import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { uploadFile, getFileUrl, deleteFile } from "@/lib/r2";

type DocumentField = "etatDesLieuxEntree" | "etatDesLieuxSortie" | "dossierLocatif";

const VALID_FIELDS: DocumentField[] = [
  "etatDesLieuxEntree",
  "etatDesLieuxSortie",
  "dossierLocatif",
];

const FOLDER_MAP: Record<DocumentField, string> = {
  etatDesLieuxEntree: "etats-des-lieux",
  etatDesLieuxSortie: "etats-des-lieux",
  dossierLocatif: "dossiers-locatifs",
};

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { id } = await params;
  const locataireId = Number(id);

  const locataire = await prisma.locataire.findUnique({
    where: { id: locataireId },
    include: { bien: true },
  });

  if (!locataire || locataire.bien.userId !== session.user.id) {
    return NextResponse.json({ error: "Locataire non trouvé" }, { status: 404 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const field = formData.get("field") as string | null;

  if (!file) {
    return NextResponse.json({ error: "Aucun fichier envoyé" }, { status: 400 });
  }

  if (!field || !VALID_FIELDS.includes(field as DocumentField)) {
    return NextResponse.json({ error: "Type de document invalide" }, { status: 400 });
  }

  const typedField = field as DocumentField;

  try {
    // Supprimer l'ancien fichier s'il existe
    const oldKey = locataire[typedField];
    if (oldKey) {
      await deleteFile(oldKey);
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const folder = `${FOLDER_MAP[typedField]}/locataire-${locataireId}`;
    const key = await uploadFile(buffer, folder, file.type);

    await prisma.locataire.update({
      where: { id: locataireId },
      data: { [typedField]: key },
    });

    return NextResponse.json({ key }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { id } = await params;
  const locataireId = Number(id);

  const locataire = await prisma.locataire.findUnique({
    where: { id: locataireId },
    include: { bien: true },
  });

  if (!locataire || locataire.bien.userId !== session.user.id) {
    return NextResponse.json({ error: "Locataire non trouvé" }, { status: 404 });
  }

  const documents: Record<string, string | null> = {};

  for (const field of VALID_FIELDS) {
    const key = locataire[field];
    if (key) {
      documents[field] = await getFileUrl(key);
    } else {
      documents[field] = null;
    }
  }

  return NextResponse.json(documents);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { id } = await params;
  const locataireId = Number(id);

  const locataire = await prisma.locataire.findUnique({
    where: { id: locataireId },
    include: { bien: true },
  });

  if (!locataire || locataire.bien.userId !== session.user.id) {
    return NextResponse.json({ error: "Locataire non trouvé" }, { status: 404 });
  }

  const { field } = await request.json();

  if (!field || !VALID_FIELDS.includes(field as DocumentField)) {
    return NextResponse.json({ error: "Type de document invalide" }, { status: 400 });
  }

  const typedField = field as DocumentField;
  const key = locataire[typedField];

  if (!key) {
    return NextResponse.json({ error: "Aucun document à supprimer" }, { status: 404 });
  }

  try {
    await deleteFile(key);

    await prisma.locataire.update({
      where: { id: locataireId },
      data: { [typedField]: null },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
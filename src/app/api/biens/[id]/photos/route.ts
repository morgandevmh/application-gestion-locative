import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { uploadFile, getFileUrl, deleteFile } from "@/lib/r2";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { id } = await params;
  const bienId = Number(id);

  // Vérifier ownership
  const bien = await prisma.bien.findUnique({ where: { id: bienId } });
  if (!bien || bien.userId !== session.user.id) {
    return NextResponse.json({ error: "Bien non trouvé" }, { status: 404 });
  }

  // Récupérer le fichier depuis le FormData
  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "Aucun fichier envoyé" }, { status: 400 });
  }

  try {
    // Convertir le File en Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload vers R2
    const key = await uploadFile(
      buffer,
      `photos/bien-${bienId}`,
      file.type
    );

    // Ajouter la key au tableau photos du bien
    await prisma.bien.update({
      where: { id: bienId },
      data: {
        photos: { push: key },
      },
    });

    return NextResponse.json({ key }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
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
    const bienId = Number(id);
  
    const bien = await prisma.bien.findUnique({ where: { id: bienId } });
    if (!bien || bien.userId !== session.user.id) {
      return NextResponse.json({ error: "Bien non trouvé" }, { status: 404 });
    }
  
    // Générer une URL présignée pour chaque photo
    const urls = await Promise.all(
      bien.photos.map(async (key) => ({
        key,
        url: await getFileUrl(key),
      }))
    );
  
    return NextResponse.json(urls);
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
    const bienId = Number(id);
  
    const bien = await prisma.bien.findUnique({ where: { id: bienId } });
    if (!bien || bien.userId !== session.user.id) {
      return NextResponse.json({ error: "Bien non trouvé" }, { status: 404 });
    }
  
    const { key } = await request.json();
  
    if (!key || !bien.photos.includes(key)) {
      return NextResponse.json({ error: "Photo non trouvée" }, { status: 404 });
    }
  
    // 1. Supprimer de R2
    await deleteFile(key);
  
    // 2. Retirer du tableau en base
    await prisma.bien.update({
      where: { id: bienId },
      data: {
        photos: bien.photos.filter((photo) => photo !== key),
      },
    });
  
    return NextResponse.json({ success: true });
  }
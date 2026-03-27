import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

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

  const bien = await prisma.bien.findUnique({ where: { id: bienId } });
  if (!bien || bien.userId !== session.user.id) {
    return NextResponse.json({ error: "Bien non trouvé" }, { status: 404 });
  }

  const body = await request.json();
  const { locataireId, templateId, dateDebut, dateFin, loyerEncadre, complementLoyer, charges, typeBail, contenu } = body;

  if (!locataireId || !templateId || !dateDebut || !typeBail || !contenu) {
    return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
  }

  // Vérifier que le locataire appartient à ce bien
  const locataire = await prisma.locataire.findUnique({ where: { id: Number(locataireId) } });
  if (!locataire || locataire.bienId !== bienId) {
    return NextResponse.json({ error: "Locataire non trouvé pour ce bien" }, { status: 404 });
  }

  try {
    const bail = await prisma.bail.create({
      data: {
        contenu,
        dateDebut: new Date(dateDebut),
        dateFin: dateFin ? new Date(dateFin) : null,
        loyerEncadre: loyerEncadre ? parseFloat(loyerEncadre) : null,
        complementLoyer: parseFloat(complementLoyer) || 0,
        charges: parseFloat(charges) || 0,
        typeBail,
        templateId: Number(templateId),
        bienId,
        locataireId: Number(locataireId),
      },
    });

    return NextResponse.json(bail, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erreur lors de la création du bail" }, { status: 500 });
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

  try {
    const baux = await prisma.bail.findMany({
      where: { bienId },
      include: { locataire: true, template: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(baux);
  } catch {
    return NextResponse.json({ error: "Erreur lors de la récupération des baux" }, { status: 500 });
  }
}
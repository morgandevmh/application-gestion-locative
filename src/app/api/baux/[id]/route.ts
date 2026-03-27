import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { id } = await params;
  const bailId = Number(id);

  const bail = await prisma.bail.findUnique({
    where: { id: bailId },
    include: {
      bien: true,
      locataire: true,
      template: true,
    },
  });

  if (!bail || bail.bien.userId !== session.user.id) {
    return NextResponse.json({ error: "Bail non trouvé" }, { status: 404 });
  }

  return NextResponse.json(bail);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { id } = await params;
  const bailId = Number(id);

  const existingBail = await prisma.bail.findUnique({
    where: { id: bailId },
    include: { bien: true },
  });

  if (!existingBail || existingBail.bien.userId !== session.user.id) {
    return NextResponse.json({ error: "Bail non trouvé" }, { status: 404 });
  }

  const body = await request.json();
  const { dateDebut, dateFin, loyerEncadre, complementLoyer, charges, typeBail, contenu } = body;

  try {
    const bail = await prisma.bail.update({
      where: { id: bailId },
      data: {
        ...(contenu && { contenu }),
        ...(dateDebut && { dateDebut: new Date(dateDebut) }),
        ...(dateFin !== undefined && { dateFin: dateFin ? new Date(dateFin) : null }),
        ...(loyerEncadre !== undefined && { loyerEncadre: loyerEncadre ? parseFloat(loyerEncadre) : null }),
        ...(complementLoyer !== undefined && { complementLoyer: parseFloat(complementLoyer) }),
        ...(charges !== undefined && { charges: parseFloat(charges) }),
        ...(typeBail && { typeBail }),
      },
    });

    return NextResponse.json(bail);
  } catch {
    return NextResponse.json({ error: "Erreur lors de la modification du bail" }, { status: 500 });
  }
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
  const bailId = Number(id);

  const existingBail = await prisma.bail.findUnique({
    where: { id: bailId },
    include: { bien: true },
  });

  if (!existingBail || existingBail.bien.userId !== session.user.id) {
    return NextResponse.json({ error: "Bail non trouvé" }, { status: 404 });
  }

  try {
    await prisma.bail.delete({ where: { id: bailId } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erreur lors de la suppression du bail" }, { status: 500 });
  }
}
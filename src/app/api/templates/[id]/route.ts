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
  const templateId = Number(id);

  const template = await prisma.bailTemplate.findUnique({
    where: { id: templateId },
  });
  if (!template || (template.userId !== session.user.id && !template.isDefault)) {
    return NextResponse.json({ error: "Template non trouvé" }, { status: 404 });
  }
  return NextResponse.json(template);
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
  const templateId = Number(id);

  const existing = await prisma.bailTemplate.findUnique({
    where: { id: templateId },
  });
  if (!existing) {
    return NextResponse.json({ error: "Template non trouvé" }, { status: 404 });
  }
  if (existing.isDefault) {
    return NextResponse.json(
      { error: "Impossible de modifier un template par défaut" },
      { status: 403 }
    );
  }
  if (existing.userId !== session.user.id) {
    return NextResponse.json({ error: "Template non trouvé" }, { status: 404 });
  }

  const body = await request.json();
  const { nom, contenu } = body;

  try {
    const template = await prisma.bailTemplate.update({
      where: { id: templateId },
      data: {
        ...(nom && { nom }),
        ...(contenu && { contenu }),
      },
    });

    return NextResponse.json(template);
  } catch {
    return NextResponse.json({ error: "Erreur lors de la modification du template" }, { status: 500 });
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
  const templateId = Number(id);

  const existing = await prisma.bailTemplate.findUnique({
    where: { id: templateId },
  });
  if (!existing) {
    return NextResponse.json({ error: "Template non trouvé" }, { status: 404 });
  }
  if (existing.isDefault) {
    return NextResponse.json(
      { error: "Impossible de supprimer un template par défaut" },
      { status: 403 }
    );
  }
  if (existing.userId !== session.user.id) {
    return NextResponse.json({ error: "Template non trouvé" }, { status: 404 });
  }

  const nbBaux = await prisma.bail.count({
    where: { templateId },
  });
  if (nbBaux > 0) {
    const message = nbBaux === 1
      ? "Impossible de supprimer ce template, 1 bail l'utilise."
      : `Impossible de supprimer ce template, ${nbBaux} baux l'utilisent.`;
    return NextResponse.json({ error: message }, { status: 409 });
  }

  try {
    await prisma.bailTemplate.delete({ where: { id: templateId } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la suppression du template" },
      { status: 500 }
    );
  }
}
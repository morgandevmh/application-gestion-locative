import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await request.json();
  const { nom, contenu } = body;

  if (!nom || !contenu) {
    return NextResponse.json({ error: "Nom et contenu requis" }, { status: 400 });
  }

  try {
    const template = await prisma.bailTemplate.create({
      data: {
        nom,
        contenu,
        userId: session.user.id,
      },
    });

    return NextResponse.json(template, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erreur lors de la création du template" }, { status: 500 });
  }
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const templates = await prisma.bailTemplate.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(templates);
  } catch {
    return NextResponse.json({ error: "Erreur lors de la récupération des templates" }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const baux = await prisma.bail.findMany({
      where: { bien: { userId: session.user.id } },
      include: {
        bien: true,
        locataire: true,
        template: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(baux);
  } catch {
    return NextResponse.json({ error: "Erreur lors de la récupération des baux" }, { status: 500 });
  }
}
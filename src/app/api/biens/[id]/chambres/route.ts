import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // 1 session
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { error: "Non autorisé" },
      { status: 401 }
    );
  }

  // 2 Recuperer l'ID de la colocation depuis l'URL
  const { id } = await params;
  const parentId = Number(id);

  // 3Verification double du parent 
  const colocation = await prisma.bien.findUnique({ where: { id: parentId } });

  if (!colocation || colocation.userId !== session.user.id) {
    return NextResponse.json(
      { error: "Bien non trouvé" },
      { status: 404 }
    );
  }

  if (colocation.type !== "COLOCATION") {
    return NextResponse.json(
      { error: "Ce bien n'est pas une colocation" },
      { status: 400 }
    );
  }

// 4 juste nom et description 
  const body = await request.json();
  const { nom, description } = body;

  if (!nom) {
    return NextResponse.json(
      { error: "Le nom de la chambre est requis" },
      { status: 400 }
    );
  }


  try {
    const chambre = await prisma.bien.create({
      data: {
        nom,
        description,
        type: "CHAMBRE",
        adresse: colocation.adresse,
        userId: session.user.id,
        parentId: parentId
      }
    });
    return NextResponse.json(chambre, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la création de la chambre" },
      { status: 500 }
    );
  }
}
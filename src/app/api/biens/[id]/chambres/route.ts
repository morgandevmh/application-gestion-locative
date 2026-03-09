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

  // 3 Verification double du parent
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

  // 5 Image placeholder aléatoire
  const images = ["/placeholders/1.jpg", "/placeholders/2.jpg", "/placeholders/3.jpg", "/placeholders/4.jpg", "/placeholders/5.jpg", "/placeholders/6.jpg", "/placeholders/7.jpg"]
  const randomImage = images[Math.floor(Math.random() * images.length)]

  try {
    const chambre = await prisma.bien.create({
      data: {
        nom,
        description,
        type: "CHAMBRE",
        adresse: colocation.adresse,
        userId: session.user.id,
        parentId: parentId,
        image: randomImage
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
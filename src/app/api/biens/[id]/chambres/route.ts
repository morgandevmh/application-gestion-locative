import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { createChambreSchema } from "@/lib/validations/bien.schema";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { error: "Non autorisé" },
      { status: 401 }
    );
  }

  const { id } = await params;
  const parentId = Number(id);

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

  const body = await request.json();
  const result = createChambreSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: "Données invalides", issues: result.error.flatten() },
      { status: 400 }
    );
  }

  const images = [
    "/placeholders/1.jpg", "/placeholders/2.jpg", "/placeholders/3.jpg",
    "/placeholders/4.jpg", "/placeholders/5.jpg", "/placeholders/6.jpg",
    "/placeholders/7.jpg", "/placeholders/8.jpg", "/placeholders/9.jpg",
    "/placeholders/10.jpg", "/placeholders/11.jpg", "/placeholders/12.jpg",
    "/placeholders/13.jpg", "/placeholders/14.jpg", "/placeholders/15.jpg",
    "/placeholders/16.jpg", "/placeholders/17.jpg"
  ];
  const randomImage = images[Math.floor(Math.random() * images.length)];

  try {
    const chambre = await prisma.bien.create({
      data: {
        ...result.data,
        type: "CHAMBRE",
        adresse: colocation.adresse,
        userId: session.user.id,
        parentId: parentId,
        image: randomImage,
      },
    });
    return NextResponse.json(chambre, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la création de la chambre" },
      { status: 500 }
    );
  }
}
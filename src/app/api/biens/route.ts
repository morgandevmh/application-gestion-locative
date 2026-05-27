import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { getFileUrl } from "@/lib/r2";
import { createBienSchema } from "@/lib/validations/bien.schema";

//CREATE C 
export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { error: "Non autorisé" },
      { status: 401 }
    );
  }

  const body = await request.json();

  const result = createBienSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: "Données invalides", issues: result.error.flatten() },
      { status: 400 }
    );
  }

  const data = result.data;

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
    const bien = await prisma.bien.create({
      data: {
        ...data,
        userId: session.user.id,
        image: randomImage,
      },
    });
    return NextResponse.json(bien, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la création du bien" },
      { status: 500 }
    );
  }
}

//READ R 
export async function GET(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { error: "Non autorisé" },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const louables = searchParams.get("louables") === "true";

  try {
    const biens = await prisma.bien.findMany({
      where: {
        userId: session.user.id,
        type: louables
          ? { not: "COLOCATION" as const }
          : { not: "CHAMBRE" as const },
      },
      include: louables
        ? { parent: { select: { nom: true } } }
        : undefined,
    });
    // Générer l'URL présignée de la photo principale pour chaque bien
    const biensAvecPhotos = await Promise.all(
      biens.map(async (bien) => {
        if (bien.photos.length > 0) {
          const photoUrl = await getFileUrl(bien.photos[0]);
          return { ...bien, photoPrincipaleUrl: photoUrl };
        }
        return { ...bien, photoPrincipaleUrl: null };
      })
    );
    return NextResponse.json(biensAvecPhotos, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la récupération des biens" },
      { status: 500 }
    );
  }
}
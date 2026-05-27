import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { createLocataireSchema } from "@/lib/validations/locatiare.schema";

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
  const bienId = Number(id);

  // Ownership : vérifier que le bien parent appartient à l'user
  const existingBien = await prisma.bien.findUnique({ where: { id: bienId } });
  if (!existingBien || existingBien.userId !== session.user.id) {
    return NextResponse.json(
      { error: "Bien non trouvé" },
      { status: 404 }
    );
  }

  // Validation Zod
  const body = await request.json();
  const result = createLocataireSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: "Données invalides", issues: result.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const locataire = await prisma.locataire.create({
      data: {
        ...result.data,
        bienId,
      },
    });
    return NextResponse.json(locataire, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la création du locataire" },
      { status: 500 }
    );
  }
}

export async function GET (
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      )
    }

    const { id } = await params
    const bienId = Number(id)

    const existingBien = await prisma.bien.findUnique({ where: { id: bienId } })
    if (!existingBien || existingBien.userId !== session.user.id) {
        return NextResponse.json(
          { error: "Bien non trouvé" },
          { status: 404 }
        )
    }

    try{
        const locataires = await prisma.locataire.findMany({
            where: {
                bienId
              }
        })
        return NextResponse.json(locataires, { status: 200})
    } catch {
        return NextResponse.json(
            {error:"Erreur lors de la récupération des locataires"},
            {status: 500 }
        )
    }


}
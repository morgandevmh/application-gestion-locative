import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { getFileUrl } from "@/lib/r2";
import { updateBienSchema } from "@/lib/validations/bien.schema";

export async function PUT(
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

  const existingBien = await prisma.bien.findUnique({ where: { id: bienId } });
  if (!existingBien || existingBien.userId !== session.user.id) {
    return NextResponse.json(
      { error: "Bien non trouvé" },
      { status: 404 }
    );
  }

  const body = await request.json();

  const result = updateBienSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: "Données invalides", issues: result.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const bien = await prisma.bien.update({
      where: { id: bienId },
      data: result.data,
    });
    return NextResponse.json(bien, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la modification du bien" },
      { status: 500 }
    );
  }
}


export async function DELETE(
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

    const locataireCount = await prisma.locataire.count({ where: { bienId: bienId } })
    if (locataireCount > 0) {
      return NextResponse.json(
        { error: "Veuillez supprimer les locataires avant de supprimer ce bien" },
        { status: 400 }
      )
    }
  
    try {
      const bien = await prisma.bien.delete({
        where: { id: bienId }
      })
      return NextResponse.json(bien, { status: 200 })
    } catch {
      return NextResponse.json(
        { error: "Erreur lors de la suppression du bien" },
        { status: 500 }
      )
    }
  }

  export async function GET(
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
  
    const existingBien = await prisma.bien.findUnique({
      where: { id: bienId },
      include: {
        sousBiens: {
          include: {
            locataires: true,
          },
        },
      },
    });
  
    if (!existingBien || existingBien.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Bien non trouvé" },
        { status: 404 }
      );
    }
  
    // Générer les URLs des photos des chambres
    const sousBiensAvecPhotos = await Promise.all(
      existingBien.sousBiens.map(async (chambre) => {
        if (chambre.photos.length > 0) {
          const photoPrincipaleUrl = await getFileUrl(chambre.photos[0]);
          return { ...chambre, photoPrincipaleUrl };
        }
        return { ...chambre, photoPrincipaleUrl: null };
      })
    );
  
    return NextResponse.json(
      { ...existingBien, sousBiens: sousBiensAvecPhotos },
      { status: 200 }
    );
  }
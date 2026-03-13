import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
){

    const session = await getSession();
    if(!session){
       return NextResponse.json(
       {error: "Non autorisé"},
       {status: 401}
        );
    }

    const { id } = await params;
    const locataireId = Number(id);

    const existingLocataire = await prisma.locataire.findUnique({
        where: { id: locataireId },
        include: { bien: true },
      });
    
    if (!existingLocataire || existingLocataire.bien.userId !== session.user.id) {
        return NextResponse.json(
          { error: "Locataire non trouvé" },
          { status: 404 }
        );
    }

    const body = await request.json();

    try {
        const locataire = await prisma.locataire.update({
          where: { id: locataireId },
          data: body,
        });
    
        return NextResponse.json(locataire, { status: 200 });
      } catch {
        return NextResponse.json(
          { error: "Erreur lors de la modification du locataire" },
          { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
){

    const session = await getSession();
    if(!session){
       return NextResponse.json(
       {error: "Non autorisé"},
       {status: 401}
        );
    }

    const { id } = await params;
    const locataireId = Number(id);

    const existingLocataire = await prisma.locataire.findUnique({
        where: { id: locataireId },
        include: { bien: true },
      });
    
    if (!existingLocataire || existingLocataire.bien.userId !== session.user.id) {
        return NextResponse.json(
          { error: "Locataire non trouvé" },
          { status: 404 }
        );
    }


    try {
        const locataire = await prisma.locataire.delete({
          where: { id: locataireId },
        });
    
        return NextResponse.json(locataire, { status: 200 });
      } catch {
        return NextResponse.json(
          { error: "Erreur lors de la supression du locataire" },
          { status: 500 }
        );
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
    )
  }

  const { id } = await params
  const locataireId = Number(id)

  const existingLocataire = await prisma.locataire.findUnique
  ({ where: { id: locataireId },
    include: {bien: true}
   })
  if (!existingLocataire || existingLocataire.bien.userId !== session.user.id) {
    return NextResponse.json(
      { error: "Locataire non trouvé" },
      { status: 404 }
    )
  }
   return NextResponse.json(existingLocataire, { status: 200 })

}


import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(
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
    const bienId = Number(id);

    const body = await request.json()
    const {nom, email, telephone, dateEntree, dateSortie, caution, statut, notes} = body

    if (!nom || !dateEntree || !caution) {
        return NextResponse.json(
          { error: "Champs requis manquants" },
          { status: 400 }
        )
      }

    const existingBien = await prisma.bien.findUnique({ where: { id: bienId } })
    if (!existingBien || existingBien.userId !== session.user.id) {
        return NextResponse.json(
          { error: "Bien non trouvé" },
          { status: 404 }
        )
    }

    try{
        const locataire = await prisma.locataire.create({
            data: {
                nom,
                email,
                telephone,
                dateEntree,
                dateSortie,
                caution, 
                statut,
                notes,
                bienId
            }
        })
        return NextResponse.json(locataire, {status: 201})
    }catch {
        return NextResponse.json(
            {error: "Erreur lors de la création du locataire"},
            {status: 500}
        )
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
import { NextResponse } from "next/server";
import  prisma  from "@/lib/prisma";
import { getSession } from "@/lib/auth";

//CREAT C 
export async function POST (request: Request) {
    const session = await getSession();

    if (!session){
        return NextResponse.json(
            {error: "Non autorisé"},
            {status: 401}
        )
    }

    const body = await request.json()
    const { nom, adresse, type, description } = body

    if(!nom || !adresse || !type){
        return NextResponse.json(
            {error: "Champs requis manquants"},
            {status: 400}
        )
    }

    const validTypes = ["APPARTEMENT", "MAISON", "STUDIO", "COLOCATION", "CHAMBRE"]

    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: "Type de bien invalide" },
        { status: 400 }
      )
    }

    try {
        const bien = await prisma.bien.create({
            data: {
              nom,
              adresse,
              type,
              description,
              userId: session.user.id
            }
            
          })
          return NextResponse.json(bien, { status: 201 })
    } catch {
        return NextResponse.json(
            {error: "Erreur lors de la création du bien"},
            {status: 500}
        )
    }
      
}

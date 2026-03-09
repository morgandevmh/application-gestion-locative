import { NextResponse } from "next/server";
import  prisma  from "@/lib/prisma";
import { getSession } from "@/lib/auth";

//CREATE C 
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

    const validTypes = ["APPARTEMENT", "MAISON", "STUDIO", "COLOCATION"]

    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: "Type de bien invalide" },
        { status: 400 }
      )
    }

    const images = ["/placeholders/1.jpg", "/placeholders/2.jpg", "/placeholders/3.jpg", "/placeholders/4.jpg", "/placeholders/5.jpg", "/placeholders/6.jpg", "/placeholders/7.jpg" ]
    const randomImage = images[Math.floor(Math.random() * images.length)]

    try {
        const bien = await prisma.bien.create({
            data: {
              nom,
              adresse,
              type,
              description,
              userId: session.user.id,
              image: randomImage
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

//READ R 

export async function GET() {
    const session = await getSession();
    if (!session){
        return NextResponse.json(
            {error: "Non autorisé"},
            {status: 401}
        )
    }

    try{
        const bien = await prisma.bien.findMany({
            where: {
                userId: session.user.id,
                type: { not: "CHAMBRE" }
              }
        })
        return NextResponse.json(bien, { status: 200})
    } catch {
        return NextResponse.json(
            {error:"Erreur lors de la récupération des biens"},
            {status: 500 }
        )
    }
    
}

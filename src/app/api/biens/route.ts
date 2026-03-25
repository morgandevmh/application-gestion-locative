import { NextResponse } from "next/server";
import  prisma  from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { getFileUrl } from "@/lib/r2";

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

    const images = ["/placeholders/1.jpg", "/placeholders/2.jpg", "/placeholders/3.jpg", "/placeholders/4.jpg", "/placeholders/5.jpg", "/placeholders/6.jpg", "/placeholders/7.jpg", "/placeholders/8.jpg","/placeholders/9.jpg", "/placeholders/10.jpg","placeholders/11.jpg", "/placeholders/12.jpg", "/placeholders/13.jpg", "/placeholders/14.jpg", "/placeholders/15.jpg", "/placeholders/16.jpg", "/placeholders/17.jpg" ]
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
    if (!session) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }
  
    try {
      const biens = await prisma.bien.findMany({
        where: {
          userId: session.user.id,
          type: { not: "CHAMBRE" },
        },
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
import { NextResponse } from "next/server";
import  prisma  from "@/lib/prisma";
import { getSession } from "@/lib/auth";


export async function GET() {
    const session = await getSession();
    if (!session){
        return NextResponse.json(
            {error: "Non autorisé"},
            {status: 401}
        )
    }

    try{
        const locataires = await prisma.locataire.findMany({
            where: {
              bien: {
                userId: session.user.id
              }
            },
            include: {
              bien: {
                include: {
                  parent: true
                }
              }
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
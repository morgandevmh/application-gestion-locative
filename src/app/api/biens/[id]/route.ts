import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function PUT(
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

  const body = await request.json()
  const { nom, adresse, type, description } = body

  if (!nom || !adresse || !type) {
    return NextResponse.json(
      { error: "Champs requis manquants" },
      { status: 400 }
    )
  }

  const validTypes = ["APPARTEMENT", "MAISON", "STUDIO", "COLOCATION"]
  if (!validTypes.includes(type)) {
    return NextResponse.json(
      { error: "Type de bien invalide" },
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

  try {
    const bien = await prisma.bien.update({
      where: { id: bienId },
      data: { nom, adresse, type, description }
    })
    return NextResponse.json(bien, { status: 200 })
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la modification du bien" },
      { status: 500 }
    )
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
      )
    }
  
    const { id } = await params
    const bienId = Number(id)

    const existingBien = await prisma.bien.findUnique
    ({ where: { id: bienId },
      include: {sousBiens: true}
     })
    if (!existingBien || existingBien.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Bien non trouvé" },
        { status: 404 }
      )
    }
     return NextResponse.json(existingBien, { status: 200 })

  }
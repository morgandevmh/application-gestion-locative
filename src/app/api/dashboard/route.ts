import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const userId = session.user.id;

  try {
    const biens = await prisma.bien.findMany({
      where: { userId, type: { not: "CHAMBRE" } },
      include: {
        locataires: true,
        sousBiens: {
          include: { locataires: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    const tousLesLocataires = biens.flatMap((bien) =>
      bien.type === "COLOCATION"
        ? bien.sousBiens.flatMap((chambre) => chambre.locataires)
        : bien.locataires
    );

    const resumeGlobal = {
      totalBiens: biens.length,
      totalLocataires: tousLesLocataires.length,
      totalCautions: tousLesLocataires.reduce((sum, loc) => sum + loc.caution, 0),
    };

    const patrimoine = biens.reduce(
      (acc, bien) => {
        const type = bien.type;
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    let totalBiensLouables = 0;
    let totalBiensLoues = 0;

    biens.forEach((bien) => {
      if (bien.type === "COLOCATION") {
        bien.sousBiens.forEach((chambre) => {
          totalBiensLouables += 1;
          const aUnLocataireActif = chambre.locataires.some(
            (loc) => loc.statut === "ACTIF"
          );
          if (aUnLocataireActif) totalBiensLoues += 1;
        });
      } else {
        totalBiensLouables += 1;
        const aUnLocataireActif = bien.locataires.some(
          (loc) => loc.statut === "ACTIF"
        );
        if (aUnLocataireActif) totalBiensLoues += 1;
      }
    });

    const remplissage = {
      total: totalBiensLouables,
      loues: totalBiensLoues,
    };

    const derniersLocataires = await prisma.locataire.findMany({
      where: { bien: { userId } },
      include: { bien: { include: { parent: true } } },
      orderBy: { updatedAt: "desc" },
      take: 6,
    });

    const derniersBiens = biens.slice(0, 3);

    return NextResponse.json({
      user: { name: session.user.name },
      resumeGlobal,
      patrimoine,
      remplissage,
      derniersLocataires,
      derniersBiens,
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { uploadFile, getFileUrl } from "@/lib/r2";
import { TEMPLATE_MEUBLE_CLASSIQUE, remplirTemplate } from "@/lib/bail-templates/meuble-classique";
import { genererBailPDF } from "@/lib/bail-pdf";

const TYPE_BAIL_DUREES: Record<string, number> = {
  MEUBLE: 12,
  VIDE: 36,
  ETUDIANT: 9,
  MOBILITE: 10,
};

const TYPE_BIEN_LABELS: Record<string, string> = {
  APPARTEMENT: "Appartement",
  MAISON: "Maison",
  STUDIO: "Studio",
  COLOCATION: "Colocation",
  CHAMBRE: "Chambre",
};

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { id } = await params;
  const bailId = Number(id);

  const bail = await prisma.bail.findUnique({
    where: { id: bailId },
    include: {
      bien: true,
      locataire: true,
      template: true,
    },
  });

  if (!bail || bail.bien.userId !== session.user.id) {
    return NextResponse.json({ error: "Bail non trouvé" }, { status: 404 });
  }

  try {
    const loyerTotal =
      (bail.loyerEncadre || 0) + bail.complementLoyer + bail.charges;

    const duree = TYPE_BAIL_DUREES[bail.typeBail] || 12;

    const donnees: Record<string, string> = {
      BAILLEUR_NOM: session.user.name || "Non renseigné",
      LOCATAIRE_NOM: bail.locataire.nom,
      BIEN_ADRESSE: bail.bien.adresse,
      BIEN_TYPE: TYPE_BIEN_LABELS[bail.bien.type] || bail.bien.type,
      BIEN_DESCRIPTION: bail.bien.description || "Voir état des lieux",
      CAUTION: bail.locataire.caution.toLocaleString("fr-FR"),

      DATE_DEBUT: new Date(bail.dateDebut).toLocaleDateString("fr-FR"),
      DATE_FIN: bail.dateFin
        ? new Date(bail.dateFin).toLocaleDateString("fr-FR")
        : "Non définie",
      DUREE: duree.toString(),
      LOYER_ENCADRE: bail.loyerEncadre
        ? bail.loyerEncadre.toLocaleString("fr-FR")
        : "Non renseigné",
      COMPLEMENT_LOYER: bail.complementLoyer.toLocaleString("fr-FR"),
      CHARGES: bail.charges.toLocaleString("fr-FR"),
      LOYER_TOTAL: loyerTotal.toLocaleString("fr-FR"),

      DATE_GENERATION: new Date().toLocaleDateString("fr-FR"),
      LIEU_SIGNATURE: bail.bien.adresse.split(",").pop()?.trim() || "Non renseigné",
    };

    const articlesRemplis = remplirTemplate(
      TEMPLATE_MEUBLE_CLASSIQUE.articles,
      donnees
    );

    const pdfBuffer = await genererBailPDF(
      "CONTRAT DE LOCATION MEUBLÉE CONSTITUANT LA RÉSIDENCE PRINCIPALE DU LOCATAIRE",
      articlesRemplis
    );

    const key = await uploadFile(
      pdfBuffer,
      `baux/generes/locataire-${bail.locataireId}`,
      "application/pdf"
    );

    const pdfUrl = await getFileUrl(key);

    const contenuFinal = Object.values(articlesRemplis)
      .map((article) => `${article.titre}\n\n${article.contenu}`)
      .join("\n\n---\n\n");

    await prisma.bail.update({
      where: { id: bailId },
      data: {
        pdfUrl: key,
        contenu: contenuFinal,
      },
    });

    return NextResponse.json({
      success: true,
      pdfUrl,
      key,
    });
  } catch (error) {
    console.error("Erreur génération PDF:", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération du PDF : " + String(error) },
      { status: 500 }
    );
  }
}
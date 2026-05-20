import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { TEMPLATE_MEUBLE_CLASSIQUE } from "../src/lib/bail-templates/meuble-classique";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log(" Démarrage du seed...");

  const existing = await prisma.bailTemplate.findFirst({
    where: {
      nom: TEMPLATE_MEUBLE_CLASSIQUE.nom,
      isDefault: true,
    },
  });

  if (existing) {
    console.log(`✓ Template "${TEMPLATE_MEUBLE_CLASSIQUE.nom}" déjà présent (id: ${existing.id})`);
  } else {
    const created = await prisma.bailTemplate.create({
      data: {
        nom: TEMPLATE_MEUBLE_CLASSIQUE.nom,
        contenu: JSON.stringify(TEMPLATE_MEUBLE_CLASSIQUE.articles),
        isDefault: true,
        userId: null,
      },
    });
    console.log(`✓ Template "${created.nom}" créé (id: ${created.id})`);
  }

  console.log(" Seed terminé");
}

main()
  .catch((e) => {
    console.error(" Erreur dans le seed :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { TEMPLATE_MEUBLE_CLASSIQUE } from "../src/lib/bail-templates/meuble-classique";
import { TEMPLATE_COLOCATION_MEUBLE } from "../src/lib/bail-templates/colocation-meuble";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

type Template = {
  nom: string;
  articles: Record<string, { titre: string; contenu: string }>;
};

async function seedTemplate(template: Template) {
  const existing = await prisma.bailTemplate.findFirst({
    where: {
      nom: template.nom,
      isDefault: true,
    },
  });

  if (existing) {
    console.log(`✓ Template "${template.nom}" déjà présent (id: ${existing.id})`);
    return;
  }

  const created = await prisma.bailTemplate.create({
    data: {
      nom: template.nom,
      contenu: JSON.stringify(template.articles),
      isDefault: true,
      userId: null,
    },
  });
  console.log(`✓ Template "${created.nom}" créé (id: ${created.id})`);
}

async function main() {
  console.log("Démarrage du seed...");

  await seedTemplate(TEMPLATE_MEUBLE_CLASSIQUE);
  await seedTemplate(TEMPLATE_COLOCATION_MEUBLE);

  console.log("Seed terminé");
}

main()
  .catch((e) => {
    console.error("Erreur dans le seed :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
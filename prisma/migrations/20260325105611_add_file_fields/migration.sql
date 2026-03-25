-- AlterTable
ALTER TABLE "Bien" ADD COLUMN     "photos" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "Locataire" ADD COLUMN     "dossierLocatif" TEXT,
ADD COLUMN     "etatDesLieuxEntree" TEXT,
ADD COLUMN     "etatDesLieuxSortie" TEXT;

/*
  Warnings:

  - Added the required column `dateDebut` to the `Bail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `typeBail` to the `Bail` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TypeBail" AS ENUM ('MEUBLE', 'VIDE', 'ETUDIANT', 'MOBILITE');

-- AlterTable
ALTER TABLE "Bail" ADD COLUMN     "charges" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "complementLoyer" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "dateDebut" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "dateFin" TIMESTAMP(3),
ADD COLUMN     "loyerEncadre" DOUBLE PRECISION,
ADD COLUMN     "pdfUrl" TEXT,
ADD COLUMN     "typeBail" "TypeBail" NOT NULL;

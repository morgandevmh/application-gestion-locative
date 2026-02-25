-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'PROPRIETAIRE');

-- CreateEnum
CREATE TYPE "TypeBien" AS ENUM ('APPARTEMENT', 'MAISON', 'STUDIO', 'COLOCATION', 'CHAMBRE');

-- CreateEnum
CREATE TYPE "StatutLocataire" AS ENUM ('ACTIF', 'SORTI');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'PROPRIETAIRE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bien" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "adresse" TEXT NOT NULL,
    "type" "TypeBien" NOT NULL,
    "description" TEXT,
    "userId" INTEGER NOT NULL,
    "parentId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bien_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Locataire" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "email" TEXT,
    "telephone" TEXT,
    "dateEntree" TIMESTAMP(3) NOT NULL,
    "dateSortie" TIMESTAMP(3),
    "caution" DOUBLE PRECISION NOT NULL,
    "statut" "StatutLocataire" NOT NULL DEFAULT 'ACTIF',
    "notes" TEXT,
    "bienId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Locataire_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BailTemplate" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "contenu" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BailTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bail" (
    "id" SERIAL NOT NULL,
    "contenu" TEXT NOT NULL,
    "templateId" INTEGER NOT NULL,
    "bienId" INTEGER NOT NULL,
    "locataireId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Bien" ADD CONSTRAINT "Bien_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bien" ADD CONSTRAINT "Bien_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Bien"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Locataire" ADD CONSTRAINT "Locataire_bienId_fkey" FOREIGN KEY ("bienId") REFERENCES "Bien"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BailTemplate" ADD CONSTRAINT "BailTemplate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bail" ADD CONSTRAINT "Bail_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "BailTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bail" ADD CONSTRAINT "Bail_bienId_fkey" FOREIGN KEY ("bienId") REFERENCES "Bien"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bail" ADD CONSTRAINT "Bail_locataireId_fkey" FOREIGN KEY ("locataireId") REFERENCES "Locataire"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

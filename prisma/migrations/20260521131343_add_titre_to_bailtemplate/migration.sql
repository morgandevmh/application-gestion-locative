/*
  Warnings:

  - Added the required column `titre` to the `BailTemplate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BailTemplate" ADD COLUMN     "titre" TEXT NOT NULL;

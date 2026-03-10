-- DropForeignKey
ALTER TABLE "Bien" DROP CONSTRAINT "Bien_parentId_fkey";

-- AddForeignKey
ALTER TABLE "Bien" ADD CONSTRAINT "Bien_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Bien"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- DropForeignKey
ALTER TABLE "BailTemplate" DROP CONSTRAINT "BailTemplate_userId_fkey";

-- AlterTable
ALTER TABLE "BailTemplate" ADD COLUMN     "isDefault" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "BailTemplate" ADD CONSTRAINT "BailTemplate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

/*
  Warnings:

  - A unique constraint covering the columns `[orgAdminId]` on the table `Organization` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `orgAdminId` to the `Organization` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "orgAdminId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Organization_orgAdminId_key" ON "Organization"("orgAdminId");

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_orgAdminId_fkey" FOREIGN KEY ("orgAdminId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

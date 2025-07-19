/*
  Warnings:

  - You are about to drop the column `orgAdminId` on the `Organization` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[adminId]` on the table `Organization` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `adminId` to the `Organization` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Organization" DROP CONSTRAINT "Organization_orgAdminId_fkey";

-- DropIndex
DROP INDEX "Organization_orgAdminId_key";

-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "orgAdminId",
ADD COLUMN     "adminId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Organization_adminId_key" ON "Organization"("adminId");

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `maxMembers` on the `FYPGroup` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FYPGroup" DROP COLUMN "maxMembers";

-- CreateTable
CREATE TABLE "FYPGroupRules" (
    "id" SERIAL NOT NULL,
    "batchId" INTEGER NOT NULL,
    "minMembers" INTEGER NOT NULL DEFAULT 1,
    "maxMembers" INTEGER NOT NULL DEFAULT 4,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FYPGroupRules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FYPGroupRules_batchId_key" ON "FYPGroupRules"("batchId");

-- AddForeignKey
ALTER TABLE "FYPGroupRules" ADD CONSTRAINT "FYPGroupRules_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

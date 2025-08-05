/*
  Warnings:

  - Added the required column `projectId` to the `FYPGroup` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FYPGroup" ADD COLUMN     "projectId" INTEGER NOT NULL,
ADD COLUMN     "supervisorId" INTEGER;

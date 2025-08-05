/*
  Warnings:

  - Added the required column `departmentId` to the `FYPProjects` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FYPProjects" ADD COLUMN     "departmentId" INTEGER NOT NULL;

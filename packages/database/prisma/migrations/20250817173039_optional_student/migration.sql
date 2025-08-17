/*
  Warnings:

  - You are about to drop the column `email` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Student` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Student_email_key";

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "email",
DROP COLUMN "name",
ALTER COLUMN "rollNo" DROP NOT NULL,
ALTER COLUMN "batchId" DROP NOT NULL,
ALTER COLUMN "departmentId" DROP NOT NULL;

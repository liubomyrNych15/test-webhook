/*
  Warnings:

  - Added the required column `reviewer` to the `Row` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Row" ADD COLUMN     "reviewer" TEXT NOT NULL;

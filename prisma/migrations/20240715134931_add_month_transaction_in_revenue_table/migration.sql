/*
  Warnings:

  - Added the required column `monthTransaction` to the `revenues` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "revenues" ADD COLUMN     "monthTransaction" "Months" NOT NULL;

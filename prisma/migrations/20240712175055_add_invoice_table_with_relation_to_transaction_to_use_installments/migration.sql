/*
  Warnings:

  - You are about to drop the column `monthTransaction` on the `transactions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "monthTransaction";

-- CreateTable
CREATE TABLE "invoices" (
    "id" TEXT NOT NULL,
    "value" DECIMAL(65,30) NOT NULL,
    "monthTransaction" "Months" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

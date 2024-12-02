/*
  Warnings:

  - The `status` column on the `Todo` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "TodoStatus" AS ENUM ('ACTIVE', 'COMPLETED');

-- AlterTable
ALTER TABLE "Todo" DROP COLUMN "status",
ADD COLUMN     "status" "TodoStatus" NOT NULL DEFAULT 'ACTIVE';

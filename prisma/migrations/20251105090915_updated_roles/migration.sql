/*
  Warnings:

  - The values [DOCTOR] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `email` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - Made the column `phone` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('USER', 'ADMIN');
ALTER TABLE "public"."User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'USER';
COMMIT;

-- DropIndex
DROP INDEX "public"."Doctor_email_key";

-- DropIndex
DROP INDEX "public"."User_email_key";

-- AlterTable
ALTER TABLE "Doctor" DROP COLUMN "email";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "email",
DROP COLUMN "password",
ALTER COLUMN "phone" SET NOT NULL;

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_phone_key" ON "Admin"("phone");

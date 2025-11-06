/*
  Warnings:

  - The values [SERVICE_A,SERVICE_B,SERVICE_C] on the enum `ServiceType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `date` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `endTime` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `Slot` table. All the data in the column will be lost.
  - You are about to drop the column `endTime` on the `Slot` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `Slot` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slotId]` on the table `Appointment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `Doctor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[doctorId,startAt]` on the table `Slot` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `endAt` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startAt` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sizeInBytes` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `doctorId` to the `Slot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endAt` to the `Slot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startAt` to the `Slot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `UserForm` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StorageProvider" AS ENUM ('CLOUDINARY', 'S3', 'LOCAL');

-- AlterEnum
BEGIN;
CREATE TYPE "ServiceType_new" AS ENUM ('NUTRITION', 'FITNESS', 'DIET_PLAN');
ALTER TABLE "Slot" ALTER COLUMN "serviceType" TYPE "ServiceType_new" USING ("serviceType"::text::"ServiceType_new");
ALTER TABLE "Appointment" ALTER COLUMN "service" TYPE "ServiceType_new" USING ("service"::text::"ServiceType_new");
ALTER TYPE "ServiceType" RENAME TO "ServiceType_old";
ALTER TYPE "ServiceType_new" RENAME TO "ServiceType";
DROP TYPE "public"."ServiceType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."UserForm" DROP CONSTRAINT "UserForm_appointmentId_fkey";

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "date",
DROP COLUMN "endTime",
DROP COLUMN "startTime",
ADD COLUMN     "endAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "meetingUrl" TEXT,
ADD COLUMN     "reminderSent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "slotId" TEXT,
ADD COLUMN     "startAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "File" ADD COLUMN     "provider" "StorageProvider" NOT NULL DEFAULT 'CLOUDINARY',
ADD COLUMN     "sizeInBytes" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Slot" DROP COLUMN "date",
DROP COLUMN "endTime",
DROP COLUMN "startTime",
ADD COLUMN     "doctorId" TEXT NOT NULL,
ADD COLUMN     "endAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "UserForm" ADD COLUMN     "slotId" TEXT,
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "appointmentId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_slotId_key" ON "Appointment"("slotId");

-- CreateIndex
CREATE INDEX "Appointment_startAt_idx" ON "Appointment"("startAt");

-- CreateIndex
CREATE INDEX "Appointment_doctorId_startAt_idx" ON "Appointment"("doctorId", "startAt");

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_phone_key" ON "Doctor"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Slot_doctorId_startAt_key" ON "Slot"("doctorId", "startAt");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- AddForeignKey
ALTER TABLE "Slot" ADD CONSTRAINT "Slot_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "Slot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserForm" ADD CONSTRAINT "UserForm_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserForm" ADD CONSTRAINT "UserForm_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

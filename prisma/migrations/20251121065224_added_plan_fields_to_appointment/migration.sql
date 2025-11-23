/*
  Warnings:

  - Added the required column `planDuration` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `planName` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `planPrice` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `planSlug` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "planDuration" TEXT NOT NULL,
ADD COLUMN     "planName" TEXT NOT NULL,
ADD COLUMN     "planPackageName" TEXT,
ADD COLUMN     "planPrice" INTEGER NOT NULL,
ADD COLUMN     "planSlug" TEXT NOT NULL;

/*
  Warnings:

  - You are about to drop the column `service` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `serviceType` on the `Slot` table. All the data in the column will be lost.
  - Added the required column `mode` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mode` to the `Slot` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AppointmentMode" AS ENUM ('IN_PERSON', 'ONLINE');

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "service",
ADD COLUMN     "mode" "AppointmentMode" NOT NULL;

-- AlterTable
ALTER TABLE "Slot" DROP COLUMN "serviceType",
ADD COLUMN     "mode" "AppointmentMode" NOT NULL;

-- DropEnum
DROP TYPE "ServiceType";

-- CreateTable
CREATE TABLE "DoctorDayOff" (
    "id" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DoctorDayOff_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DoctorDayOff_doctorId_date_key" ON "DoctorDayOff"("doctorId", "date");

-- AddForeignKey
ALTER TABLE "DoctorDayOff" ADD CONSTRAINT "DoctorDayOff_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `doctorId` on the `DoctorDayOff` table. All the data in the column will be lost.
  - You are about to drop the `Doctor` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[adminId,date]` on the table `DoctorDayOff` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `adminId` to the `DoctorDayOff` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "DoctorDayOff" DROP CONSTRAINT "DoctorDayOff_doctorId_fkey";

-- DropIndex
DROP INDEX "DoctorDayOff_doctorId_date_key";

-- AlterTable
ALTER TABLE "DoctorDayOff" DROP COLUMN "doctorId",
ADD COLUMN     "adminId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Doctor";

-- CreateIndex
CREATE INDEX "DoctorDayOff_date_idx" ON "DoctorDayOff"("date");

-- CreateIndex
CREATE UNIQUE INDEX "DoctorDayOff_adminId_date_key" ON "DoctorDayOff"("adminId", "date");

-- CreateIndex
CREATE INDEX "Slot_adminId_startAt_isBooked_idx" ON "Slot"("adminId", "startAt", "isBooked");

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorDayOff" ADD CONSTRAINT "DoctorDayOff_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

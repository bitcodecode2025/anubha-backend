/*
  Warnings:

  - You are about to drop the column `doctorId` on the `Slot` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[adminId,startAt]` on the table `Slot` will be added. If there are existing duplicate values, this will fail.
  - Made the column `clinicAddress` on table `Doctor` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `adminId` to the `Slot` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Slot" DROP CONSTRAINT "Slot_doctorId_fkey";

-- DropIndex
DROP INDEX "Slot_doctorId_startAt_key";

-- AlterTable
ALTER TABLE "Doctor" ALTER COLUMN "clinicAddress" SET NOT NULL;

-- AlterTable
ALTER TABLE "Slot" DROP COLUMN "doctorId",
ADD COLUMN     "adminId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Slot_adminId_startAt_key" ON "Slot"("adminId", "startAt");

-- AddForeignKey
ALTER TABLE "Slot" ADD CONSTRAINT "Slot_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

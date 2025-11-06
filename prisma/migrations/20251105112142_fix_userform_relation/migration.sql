/*
  Warnings:

  - Added the required column `service` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('SERVICE_A', 'SERVICE_B', 'SERVICE_C');

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "service" "ServiceType" NOT NULL;

-- CreateTable
CREATE TABLE "Slot" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "isBooked" BOOLEAN NOT NULL DEFAULT false,
    "serviceType" "ServiceType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Slot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserForm" (
    "id" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "formData" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserForm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "File" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "userFormId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserForm_appointmentId_key" ON "UserForm"("appointmentId");

-- AddForeignKey
ALTER TABLE "UserForm" ADD CONSTRAINT "UserForm_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_userFormId_fkey" FOREIGN KEY ("userFormId") REFERENCES "UserForm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

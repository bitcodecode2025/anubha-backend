/*
  Warnings:

  - You are about to drop the column `userFormId` on the `File` table. All the data in the column will be lost.
  - You are about to drop the `UserForm` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `patientId` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patientId` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "SleepQuality" AS ENUM ('SOUND', 'DISTURBED');

-- CreateEnum
CREATE TYPE "FoodPreference" AS ENUM ('VEG', 'NON_VEG', 'EGG_VEG');

-- CreateEnum
CREATE TYPE "BowelMovement" AS ENUM ('NORMAL', 'CONSTIPATION', 'DIARRHEA', 'IRREGULAR');

-- DropForeignKey
ALTER TABLE "public"."File" DROP CONSTRAINT "File_userFormId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserForm" DROP CONSTRAINT "UserForm_appointmentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserForm" DROP CONSTRAINT "UserForm_userId_fkey";

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "notes" TEXT,
ADD COLUMN     "patientId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "File" DROP COLUMN "userFormId",
ADD COLUMN     "patientId" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."UserForm";

-- CreateTable
CREATE TABLE "Patient" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" "Gender" NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "neck" DOUBLE PRECISION NOT NULL,
    "waist" DOUBLE PRECISION NOT NULL,
    "hip" DOUBLE PRECISION NOT NULL,
    "wakeUpTime" TEXT NOT NULL,
    "sleepTime" TEXT NOT NULL,
    "sleepQuality" "SleepQuality" NOT NULL,
    "dailyWaterIntake" INTEGER NOT NULL,
    "medicalHistory" TEXT,
    "foodPreference" "FoodPreference" NOT NULL,
    "allergy" TEXT,
    "bowelMovement" "BowelMovement" NOT NULL,
    "postWakeUpTime" TEXT,
    "postWakeUpMeal" TEXT,
    "breakfastTime" TEXT,
    "breakfastMeal" TEXT,
    "midMealTime" TEXT,
    "midMealMeal" TEXT,
    "lunchTime" TEXT,
    "lunchMeal" TEXT,
    "midEveningTime" TEXT,
    "midEveningMeal" TEXT,
    "dinnerTime" TEXT,
    "dinnerMeal" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

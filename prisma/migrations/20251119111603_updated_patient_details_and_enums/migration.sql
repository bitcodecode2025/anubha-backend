/*
  Warnings:

  - The values [SOUND] on the enum `SleepQuality` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `allergy` on the `PatientDetials` table. All the data in the column will be lost.
  - You are about to drop the column `breakfastMeal` on the `PatientDetials` table. All the data in the column will be lost.
  - You are about to drop the column `breakfastTime` on the `PatientDetials` table. All the data in the column will be lost.
  - You are about to drop the column `dinnerMeal` on the `PatientDetials` table. All the data in the column will be lost.
  - You are about to drop the column `dinnerTime` on the `PatientDetials` table. All the data in the column will be lost.
  - You are about to drop the column `foodPreference` on the `PatientDetials` table. All the data in the column will be lost.
  - You are about to drop the column `lunchMeal` on the `PatientDetials` table. All the data in the column will be lost.
  - You are about to drop the column `lunchTime` on the `PatientDetials` table. All the data in the column will be lost.
  - You are about to drop the column `midEveningMeal` on the `PatientDetials` table. All the data in the column will be lost.
  - You are about to drop the column `midEveningTime` on the `PatientDetials` table. All the data in the column will be lost.
  - You are about to drop the column `midMealMeal` on the `PatientDetials` table. All the data in the column will be lost.
  - You are about to drop the column `midMealTime` on the `PatientDetials` table. All the data in the column will be lost.
  - You are about to drop the column `postWakeUpMeal` on the `PatientDetials` table. All the data in the column will be lost.
  - You are about to drop the column `postWakeUpTime` on the `PatientDetials` table. All the data in the column will be lost.
  - Added the required column `address` to the `PatientDetials` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateOfBirth` to the `PatientDetials` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `PatientDetials` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `PatientDetials` table without a default value. This is not possible if the table is not empty.
  - Made the column `medicalHistory` on table `PatientDetials` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
ALTER TYPE "Gender" ADD VALUE 'OTHER';

-- AlterEnum
BEGIN;
CREATE TYPE "SleepQuality_new" AS ENUM ('NORMAL', 'IRREGULAR', 'DISTURBED', 'INSOMNIA');
ALTER TABLE "PatientDetials" ALTER COLUMN "sleepQuality" TYPE "SleepQuality_new" USING ("sleepQuality"::text::"SleepQuality_new");
ALTER TYPE "SleepQuality" RENAME TO "SleepQuality_old";
ALTER TYPE "SleepQuality_new" RENAME TO "SleepQuality";
DROP TYPE "public"."SleepQuality_old";
COMMIT;

-- AlterTable
ALTER TABLE "PatientDetials" DROP COLUMN "allergy",
DROP COLUMN "breakfastMeal",
DROP COLUMN "breakfastTime",
DROP COLUMN "dinnerMeal",
DROP COLUMN "dinnerTime",
DROP COLUMN "foodPreference",
DROP COLUMN "lunchMeal",
DROP COLUMN "lunchTime",
DROP COLUMN "midEveningMeal",
DROP COLUMN "midEveningTime",
DROP COLUMN "midMealMeal",
DROP COLUMN "midMealTime",
DROP COLUMN "postWakeUpMeal",
DROP COLUMN "postWakeUpTime",
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "appointmentConcerns" TEXT,
ADD COLUMN     "dailyFoodIntake" TEXT,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL,
ALTER COLUMN "medicalHistory" SET NOT NULL;

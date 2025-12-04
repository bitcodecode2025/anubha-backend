/*
  Warnings:

  - You are about to drop the column `doctorId` on the `DoctorFormSession` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `DoctorFormSession` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `DoctorFormSession` table. All the data in the column will be lost.
  - You are about to drop the column `channel` on the `MessageLog` table. All the data in the column will be lost.
  - You are about to drop the column `error` on the `MessageLog` table. All the data in the column will be lost.
  - You are about to drop the column `payload` on the `MessageLog` table. All the data in the column will be lost.
  - You are about to drop the column `sentAt` on the `MessageLog` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `MessageLog` table. All the data in the column will be lost.
  - You are about to drop the column `template` on the `MessageLog` table. All the data in the column will be lost.
  - You are about to drop the column `toNumber` on the `MessageLog` table. All the data in the column will be lost.
  - You are about to drop the column `attempts` on the `Reminder` table. All the data in the column will be lost.
  - You are about to drop the column `lastError` on the `Reminder` table. All the data in the column will be lost.
  - You are about to drop the column `scheduledAt` on the `Reminder` table. All the data in the column will be lost.
  - You are about to drop the column `sentAt` on the `Reminder` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Reminder` table. All the data in the column will be lost.
  - You are about to drop the column `toUser` on the `Reminder` table. All the data in the column will be lost.
  - You are about to drop the `DoctorFieldGroup` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DoctorFieldMaster` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DoctorFieldOption` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DoctorFormFieldValue` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `MessageLog` table without a default value. This is not possible if the table is not empty.
  - Made the column `appointmentId` on table `MessageLog` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `foodPreference` to the `PatientDetials` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FormSectionType" AS ENUM ('PERSONAL_INFO', 'FOOD_RECALL_24H', 'WEEKEND_DIET', 'QUESTIONNAIRE', 'FOOD_FREQUENCY', 'HEALTH_PROFILE', 'DIET_PRESCRIBED');

-- CreateEnum
CREATE TYPE "MealPeriod" AS ENUM ('MORNING_INTAKE', 'BREAKFAST', 'MID_MORNING', 'LUNCH', 'MID_DAY', 'EVENING_SNACK', 'DINNER');

-- CreateEnum
CREATE TYPE "AttachmentCategory" AS ENUM ('DIET_CHART', 'LAB_REPORT', 'PRESCRIPTION', 'IMAGE', 'DOCUMENT', 'OTHER');

-- DropForeignKey
ALTER TABLE "DoctorFieldMaster" DROP CONSTRAINT "DoctorFieldMaster_groupId_fkey";

-- DropForeignKey
ALTER TABLE "DoctorFieldOption" DROP CONSTRAINT "DoctorFieldOption_fieldId_fkey";

-- DropForeignKey
ALTER TABLE "DoctorFormFieldValue" DROP CONSTRAINT "DoctorFormFieldValue_fieldId_fkey";

-- DropForeignKey
ALTER TABLE "DoctorFormFieldValue" DROP CONSTRAINT "DoctorFormFieldValue_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "DoctorFormSession" DROP CONSTRAINT "DoctorFormSession_appointmentId_fkey";

-- DropForeignKey
ALTER TABLE "DoctorFormSession" DROP CONSTRAINT "DoctorFormSession_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "DoctorFormSession" DROP CONSTRAINT "DoctorFormSession_patientId_fkey";

-- DropForeignKey
ALTER TABLE "MessageLog" DROP CONSTRAINT "MessageLog_appointmentId_fkey";

-- DropForeignKey
ALTER TABLE "RecallEntry" DROP CONSTRAINT "RecallEntry_recallId_fkey";

-- DropForeignKey
ALTER TABLE "RefreshToken" DROP CONSTRAINT "RefreshToken_adminId_fkey";

-- DropForeignKey
ALTER TABLE "RefreshToken" DROP CONSTRAINT "RefreshToken_userId_fkey";

-- DropIndex
DROP INDEX "DoctorFormSession_doctorId_idx";

-- DropIndex
DROP INDEX "Reminder_scheduledAt_idx";

-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "archivedAt" TIMESTAMP(3),
ADD COLUMN     "isArchived" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "archivedAt" TIMESTAMP(3),
ADD COLUMN     "isArchived" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "DoctorDayOff" ADD COLUMN     "archivedAt" TIMESTAMP(3),
ADD COLUMN     "isArchived" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "DoctorFormSession" DROP COLUMN "doctorId",
DROP COLUMN "notes",
DROP COLUMN "title",
ADD COLUMN     "adminId" TEXT,
ADD COLUMN     "archivedAt" TIMESTAMP(3),
ADD COLUMN     "isArchived" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "patientId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "File" ADD COLUMN     "archivedAt" TIMESTAMP(3),
ADD COLUMN     "isArchived" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "MessageLog" DROP COLUMN "channel",
DROP COLUMN "error",
DROP COLUMN "payload",
DROP COLUMN "sentAt",
DROP COLUMN "status",
DROP COLUMN "template",
DROP COLUMN "toNumber",
ADD COLUMN     "archivedAt" TIMESTAMP(3),
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isArchived" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "appointmentId" SET NOT NULL;

-- AlterTable
ALTER TABLE "PatientDetials" ADD COLUMN     "allergic" TEXT,
ADD COLUMN     "archivedAt" TIMESTAMP(3),
ADD COLUMN     "foodPreference" "FoodPreference" NOT NULL,
ADD COLUMN     "isArchived" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Recall" ADD COLUMN     "archivedAt" TIMESTAMP(3),
ADD COLUMN     "isArchived" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Reminder" DROP COLUMN "attempts",
DROP COLUMN "lastError",
DROP COLUMN "scheduledAt",
DROP COLUMN "sentAt",
DROP COLUMN "status",
DROP COLUMN "toUser",
ADD COLUMN     "archivedAt" TIMESTAMP(3),
ADD COLUMN     "isArchived" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Slot" ADD COLUMN     "archivedAt" TIMESTAMP(3),
ADD COLUMN     "isArchived" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "archivedAt" TIMESTAMP(3),
ADD COLUMN     "isArchived" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "DoctorFieldGroup";

-- DropTable
DROP TABLE "DoctorFieldMaster";

-- DropTable
DROP TABLE "DoctorFieldOption";

-- DropTable
DROP TABLE "DoctorFormFieldValue";

-- CreateTable
CREATE TABLE "doctor_notes" (
    "id" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "formVersion" TEXT NOT NULL DEFAULT '1.0.0',
    "isDraft" BOOLEAN NOT NULL DEFAULT true,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "submittedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "archivedAt" TIMESTAMP(3),
    "personalHistory" TEXT,
    "reasonForJoiningProgram" TEXT,
    "ethnicity" TEXT,
    "joiningDate" TIMESTAMP(3),
    "expiryDate" TIMESTAMP(3),
    "dietPrescriptionDate" TIMESTAMP(3),
    "durationOfDiet" TEXT,
    "maritalStatus" TEXT,
    "numberOfChildren" INTEGER,
    "dietPreference" TEXT,
    "wakeupTime" TEXT,
    "bedTime" TEXT,
    "dayNap" TEXT,
    "workoutTiming" TEXT,
    "workoutType" TEXT,
    "formData" JSONB,
    "analyticsData" JSONB,

    CONSTRAINT "doctor_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MealEntry" (
    "id" TEXT NOT NULL,
    "doctorNotesId" TEXT NOT NULL,
    "mealPeriod" "MealPeriod" NOT NULL,
    "time" TEXT,
    "foodItems" JSONB NOT NULL,
    "waterIntake" INTEGER,
    "medicines" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "MealEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FoodFrequencyItem" (
    "id" TEXT NOT NULL,
    "doctorNotesId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "itemName" TEXT NOT NULL,
    "checked" BOOLEAN NOT NULL DEFAULT false,
    "quantity" TEXT,
    "frequency" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "FoodFrequencyItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HealthCondition" (
    "id" TEXT NOT NULL,
    "doctorNotesId" TEXT NOT NULL,
    "conditionName" TEXT NOT NULL,
    "hasCondition" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "HealthCondition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionnaireAnswer" (
    "id" TEXT NOT NULL,
    "doctorNotesId" TEXT NOT NULL,
    "questionKey" TEXT NOT NULL,
    "answer" TEXT,
    "answerType" TEXT,
    "otherValue" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "QuestionnaireAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DoctorNoteAttachment" (
    "id" TEXT NOT NULL,
    "doctorNotesId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "fileUrl" TEXT,
    "mimeType" TEXT NOT NULL,
    "sizeInBytes" INTEGER NOT NULL,
    "provider" "StorageProvider" NOT NULL DEFAULT 'CLOUDINARY',
    "fileCategory" "AttachmentCategory" NOT NULL DEFAULT 'OTHER',
    "section" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "DoctorNoteAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormSchema" (
    "id" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "schema" JSONB NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "FormSchema_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "doctor_notes_appointmentId_key" ON "doctor_notes"("appointmentId");

-- CreateIndex
CREATE INDEX "doctor_notes_appointmentId_idx" ON "doctor_notes"("appointmentId");

-- CreateIndex
CREATE INDEX "doctor_notes_createdAt_idx" ON "doctor_notes"("createdAt");

-- CreateIndex
CREATE INDEX "doctor_notes_formVersion_idx" ON "doctor_notes"("formVersion");

-- CreateIndex
CREATE INDEX "doctor_notes_isCompleted_submittedAt_idx" ON "doctor_notes"("isCompleted", "submittedAt");

-- CreateIndex
CREATE INDEX "doctor_notes_isDraft_idx" ON "doctor_notes"("isDraft");

-- CreateIndex
CREATE INDEX "doctor_notes_isArchived_archivedAt_idx" ON "doctor_notes"("isArchived", "archivedAt");

-- CreateIndex
CREATE INDEX "doctor_notes_createdBy_idx" ON "doctor_notes"("createdBy");

-- CreateIndex
CREATE INDEX "doctor_notes_submittedAt_idx" ON "doctor_notes"("submittedAt");

-- CreateIndex
CREATE INDEX "MealEntry_doctorNotesId_mealPeriod_idx" ON "MealEntry"("doctorNotesId", "mealPeriod");

-- CreateIndex
CREATE INDEX "MealEntry_mealPeriod_idx" ON "MealEntry"("mealPeriod");

-- CreateIndex
CREATE INDEX "MealEntry_doctorNotesId_idx" ON "MealEntry"("doctorNotesId");

-- CreateIndex
CREATE INDEX "MealEntry_isArchived_idx" ON "MealEntry"("isArchived");

-- CreateIndex
CREATE UNIQUE INDEX "MealEntry_doctorNotesId_mealPeriod_key" ON "MealEntry"("doctorNotesId", "mealPeriod");

-- CreateIndex
CREATE INDEX "FoodFrequencyItem_doctorNotesId_category_idx" ON "FoodFrequencyItem"("doctorNotesId", "category");

-- CreateIndex
CREATE INDEX "FoodFrequencyItem_category_itemName_idx" ON "FoodFrequencyItem"("category", "itemName");

-- CreateIndex
CREATE INDEX "FoodFrequencyItem_doctorNotesId_idx" ON "FoodFrequencyItem"("doctorNotesId");

-- CreateIndex
CREATE INDEX "FoodFrequencyItem_checked_category_idx" ON "FoodFrequencyItem"("checked", "category");

-- CreateIndex
CREATE INDEX "FoodFrequencyItem_isArchived_idx" ON "FoodFrequencyItem"("isArchived");

-- CreateIndex
CREATE UNIQUE INDEX "FoodFrequencyItem_doctorNotesId_category_itemName_key" ON "FoodFrequencyItem"("doctorNotesId", "category", "itemName");

-- CreateIndex
CREATE INDEX "HealthCondition_doctorNotesId_idx" ON "HealthCondition"("doctorNotesId");

-- CreateIndex
CREATE INDEX "HealthCondition_conditionName_hasCondition_idx" ON "HealthCondition"("conditionName", "hasCondition");

-- CreateIndex
CREATE INDEX "HealthCondition_hasCondition_idx" ON "HealthCondition"("hasCondition");

-- CreateIndex
CREATE INDEX "HealthCondition_isArchived_idx" ON "HealthCondition"("isArchived");

-- CreateIndex
CREATE UNIQUE INDEX "HealthCondition_doctorNotesId_conditionName_key" ON "HealthCondition"("doctorNotesId", "conditionName");

-- CreateIndex
CREATE INDEX "QuestionnaireAnswer_doctorNotesId_questionKey_idx" ON "QuestionnaireAnswer"("doctorNotesId", "questionKey");

-- CreateIndex
CREATE INDEX "QuestionnaireAnswer_questionKey_idx" ON "QuestionnaireAnswer"("questionKey");

-- CreateIndex
CREATE INDEX "QuestionnaireAnswer_doctorNotesId_idx" ON "QuestionnaireAnswer"("doctorNotesId");

-- CreateIndex
CREATE INDEX "QuestionnaireAnswer_isArchived_idx" ON "QuestionnaireAnswer"("isArchived");

-- CreateIndex
CREATE UNIQUE INDEX "QuestionnaireAnswer_doctorNotesId_questionKey_key" ON "QuestionnaireAnswer"("doctorNotesId", "questionKey");

-- CreateIndex
CREATE INDEX "DoctorNoteAttachment_doctorNotesId_idx" ON "DoctorNoteAttachment"("doctorNotesId");

-- CreateIndex
CREATE INDEX "DoctorNoteAttachment_doctorNotesId_fileCategory_idx" ON "DoctorNoteAttachment"("doctorNotesId", "fileCategory");

-- CreateIndex
CREATE INDEX "DoctorNoteAttachment_fileCategory_idx" ON "DoctorNoteAttachment"("fileCategory");

-- CreateIndex
CREATE INDEX "DoctorNoteAttachment_section_idx" ON "DoctorNoteAttachment"("section");

-- CreateIndex
CREATE INDEX "DoctorNoteAttachment_isArchived_idx" ON "DoctorNoteAttachment"("isArchived");

-- CreateIndex
CREATE UNIQUE INDEX "FormSchema_version_key" ON "FormSchema"("version");

-- CreateIndex
CREATE INDEX "FormSchema_version_isActive_idx" ON "FormSchema"("version", "isActive");

-- CreateIndex
CREATE INDEX "FormSchema_isActive_idx" ON "FormSchema"("isActive");

-- CreateIndex
CREATE INDEX "FormSchema_isArchived_idx" ON "FormSchema"("isArchived");

-- CreateIndex
CREATE INDEX "Admin_email_idx" ON "Admin"("email");

-- CreateIndex
CREATE INDEX "Admin_phone_idx" ON "Admin"("phone");

-- CreateIndex
CREATE INDEX "Admin_isArchived_idx" ON "Admin"("isArchived");

-- CreateIndex
CREATE INDEX "Appointment_patientId_startAt_idx" ON "Appointment"("patientId", "startAt");

-- CreateIndex
CREATE INDEX "Appointment_status_startAt_idx" ON "Appointment"("status", "startAt");

-- CreateIndex
CREATE INDEX "Appointment_isArchived_idx" ON "Appointment"("isArchived");

-- CreateIndex
CREATE INDEX "DoctorDayOff_adminId_date_idx" ON "DoctorDayOff"("adminId", "date");

-- CreateIndex
CREATE INDEX "DoctorDayOff_isArchived_idx" ON "DoctorDayOff"("isArchived");

-- CreateIndex
CREATE INDEX "DoctorFormSession_adminId_idx" ON "DoctorFormSession"("adminId");

-- CreateIndex
CREATE INDEX "DoctorFormSession_appointmentId_idx" ON "DoctorFormSession"("appointmentId");

-- CreateIndex
CREATE INDEX "DoctorFormSession_isArchived_idx" ON "DoctorFormSession"("isArchived");

-- CreateIndex
CREATE INDEX "File_patientId_idx" ON "File"("patientId");

-- CreateIndex
CREATE INDEX "File_isArchived_idx" ON "File"("isArchived");

-- CreateIndex
CREATE INDEX "MessageLog_appointmentId_idx" ON "MessageLog"("appointmentId");

-- CreateIndex
CREATE INDEX "MessageLog_isArchived_idx" ON "MessageLog"("isArchived");

-- CreateIndex
CREATE INDEX "OTP_expiresAt_idx" ON "OTP"("expiresAt");

-- CreateIndex
CREATE INDEX "PatientDetials_userId_idx" ON "PatientDetials"("userId");

-- CreateIndex
CREATE INDEX "PatientDetials_phone_idx" ON "PatientDetials"("phone");

-- CreateIndex
CREATE INDEX "PatientDetials_email_idx" ON "PatientDetials"("email");

-- CreateIndex
CREATE INDEX "PatientDetials_isArchived_idx" ON "PatientDetials"("isArchived");

-- CreateIndex
CREATE INDEX "Recall_patientId_idx" ON "Recall"("patientId");

-- CreateIndex
CREATE INDEX "Recall_appointmentId_idx" ON "Recall"("appointmentId");

-- CreateIndex
CREATE INDEX "Recall_isArchived_idx" ON "Recall"("isArchived");

-- CreateIndex
CREATE INDEX "RecallEntry_recallId_mealType_idx" ON "RecallEntry"("recallId", "mealType");

-- CreateIndex
CREATE INDEX "RecallEntry_mealType_idx" ON "RecallEntry"("mealType");

-- CreateIndex
CREATE INDEX "RefreshToken_userId_idx" ON "RefreshToken"("userId");

-- CreateIndex
CREATE INDEX "RefreshToken_adminId_idx" ON "RefreshToken"("adminId");

-- CreateIndex
CREATE INDEX "RefreshToken_expiresAt_idx" ON "RefreshToken"("expiresAt");

-- CreateIndex
CREATE INDEX "Reminder_isArchived_idx" ON "Reminder"("isArchived");

-- CreateIndex
CREATE INDEX "Slot_startAt_isBooked_idx" ON "Slot"("startAt", "isBooked");

-- CreateIndex
CREATE INDEX "Slot_isArchived_idx" ON "Slot"("isArchived");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_isArchived_idx" ON "User"("isArchived");

-- CreateIndex
CREATE INDEX "WebhookEvent_createdAt_idx" ON "WebhookEvent"("createdAt");

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecallEntry" ADD CONSTRAINT "RecallEntry_recallId_fkey" FOREIGN KEY ("recallId") REFERENCES "Recall"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_notes" ADD CONSTRAINT "doctor_notes_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealEntry" ADD CONSTRAINT "MealEntry_doctorNotesId_fkey" FOREIGN KEY ("doctorNotesId") REFERENCES "doctor_notes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodFrequencyItem" ADD CONSTRAINT "FoodFrequencyItem_doctorNotesId_fkey" FOREIGN KEY ("doctorNotesId") REFERENCES "doctor_notes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HealthCondition" ADD CONSTRAINT "HealthCondition_doctorNotesId_fkey" FOREIGN KEY ("doctorNotesId") REFERENCES "doctor_notes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionnaireAnswer" ADD CONSTRAINT "QuestionnaireAnswer_doctorNotesId_fkey" FOREIGN KEY ("doctorNotesId") REFERENCES "doctor_notes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorNoteAttachment" ADD CONSTRAINT "DoctorNoteAttachment_doctorNotesId_fkey" FOREIGN KEY ("doctorNotesId") REFERENCES "doctor_notes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorFormSession" ADD CONSTRAINT "DoctorFormSession_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "PatientDetials"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorFormSession" ADD CONSTRAINT "DoctorFormSession_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorFormSession" ADD CONSTRAINT "DoctorFormSession_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageLog" ADD CONSTRAINT "MessageLog_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

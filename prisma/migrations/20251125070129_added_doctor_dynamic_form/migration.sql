-- CreateEnum
CREATE TYPE "DoctorFieldType" AS ENUM ('TEXT', 'NUMBER', 'SELECT', 'MULTISELECT', 'RADIO', 'BOOLEAN', 'DATE', 'TIME', 'TEXTAREA');

-- CreateTable
CREATE TABLE "DoctorFieldGroup" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DoctorFieldGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DoctorFieldMaster" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "type" "DoctorFieldType" NOT NULL,
    "placeholder" TEXT,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "groupId" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DoctorFieldMaster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DoctorFieldOption" (
    "id" TEXT NOT NULL,
    "fieldId" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DoctorFieldOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DoctorFormSession" (
    "id" TEXT NOT NULL,
    "appointmentId" TEXT,
    "patientId" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "title" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DoctorFormSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DoctorFormFieldValue" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "fieldId" TEXT NOT NULL,
    "stringValue" TEXT,
    "numberValue" DOUBLE PRECISION,
    "booleanValue" BOOLEAN,
    "dateValue" TIMESTAMP(3),
    "timeValue" TEXT,
    "jsonValue" JSONB,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DoctorFormFieldValue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DoctorFieldGroup_key_key" ON "DoctorFieldGroup"("key");

-- CreateIndex
CREATE UNIQUE INDEX "DoctorFieldMaster_key_key" ON "DoctorFieldMaster"("key");

-- CreateIndex
CREATE INDEX "DoctorFieldMaster_key_idx" ON "DoctorFieldMaster"("key");

-- CreateIndex
CREATE INDEX "DoctorFieldMaster_groupId_order_idx" ON "DoctorFieldMaster"("groupId", "order");

-- CreateIndex
CREATE INDEX "DoctorFieldOption_fieldId_idx" ON "DoctorFieldOption"("fieldId");

-- CreateIndex
CREATE UNIQUE INDEX "DoctorFieldOption_fieldId_value_key" ON "DoctorFieldOption"("fieldId", "value");

-- CreateIndex
CREATE INDEX "DoctorFormSession_patientId_idx" ON "DoctorFormSession"("patientId");

-- CreateIndex
CREATE INDEX "DoctorFormSession_doctorId_idx" ON "DoctorFormSession"("doctorId");

-- CreateIndex
CREATE INDEX "DoctorFormFieldValue_sessionId_idx" ON "DoctorFormFieldValue"("sessionId");

-- CreateIndex
CREATE INDEX "DoctorFormFieldValue_fieldId_idx" ON "DoctorFormFieldValue"("fieldId");

-- AddForeignKey
ALTER TABLE "DoctorFieldMaster" ADD CONSTRAINT "DoctorFieldMaster_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "DoctorFieldGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorFieldOption" ADD CONSTRAINT "DoctorFieldOption_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "DoctorFieldMaster"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorFormSession" ADD CONSTRAINT "DoctorFormSession_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorFormSession" ADD CONSTRAINT "DoctorFormSession_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "PatientDetials"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorFormSession" ADD CONSTRAINT "DoctorFormSession_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorFormFieldValue" ADD CONSTRAINT "DoctorFormFieldValue_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "DoctorFormSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorFormFieldValue" ADD CONSTRAINT "DoctorFormFieldValue_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "DoctorFieldMaster"("id") ON DELETE CASCADE ON UPDATE CASCADE;

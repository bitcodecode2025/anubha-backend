-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_patientId_fkey";

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_userId_fkey";

-- DropForeignKey
ALTER TABLE "DoctorDayOff" DROP CONSTRAINT "DoctorDayOff_adminId_fkey";

-- DropForeignKey
ALTER TABLE "DoctorFormSession" DROP CONSTRAINT "DoctorFormSession_adminId_fkey";

-- DropForeignKey
ALTER TABLE "DoctorFormSession" DROP CONSTRAINT "DoctorFormSession_appointmentId_fkey";

-- DropForeignKey
ALTER TABLE "DoctorFormSession" DROP CONSTRAINT "DoctorFormSession_patientId_fkey";

-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_patientId_fkey";

-- DropForeignKey
ALTER TABLE "PatientDetials" DROP CONSTRAINT "PatientDetials_userId_fkey";

-- DropForeignKey
ALTER TABLE "Recall" DROP CONSTRAINT "Recall_appointmentId_fkey";

-- DropForeignKey
ALTER TABLE "Recall" DROP CONSTRAINT "Recall_patientId_fkey";

-- DropForeignKey
ALTER TABLE "Slot" DROP CONSTRAINT "Slot_adminId_fkey";

-- DropIndex
DROP INDEX "Appointment_slotId_key";

-- CreateIndex
CREATE INDEX "Appointment_bookingProgress_idx" ON "Appointment"("bookingProgress");

-- CreateIndex
CREATE INDEX "Appointment_status_bookingProgress_idx" ON "Appointment"("status", "bookingProgress");

-- CreateIndex
CREATE INDEX "Appointment_slotId_status_idx" ON "Appointment"("slotId", "status");

-- AddForeignKey
ALTER TABLE "PatientDetials" ADD CONSTRAINT "PatientDetials_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recall" ADD CONSTRAINT "Recall_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "PatientDetials"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recall" ADD CONSTRAINT "Recall_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "PatientDetials"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Slot" ADD CONSTRAINT "Slot_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "PatientDetials"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorDayOff" ADD CONSTRAINT "DoctorDayOff_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorFormSession" ADD CONSTRAINT "DoctorFormSession_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "PatientDetials"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorFormSession" ADD CONSTRAINT "DoctorFormSession_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorFormSession" ADD CONSTRAINT "DoctorFormSession_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- DropForeignKey
ALTER TABLE "public"."File" DROP CONSTRAINT "File_patientId_fkey";

-- AlterTable
ALTER TABLE "File" ALTER COLUMN "patientId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "PatientDetials"("id") ON DELETE SET NULL ON UPDATE CASCADE;

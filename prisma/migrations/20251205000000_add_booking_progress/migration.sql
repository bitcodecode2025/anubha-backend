-- CreateEnum
CREATE TYPE "BookingProgress" AS ENUM ('USER_DETAILS', 'RECALL', 'SLOT', 'PAYMENT');

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN "bookingProgress" "BookingProgress";




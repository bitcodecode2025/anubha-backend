-- CreateEnum (only if it doesn't exist)
DO $$ BEGIN
 CREATE TYPE "BookingProgress" AS ENUM ('USER_DETAILS', 'RECALL', 'SLOT', 'PAYMENT');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- AlterTable (only if column doesn't exist)
DO $$ BEGIN
 ALTER TABLE "Appointment" ADD COLUMN "bookingProgress" "BookingProgress";
EXCEPTION
 WHEN duplicate_column THEN null;
END $$;


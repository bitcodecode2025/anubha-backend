-- Migration: Add partial unique constraint to prevent multiple PENDING appointments per slot
-- This prevents race conditions where multiple users try to book the same slot simultaneously

-- Create a partial unique index that only applies when status is 'PENDING'
-- This allows multiple appointments per slot as long as only one is PENDING
CREATE UNIQUE INDEX IF NOT EXISTS "Appointment_slotId_status_key" 
ON "Appointment" ("slotId", "status") 
WHERE "slotId" IS NOT NULL AND "status" = 'PENDING';

-- Note: This index ensures that:
-- 1. Multiple appointments can reference the same slot if they have different statuses
-- 2. Only one PENDING appointment can exist per slot
-- 3. Race conditions are prevented at the database level



-- AlterTable
ALTER TABLE "User"
  ALTER COLUMN "phone" DROP NOT NULL,
  ADD COLUMN IF NOT EXISTS "password" TEXT,
  ADD COLUMN IF NOT EXISTS "provider" TEXT DEFAULT 'credentials';

-- CreateIndex
CREATE INDEX IF NOT EXISTS "User_provider_idx" ON "User"("provider");


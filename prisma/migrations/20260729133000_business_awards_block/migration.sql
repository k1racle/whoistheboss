ALTER TABLE "businesses"
ADD COLUMN "awardsEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "awardsTitle" TEXT,
ADD COLUMN "awardsDescription" TEXT,
ADD COLUMN "awardsItems" TEXT;

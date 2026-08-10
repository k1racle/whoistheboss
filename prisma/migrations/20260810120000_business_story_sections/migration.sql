ALTER TABLE "businesses"
ADD COLUMN "useCustomOwnerBiography" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "ownerBiographyBlocks" TEXT,
ADD COLUMN "storySections" JSONB;

ALTER TABLE "entrepreneurs"
ADD COLUMN "metaTitle" TEXT,
ADD COLUMN "metaDesc" TEXT,
ADD COLUMN "socialImage" TEXT;

ALTER TABLE "businesses"
ADD COLUMN "metaTitle" TEXT,
ADD COLUMN "metaDesc" TEXT,
ADD COLUMN "socialImage" TEXT;

ALTER TABLE "reels"
ADD COLUMN "metaTitle" TEXT,
ADD COLUMN "metaDesc" TEXT,
ADD COLUMN "socialImage" TEXT;

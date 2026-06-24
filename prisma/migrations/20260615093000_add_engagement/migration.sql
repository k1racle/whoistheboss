-- Add engagement support: likes, shares, comments on all entity types, and businesses

-- Extend comments table with reelId and entrepreneurId
ALTER TABLE "comments" ADD COLUMN IF NOT EXISTS "reelId" TEXT;
ALTER TABLE "comments" ADD COLUMN IF NOT EXISTS "entrepreneurId" TEXT;

-- Add foreign keys for comments (idempotent)
ALTER TABLE "comments" DROP CONSTRAINT IF EXISTS "comments_reelId_fkey";
ALTER TABLE "comments" ADD CONSTRAINT "comments_reelId_fkey" FOREIGN KEY ("reelId") REFERENCES "reels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "comments" DROP CONSTRAINT IF EXISTS "comments_entrepreneurId_fkey";
ALTER TABLE "comments" ADD CONSTRAINT "comments_entrepreneurId_fkey" FOREIGN KEY ("entrepreneurId") REFERENCES "entrepreneurs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Create likes table
CREATE TABLE IF NOT EXISTS "likes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "likes_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "likes_userId_entityType_entityId_key" ON "likes"("userId", "entityType", "entityId");
CREATE INDEX IF NOT EXISTS "likes_entityType_entityId_idx" ON "likes"("entityType", "entityId");

ALTER TABLE "likes" DROP CONSTRAINT IF EXISTS "likes_userId_fkey";
ALTER TABLE "likes" ADD CONSTRAINT "likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Create share events table
CREATE TABLE IF NOT EXISTS "share_events" (
    "id" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "share_events_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "share_events_entityType_entityId_idx" ON "share_events"("entityType", "entityId");

-- Create businesses table
CREATE TABLE IF NOT EXISTS "businesses" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "address" TEXT,
    "city" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "coverImage" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "entrepreneurId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "businesses_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "businesses_slug_key" ON "businesses"("slug");
CREATE INDEX IF NOT EXISTS "businesses_entrepreneurId_idx" ON "businesses"("entrepreneurId");

ALTER TABLE "businesses" DROP CONSTRAINT IF EXISTS "businesses_entrepreneurId_fkey";
ALTER TABLE "businesses" ADD CONSTRAINT "businesses_entrepreneurId_fkey" FOREIGN KEY ("entrepreneurId") REFERENCES "entrepreneurs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

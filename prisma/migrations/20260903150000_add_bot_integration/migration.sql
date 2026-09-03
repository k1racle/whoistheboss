-- CreateEnum
CREATE TYPE "RequestSource" AS ENUM ('WEBSITE', 'TELEGRAM', 'MAX');

-- CreateEnum
CREATE TYPE "BotPlatform" AS ENUM ('TELEGRAM', 'MAX');

-- CreateEnum
CREATE TYPE "RequestActivityType" AS ENUM ('CREATED', 'STATUS_CHANGED', 'ASSIGNED', 'COMMENT', 'MESSAGE_FROM_USER', 'MESSAGE_TO_USER', 'REMINDER_SET', 'USER_CANCELLED');

-- AlterTable
ALTER TABLE "shooting_requests"
ADD COLUMN "requestNumber" TEXT,
ADD COLUMN "position" TEXT,
ADD COLUMN "source" "RequestSource" NOT NULL DEFAULT 'WEBSITE',
ADD COLUMN "externalPlatform" "BotPlatform",
ADD COLUMN "externalUserId" TEXT,
ADD COLUMN "externalChatId" TEXT,
ADD COLUMN "externalRequestKey" TEXT,
ADD COLUMN "campaign" TEXT,
ADD COLUMN "consentAt" TIMESTAMP(3),
ADD COLUMN "assignedAdminKey" TEXT,
ADD COLUMN "assignedAdminName" TEXT,
ADD COLUMN "nextContactAt" TIMESTAMP(3);

UPDATE "shooting_requests"
SET "requestNumber" = 'MP-' || TO_CHAR("createdAt", 'YYMMDD') || '-' || UPPER(SUBSTRING(MD5("id") FROM 1 FOR 6));

ALTER TABLE "shooting_requests" ALTER COLUMN "requestNumber" SET NOT NULL;

-- CreateTable
CREATE TABLE "shooting_request_activities" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "type" "RequestActivityType" NOT NULL,
    "body" TEXT,
    "actorKey" TEXT,
    "actorName" TEXT,
    "fromStatus" "RequestStatus",
    "toStatus" "RequestStatus",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "shooting_request_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bot_outbox_events" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "bot_outbox_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "shooting_requests_requestNumber_key" ON "shooting_requests"("requestNumber");
CREATE UNIQUE INDEX "shooting_requests_externalRequestKey_key" ON "shooting_requests"("externalRequestKey");
CREATE INDEX "shooting_requests_status_createdAt_idx" ON "shooting_requests"("status", "createdAt");
CREATE INDEX "shooting_requests_externalPlatform_externalUserId_createdAt_idx" ON "shooting_requests"("externalPlatform", "externalUserId", "createdAt");
CREATE INDEX "shooting_requests_campaign_createdAt_idx" ON "shooting_requests"("campaign", "createdAt");
CREATE INDEX "shooting_requests_assignedAdminKey_status_idx" ON "shooting_requests"("assignedAdminKey", "status");
CREATE INDEX "shooting_requests_nextContactAt_status_idx" ON "shooting_requests"("nextContactAt", "status");
CREATE INDEX "shooting_request_activities_requestId_createdAt_idx" ON "shooting_request_activities"("requestId", "createdAt");
CREATE INDEX "bot_outbox_events_createdAt_idx" ON "bot_outbox_events"("createdAt");

-- AddForeignKey
ALTER TABLE "shooting_request_activities" ADD CONSTRAINT "shooting_request_activities_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "shooting_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

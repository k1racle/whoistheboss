CREATE TYPE "TrademarkRequestType" AS ENUM ('LICENSE', 'INFRINGEMENT');

CREATE TABLE "trademark_requests" (
    "id" TEXT NOT NULL,
    "requestNumber" TEXT NOT NULL,
    "type" "TrademarkRequestType" NOT NULL,
    "applicantName" TEXT NOT NULL,
    "organization" TEXT,
    "contactName" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "details" JSONB NOT NULL,
    "attachments" JSONB,
    "status" "RequestStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trademark_requests_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "trademark_requests_requestNumber_key" ON "trademark_requests"("requestNumber");
CREATE INDEX "trademark_requests_type_status_createdAt_idx" ON "trademark_requests"("type", "status", "createdAt");

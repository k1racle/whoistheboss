ALTER TABLE "entrepreneurs"
ADD COLUMN "sortOrder" INTEGER NOT NULL DEFAULT 0;

WITH "rankedEntrepreneurs" AS (
  SELECT
    "id",
    ROW_NUMBER() OVER (ORDER BY "createdAt" DESC, "id" ASC) - 1 AS "position"
  FROM "entrepreneurs"
)
UPDATE "entrepreneurs"
SET "sortOrder" = "rankedEntrepreneurs"."position"
FROM "rankedEntrepreneurs"
WHERE "entrepreneurs"."id" = "rankedEntrepreneurs"."id";

CREATE INDEX "entrepreneurs_sortOrder_idx"
ON "entrepreneurs"("sortOrder");

DROP INDEX IF EXISTS "entrepreneurs_isPublished_createdAt_idx";

CREATE INDEX "entrepreneurs_isPublished_sortOrder_createdAt_idx"
ON "entrepreneurs"("isPublished", "sortOrder", "createdAt");

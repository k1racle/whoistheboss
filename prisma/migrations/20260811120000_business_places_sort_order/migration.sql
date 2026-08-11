ALTER TABLE "businesses"
ADD COLUMN "placesSortOrder" INTEGER NOT NULL DEFAULT 0;

WITH "rankedBusinesses" AS (
  SELECT
    "id",
    (ROW_NUMBER() OVER (ORDER BY "createdAt" DESC, "id" ASC) - 1)::INTEGER AS "position"
  FROM "businesses"
)
UPDATE "businesses"
SET "placesSortOrder" = "rankedBusinesses"."position"
FROM "rankedBusinesses"
WHERE "businesses"."id" = "rankedBusinesses"."id";

CREATE INDEX "businesses_placesSortOrder_idx" ON "businesses"("placesSortOrder");

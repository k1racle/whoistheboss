CREATE TABLE "cities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cities_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "entrepreneur_cities" (
    "entrepreneurId" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,

    CONSTRAINT "entrepreneur_cities_pkey" PRIMARY KEY ("entrepreneurId", "cityId")
);

ALTER TABLE "businesses" ADD COLUMN "cityId" TEXT;

CREATE UNIQUE INDEX "cities_slug_key" ON "cities"("slug");
CREATE INDEX "entrepreneur_cities_cityId_idx" ON "entrepreneur_cities"("cityId");
CREATE INDEX "businesses_cityId_idx" ON "businesses"("cityId");

ALTER TABLE "entrepreneur_cities" ADD CONSTRAINT "entrepreneur_cities_entrepreneurId_fkey"
FOREIGN KEY ("entrepreneurId") REFERENCES "entrepreneurs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "entrepreneur_cities" ADD CONSTRAINT "entrepreneur_cities_cityId_fkey"
FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

INSERT INTO "cities" ("id", "name", "slug", "updatedAt")
VALUES ('city_krd', 'Краснодар', 'krd', CURRENT_TIMESTAMP)
ON CONFLICT ("slug") DO NOTHING;

UPDATE "businesses"
SET "cityId" = (SELECT "id" FROM "cities" WHERE "slug" = 'krd')
WHERE "cityId" IS NULL;

ALTER TABLE "businesses" ALTER COLUMN "cityId" SET NOT NULL;

ALTER TABLE "businesses" ADD CONSTRAINT "businesses_cityId_fkey"
FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

INSERT INTO "entrepreneur_cities" ("entrepreneurId", "cityId")
SELECT e."id", c."id"
FROM "entrepreneurs" e
CROSS JOIN "cities" c
WHERE c."slug" = 'krd'
ON CONFLICT DO NOTHING;

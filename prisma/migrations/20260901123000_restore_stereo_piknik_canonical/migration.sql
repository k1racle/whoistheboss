-- The public canonical URL is /companies/stereo-piknik.
-- Restore it after the earlier metadata migration used the legacy slug.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM "businesses" WHERE "slug" = 'stereopiknik')
    AND NOT EXISTS (SELECT 1 FROM "businesses" WHERE "slug" = 'stereo-piknik') THEN
    UPDATE "businesses"
    SET "slug" = 'stereo-piknik', "updatedAt" = CURRENT_TIMESTAMP
    WHERE "slug" = 'stereopiknik';
  ELSIF EXISTS (SELECT 1 FROM "businesses" WHERE "slug" = 'stereopiknik')
    AND EXISTS (SELECT 1 FROM "businesses" WHERE "slug" = 'stereo-piknik') THEN
    UPDATE "businesses"
    SET "isPublished" = false, "updatedAt" = CURRENT_TIMESTAMP
    WHERE "slug" = 'stereopiknik';

    UPDATE "businesses"
    SET "isPublished" = true, "updatedAt" = CURRENT_TIMESTAMP
    WHERE "slug" = 'stereo-piknik';
  END IF;
END $$;

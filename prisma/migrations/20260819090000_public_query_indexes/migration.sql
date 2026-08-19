-- Indexes for the filters and ordering used by public list/detail endpoints.
CREATE INDEX "entrepreneurs_isPublished_createdAt_idx"
ON "entrepreneurs"("isPublished", "createdAt");

CREATE INDEX "interviews_entrepreneurId_idx"
ON "interviews"("entrepreneurId");

CREATE INDEX "interviews_isPublished_publishedAt_idx"
ON "interviews"("isPublished", "publishedAt");

CREATE INDEX "reels_entrepreneurId_idx"
ON "reels"("entrepreneurId");

CREATE INDEX "reels_isPublished_createdAt_idx"
ON "reels"("isPublished", "createdAt");

CREATE INDEX "articles_entrepreneurId_idx"
ON "articles"("entrepreneurId");

CREATE INDEX "articles_isPublished_publishedAt_idx"
ON "articles"("isPublished", "publishedAt");

CREATE INDEX "businesses_isPublished_placesSortOrder_createdAt_idx"
ON "businesses"("isPublished", "placesSortOrder", "createdAt");

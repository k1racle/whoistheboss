-- Apply the approved public SEO copy to existing CMS settings.
UPDATE "site_settings"
SET "value" = CASE "key"
  WHEN 'SITE_NAME' THEN 'МАРШРУТ ПОСТРОЕН МЕДИАГИД'
  WHEN 'SEO_HOME_TITLE' THEN 'МАРШРУТ ПОСТРОЕН МЕДИАГИД — предприниматели и бизнес России'
  WHEN 'SEO_HOME_DESCRIPTION' THEN 'МАРШРУТ ПОСТРОЕН МЕДИАГИД — истории предпринимателей, компаний, брендов и проектов России. Интервью, биографии, бизнес-модели и факты.'
  WHEN 'SEO_ENTREPRENEURS_TITLE' THEN 'Предприниматели России | МАРШРУТ ПОСТРОЕН МЕДИАГИД'
  WHEN 'SEO_ENTREPRENEURS_DESCRIPTION' THEN 'Истории предпринимателей России: биографии, бизнес-путь, решения, проекты и опыт развития компаний. Интервью и редакционные материалы.'
  WHEN 'SEO_COMPANIES_TITLE' THEN 'Компании и бизнес-проекты | МАРШРУТ ПОСТРОЕН МЕДИАГИД'
  WHEN 'SEO_COMPANIES_DESCRIPTION' THEN 'Российские компании, бренды и бизнес-проекты. Истории создания, основатели, бизнес-модели, ключевые факты и редакционные материалы.'
  WHEN 'SEO_BLOG_TITLE' THEN 'Журнал о предпринимателях и бизнесе | МАРШРУТ ПОСТРОЕН МЕДИАГИД'
  WHEN 'SEO_BLOG_DESCRIPTION' THEN 'Статьи о предпринимателях, компаниях и бизнесе России: разборы проектов, опыт основателей, биографии, факты и практические материалы.'
  WHEN 'SEO_INTERVIEWS_TITLE' THEN 'Интервью с предпринимателями | МАРШРУТ ПОСТРОЕН МЕДИАГИД'
  WHEN 'SEO_INTERVIEWS_DESCRIPTION' THEN 'Видеоинтервью с предпринимателями и основателями российских компаний о бизнесе, профессиональном пути, командах, решениях и развитии проектов.'
  WHEN 'SEO_REELS_TITLE' THEN 'Короткие видео о бизнесе | МАРШРУТ ПОСТРОЕН МЕДИАГИД'
  WHEN 'SEO_REELS_DESCRIPTION' THEN 'Короткие видео с предпринимателями и руководителями российских проектов: практический опыт, бизнес-решения, продукты, команды и ключевые идеи.'
  WHEN 'SEO_CONTACTS_TITLE' THEN 'Контакты редакции | МАРШРУТ ПОСТРОЕН МЕДИАГИД'
  WHEN 'SEO_CONTACTS_DESCRIPTION' THEN 'Контакты редакции МАРШРУТ ПОСТРОЕН МЕДИАГИД: адрес, телефон, электронная почта и форма для вопросов, предложений и заявок на участие.'
  WHEN 'SHOOTING_PAGE_TITLE' THEN 'Стать героем проекта | МАРШРУТ ПОСТРОЕН МЕДИАГИД'
  WHEN 'SHOOTING_PAGE_DESCRIPTION' THEN 'Как стать героем МАРШРУТ ПОСТРОЕН МЕДИАГИД: этапы участия, съёмка интервью, подготовка биографии, страницы предпринимателя и материалов о бизнесе.'
  ELSE "value"
END
WHERE "key" IN (
  'SITE_NAME',
  'SEO_HOME_TITLE',
  'SEO_HOME_DESCRIPTION',
  'SEO_ENTREPRENEURS_TITLE',
  'SEO_ENTREPRENEURS_DESCRIPTION',
  'SEO_COMPANIES_TITLE',
  'SEO_COMPANIES_DESCRIPTION',
  'SEO_BLOG_TITLE',
  'SEO_BLOG_DESCRIPTION',
  'SEO_INTERVIEWS_TITLE',
  'SEO_INTERVIEWS_DESCRIPTION',
  'SEO_REELS_TITLE',
  'SEO_REELS_DESCRIPTION',
  'SEO_CONTACTS_TITLE',
  'SEO_CONTACTS_DESCRIPTION',
  'SHOOTING_PAGE_TITLE',
  'SHOOTING_PAGE_DESCRIPTION'
);

-- Keep the sitemap's established canonical company URL and leave the typo URL unavailable.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM "businesses" WHERE "slug" = 'stereo-piknik')
    AND NOT EXISTS (SELECT 1 FROM "businesses" WHERE "slug" = 'stereopiknik') THEN
    UPDATE "businesses"
    SET "slug" = 'stereopiknik', "updatedAt" = CURRENT_TIMESTAMP
    WHERE "slug" = 'stereo-piknik';
  ELSIF EXISTS (SELECT 1 FROM "businesses" WHERE "slug" = 'stereo-piknik')
    AND EXISTS (SELECT 1 FROM "businesses" WHERE "slug" = 'stereopiknik') THEN
    UPDATE "businesses"
    SET "isPublished" = false, "updatedAt" = CURRENT_TIMESTAMP
    WHERE "slug" = 'stereo-piknik';
  END IF;
END $$;

-- Replace only the previous brand wording; custom unrelated content is preserved.
UPDATE "site_settings"
SET "value" = E'Маршрут\nпостроен'
WHERE "key" IN ('HOME_HERO_TITLE', 'ENTREPRENEURS_PAGE_HERO_TITLE')
  AND lower(regexp_replace(trim("value"), '\s+', ' ', 'g')) IN (
    'кто здесь главный',
    'кто здесь главный?'
  );

UPDATE "site_settings"
SET "value" = 'Маршрут Построен'
WHERE "key" = 'SITE_NAME'
  AND lower(trim("value")) IN ('кто здесь главный', 'кто здесь главный?');

UPDATE "site_settings"
SET "value" = replace(
  replace(
    replace(
      replace("value", 'Кто здесь главный?', 'Маршрут Построен'),
      'КТО ЗДЕСЬ ГЛАВНЫЙ?',
      'МАРШРУТ ПОСТРОЕН'
    ),
    'Кто здесь главный',
    'Маршрут Построен'
  ),
  'КТО ЗДЕСЬ ГЛАВНЫЙ',
  'МАРШРУТ ПОСТРОЕН'
)
WHERE "value" LIKE '%Кто здесь главный%'
   OR "value" LIKE '%КТО ЗДЕСЬ ГЛАВНЫЙ%';

UPDATE "entrepreneurs"
SET "heroMarquee" = replace(
  replace("heroMarquee", 'Кто здесь главный', 'Маршрут Построен'),
  'КТО ЗДЕСЬ ГЛАВНЫЙ',
  'МАРШРУТ ПОСТРОЕН'
)
WHERE "heroMarquee" LIKE '%Кто здесь главный%'
   OR "heroMarquee" LIKE '%КТО ЗДЕСЬ ГЛАВНЫЙ%';

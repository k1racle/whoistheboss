UPDATE "site_settings"
SET "value" = E'МЕДИА ГИД\nМАРШРУТ\nПОСТРОЕН'
WHERE "key" = 'HOME_HERO_TITLE';

UPDATE "site_settings"
SET "value" = regexp_replace("value", '\.[[:space:]]*$', '')
WHERE "key" = 'HOME_ABOUT_BOTTOM_TEXT';

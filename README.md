# Кто здесь главный?

Премиальный медиа-портал о предпринимателях и их бизнесе. SSR-сайт на Node.js + самописная админ-панель.

## Стек

- **Backend:** Node.js 20, TypeScript, Express, Prisma, PostgreSQL
- **Frontend (публичный сайт):** EJS (SSR), TailwindCSS, чистый TypeScript
- **Админ-панель:** лёгкий SPA на чистом TypeScript + Vite
- **Деплой:** Docker, Docker Compose, Portainer
- **Видео:** собственное хранилище + встраивание (VK, Rutube, YouTube и др.)

## Быстрый старт

### Локальная разработка

1. Скопируйте `.env.example` в `.env` и настройте переменные.
2. Запустите PostgreSQL через Docker Compose:
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d db
   ```
   (файл `docker-compose.dev.yml` открывает порт PostgreSQL `5433` для локальной разработки)
3. Установите зависимости:
   ```bash
   npm install
   ```
4. Примените миграции и создайте начальные данные:
   ```bash
   npx prisma migrate dev
   npm run db:seed
   ```
5. Запустите dev-сервер:
   ```bash
   npm run dev
   ```
   Сервер доступен на `http://localhost:${PORT}`, админка на `http://localhost:${PORT}/admin`.
   По умолчанию `PORT=3000`. Если порт занят, измените `PORT` в `.env` (например, `PORT=3001`).

### Сборка production

```bash
npm run build
npm start
```

## Деплой через Portainer

1. Загрузите код в Git-репозиторий.
2. В Portainer создайте Stack из Git-репозитория, указав `docker-compose.yml`.
3. Задайте переменные окружения в секции Environment variables Portainer или создайте `.env` внутри стека.
4. Обязательные переменные:
   - `NODE_ENV=production`
   - `PORT=3000` (или другой свободный порт)
   - `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`
   - `DATABASE_URL` (или используйте автоформирование в `docker-compose.yml`)
   - `SESSION_SECRET` — случайная строка минимум 32 символа
   - `ADMIN_SEED_PASSWORD` — пароль для начальных пользователей
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `FROM_EMAIL`, `ADMIN_EMAIL` — для уведомлений
   - `SITE_URL`, `SITE_NAME`, `SITE_DESCRIPTION`
5. При первом запуске миграции применятся автоматически через `scripts/docker-entrypoint.sh`.
6. Зайдите в админку по `http://your-domain/admin` с учётными данными из `npm run db:seed`:
   - Admin: `admin@guessboss.local`
   - Editor: `editor@guessboss.local`
   - Пароль: значение `ADMIN_SEED_PASSWORD`

## Роли

- **ADMIN** — полный доступ, управление пользователями
- **EDITOR** — создание и редактирование контента, модерация
- **SUBSCRIBER** — комментарии + подписка на рассылку

## Структура проекта

```
src/
  server/          # SSR-сервер, API, маршруты, шаблоны
  admin/           # SPA админ-панели
  shared/          # общие типы и утилиты
prisma/            # схема и миграции БД
public/            # статика и загруженные файлы
dist/              # собранное приложение
```

## Полезные команды

```bash
npm run dev            # запуск dev-сервера и админки
npm run build          # production-сборка
npm start              # запуск собранного приложения
npm run db:migrate     # создание миграции
npm run db:seed        # наполнение начальными данными
npm run db:studio      # Prisma Studio
```

## SEO

- Серверный рендеринг всех публичных страниц
- Мета-теги, Open Graph, Twitter Cards
- JSON-LD (Organization, WebSite, VideoObject, Article, Person)
- Автогенерация `sitemap.xml` и `robots.txt`
- Чистые URL и семантическая вёрстка

## Безопасность

- Сессии в PostgreSQL (httpOnly, secure в production)
- Хеширование паролей bcrypt
- Rate limiting на API и формах
- Helmet для заголовков безопасности
- Валидация входных данных через Zod

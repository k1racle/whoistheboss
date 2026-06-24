# Техническое задание: «Кто здесь главный?»

## 1. Общее описание проекта

Медиа-портал о предпринимателях и их бизнесе. Премиальный деловой журнал в стиле Forbes × The Verge. Белый фон, много воздуха, терракотовый акцент `#D94A2B`.

**Цель:** публикация интервью, коротких видео (рилсов), статей и профилей бизнесменов с возможностью оставить заявку на съёмку подобного проекта.

**Язык:** русский.  
**Приоритет вёрстки:** mobile-first, адаптивность до десктопа.  
**Деплой:** Docker + Docker Compose, управление через Portainer из git-репозитория.

---

## 2. Технологический стек

| Слой | Технология |
|------|------------|
| Runtime | Node.js 20 LTS |
| Язык | TypeScript 5.x |
| Веб-фреймворк | Express.js 4.x |
| SSR-шаблоны | EJS |
| Админ-панель | Лёгкий SPA на чистом TypeScript + Vite |
| Стили | TailwindCSS 3.x |
| ORM | Prisma |
| БД | PostgreSQL 16 |
| Сессии | `express-session` + `connect-pg-simple` |
| Загрузка файлов | Multer + Sharp |
| Почта | Nodemailer (SMTP) |
| Валидация | Zod |
| Логирование | Pino |
| Тесты | Vitest (юнит), Playwright (e2e) — по необходимости |
| Контейнеризация | Docker + Docker Compose |

---

## 3. Архитектура

### 3.1. Публичный сайт
- Серверный рендеринг (SSR) через Express + EJS.
- Чистый TypeScript для интерактива (меню, фильтры, лайтбоксы, формы).
- TailwindCSS собирается через PostCSS.
- Все публичные страницы доступны без авторизации.

### 3.2. Админ-панель
- Отдельное SPA-приложение, собираемое Vite.
- Размещается по маршруту `/admin/*`.
- Общается с сервером через REST API (`/api/admin/*`).
- Доступно только для ролей `ADMIN` и `EDITOR`.

### 3.3. API
- Публичное API для форм: `/api/shooting-request`, `/api/subscribe`, комментарии.
- Админ API: `/api/admin/*` — полный CRUD контента и пользователей.
- Защита через сессии и CSRF-токены на формах.

### 3.4. Хранение файлов
- Изображения и видео хранятся в Docker-volume на VPS (`/app/public/uploads`).
- Внешние видео (VK, Rutube, YouTube) сохраняются как ссылки/ID плеера.
- Sharp генерирует WebP-превью исходных изображений.

---

## 4. Структура проекта

```
guessboss/
├── docs/
│   └── SPECIFICATION.md
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── public/
│   ├── uploads/              # пользовательские файлы (volume)
│   ├── css/                  # собранные стили
│   ├── js/                   # публичные скрипты
│   └── favicon/
├── src/
│   ├── admin/                # исходники админ-SPA
│   │   ├── index.html
│   │   ├── main.ts
│   │   ├── api.ts
│   │   ├── router.ts
│   │   └── views/
│   ├── server/
│   │   ├── index.ts          # точка входа
│   │   ├── config.ts
│   │   ├── routes/           # публичные SSR-маршруты
│   │   ├── api/              # API-контроллеры
│   │   ├── middleware/       # auth, errorHandler, upload
│   │   ├── lib/              # helpers, mailer, seo
│   │   └── views/            # EJS-шаблоны
│   └── shared/               # общие типы и утилиты
├── scripts/                  # миграции, сиды
├── tests/
├── .env.example
├── .dockerignore
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── vite.config.ts
```

---

## 5. Сущности базы данных

### 5.1. Роли пользователей
- `ADMIN` — полный доступ
- `EDITOR` — управление контентом, заявками, комментариями
- `SUBSCRIBER` — комментарии + подписка на рассылку

### 5.2. Основные модели

#### User
- `id`, `email` (unique), `password` (hash), `name`, `role`, `isActive`, `createdAt`, `updatedAt`

#### Entrepreneur (бизнесмен)
- `id`, `slug` (unique), `name`, `title`, `photo`, `bio` (text), `quote`
- `isPublished`, `createdAt`, `updatedAt`
- Связи: Interview[], Reel[], Article[]

#### Interview (интервью)
- `id`, `slug` (unique), `title`, `subtitle`
- `entrepreneurId` → Entrepreneur
- `coverImage`, `videoType` (EMBED | SELF_HOSTED), `videoUrl`, `videoFile`
- `summary`, `content` (text), `quote`
- `isPublished`, `publishedAt`, `views`
- `metaTitle`, `metaDesc`
- `createdAt`, `updatedAt`
- Связи: Comment[]

#### Reel (короткое видео)
- `id`, `slug` (unique), `title`
- `entrepreneurId` → Entrepreneur (optional)
- `coverImage`, `videoType`, `videoUrl`, `videoFile`
- `description` (text)
- `isPublished`, `createdAt`, `updatedAt`

#### Article (статья/блог)
- `id`, `slug` (unique), `title`, `subtitle`
- `entrepreneurId` → Entrepreneur (optional)
- `coverImage`, `content` (text)
- `isPublished`, `publishedAt`
- `metaTitle`, `metaDesc`
- `createdAt`, `updatedAt`
- Связи: Comment[]

#### Comment (комментарий)
- `id`, `content` (text)
- `userId` → User
- `interviewId` или `articleId` (полиморфная связь через nullable FK)
- `isApproved`
- `createdAt`

#### ShootingRequest (заявка на съёмку)
- `id`, `name`, `company`, `phone`, `email`, `message` (text)
- `status` (NEW | IN_PROGRESS | COMPLETED | ARCHIVED)
- `createdAt`, `updatedAt`

#### Subscriber (подписчик рассылки)
- `id`, `email` (unique), `isActive`, `createdAt`

#### SiteSetting (настройки сайта)
- `id`, `key` (unique), `value` (text)

### 5.3. Сессии
Хранятся в PostgreSQL через `connect-pg-simple`:
- `sid`, `sess`, `expire`

---

## 6. Публичные страницы и дизайн-секции

### 6.1. Главная страница `/`
1. **Hero**
   - Крупное чёрно-белое фото предпринимателя в костюме без галстука, смотрит в камеру.
   - Полупрозрачная белая плашка слева с заголовком «КТО ЗДЕСЬ ГЛАВНЫЙ».
   - Подзаголовок: «Интервью с основателями бизнеса. Видео, рилсы, фото».
   - Кнопка терракотового цвета «Смотреть интервью».
   - Соотношение сторон секции 16:9, мягкие тени, чистые шрифты без засечек.

2. **Интервью**
   - Светлый фон, сетка из двух колонок на десктопе.
   - Горизонтальные карточки: фото слева, справа — имя, должность, цитата курсивом, иконка Play + «Полное интервью».
   - Карточки разделены тонкими линиями.

3. **Коротко. Рилсы**
   - Кремовый фон.
   - Три вертикальных прямоугольника 9:16 в ряд.
   - Размытая яркая обложка, иконка Play в центре.
   - Подпись под каждым видео: «Имя: тема».

4. **Главная сетка / портреты с цитатами**
   - Крупные портреты предпринимателей с цитатами.
   - Много пустого пространства.
   - Терракотовые подчёркивания и иконки Play.

5. **Блог / три видео-рилса**
   - Вертикальные превью 9:16, минималистично.

6. **Футер**
   - Логотип, меню, форма подписки, соцсети, копирайт.

### 6.2. Страницы разделов
- `/interviews` — список всех интервью с пагинацией.
- `/interviews/:slug` — страница интервью с видео, текстом, цитатами, блоком FAQ, комментариями.
- `/reels` — сетка рилсов.
- `/reels/:slug` — страница рилса (или открытие в модалке/лайтбоксе).
- `/entrepreneurs` — каталог бизнесменов.
- `/entrepreneurs/:slug` — профиль с его интервью, рилсами, статьями.
- `/blog` — лента статей.
- `/blog/:slug` — страница статьи.
- `/shooting-request` — форма заявки на съёмку.

### 6.3. Служебные страницы
- `/sitemap.xml` — автогенерируемая карта сайта.
- `/robots.txt`
- `/rss.xml` — RSS-лента (опционально).
- 404, 500 страницы.

---

## 7. Админ-панель

### 7.1. Общие требования
- Лёгкий SPA на чистом TypeScript.
- Единый лайаут: шапка, боковое меню, рабочая область.
- Таблицы с пагинацией, поиском, фильтрами.
- Редакторы контента с предпросмотром.
- Уведомления об успехе/ошибке.

### 7.2. Разделы

| Раздел | Возможности |
|--------|-------------|
| Dashboard | Статистика: материалов, заявок, подписчиков, комментариев на модерации |
| Пользователи | Список, создание, редактирование роли/активности, удаление |
| Бизнесмены | CRUD, загрузка фото, SEO-поля |
| Интервью | CRUD, выбор бизнесмена, загрузка обложки/видео, вставка внешней ссылки, публикация |
| Рилсы | CRUD, загрузка/ссылка видео, обложка |
| Статьи | CRUD, обложка, WYSIWYG-редактор контента |
| Комментарии | Модерация: одобрить/отклонить/удалить |
| Заявки на съёмку | Просмотр, смена статуса, удаление |
| Подписчики | Список, экспорт CSV, удаление |
| Настройки | Логотип, контакты, SMTP, SEO-заголовки сайта |

### 7.3. Редактор контента
- Для статей и интервью — лёгкий WYSIWYG на чистом JS или markdown-редактор.
- Автосохранение черновика.
- Загрузка изображений в контент через drag-and-drop.

---

## 8. API endpoints

### 8.1. Аутентификация
- `POST /api/auth/login` — вход
- `POST /api/auth/logout` — выход
- `GET /api/auth/me` — текущий пользователь

### 8.2. Публичные формы
- `POST /api/shooting-request` — отправка заявки на съёмку
- `POST /api/subscribe` — подписка на рассылку
- `POST /api/comments` — добавление комментария (требуется авторизация)

### 8.3. Админ API

#### Пользователи
- `GET /api/admin/users`
- `POST /api/admin/users`
- `GET /api/admin/users/:id`
- `PATCH /api/admin/users/:id`
- `DELETE /api/admin/users/:id`

#### Бизнесмены
- `GET /api/admin/entrepreneurs`
- `POST /api/admin/entrepreneurs`
- `GET /api/admin/entrepreneurs/:id`
- `PATCH /api/admin/entrepreneurs/:id`
- `DELETE /api/admin/entrepreneurs/:id`

#### Интервью
- `GET /api/admin/interviews`
- `POST /api/admin/interviews`
- `GET /api/admin/interviews/:id`
- `PATCH /api/admin/interviews/:id`
- `DELETE /api/admin/interviews/:id`

#### Рилсы
- `GET /api/admin/reels`
- `POST /api/admin/reels`
- `GET /api/admin/reels/:id`
- `PATCH /api/admin/reels/:id`
- `DELETE /api/admin/reels/:id`

#### Статьи
- `GET /api/admin/articles`
- `POST /api/admin/articles`
- `GET /api/admin/articles/:id`
- `PATCH /api/admin/articles/:id`
- `DELETE /api/admin/articles/:id`

#### Комментарии
- `GET /api/admin/comments`
- `PATCH /api/admin/comments/:id/approve`
- `DELETE /api/admin/comments/:id`

#### Заявки на съёмку
- `GET /api/admin/shooting-requests`
- `PATCH /api/admin/shooting-requests/:id`
- `DELETE /api/admin/shooting-requests/:id`

#### Подписчики
- `GET /api/admin/subscribers`
- `GET /api/admin/subscribers/export` (CSV)
- `DELETE /api/admin/subscribers/:id`

#### Загрузка файлов
- `POST /api/admin/upload/image` — загрузка изображения с генерацией WebP-превью
- `POST /api/admin/upload/video` — загрузка видеофайла

#### Настройки
- `GET /api/admin/settings`
- `PATCH /api/admin/settings`

---

## 9. SEO и оптимизация под нейро-запросы

### 9.1. Технические основы
- Серверный рендеринг всех публичных страниц.
- Чистые URL: `/interviews/aleksey-smirnov`, `/reels/anna-belova-marketplace`.
- Корректные `<title>`, `<meta name="description">`, Open Graph, Twitter Cards.
- Автогенерация `sitemap.xml` и `robots.txt`.
- HTTP-кэширование и gzip/brotli.
- Lazy loading изображений, формат WebP, srcset.

### 9.2. Структурированные данные (JSON-LD)
- `WebSite` — на главной.
- `Organization` — данные медиа.
- `Person` — профиль бизнесмена.
- `VideoObject` — интервью и рилсы.
- `Article` — публикации блога.
- `BreadcrumbList` — хлебные крошки.
- `FAQPage` — блок вопрос-ответ внутри интервью.

### 9.3. Оптимизация под нейро-поисковики
- Чёткая иерархия заголовков H1-H6.
- Прямые ответы в первых абзацах.
- FAQ-блоки с вопросами «Кто…», «Что…», «Как…».
- Короткие цитаты и выводы в начале материала.
- Разметка ключевых сущностей (имена, компании, должности).
- Структурированные списки и таблицы.
- Быстрая загрузка и Core Web Vitals.

---

## 10. Деплой и инфраструктура

### 10.1. Docker
- **Dockerfile** многоступенчатый:
  1. Установка зависимостей.
  2. Сборка TypeScript и админ-SPA.
  3. Production-образ с Node.js, скомпилированным кодом и статикой.
- **docker-compose.yml** включает:
  - `app` — основное приложение.
  - `db` — PostgreSQL.
  - `redis` — (опционально) для кэша и очередей.
- Volume для загрузок и БД.

### 10.2. Переменные окружения (.env.example)
```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:pass@db:5432/guessboss
SESSION_SECRET=...
UPLOAD_DIR=./public/uploads
SMTP_HOST=...
SMTP_PORT=587
SMTP_USER=...
SMTP_PASS=...
FROM_EMAIL=...
ADMIN_EMAIL=...
SITE_URL=https://...
SITE_NAME=Кто здесь главный?
```

### 10.3. Portainer
- Репозиторий подключается к Portainer.
- При push в основную ветку происходит автоматический redeploy.
- Nginx и SSL настраиваются на стороне VPS (за пределами контейнера приложения).

### 10.4. Безопасность
- Хеширование паролей bcrypt.
- CSRF-токены на формах.
- Rate limiting на API и формах.
- Helmet для заголовков безопасности.
- Валидация всех входных данных через Zod.

---

## 11. Этапы разработки

### Этап 1. Фундамент
- Инициализация проекта, TypeScript, Express, Prisma, Tailwind.
- Docker и docker-compose.
- Схема БД и миграции.
- Система аутентификации и ролей.

### Этап 2. Публичный сайт
- Лайаут, шапка, футер, меню.
- Главная страница со всеми секциями (Hero, интервью, рилсы, сетка цитат, блог).
- Страницы интервью, рилсов, бизнесменов, статей.

### Этап 3. Админ-панель
- SPA-скелет, роутинг, API-клиент.
- CRUD для бизнесменов, интервью, рилсов, статей.
- Загрузка файлов и генерация превью.

### Этап 4. Интерактив
- Форма заявки на съёмку.
- Подписка на рассылку.
- Комментарии и модерация.

### Этап 5. SEO и полировка
- Мета-теги, JSON-LD, sitemap, robots.
- Оптимизация изображений и видео.
- 404/500, мобильная адаптация.

### Этап 6. Деплой
- Dockerfile, healthcheck, документация для Portainer.
- Инструкция по развёртыванию.

---

## 12. Нефункциональные требования

- Время отклика сервера < 200 мс для кэшированных страниц.
- Поддержка последних двух версий Chrome, Firefox, Safari, Edge.
- Доступность (a11y): контрастность, семантические теги, aria-лейблы.
- Возможность горизонтального масштабирования через S3 и CDN в будущем.
- Резервное копирование БД и загруженных файлов — за пределами приложения.

---

## 13. Будущие улучшения (не в MVP)

- Интеграция с внешними почтовыми сервисами (SendPulse и др.).
- Поиск по сайту (PostgreSQL full-text или Elasticsearch).
- Аналитика просмотров.
- Подкасты/аудио.
- Мультиязычность.
- Платная подписка на закрытый контент.

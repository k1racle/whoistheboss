# Миграция публичного сайта на Nuxt 4

Цель: перевести публичный сайт «Кто здесь главный?» с legacy Express/EJS на `Nuxt 4`, не ломая существующую админку.

Текущее состояние репозитория на 3 августа 2026:

- публичный legacy-сервер уже вынесен в `migration_old/`
- `src/admin/` остаётся рабочей отдельной SPA на Vite
- Prisma и текущая схема БД остаются источником данных
- миграция касается публичного сайта и backend-слоя под него; админка не переписывается

## Зафиксированные решения

| Область | Решение |
| --- | --- |
| Package manager | Только `npm`. Использование `pnpm`, `yarn`, `bun` запрещено. Все install/build/dev/typecheck/lint команды должны идти через `npm`. |
| Frontend stack | `Nuxt 4` + `Vue 3` + `Nitro` |
| Стили публички | `Tailwind CSS 4` через `@tailwindcss/vite`; новый публичный слой делаем utilities-first |
| CSS-подход | Отказываемся от BEM в новом Nuxt-коде. Допустимы только локальные семантические обёртки поверх utility-классов, если они реально сокращают повторение |
| Архитектура | Feature-based design для публичного приложения |
| Админка | `src/admin/` не мигрируется и не переводится на Nuxt в рамках этой задачи |
| Первый обязательный чекпоинт | Паритет главной страницы `/` на Nuxt |
| Legacy-источник | Источник правды для переноса публички — `migration_old/`, а не старые пути из `src/server/*` |
| Сессии | `nuxt-auth-utils`; существующие серверные сессии legacy не сохраняются, допускается разовый релогин админа |

## Неподвижные ограничения

- Нельзя ломать маршруты и контракты, на которые завязана админка:
  - `/admin`
  - `/admin/*` SPA fallback
  - `/api/auth/*`
  - `/api/admin/*`
- Нельзя смешивать новый публичный Nuxt-код с кодом админки.
- Нельзя переносить EJS-страницы и legacy CSS «как есть» без декомпозиции на компоненты и фичи.
- Нельзя использовать другой пакетный менеджер кроме `npm`.

## Целевая структура проекта

```text
app/
  assets/
    css/
      main.css
  components/
  composables/
  features/
    home/
    entrepreneurs/
    businesses/
    interviews/
    reels/
    blog/
    shooting-request/
    engagement/
    auth/
  layouts/
  pages/
  plugins/
  shared/
    ui/
    lib/
    types/
server/
  api/
  middleware/
  routes/
  utils/
  plugins/
src/
  admin/
migration_old/
prisma/
public/
```

Принцип разбиения:

- `app/features/*` — предметные фичи публичного сайта
- `app/shared/*` — общие UI-элементы, типы, утилиты, composables без предметной привязки
- `app/components/*` — только очень общие переиспользуемые компоненты приложения, если они не принадлежат конкретной фиче
- `server/*` — серверные обработчики и инфраструктура Nuxt/Nitro
- `src/admin/*` — изолированная админка, не втягиваем её в новую структуру

## Техническая база для нового публичного приложения

### Nuxt и Tailwind

Для нового публичного приложения фиксируем такой базовый стек:

- `nuxt`
- `nuxt-auth-utils`
- `tailwindcss`
- `@tailwindcss/vite`

Tailwind 4 подключается через:

- `app/assets/css/main.css` с `@import "tailwindcss";`
- vite plugin `@tailwindcss/vite` в `nuxt.config.ts`

`@nuxtjs/tailwindcss` не считаем базовым решением для этой миграции.

### Качество и проверки

В новый стек обязательно входят:

- линтер: `@nuxt/eslint` + `eslint`
- typecheck: `typescript` + `vue-tsc`

Обязательные npm-скрипты целевого состояния:

- `npm run lint`
- `npm run lint:fix`
- `npm run typecheck`
- `npm run build`

Требования к реализации:

- `npm run lint` должен проверять Nuxt-код, серверный код и админку
- `npm run typecheck` должен запускать `nuxt typecheck`
- сборка не считается валидной без успешных `lint` и `typecheck`

## Что не переносим 1:1

Не делаем буквальный перенос:

- EJS layout/partials структуры в Vue-шаблоны без переосмысления
- `migration_old/server/styles/main.css` как единого файла в новую публичку
- BEM-иерархии классов как архитектурного стандарта
- legacy DOM-перестановки секций, если во Vue это можно выразить декларативно
- инлайн-скрипты из страниц в их исходном виде

Вместо этого:

- сначала составляем карту блоков и повторяющихся partials
- потом строим карту Vue-компонентов и фич
- затем переносим страницу на новый слой данных и UI

## Инвентарь критичного функционала

### Публичный сайт

Нельзя потерять при переносе:

- splash-заставку по `SPLASH_ENABLED`
- глобальные данные сайта из `site_settings`
- `sectionVisibility` и `sectionOrder` для управляемых страниц
- лайки и шеринги с SSR-счётчиками
- комментарии
- заявку на съёмку с email + Telegram уведомлениями
- загрузки и доступ к `uploads`
- rate limit для API и форм
- `sitemap.xml`, `robots.txt`, JSON-LD, canonical/meta/OG
- `/health`
- легаси-совместимость `/companies` и `/businesses`
- reels lightbox / query-driven open state
- Konami-пасхалку

### Админка

Нельзя сломать:

- cookie-auth сценарии логина/логаута/`me`
- CRUD по текущим `/api/admin/*`
- media library
- CSV export подписчиков
- page editors
- dashboard
- загрузку файлов
- SPA fallback под `/admin/*`

## Контракт совместимости с админкой

Админка считается внешним клиентом нового backend-слоя. Для неё сохраняем:

- те же URL-адреса API
- те же основные JSON shape ответов
- те же коды ответа для happy path и авторизации
- статическую раздачу собранной админки под `/admin`
- SPA fallback на `dist/admin/index.html`

Допустимое изменение:

- разовый релогин после замены legacy session-механики на `nuxt-auth-utils`

Недопустимые изменения:

- перенос админки в `app/`
- переименование `/api/admin/*`
- смена форматов ответов «по пути»
- удаление `/admin/*` fallback

## Фазы миграции

### Фаза 0 — Основание Nuxt и quality gates

1. Поднять базовую структуру Nuxt 4 для публичного приложения.
2. Подключить `Tailwind 4` через `@tailwindcss/vite`.
3. Подключить `@nuxt/eslint`, `eslint`, `typescript`, `vue-tsc`.
4. Зафиксировать npm-only workflow:
   - установка зависимостей только через `npm install`
   - локальная разработка только через `npm run ...`
   - сборка только через `npm run build`
5. Обновить `package.json` под новый стек публички, не ломая сборку админки.
6. Настроить `npm run lint`, `npm run lint:fix`, `npm run typecheck`.
7. Подготовить `nuxt.config.ts`, runtime config и Nitro-основу.

### Фаза 1 — Архитектурная декомпозиция legacy

1. Использовать `migration_old/` как единственный источник legacy-публички.
2. Составить карту:
   - маршрутов
   - partials
   - повторяющихся блоков
   - интерактивных сценариев
   - CSS-зон
3. Выделить фичи и shared-слой.
4. Спроектировать Vue-компоненты вместо EJS partials.
5. Спроектировать composables вместо page-level inline JS.

### Фаза 2 — Серверная инфраструктура Nuxt/Nitro

1. Перенести auth endpoints:
   - `/api/auth/login`
   - `/api/auth/logout`
   - `/api/auth/me`
2. Перенести `/api/admin/*` без разрыва контракта для админки.
3. Перенести публичные API:
   - comments
   - likes
   - shares
   - subscribe
   - shooting-request
4. Реализовать:
   - `/health`
   - `sitemap.xml`
   - `robots.txt`
   - uploads route
   - splash middleware
   - rate limiting

### Фаза 3 — Общий shell и shared building blocks

1. Собрать общий layout публички:
   - header
   - footer
   - social links
   - shooting CTA
2. Вынести:
   - SEO helpers
   - page sections helpers
   - API composables
   - engagement components
   - media/video/lightbox wrappers
3. Разделить CSS:
   - глобальная основа
   - shared primitives
   - feature-local стили, если utility-классов недостаточно

### Фаза 4 — Первый milestone: главная `/`

1. Поднять `server/api/pages/home`.
2. Собрать `app/features/home/*`.
3. Реализовать страницу `/` на Nuxt.
4. Перенести интерактив:
   - reveal
   - scroll scenes
   - mobile slider
   - header theme switches
   - randomization/hover behavior
5. Провести A/B сверку legacy vs Nuxt:
   - данные
   - SEO
   - блоки
   - интерактив
   - mobile/desktop поведение

### Фаза 5 — Остальные публичные маршруты

Порядок переноса:

1. `companies` / legacy alias handling
2. `entrepreneurs`
3. `interviews`
4. `reels`
5. `blog`
6. `contacts`
7. `shooting-request`
8. `login/register`
9. `splash`
10. `404`

Для каждой страницы:

1. серверный data contract
2. feature-layer
3. shared blocks
4. интерактив
5. SEO parity

### Фаза 6 — Сборка и деплой

1. Перевести production build на Nuxt/Nitro.
2. Сохранить сборку админки как отдельный шаг внутри общего `npm run build`.
3. Публиковать админку как статический asset bundle под `/admin`.
4. Обновить `Dockerfile`, `docker-compose.yml`, entrypoint и `.gitignore`.
5. Переключить healthcheck на Nitro runtime.
6. Проверить uploads, Prisma, auth и admin fallback в контейнере.

## Feature-based design: правила

Для нового публичного приложения:

- у каждой фичи свои компоненты, composables, server contracts и тестируемые границы
- shared-слой не знает о предметных фичах
- страницы собирают фичи, а не содержат всю бизнес-логику внутри себя
- маршруты и data loaders должны опираться на feature contracts, а не на случайный прямой импорт из соседних страниц

Пример направления:

- `app/features/home/components/*`
- `app/features/home/composables/*`
- `app/features/home/types/*`
- `app/features/blog/components/*`
- `app/features/engagement/components/*`

## Риски

- Самый большой риск — перенос больших legacy JS-сцен в декларативный Vue без визуального регресса.
- Второй риск — незаметно сломать контракт админки при переносе `/api/auth/*` и `/api/admin/*`.
- Третий риск — попытка тащить legacy CSS целиком вместо нормальной декомпозиции.
- Четвёртый риск — забыть quality gates и накопить типовые/линт-ошибки уже в новой архитектуре.

## Критерии готовности

Минимально приемлемое состояние первой вехи:

- публичная главная работает на Nuxt 4
- админка продолжает открываться по `/admin`
- `npm run lint` проходит
- `npm run typecheck` проходит
- `npm run build` проходит
- SEO и контент главной не деградировали критично относительно legacy

Полная готовность миграции:

- все публичные маршруты перенесены
- legacy Express-публичка больше не участвует в рантайме
- админка работает на новом backend-слое без контрактных регрессий
- Docker/compose собираются только через `npm`-ориентированный pipeline

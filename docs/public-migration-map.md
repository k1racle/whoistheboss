# Public Migration Map

Документ фиксирует маршрутную матрицу и decomposition-подход для переноса legacy view из `migration_old/server/views` в публичный слой `Nuxt 4`.

## Ограничения

- Мигрируем только публичный слой.
- `src/admin` не входит в объем работ.
- Legacy CSS-классы не переносим: интерфейсы пересобираются на `Tailwind CSS 4`.
- Во время промежуточных этапов обязательна только проверка `npm run lint`.
- `npm run build` выполняется один раз в самом конце всей миграции.

## Route Matrix

| Route | Legacy source | Nuxt target | Feature area | Notes |
| --- | --- | --- | --- | --- |
| `/` | `views/index.ejs` | `app/pages/index.vue` | `landing` | Уже собран, позже сверяем data parity |
| `/entrepreneurs` | `views/entrepreneurs/index.ejs` | `app/pages/entrepreneurs/index.vue` | `entrepreneurs/list` | Есть `sectionVisibility` и `sectionOrder` из `SiteSetting` |
| `/entrepreneurs/:slug` | `views/entrepreneurs/detail.ejs` | `app/pages/entrepreneurs/[slug].vue` | `entrepreneurs/detail` | Самая сложная страница, переносится последней |
| `/companies` | `views/businesses/index.ejs` | `app/pages/companies/index.vue` | `businesses/list` | Канонический route |
| `/businesses` | `views/businesses/index.ejs` | alias для `/companies` | `businesses/list` | Legacy alias обязан остаться рабочим |
| `/companies/:slug` | `views/businesses/detail.ejs` | `app/pages/companies/[slug].vue` | `businesses/detail` | Много section config и rich blocks |
| `/interviews` | `views/interviews/index.ejs` | `app/pages/interviews/index.vue` | `interviews/list` | Простой media list |
| `/interviews/:slug` | `views/interviews/detail.ejs` | `app/pages/interviews/[slug].vue` | `interviews/detail` | Rich text, video, related, comments, engagement |
| `/reels` | `views/reels/index.ejs` | `app/pages/reels/index.vue` | `reels/list` | Grid + modal player |
| `/reels/:slug` | legacy redirect to `/reels?play=` | page alias/redirect | `reels/list` | Нужно сохранить поведение `?play=` |
| `/blog` | `views/blog/index.ejs` | `app/pages/blog/index.vue` | `blog/list` | Есть `sectionVisibility`, `sectionOrder`, featured slots из `SiteSetting` |
| `/blog/:slug` | `views/blog/detail.ejs` | `app/pages/blog/[slug].vue` | `blog/detail` | Rich article with related materials |
| `/contacts` | `views/contacts.ejs` | `app/pages/contacts.vue` | `contacts` | Контакты + форма заявки |
| `/shooting-request` | `views/shooting-request.ejs` | `app/pages/shooting-request.vue` | `shooting-request` | Hero, about, stages, faq, CTA |
| `/login` | `views/auth/login.ejs` | `app/pages/login.vue` | `auth` | Публичная auth form |
| `/register` | `views/auth/register.ejs` | `app/pages/register.vue` | `auth` | Публичная auth form |
| `404` | `views/404.ejs` | `app/pages/[...slug].vue` или error page | `system` | Нужен явный not found UI |
| `splash` | `views/splash.ejs` | pending | `system` | Решение отдельно: оставить ли как legacy-only flow |

## Shared UI Candidates

Следующие блоки нельзя собирать page-by-page. Их нужно вынести в `app/shared` или в доменные `app/features/*`.

### Layout and chrome

- sticky public header with logo docking behavior
- public footer with CTA and social links
- page hero variants: landing hero, list hero, profile hero, company hero
- shared banner section
- shared shooting CTA section

### Cards and content blocks

- entrepreneur hero card
- company card
- interview card
- article card
- reel card
- latest-news horizontal card
- popular article card
- related materials grid

### Media and interactive blocks

- embedded/self-hosted video renderer
- reel modal player
- marquee line
- horizontal scroll gallery/stages scene
- FAQ accordion

### Forms

- shooting request form
- auth form shell
- feedback/alert blocks for `success` and `error`

## Data Foundations

Повторяющиеся data dependencies, которые нужно стандартизировать в Nuxt server layer:

- `SiteSetting` as `Record<string, string>`
- parser helpers for `sectionVisibility`
- parser helpers for `sectionOrder`
- page-specific `SiteSetting` groups:
  - `ENTREPRENEURS_PAGE_*`
  - `COMPANIES_PAGE_*`
  - `BLOG_PAGE_*`
  - `SHOOTING_PAGE_*`
  - `HOME_*`
- canonical route helpers and alias handling for `/companies` and `/businesses`

## Feature Layout

- `app/features/entrepreneurs/list/*`
- `app/features/entrepreneurs/detail/*`
- `app/features/businesses/list/*`
- `app/features/businesses/detail/*`
- `app/features/interviews/list/*`
- `app/features/interviews/detail/*`
- `app/features/reels/*`
- `app/features/blog/list/*`
- `app/features/blog/detail/*`
- `app/features/contacts/*`
- `app/features/shooting-request/*`
- `app/features/auth/*`
- `app/shared/ui/public/*`
- `app/shared/lib/*`
- `server/utils/*`

## Migration Order

1. Foundation:
   route constants, aliases, site settings helper, section config helper.
2. Shared UI:
   public layout primitives, media cards, CTA, form shell, video renderer.
3. List and static pages:
   `entrepreneurs`, `companies`, `interviews`, `reels`, `blog`, `contacts`, `shooting-request`, `login`, `register`, `404`.
4. Medium detail pages:
   `interviews/[slug]`, `blog/[slug]`, `companies/[slug]`.
5. Final complex page:
   `entrepreneurs/[slug]`.

## Open Questions

- Нужно ли переносить `splash` в Nuxt, или он остается временным legacy-only entry flow.
- Комментарии и engagement (`likes`, `shares`, `comments`) переносим вместе с detail pages, а не раньше.
- Для `/reels/:slug` лучше сохранить server redirect на `/reels?play=slug`, а не делать отдельный full detail page, чтобы не ломать legacy behavior.

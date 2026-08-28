# Административная панель

Административная панель проекта `guessboss` управляет контентом и настройками публичного сайта. Она работает как отдельный Vite-клиент в `src/admin/` и использует Nitro API как самостоятельный клиент backend-слоя.

Перед любой задачей по админке прочитайте этот документ полностью. Код остается главным источником истины, а этот документ задает карту файлов, контрактов и типовых путей изменений.

## Краткая модель

- Админка не входит в публичное Nuxt-приложение.
- Админка не использует Vue, Vue Router, Nuxt pages или Nuxt composables.
- Клиент написан на TypeScript, формирует HTML-строки и работает через browser DOM API.
- Собственный роутер находится в `src/admin/router.ts`.
- API-клиент находится в `src/admin/api.ts`.
- Nitro обслуживает `/api/auth/*`, `/api/admin/*`, uploads и production-раздачу админки.
- Prisma остается основным доступом к PostgreSQL.
- Публичные компоненты Nuxt не импортируются в админку.
- Legacy-код в `migration_old/` не является актуальной реализацией.

Главная цепочка изменения контента выглядит так:

```text
форма в src/admin/views/*
  -> src/admin/api.ts
  -> /api/admin/*
  -> server/api/admin/[...path].ts
  -> server/utils/admin-*-handlers.ts
  -> server/utils/admin-schemas.ts
  -> Prisma или SiteSetting
  -> публичный server/api/*
  -> app/pages/* и app/features/*
```

Изменение считается сквозным, если значение должно не только сохраняться в админке, но и отображаться на публичном сайте. В таком случае проверьте каждый участок цепочки.

## Границы трех приложений

Проект содержит три отдельные зоны:

1. Публичный сайт на Nuxt 4 и Vue 3 в `app/`.
2. Серверный слой Nitro в `server/`.
3. Административная SPA на TypeScript и Vite в `src/admin/`.

Админка и публичный сайт могут использовать одни данные, но не общий клиентский UI-код. Связь между ними проходит через API, Prisma и `SiteSetting`.

Не переносите админку в Nuxt или Vue в рамках обычной контентной задачи. Не импортируйте в `src/admin/` компоненты, composables или feature-модули из `app/`.

## Запуск и раздача

### Development

Скрипт `npm run dev` запускает два отдельных процесса:

- `npm run dev:site` запускает Nuxt на `127.0.0.1:3001`;
- `npm run dev:admin` запускает Vite для `src/admin/` на `127.0.0.1:5173`.

`vite.admin.config.ts` проксирует `/api` с Vite-сервера на Nuxt по адресу `http://127.0.0.1:3001`. Development-секция `nuxt.config.ts` проксирует `/admin/**` на Vite.

Агент не запускает `npm run dev`, `npm run dev:site`, `npm run dev:admin`, `npm run preview` или другой долгоживущий сервер без явного разрешения владельца проекта.

### Production

`npm run build` сначала выполняет `npm run build:admin`, затем `nuxt build`. Vite собирает админку из `src/admin/` в `dist/admin` с базовым путем `/admin/`.

Nitro раздает файлы `dist/admin` как public assets. Обработчик `server/routes/admin/[...path].get.ts` возвращает `index.html` для `/admin/*` и обеспечивает SPA fallback.

## Карта ключевых файлов

### Клиент админки

| Файл | Ответственность |
| --- | --- |
| `vite.admin.config.ts` | Root, base path, output, Tailwind Vite plugin, dev port и proxy `/api` |
| `src/admin/index.html` | HTML-оболочка с контейнером `#app` |
| `src/admin/main.ts` | Проверка сессии, рендер маршрута, навигация и logout |
| `src/admin/router.ts` | Сопоставление `/admin/*` с функциями экранов |
| `src/admin/api.ts` | Типы данных и все браузерные запросы к auth/admin API |
| `src/admin/views/layout.ts` | Общий layout, меню, `escapeHtml`, сообщения и форматирование дат |
| `src/admin/views/*.ts` | Разметка экранов, загрузка данных и DOM-обработчики |
| `src/admin/lib/editor.ts` | Инициализация Quill и чтение rich text HTML |
| `src/admin/lib/formAutosave.ts` | Автосохранение и защита от потери несохраненных данных |
| `src/admin/lib/slug.ts` | Генерация slug на стороне формы |
| `src/admin/lib/sortableList.ts` | Общая настройка drag-and-drop, drag handle и клавиатурного перемещения строк |
| `src/admin/styles/admin.css` | Tailwind import и локальные semantic-классы админки |
| `src/admin/tsconfig.json` | Отдельная TypeScript-конфигурация админки |

### Серверный слой

| Файл | Ответственность |
| --- | --- |
| `server/api/auth/login.post.ts` | Вход и создание сессии |
| `server/api/auth/logout.get.ts` и `logout.post.ts` | Выход из сессии |
| `server/api/auth/me.get.ts` | Текущий пользователь для запуска админки |
| `server/api/admin/[...path].ts` | Catch-all диспетчер ресурсов `/api/admin/*` |
| `server/utils/admin-api.ts` | Проверка ролей, методов, Zod body и единый формат ошибок |
| `server/utils/admin-content-handlers.ts` | CRUD контентных сущностей |
| `server/utils/admin-operations-handlers.ts` | Пользователи, настройки, карточки и операционные сущности |
| `server/utils/admin-schemas.ts` | Zod-схемы входных данных админки |
| `server/utils/admin-upload-handler.ts` | Загрузка и список медиафайлов |
| `server/utils/auth-session.ts` | H3 session и bridge секретов сессии |
| `server/utils/site-settings.ts` | Чтение настроек публичных страниц |
| `server/utils/site-footer.ts` | Нормализация нижней строки футера и проверка безопасных ссылок |
| `prisma/schema.prisma` | Модели и поля базы данных |

### Публичные потребители

| Область | Публичный API | UI |
| --- | --- | --- |
| Главная | `server/api/landing-page.get.ts` | `app/features/landing/` |
| Предприниматели | `server/api/entrepreneurs-page.get.ts`, `server/api/entrepreneurs/[slug].get.ts` | `app/features/entrepreneurs/` |
| Компании | `server/api/companies-page.get.ts`, `server/api/companies/[slug].get.ts` | `app/features/companies/` |
| Блог | `server/api/blog-page.get.ts`, `server/api/blog/[slug].get.ts` | `app/features/blog/` |
| Интервью | `server/api/interviews.get.ts`, `server/api/interviews/[slug].get.ts` | `app/features/interviews/` |
| Рилсы | `server/api/reels.get.ts`, `server/api/reels/[slug].get.ts` | `app/features/reels/` |
| Стать героем | `server/api/shooting-page.get.ts` | `app/features/shooting-request/` |
| Баннер | `server/api/site-banner.get.ts` | Общий UI публичных страниц |
| Футер | `server/api/site-footer.get.ts` | `app/shared/ui/footer/SiteFooter.vue` через `LayoutDefault.vue` |

## Маршруты экранов

`src/admin/router.ts` не использует Vue Router. Метод `router.resolve()` возвращает объект `{ html, init? }`, который `src/admin/main.ts` вставляет в `#app`.

| URL | Экран | Основные данные |
| --- | --- | --- |
| `/admin/login` | `views/login.ts` | `/api/auth/login` |
| `/admin` | `views/home.ts` | `SiteSetting` главной страницы |
| `/admin/pages/entrepreneurs` | `views/pageEditors.ts` | `ENTREPRENEURS_PAGE_*` |
| `/admin/pages/companies` | `views/pageEditors.ts` | `COMPANIES_PAGE_*` |
| `/admin/pages/blog` | `views/pageEditors.ts` | `BLOG_PAGE_*` и список статей |
| `/admin/pages/shooting-request` | `views/shootingPageEditor.ts` | `SHOOTING_PAGE_*` |
| `/admin/entrepreneurs` и формы | `views/entrepreneurs.ts` | `Entrepreneur` |
| `/admin/cities` и формы | `views/cities.ts` | `City`, города присутствия |
| `/admin/businesses` и формы | `views/businesses.ts` | `Business` |
| `/admin/interviews` и формы | `views/interviews.ts` | `Interview` |
| `/admin/articles` и формы | `views/articles.ts` | `Article` |
| `/admin/reels` и формы | `views/reels.ts` | `Reel` |
| `/admin/audience-cards` и формы | `views/audienceCards.ts` | `AudienceCard` |
| `/admin/shooting-requests` | `views/shootingRequests.ts` | `ShootingRequest` |
| `/admin/users` и формы | `views/users.ts` | `User`, только роль `ADMIN` |
| `/admin/banner` | `views/banner.ts` | Общие настройки баннера |
| `/admin/stages` | `views/stages.ts` | `HOME_STAGES_*` |
| `/admin/settings` | `views/settings.ts` | Общие `SiteSetting` |

При добавлении экрана обновите как минимум `src/admin/router.ts` и при необходимости меню в `src/admin/views/layout.ts`. Добавление файла в `views/` само по себе не создает маршрут.

## Жизненный цикл экрана

Экран обычно возвращает HTML сразу и выполняет асинхронную загрузку внутри `init`:

```ts
return {
  html: layout('Заголовок', renderLoading(), user),
  init: async () => {
    const item = await api.example.get(id)
    setContent(renderForm(item))
    attachSubmit()
  },
}
```

После присвоения `innerHTML` старые DOM-узлы и их обработчики уничтожаются. Поэтому функции вида `attachSubmit`, `attachOrderEditor`, `attachMediaFields` и `initQuill` вызываются после каждой вставки новой разметки.

`src/admin/main.ts` перехватывает только ссылки с атрибутом `data-link`, если их `href` начинается с `/admin`. Обычная ссылка без `data-link` выполняет полную навигацию браузера.

## Авторизация и роли

Перед отображением любого маршрута, кроме `/admin/login`, клиент вызывает `/api/auth/me`. Ошибка запроса отправляет пользователя на `/admin/login`.

Catch-all admin API выполняет серверную проверку роли:

- `ADMIN` и `EDITOR` работают с контентом, настройками и uploads;
- только `ADMIN` работает с `/api/admin/users`;
- клиентское скрытие пункта меню не заменяет серверную авторизацию.

Сессия читает пароль в порядке `NUXT_SESSION_PASSWORD || SESSION_SECRET || runtimeConfig`. Не меняйте этот bridge без отдельной миграции сессий.

## Устройство API

Браузерный клиент использует базовый адрес `/api`. Например, вызов `api.articles.update(id, data)` отправляет `PUT /api/admin/articles/:id`.

`server/api/admin/[...path].ts` выделяет первый сегмент пути как ресурс и передает оставшиеся сегменты обработчику. Сейчас диспетчер знает ресурсы:

- `users`;
- `entrepreneurs`;
- `cities`;
- `interviews`;
- `reels`;
- `articles`;
- `businesses`;
- `audience-cards`;
- `comments`;
- `shooting-requests`;
- `subscribers`;
- `settings`;
- `upload`.

Формат ошибок задает `throwAdminError()`. `src/admin/api.ts` извлекает Zod issues и добавляет их к тексту ошибки. Не меняйте URL, HTTP-метод или shape JSON-ответа без проверки всех существующих клиентов.

## Где хранятся данные

Админка использует три основных способа хранения.

| Способ | Примеры | Когда используется |
| --- | --- | --- |
| Обычные поля Prisma | `Article.title`, `Business.aboutPhoto` | Данные конкретной сущности |
| JSON в текстовом поле сущности | `sectionOrder`, `sectionVisibility`, `storySections` | Составные настройки конкретной записи |
| `SiteSetting` | `BLOG_PAGE_*`, `HOME_*`, `SHOOTING_PAGE_*` | Глобальные страницы и общие блоки |

### Prisma-сущности

Формы предпринимателей, компаний, интервью, статей и рилсов работают через CRUD в `admin-content-handlers.ts`. Изменение поля обычно требует согласовать:

1. Prisma schema и миграцию, если поля еще нет.
2. Тип в `src/admin/api.ts`.
3. Разметку формы и сбор данных в соответствующем `views/*.ts`.
4. Zod-схему в `server/utils/admin-schemas.ts`.
5. Admin handler.
6. Публичный API.
7. Публичный тип и Vue-компонент.

Не создавайте миграцию, если нужное поле уже существует и задача меняет только его ввод или отображение.

### `SiteSetting`

Редакторы главной, общих страниц, баннера, этапов и страницы заявки сохраняют словарь `Record<string, string>` через `/api/admin/settings`. Имена настроек являются частью контракта между формой и публичным API.

При добавлении настройки обновите форму, список читаемых ключей в нужном публичном endpoint и его fallback. Не переименовывайте существующий ключ без миграции данных или совместимого fallback.

Публичный endpoint читает только явно разрешенный список ключей. Не возвращайте клиенту весь объект `SiteSetting`: он может содержать `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, email администратора и другие закрытые значения. Endpoint `server/api/site-footer.get.ts` показывает актуальный пример whitelist-подхода.

### JSON-строки

Порядок секций, видимость, story-секции, FAQ, галереи и другие списки часто сохраняются как JSON-строка. Клиент сериализует значение через `JSON.stringify`, а публичный сервер парсит, валидирует и нормализует его.

Не передавайте в публичный компонент необработанный JSON из базы. Публичный endpoint должен вернуть предсказуемый массив или объект и добавить отсутствующие ключи по умолчанию.

Настройка `FOOTER_META_ITEMS` хранит массив объектов `{ text, href }`. Форма сериализует массив, `server/utils/admin-operations-handlers.ts` проверяет JSON перед сохранением, а `server/utils/site-footer.ts` нормализует публичный результат и fallback. Ссылки принимают только безопасный внутренний путь или протоколы `http:`, `https:`, `mailto:` и `tel:`.

`SOCIAL_LINKS` хранит единый сортируемый массив `{ label, href }` для футера и мобильного меню. `server/api/site-footer.get.ts` читает его через whitelist. Фиксированные `SOCIAL_*` ключи сохранены только как legacy fallback до первого сохранения нового списка. `LayoutDefault.vue` передает один и тот же массив в `SiteFooter.vue` и `SiteHeader.vue`.

## Города присутствия

`City` хранит название и короткий уникальный `slug`. `Business.cityId` задает один город места, а join-таблица `EntrepreneurCity` позволяет привязать предпринимателя к нескольким городам. Маршруты с городом имеют вид `/:city/...`; маршруты без города сохраняют общую выборку. Публичные API принимают optional query `city`.

## Порядок компаний в блоке «Места»

Список `/admin/businesses` задает порядок компаний в блоке «Места» на главной странице. Администратор перемещает строки за drag handle, а клиент сохраняет полный массив идентификаторов через `PUT /api/admin/businesses/order`. Сервер валидирует массив и обновляет `Business.placesSortOrder` для всех компаний одной транзакцией.

Публичный endpoint `GET /api/businesses` выбирает только опубликованные компании и сортирует их по `placesSortOrder`. Главная страница запрашивает первые три карточки без query-параметров. Параметры `limit` и `offset` подготавливают endpoint к последовательной загрузке следующих карточек; объект `pagination` возвращает `hasMore` и `nextOffset`.

Порядок каталога `/companies` остается независимым и продолжает использовать дату создания. Новая компания получает последнюю позицию в блоке «Места», а миграция `20260811120000_business_places_sort_order` сохраняет для существующих записей прежний порядок по дате создания.

## Дополнительные контентные секции

Предприниматели и компании используют общий набор дополнительных секций. Админка редактирует их в `src/admin/views/entrepreneurs.ts` и `src/admin/views/businesses.ts`, но публичный UI находится в shared-слое:

```text
app/shared/ui/additional-sections/
  AdditionalSection.vue
  AdditionalSectionBiography.vue
  AdditionalSectionAccent.vue
  AdditionalSectionPortrait.vue
  AdditionalSectionWide.vue

app/shared/types/additional-section.ts
```

`AdditionalSection.vue` выбирает визуальный компонент по discriminator `section.type`. Общий тип `AdditionalSectionData` сохраняет существующие значения `BIOGRAPHY`, `ACCENT`, `PORTRAIT` и `WIDE`; не меняйте discriminator или JSON shape без совместимой миграции сохраненных записей.

Код админки не импортирует Vue-компоненты из `app/shared/`. Клиент админки описывает совместимый API-тип в `src/admin/api.ts`, а сервер и публичный Nuxt-слой используют общий тип из `app/shared/types/additional-section.ts`.

## Переносы строк в заголовках и текстах

Некоторые поля админки позволяют редактору задавать перенос строки клавишей Enter. Такое поле должно быть `textarea`; однострочный `<input type="text">` не принимает перевод строки.

В интерфейсе редактор может ввести настоящий перенос через Enter или оставить в поле текстовый маркер `\n`. Маркер сохраняется в `textarea` как два символа — обратный слеш и `n` — и преобразуется в перевод строки только публичным plain-text слоем при отображении на сайте. HTML-тег `<br>` специальным маркером не является и в обычном текстовом поле отображается как текст. Другие HTML-теги также не интерпретируются. Поля URL, slug, числовые поля и rich-text редакторы не используют этот механизм.

Сохраненный перевод строки проходит по цепочке как обычная часть строки:

```text
textarea -> строка с \n -> JSON или SiteSetting/Prisma -> public API -> Vue template
```

Обычный HTML схлопывает пробельные символы, поэтому одного сохранения `\n` недостаточно. Публичный элемент должен явно поддерживать перенос, чаще всего классом Tailwind `whitespace-pre-line`. Разбиение строки через `split('\n')` применяйте только тогда, когда макету нужны отдельные DOM-узлы или независимое позиционирование строк.

Текущие примеры полей с Enter:

- hero-заголовки в `src/admin/views/pageEditors.ts` используют `textarea`;
- hero-заголовок страницы «Стать героем» в `src/admin/views/shootingPageEditor.ts` использует `textarea` и подсказку про отдельные строки;
- многие многострочные описания и story-тексты также используют `textarea`.

Поддержка переносов не распространяется автоматически на каждый заголовок. Например, поле `Article.title` в `src/admin/views/articles.ts` сейчас однострочное, а заголовок детальной статьи выводится в `app/features/blog/ui/BlogDetailPage.vue`. Если задача требует Enter в заголовках статей, проверьте как минимум эти два места и все другие карточки, где используется `article.title`.

Для SEO не вставляйте HTML `<br>` в исходное значение заголовка. Сохраняйте обычный текст с переводом строки, а meta title и structured data при необходимости нормализуйте отдельно.

## Порядок и видимость блоков

Порядок и видимость встречаются в нескольких независимых редакторах. Формулировка задачи «сделать везде, где меняем порядок» требует полного поиска по проекту, а не исправления первого найденного экрана.

Основные текущие места:

- `src/admin/views/articles.ts`;
- `src/admin/views/entrepreneurs.ts`;
- `src/admin/views/businesses.ts`;
- `src/admin/views/home.ts`;
- `src/admin/views/pageEditors.ts`;
- `src/admin/views/shootingPageEditor.ts`;
- `src/admin/views/stages.ts`;
- галерея компании в `src/admin/views/businesses.ts`;
- нижняя строка футера в `src/admin/views/settings.ts`.

Поле `AudienceCard.sortOrder` остается отдельным числовым редактором и не использует drag-and-drop.

Для инвентаризации ищите:

- `sectionOrder` и `SECTION_ORDER`;
- `data-section-order-list` и `editor-order-list`;
- `attachSortableList` и `renderSortableHandle`;
- `data-sortable-handle`;
- `sortOrder`;
- DOM-вызовы `insertBefore`, `before` и `after`.

Типовой редактор порядка хранит ключ секции в `data-section-key`, меняет DOM-порядок и перед сохранением записывает массив ключей в скрытый input. Переключатель видимости сохраняет объект `{ [sectionKey]: boolean }`.

Общий helper `src/admin/lib/sortableList.ts` подключает SortableJS, ограничивает начало drag отдельной ручкой и поддерживает клавиши `ArrowUp` и `ArrowDown`. Вызывайте `attachSortableList()` после вставки разметки и передавайте в `onChange` синхронизацию hidden JSON, нумерации или другого производного состояния.

После завершения перемещения helper отправляет bubbling-событие `input`. Формы с autosave используют это событие для нового снимка и сохранения. Динамически добавленная строка работает без повторного создания Sortable, если она соответствует переданному `itemSelector` и содержит `data-sortable-handle`.

При добавлении нового drag-and-drop-редактора сохраните следующие свойства:

- один источник текущего порядка — фактический порядок DOM-элементов;
- стабильный уникальный ключ каждой строки;
- клавиатурное перемещение через drag handle;
- корректное обновление скрытого значения перед autosave и submit;
- одна колонка для списка, если строки содержат отдельные переключатели и drag handle;
- нормализация старых сохраненных массивов при появлении новых секций;
- отсутствие сохранения во время промежуточного drag-состояния.

Используйте существующий `sortableList.ts` для новых списков. Расширяйте helper только для общего поведения нескольких экранов и не создавайте Vue-компонент для этой задачи.

## Формы и сохранение

Большинство CRUD-форм собирает `FormData`, загружает выбранные файлы, формирует объект API и вызывает `create` или `update`. Чекбокс отсутствует в `FormData`, когда он выключен, поэтому boolean-поля обычно читаются через `formData.has(name)`.

Некоторые формы используют `attachFormAutosave()`. Автосохранение сравнивает снимок формы, блокирует уход при несохраненных изменениях и может быть недоступно до первого ручного сохранения новой записи.

Форма предпринимателя после ручного сохранения остаётся открытой и не перенаправляет пользователя к списку. При первом сохранении новой записи форма запоминает созданный `id`, поэтому следующие ручные и автоматические сохранения обновляют ту же запись.

Если автоматическое сохранение завершается ошибкой, форма остается в состоянии с несохраненными изменениями, а введенные данные продолжают находиться в открытой форме. Общий helper показывает один постоянный alert с рекомендацией сохранить данные вручную и безопасным текстом исходной ошибки, если он доступен. Повторные попытки не накапливают alert, а успешное автоматическое или ручное сохранение удаляет его. При включенном интервале следующая попытка автосохранения планируется, пока форма остается измененной.

После добавления динамической строки убедитесь, что она попадает:

- в снимок формы;
- в сбор payload;
- в autosave;
- в повторный render после загрузки;
- в публичную нормализацию.

## HTML, rich text и безопасность

Интерполируйте обычные строки в HTML-разметку админки только через `escapeHtml()`. Особенно это касается `value`, содержимого `textarea`, подписей, имен и URL, которые пришли из базы.

Quill хранит доверенный rich text HTML. Инициализируйте редактор после вставки разметки и получайте итог через `getHtml()`. Не заменяйте rich text простым `escapeHtml`, если поле должно сохранять форматирование.

На публичной стороне вывод rich text проходит через предназначенный для этого компонент или серверную очистку. Не используйте `v-html` для произвольной строки только ради поддержки переносов.

## Медиафайлы

Клиент отправляет изображения и видео как `FormData` в `/api/admin/upload/image` и `/api/admin/upload/video`. `fetchJson()` не выставляет `Content-Type` вручную для `FormData`, чтобы браузер добавил multipart boundary.

URL загруженного файла сохраняется в поле сущности или `SiteSetting`. При изменении медиа-поля проверьте загрузку, ручной URL, preview, сбор payload и публичный способ отображения.

## Типовые сквозные задачи

### Изменить существующее поле сущности

1. Найдите форму по маршруту в `src/admin/router.ts`.
2. Найдите поле и сбор payload в соответствующем `src/admin/views/*.ts`.
3. Проверьте тип сущности и метод в `src/admin/api.ts`.
4. Проверьте Zod-схему и admin handler.
5. Найдите поле в `prisma/schema.prisma`.
6. Найдите публичный endpoint по сущности.
7. Найдите все UI-потребители поля через `rg`.
8. Проверьте сохранение, повторное открытие формы и публичный вывод.

### Изменить настройку страницы

1. Найдите префикс ключа, например `BLOG_PAGE_`.
2. Проверьте редактор в `home.ts`, `pageEditors.ts`, `shootingPageEditor.ts`, `banner.ts` или `settings.ts`.
3. Проверьте `collect*Settings()` и autosave.
4. Найдите ключ в соответствующем `server/api/*-page.get.ts`.
5. Проверьте fallback и нормализацию.
6. Проверьте props публичной страницы и конечный компонент.

### Добавить новый admin API resource

1. Добавьте методы и типы в `src/admin/api.ts`.
2. Добавьте Zod-схему.
3. Добавьте handler или расширьте подходящий существующий handler.
4. Добавьте case в `server/api/admin/[...path].ts`.
5. Укажите допустимые методы и роли.
6. Сохраните существующий формат ошибок.

### Добавить новый экран

1. Создайте функцию view в `src/admin/views/`.
2. Верните `{ html, init? }`.
3. Добавьте маршрут в `src/admin/router.ts`.
4. Добавьте пункт в `src/admin/views/layout.ts`, если экран должен быть в меню.
5. Подключите API и обработчики после render.
6. Проверьте прямое открытие URL и SPA-навигацию.

## Быстрая карта поиска

| Формулировка задачи | Начать с |
| --- | --- |
| «Форма статьи», «заголовок статьи» | `src/admin/views/articles.ts` |
| «Страница блога» | `src/admin/views/pageEditors.ts`, `server/api/blog-page.get.ts`, `app/features/blog/` |
| «Предприниматель», «основатель» | `src/admin/views/entrepreneurs.ts`, `server/api/entrepreneurs/[slug].get.ts`, `app/features/entrepreneurs/` |
| «Компания», «бизнес» | `src/admin/views/businesses.ts`, `server/api/companies/[slug].get.ts`, `app/features/companies/` |
| «Порядок компаний в Местах» | `src/admin/views/businesses.ts`, `server/utils/admin-content-handlers.ts`, `server/api/businesses.get.ts` |
| «Текст и вертикальное/широкое фото» | story sections в `entrepreneurs.ts`/`businesses.ts` и `app/shared/ui/additional-sections/` |
| «Главная страница» | `src/admin/views/home.ts`, `server/api/landing-page.get.ts`, `app/features/landing/` |
| «Стать героем» | `src/admin/views/shootingPageEditor.ts`, `server/api/shooting-page.get.ts` |
| «Порядок и видимость» | поиск `sectionOrder`, `SECTION_ORDER`, `attachSortableList`, `sortOrder` |
| «Футер», «социальные ссылки» | `src/admin/views/settings.ts`, `server/api/site-footer.get.ts`, `server/utils/site-footer.ts`, `app/shared/ui/footer/` |
| «Не сохраняется» | `collect*`, `src/admin/api.ts`, Zod schema, handler |
| «Сохраняется, но не видно» | публичный `server/api/*`, тип props и Vue-компонент |
| «Только администратор» | `views/layout.ts`, `server/api/admin/[...path].ts`, `admin-api.ts` |
| «Загрузка фото или видео» | `src/admin/api.ts`, `admin-upload-handler.ts`, поле preview |

## Полезные команды поиска

Ищите файлы через `rg`, не начинайте с обхода `migration_old/`:

```powershell
rg --files src/admin server app
rg -n "Article.title|article.title" src/admin server app
rg -n "sectionOrder|SECTION_ORDER|sortOrder" src/admin server app prisma
rg -n "attachSortableList|data-sortable-handle|insertBefore" src/admin
rg -n "BLOG_PAGE_" src/admin server app
rg -n "whitespace-pre-line|white-space" app src/admin
rg -n "api\.articles|/admin/articles" src/admin server
```

Сначала ищите бизнес-термин, затем имя поля или setting key. После нахождения формы двигайтесь по цепочке к API и публичному потребителю.

## Совместимость и запреты

Любое изменение админки сохраняет:

- `/admin` и SPA fallback `/admin/*`;
- `/api/auth/login`, `/api/auth/logout`, `/api/auth/me`;
- существующие `/api/admin/*`;
- JSON shape ответов без несогласованной миграции;
- роли `ADMIN` и `EDITOR`;
- production-раздачу `dist/admin` через Nitro;
- bridge `NUXT_SESSION_PASSWORD || SESSION_SECRET`;
- работу публичных aliases `/companies` и `/businesses`, если изменение касается компаний.

Не используйте `pnpm`, `yarn` или `bun`. Не смешивайте код админки с публичной feature-based структурой. Не копируйте реализацию из `migration_old/` как актуальный шаблон.

## Проверка изменений

После любого значимого изменения выполните:

```bash
npm run lint
npm run typecheck
```

`npm run typecheck` проверяет Nuxt-проект, но не заменяет отдельную проверку Vite-клиента админки. После любого изменения в `src/admin/` обязательно выполните:

```bash
npm exec tsc -- -p src/admin/tsconfig.json
```

Для небольших изменений UI, стилей и клиентского поведения не запускайте `npm run build` по умолчанию. Запускайте build при изменении зависимостей, `vite.admin.config.ts`, `nuxt.config.ts`, серверного слоя, production-раздачи или по прямому запросу владельца.

Если изменение затрагивает зависимости, Dockerfile, entrypoint или production-состав образа, дополнительно проверьте Docker-сборку без запуска контейнера:

```bash
docker build --progress=plain -t guessboss:admin-check .
```

Docker build требует работающий Docker Engine и может потребовать отдельное системное разрешение. Предупреждения сборщика перечисляйте отдельно от ошибок и всегда проверяйте итоговый exit code.

Если браузерная проверка требует dev-сервер, сначала запросите разрешение. В итоговом отчете явно перечислите непроверенные сценарии и причины.

## Поддержка документа

Обновляйте этот документ, когда меняются:

- архитектура или стек админки;
- маршруты и пункты меню;
- admin API resources;
- роли и правила доступа;
- способы хранения составных данных;
- сборка, proxy или production-раздача;
- общие механизмы autosave, sortable и публичных настроек;
- обязательные команды проверки.

Не добавляйте сюда полный список каждого поля формы. Документ должен объяснять устройство и путь поиска, а фактический набор полей остается в коде и Prisma schema.

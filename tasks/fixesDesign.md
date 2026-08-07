# fixesDesign

Дата ресерча: 2026-08-05.

Ограничения проверки: dev/preview сервер не запускался, потому что `AGENTS.md` требует отдельное разрешение владельца проекта. `npm run build` через PowerShell заблокирован execution policy для `npm.ps1`, поэтому проверка выполнена эквивалентной npm-командой `npm.cmd run build`.

## Карта компонентов

- Общий layout/header/footer: `app/shared/ui/layout/LayoutDefault.vue`, `app/shared/ui/header/SiteHeader.vue`, `app/shared/ui/header/useSiteHeader.ts`, `app/shared/ui/footer/SiteFooter.vue`.
- FullPage hero: `app/shared/ui/page/FullPage.vue`, `app/features/landing/ui/sections/LandingHeroSection.vue`, `app/features/companies/ui/CompaniesHeroSection.vue`.
- Лендинг: `app/features/landing/ui/LandingPage.vue`, `LandingOurHeroesSection.vue`, `LandingPlacesSection.vue`, `LandingArticles.vue`, `LandingAudienceSection.vue`, `LandingContactSection.vue`, `app/shared/ui/cards/ArticleRowCard.vue`.
- Shooting request: `app/features/shooting-request/ui/ShootingRequestPage.vue`, `ShootingAboutSection.vue`, `ShootingStagesSection.vue`, `ShootingFaqSection.vue`.
- Entrepreneurs list: `app/features/entrepreneurs/ui/EntrepreneursPage.vue`, `EntrepreneursAudienceSection.vue`.
- Entrepreneur profile: `app/features/entrepreneurs/ui/EntrepreneurProfilePage.vue`, `profile/EntrepreneurProfileHero.vue`, `profile/EntrepreneurAboutSection.vue`, `profile/EntrepreneurRelatedSection.vue`, `profile/EntrepreneurMoreSection.vue`, `profile/EntrepreneurStoryVariant03.vue`.
- Related-блоки для возможного шаринга: `app/features/entrepreneurs/ui/profile/EntrepreneurRelatedSection.vue`, `app/features/blog/ui/BlogRelatedSection.vue`, карточки `EntrepreneurRelatedArticleCard.vue`, `BlogRelatedEntrepreneurCard.vue`, `CompanyCatalogCard.vue`.

## 1. Общие hero / FullPage

Статус: реализовано.

Найдено:
- `LandingHeroSection.vue` используется на `/`, `/shooting-request`, `/entrepreneurs`, `/blog`.
- Сейчас wrapper внутри `FullPage` содержит `items-center`, а `h1` двигается через `pt-10 lg:pt-80`. Это и есть костыль, который ломает прижатие к низу.
- `CompaniesHeroSection.vue` тоже FullPage, но использует `items-center` и `pt-50`, плюс `lg:pb-[70px]`.
- `FullPage.vue` сам по себе уже `flex flex-col justify-between`; для нужного поведения достаточно, чтобы внутренний контейнер был `items-end`, а отступы жили на контейнере, не на `h1`.

Правка:
- В `LandingHeroSection.vue`: заменить `items-center` на `items-end`, убрать `pt-*` с `h1`, задать нижний padding контейнеру для desktop/mobile.
- В `CompaniesHeroSection.vue`: аналогично заменить центрирование на `items-end`, убрать `pt-50`, оставить/нормализовать нижний отступ.
- Проверить `/blog`: должен исправиться автоматически, так как использует `LandingHeroSection`.
- `/entrepreneur/SLUG` не переводить на `FullPage`; там нужен локальный hero с flex-выравниванием к низу.

## 2. Header / бургер на лендинге

Статус: реализовано.

Найдено:
- Пункты меню в `SiteHeader.vue` не исчезли из данных: `mobileNavigationItems` содержит `Предприниматели`, `Компании`, `Блог`, `Съемка`.
- Overlay мобильного меню имеет `z-40`, а sticky header `z-50`. Из-за этого раскрытое меню может оказаться под шапкой и восприниматься как сломанное.
- Слой меню телепортируется в `body`, но не перекрывает header.

Правка:
- Поднять overlay до `z-[60]` или выше.
- Проверить положение кнопки закрытия/бургер-иконки после открытия: если header остается сверху, нужно либо оставить кнопку в header, либо добавить отдельную кнопку закрытия в overlay.

## 3. Landing ArticleRowCard

Статус: реализовано.

Найдено:
- `ArticleRowCard.vue` сейчас использует 2-3 колонки и absolute hover image.
- Требуемая desktop-сетка: `author | title | animation-block | arrow`, далее divider на все 4 колонки, далее `empty | text | empty | empty`.
- Мобильная версия должна убрать анимационный блок и остаться в 3 колонках, с горизонтальным overflow, потому что длинный текст ломает верстку.
- Компонент переиспользуется не только на лендинге: `BlogArticleCard.vue`, `BlogDetailPage.vue`, `BlogLatestSection.vue`, `LandingArticleCard.vue`, `LandingArticles.vue`. Правку нужно делать как общий компонент - дизайн и функционал не меняется на страницах.

Правка:
- Вынести hover image из absolute в отдельную desktop-колонку.
- Добавить внутренний divider, полоса проходящая сквозь всю карточку, нижняя граница 2.5px цвет серый.
- На mobile скрыть animation-block и включить controlled horizontal overflow у карточки.

## 4. Лендинг: "Наши герои"

Статус: реализовано.

Найдено:
- `LandingOurHeroesSection.vue` сейчас рендерит title, text и кнопку "Ещё" раздельно: кнопка идет после блока title/text, поэтому не находится на уровне title.
- Кнопка не скрыта на мобилке.
- Legacy `migration_old/server/views/index.ejs` содержит логику: `featuredHeroes = allHeroes.length <= 3 ? allHeroes : allHeroes.slice(2, 6)`.
- Текущий Nuxt fallback содержит 3 героя, но API-данные на странице могут быть больше 3.

Правка:
- Сделать header секции: верхняя строка `h2 + Ещё`, под ней description.
- Скрыть кнопку на mobile.
- Добавить computed `visibleHeroes`, который гарантирует desktop-выдачу кратно 3. Минимально: использовать legacy-правило `length <= 3 ? all : slice(2, 6)` и/или обрезать до ближайшего числа, кратного 3.

## 5. Лендинг: "Места"

Статус: реализовано.

Найдено:
- `LandingPlacesSection.vue` уже держит кнопку в одном flex-row с заголовочным блоком, но из-за `items-end` и вложенного блока `h2+p` кнопка фактически выравнивается по низу описания, не по title.

Правка:
- Сделать аналогичный header: строка `h2 + Ещё`, description отдельной строкой ниже.
- Скрытие на mobile не было явно указано для "Места", но лучше уточнить/сделать консистентно с "Наши герои", если дизайн одинаковый.

## 7. LandingContactSection

Статус: реализовано.

Найдено:
- Кнопка "Узнать подробнее" находится внутри `LandingContactForm.vue`, у нее `xl:mt-auto`, из-за чего на xl она прижимается вниз.
- Пользователь просит поднять её и оставить небольшой отступ от низа около 25px в rem.

Правка:
- Править `LandingContactForm.vue`: заменить `xl:mt-auto` на controlled отступ/позиционирование, например через `xl:mt-[...]` или wrapper flex с `pb-6`/`pb-[1.5625rem]`.
- Проверить, что submit-кнопка формы и дополнительная кнопка не конфликтуют по вертикали.

## 8. Footer: убрать "Интервью"

Статус: реализовано.

Найдено:
- `SiteFooter.vue` содержит `pageLinks`, включая `{ label: 'Интервью', to: ROUTES.INTERVIEWS }`.

Правка:
- Удалить только пункт `Интервью` из footer links.
- Роут `/interviews` не трогать.

## 9. Лендинг: "Для кого" mobile

Статус: реализовано.

Найдено:
- В mobile-разметке `LandingAudienceSection.vue` title сейчас центрирован: `mx-auto flex w-fit flex-col items-center text-center`.
- Нет индивидуального смещения строк `ДЛЯ` / `КОГО`, поэтому потерян эффект с `pr-6`.
- Desktop-анимация есть только для `lg`, на mobile сейчас статичный список карточек.

Правка:
- Вернуть mobile title offsets: для второй строки добавить правый/левый сдвиг по дизайну, например через вычисленный индекс и `pr-6`.
- Для mobile сделать отдельный flow в том же компоненте или вынести подкомпонент, если логика станет крупной: центрированный title фиксируется, карточки в одном столбце двигаются горизонтально в разные стороны при scroll progress.
- Не менять порядок карточек: мобильный порядок остается одноколоночным.

## 10. `/shooting-request`: логотип во второй секции

Статус: реализовано.

Найдено:
- Лендинг управляет видимостью header logo через `LandingPage.vue` и `LandingAboutSection.logoRef`.
- `ShootingRequestPage.vue` сейчас не использует `useSiteHeader`, а `ShootingAboutSection.vue` просто показывает локальный `SiteLogo` в секции.
- Из-за этого header logo на `/shooting-request` не повторяет поведение лендинга.

Правка:
- В `ShootingRequestPage.vue` добавить логику `useSiteHeader`, аналогичную лендингу, но только для desktop.
- В `ShootingAboutSection.vue` expose `logoRef` для локального логотипа второй секции.
- На unmount возвращать `logoVisible.value = true`, чтобы не ломать другие страницы.

## 11. `/shooting-request`: FAQ hover

Статус: реализовано.

Найдено:
- `ShootingFaqSection.vue` сейчас имеет обычный `details` с `bg-surface`, hover-стилей нет.

Правка:
- На `details`/`summary` добавить hover/focus/open состояние: красная подложка (`bg-accent`) и белый текст (`text-text-on-accent`).
- Иконку плюс/минус тоже переводить в текущий цвет через `bg-current`, чтобы она становилась белой.

## 12. `/shooting-request`: этапы на mobile

Статус: реализовано.

Найдено:
- `ShootingStagesSection.vue` на `md+` уже делает pinned horizontal animation.
- На mobile сейчас используется `LandingSlider`; пользователь просит заменить на scroll-анимацию с текстом по центру и блоками, которые ездят туда-сюда.

Правка:
- Расширить текущую scroll-логику ниже `md` или вынести общий компонент pinned-flow.
- Mobile layout: title fixed/center, cards one-column или stacked-track, transform по scroll progress с чередованием направлений.
- Учитывать `prefers-reduced-motion`: оставлять простой список без pinned-анимации.

## 13. `/entrepreneurs`: EntrepreneursAudienceSection

Статус: реализовано.

Найдено:
- `EntrepreneursAudienceSection.vue` сейчас выводит intro header отдельно перед сеткой (`mb-12 ml-auto max-w-[760px]`), а сами карточки отдельно в grid.
- Сетка карточек уже CSS grid через `SLOT_POSITIONS`.

Правка:
- На desktop поместить intro/header в тот же grid, в верхний правый слот.
- Для этого лучше сделать общий grid-контейнер и задать header `lg:col-start-* lg:row-start-*`, без absolute.
- Mobile оставить как сейчас: header сверху, карточки ниже.

## 14. `/entrepreneurs/SLUG`: hero marquee

Статус: реализовано.

Найдено:
- `EntrepreneurProfileHero.vue` содержит `heroMarqueeText` и CSS animation `profileHeroMarquee`.
- Пользователь видит, что бегущая строка не бежит; возможно, проблема в привязке к hero, overflow/width или HMR/cache.
- Текущая реализация встроена внутрь hero, а пользователь просит переиспользуемый компонент и, возможно, отвязку от hero.

Правка:
- Создать shared-компонент бегущей строки, например `app/shared/ui/marquee/TextMarquee.vue`.
- Props: `text`, `speed/duration`, `variant`, `repeat`.
- Использовать его сразу после hero или как отдельную секцию вверху следующего блока. Практичнее: отдельная секция между `EntrepreneurProfileHero` и `EntrepreneurAboutSection`, чтобы потом переиспользовать без зависимости от hero.

## 15. `/entrepreneurs/SLUG`: hero текстовый порядок

Статус: реализовано.

Найдено:
- `EntrepreneurProfileHero.vue` сейчас раскладывает большие слова и teaser-тексты в три горизонтальные строки.
- Пользователь хочет: обычный подзаголовок сверху, большие слова колонкой под ним, весь текст hero прижат к низу.

Правка:
- Перестроить внутренний flex layout hero: wrapper `items-end`, внутри bottom block.
- Teaser/subtitle первым внутри bottom block, затем display words вертикальной колонкой.
- Сохранить min-height без `FullPage`.

## 16. `/entrepreneurs/SLUG`: EntrepreneurAboutSection hover

Статус: реализовано.

Найдено:
- `activeIndex` по умолчанию равен `1`, поэтому второй пункт всегда активный.
- Тот же `activeIndex` меняется на hover/focus и не сбрасывается; из-за этого наведенный пункт остается белым/красным до следующего hover.
- Сейчас активный и hover имеют одинаковую схему: красная подложка, белый текст.
- Требование: второй пункт по дизайну всегда красный; при hover он становится белой подложкой с черным текстом. Остальные при hover получают красную подложку и белый текст.

Правка:
- Развести состояния `pinned/special` и `hovered`.
- Второй пункт (`index === 1`) базово красный.
- Для второго пункта hover/focus: `bg-surface text-text`.
- Для остальных hover/focus: `bg-accent text-text-on-accent`.
- Активную картинку можно менять по hover, но цвет не должен зависеть от залипшего `activeIndex`.

## 17. `/entrepreneurs/SLUG`: Related / "Читайте также"

Статус: реализовано быстрым фиксом; shared component оставлен как отдельная рекомендация.

Найдено:
- `EntrepreneurRelatedSection.vue` использует mobile `LandingSlider`, карточка `min-w-[82%] sm:min-w-[420px]`.
- Пользователь просит mobile cards около `70%`, сейчас они шире и выглядят огромными.
- `BlogRelatedSection.vue` повторяет похожую структуру related-секции, но без mobile slider для каждой строки.

Правка:
- Быстрый фикс: в `EntrepreneurRelatedSection.vue` заменить mobile width на `min-w-[70%] max-w-[70%]`.
- Более правильная правка: создать `app/shared/ui/related/SharedRelatedSection.vue` с props для title и списков/slots.
- Для mobile: отдельный horizontal slider для каждой строки карточек.
- Для desktop: сохранить grid 3 колонки.

## 18. `/entrepreneurs/SLUG`: EntrepreneurMoreSection mobile

Статус: реализовано.

Найдено:
- `EntrepreneurMoreSection.vue` уже построен на grid, но mobile сейчас превращает первую часть в `max-lg:grid-cols-2`, затем `max-md:grid-cols-1`; из-за этого на узком mobile карточки становятся в один столбец.
- Слово `БОЛЬШЕ` сейчас видно на mobile из-за `max-lg` horizontal mode.
- Картинка на `max-md` теряет `col-span-full` и становится обычной колонкой.

Правка:
- На mobile: скрыть слово `БОЛЬШЕ`.
- Mobile grid: 4 квадрата в 2 колонки, image занимает третий ряд на всю ширину.
- Убрать `max-md:grid-cols-1` для карточек и сохранить `grid-cols-2`.
- Для image оставить `col-span-full`.
- На `lg+` вернуть текущее слово `БОЛЬШЕ` в grid.

## 19. Shared related component

Статус: рекомендовано, но делать после быстрых визуальных фиксов.

Найдено:
- Повторение related-паттерна есть между `EntrepreneurRelatedSection.vue` и `BlogRelatedSection.vue`.
- Карточки разные, поэтому shared-компонент должен быть layout/section-shell со slots, а не компонент, который знает все типы данных.

Правка:
- Создать `app/shared/ui/related/SharedRelatedSection.vue`.
- Props: `title`, optional `id`, aria labels/counts для sliders.
- Slots: `entrepreneurs`, `companies`, `articles` или generic rows.
- Мигрировать сначала `EntrepreneurRelatedSection`, потом `BlogRelatedSection`.

## Проверка

- `npm.cmd run build` прошел успешно.
- `npm run lint` и `npm run typecheck` еще не запускались после документа, потому что кодовые правки пока не вносились.

## Предлагаемый порядок реализации

1. Общий hero + header menu + footer.
2. Лендинг: ArticleRowCard, секции "Наши герои", "Места", "Для кого", CTA.
3. `/shooting-request`: logo visibility, FAQ hover, stages mobile.
4. `/entrepreneurs`: audience grid.
5. `/entrepreneurs/SLUG`: hero layout, marquee component, about hover, related, more mobile.
6. После каждого блока: `npm.cmd run lint`, `npm.cmd run typecheck`; при возможности `npm.cmd run build`.

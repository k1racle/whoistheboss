Нужны skeleton/fallback состояния для публичных Nuxt-страниц на случай пустого ответа API, долгой загрузки или отсутствия медиа/связанных материалов.

вернуть библиотеки, сеошку можно вернуть с og images false, nuxtImage спорный, может сломать.

Универсальная обёртка для story-секций из админки:

- `app/features/entrepreneurs/ui/profile/EntrepreneurStorySection.vue`
- `app/features/entrepreneurs/ui/profile/EntrepreneurStoryVariant01.vue`
- `app/features/entrepreneurs/ui/profile/EntrepreneurStoryVariant02.vue`
- `app/features/entrepreneurs/ui/profile/EntrepreneurStoryVariant03.vue`
- `app/features/entrepreneurs/ui/profile/EntrepreneurStoryVariant04.vue`
- `app/features/entrepreneurs/ui/EntrepreneurProfilePage.vue`
- `app/features/companies/ui/CompanyProfilePage.vue`

## Дальнейшая оптимизация Nuxt Image

- Добавить осмысленные `width`, `height` и `sizes` для всех `NuxtImg`, начиная с LCP-изображений и карточек каталогов. Сейчас сохранены исходные стили и поведение без изменения визуальных размеров.
- Настроить форматы WebP/AVIF и уровни `quality` после визуального сравнения с оригиналами.
- Определить отдельные image presets для hero, карточек, галерей, аватаров и вертикальных обложек reels.
- Для LCP-изображений настроить `preload`, `fetchpriority="high"` и `loading="eager"`; для остальных проверить корректность lazy loading.
- Перевести `PageBannerSection.vue` с нативного `<picture>` на `NuxtPicture`, сохранив отдельные desktop/mobile изображения, skeleton и проверку фактической загрузки.
- Перевести CSS background в `CompanyManifestSection.vue` на оптимизированное изображение или отдельный позиционируемый `NuxtImg`, не меняя текущую композицию.
- Проверить runtime-обработку файлов из Docker volume `/app/public/uploads` через `/_ipx/**` после production-деплоя.
- Настроить длительное кэширование `/_ipx/**` на reverse proxy/CDN и определить стратегию очистки кэша после замены загруженных файлов.
- Ограничить допустимые размеры и набор генерируемых вариантов, чтобы не допустить неконтролируемого роста IPX-кэша и нагрузки на CPU.
- Добавить визуальные regression-тесты для главной, блога, компаний, предпринимателей, интервью и reels на основных breakpoint.
- После появления внешних image-host настроить явный allowlist доменов и подходящий Nuxt Image provider.

## Дальнейшая SEO-оптимизация

- Подготовить дизайн и включить `nuxt-og-image` вместо текущего `ogImage: false`; сделать отдельные шаблоны для статей, интервью, предпринимателей и компаний.
- До включения генератора определить единое статическое fallback-изображение `og:image` для страниц без контентной обложки.
- После стабилизации всех маршрутов включить `linkChecker.failOnError` и устранить либо документировать все допустимые исключения.
- Проверить canonical-domain redirect за production reverse proxy и только после этого рассмотреть `seoUtils.redirectToCanonicalSiteUrl: true`.
- Ввести явную переменную окружения для управления индексацией staging/production вместо неявного определения окружения.
- Дополнить глобальную Organization schema реальными `sameAs`, контактами и юридическими данными.
- Проверить Article, VideoObject, Person и Organization через Google Rich Results Test и Schema.org Validator на production URL.
- Добавить отдельные индексируемые страницы reels; текущие `/reels/:slug` являются редиректами и поэтому сознательно не добавлены в sitemap.
- При росте каталога разделить sitemap на статьи, интервью, предпринимателей и компании, затем настроить cache/warm-up.
- При необходимости расширить sitemap данными для Google News, видео и изображений после проверки качества метаданных в БД.
- Добавить в админку обязательные SEO-поля: social image, canonical override, дата изменения, автор, alt-текст и настройки индексации.
- Выработать политику для AI/non-SEO bots и только затем включать `blockAiBots` или `blockNonSeoBots`.
- Подключить Google Search Console и Яндекс Вебмастер, отправить sitemap и отслеживать coverage, canonical и structured-data ошибки.
- Вынести повторяющуюся настройку page meta/schema в типизированные feature-композаблы после стабилизации итогового набора SEO-полей.

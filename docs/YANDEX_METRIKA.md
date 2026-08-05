# Яндекс Метрика

Документация по интеграции Яндекс Метрики в публичный сайт на Nuxt 4.

## Подключение

Метрика подключается через Nuxt-плагин, который автоматически загружается только в браузере:

```text
app/plugins/yandex-metrika.client.ts
```

Стандартное поведение Nuxt:

- файлы из `app/plugins` регистрируются автоматически, отдельная настройка в `nuxt.config.ts` не требуется;
- суффикс `.client.ts` ограничивает выполнение клиентским окружением (плагин не работает на сервере и не попадает в SSR-бандл).

### Что делает плагин

- создаёт очередь команд `window.ym`;
- загружает внешний скрипт `https://mc.yandex.ru/metrika/tag.js?id=<ID>`;
- вызывает `init` с опциями: `defer: true`, `webvisor`, `clickmap`, `trackLinks`, `accurateTrackBounce`, `ecommerce: 'dataLayer'`;
- отслеживает первый просмотр через `app:mounted`;
- отслеживает SPA-переходы через `page:finish` и `router.afterEach` (включая изменение query и hash);
- защищает от дублей просмотров (один URL учитывается один раз);
- предоставляет `$ym` для отправки целей.

### `<noscript>` fallback

Для пользователей с отключённым JavaScript в `app/app.vue` (единая точка входа Nuxt) через `useHead` добавляется `<noscript>`-пиксель:

```vue
<script setup lang="ts">
useHead({
  noscript: [
    {
      innerHTML:
        '<div><img src="https://mc.yandex.ru/watch/111314136" style="position:absolute; left:-9999px;" alt="" /></div>',
    },
  ],
})
</script>
```

Пиксель рендерится на сервере в каждом HTML-ответе и учитывает визиты без JS. ID в `src` должен совпадать с `METRIKA_ID` из плагина.

## Где прописывается ID счётчика

ID счётчика задаётся константой в начале плагина:

```ts
const METRIKA_ID = 111314136
const METRIKA_SCRIPT_URL =
  `https://mc.yandex.ru/metrika/tag.js?id=${METRIKA_ID}`
```

Чтобы подключить другой счётчик, достаточно заменить значение `METRIKA_ID`.

## Как отслеживать цели

Из любого Vue-компонента:

```vue
<script setup lang="ts">
const { $ym } = useNuxtApp()

const submitForm = async () => {
  // Отправка формы...

  $ym('reachGoal', 'FORM_SENT')
}
</script>
```

Передача параметров цели (видно в отчёте Метрики):

```ts
const { $ym } = useNuxtApp()

$ym('reachGoal', 'FORM_SENT', {
  userType: 'customer',
})
```

Передача пользовательских параметров (не цель, а атрибуты визита):

```ts
$ym('params', {
  userType: 'customer',
})
```

### Сигнатура `$ym`

```ts
$ym(method: string, ...args: unknown[]): void
```

Каждый вызов транслируется в `window.ym(METRIKA_ID, method, ...args)`. Поддерживаются все методы Метрики: `reachGoal`, `params`, `hit`, `init` и другие.

## Особенности

- **SPA и `defer: true`.** Автоматический просмотр отключён, все просмотры отправляются вручную через `hit`. Это исключает двойной учёт первого просмотра.
- **`<noscript>` fallback.** Клиентский плагин не выполняется без JavaScript, поэтому в `app/app.vue` через `useHead` добавлен `<noscript>` с пикселем счётчика (`https://mc.yandex.ru/watch/<ID>`). Он попадает в SSR-HTML и считает визиты пользователей с отключённым JS.
- **Цели создаются в интерфейсе Метрики** (раздел «Цели»), после чего в коде вызывается `$ym('reachGoal', '<ID_ЦЕЛИ>')` с тем же идентификатором.

## Верификация Яндекса

Файл подтверждения для Яндекс Вебмастера к плагину не относится и кладётся отдельно:

```text
public/<точное-имя-файла-из-Яндекса>.html
```

Содержимое файла — текст `Verification: <код>`.

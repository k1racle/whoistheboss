import { nextTick } from 'vue'

const METRIKA_ID = 111314136
const METRIKA_SCRIPT_URL =
  `https://mc.yandex.ru/metrika/tag.js?id=${METRIKA_ID}`

type MetrikaArguments = [
  counterId: number,
  method: string,
  ...args: unknown[],
]

type MetrikaFunction = ((...args: MetrikaArguments) => void) & {
  a?: MetrikaArguments[]
  l?: number
}

declare global {
  interface Window {
    ym?: MetrikaFunction
    dataLayer?: unknown[]
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter()

  /*
   * Создаём очередь команд Метрики.
   *
   * Пока внешний tag.js загружается, вызовы init/hit/reachGoal
   * сохраняются в window.ym.a.
   */
  if (!window.ym) {
    const ym = ((...args: MetrikaArguments) => {
      ym.a ||= []
      ym.a.push(args)
    }) as MetrikaFunction

    ym.l = Date.now()
    window.ym = ym
  }

  /*
   * Не загружаем скрипт повторно, например при HMR в dev-режиме.
   */
  const scriptAlreadyExists = Array
    .from(document.scripts)
    .some((script) => script.src === METRIKA_SCRIPT_URL)

  if (!scriptAlreadyExists) {
    const script = document.createElement('script')

    script.src = METRIKA_SCRIPT_URL
    script.async = true
    script.dataset.yandexMetrika = String(METRIKA_ID)

    document.head.appendChild(script)
  }

  /*
   * Нужно только при использовании ecommerce: 'dataLayer'.
   */
  window.dataLayer ||= []

  window.ym(METRIKA_ID, 'init', {
    ssr: true,

    // Отключаем автоматический просмотр.
    // Все просмотры ниже отправляем через hit.
    defer: true,

    webvisor: true,
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,

    // Удалите, если ecommerce не используется.
    ecommerce: 'dataLayer',
  })

  let lastTrackedUrl = ''
  let referer = document.referrer

  const trackPageView = async () => {
    /*
     * Ждём обновления страницы и document.title.
     */
    await nextTick()

    const currentUrl = window.location.href

    /*
     * app:mounted, page:finish и router.afterEach иногда могут
     * сработать для одного перехода. Защищаемся от дублей.
     */
    if (currentUrl === lastTrackedUrl) {
      return
    }

    window.ym?.(METRIKA_ID, 'hit', currentUrl, {
      title: document.title,
      referer,
    })

    referer = currentUrl
    lastTrackedUrl = currentUrl
  }

  /*
   * Первый просмотр после монтирования приложения.
   */
  nuxtApp.hook('app:mounted', () => {
    void trackPageView()
  })

  /*
   * Переходы между полноценными страницами Nuxt.
   */
  nuxtApp.hook('page:finish', () => {
    void trackPageView()
  })

  /*
   * В том числе изменения query-параметров и hash:
   * /catalog?page=1 → /catalog?page=2
   */
  router.afterEach(() => {
    void trackPageView()
  })

  /*
   * Теперь из компонентов можно вызывать:
   *
   * const { $ym } = useNuxtApp()
   * $ym('reachGoal', 'FORM_SENT')
   */
  return {
    provide: {
      ym: (method: string, ...args: unknown[]) => {
        window.ym?.(METRIKA_ID, method, ...args)
      },
    },
  }
})

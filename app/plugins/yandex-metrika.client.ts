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
   * Не грузим Метрику в development-режиме: не загружаем tag.js,
   * не инициализируем счётчик и не отправляем просмотры.
   */
  if (import.meta.dev) {
    return {
      provide: {
        ym: () => {},
      },
    }
  }

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

  const loadMetrikaScript = () => {
    if (scriptAlreadyExists || document.querySelector('[data-yandex-metrika]')) return

    const script = document.createElement('script')

    script.src = METRIKA_SCRIPT_URL
    script.async = true
    script.dataset.yandexMetrika = String(METRIKA_ID)

    document.head.appendChild(script)
  }

  if (localStorage.getItem('marshrut-cookie-consent-v1') !== 'accepted') {
    window.addEventListener('marshrut-cookie-consent', ((event: CustomEvent<'accepted' | 'rejected'>) => {
      if (event.detail === 'accepted') window.location.reload()
    }) as EventListener, { once: true })
    return {
      provide: {
        ym: () => {},
      },
    }
  }

  const scheduleMetrikaScript = () => {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(loadMetrikaScript, { timeout: 2_000 })
      return
    }

    globalThis.setTimeout(loadMetrikaScript, 0)
  }

  if (document.readyState === 'complete') {
    scheduleMetrikaScript()
  }
  else {
    window.addEventListener('load', scheduleMetrikaScript, { once: true })
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

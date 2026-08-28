import { nextTick } from 'vue'

const METRIKA_ID = 112035140

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

  // The public Nuxt app is not mounted for /admin, but keep this guard so
  // analytics can never leak into the separate admin client after routing changes.
  const isAdminPath = window.location.pathname === '/admin'
    || window.location.pathname.startsWith('/admin/')

  if (import.meta.dev || isAdminPath) {
    return {
      provide: {
        ym: () => {},
      },
    }
  }

  let lastTrackedUrl = window.location.href
  let referer = document.referrer

  const trackPageView = async () => {
    await nextTick()

    const currentUrl = window.location.href

    // Several Nuxt hooks may fire for the same navigation.
    if (currentUrl === lastTrackedUrl) return

    window.ym?.(METRIKA_ID, 'hit', currentUrl, {
      title: document.title,
      referer,
    })

    referer = currentUrl
    lastTrackedUrl = currentUrl
  }

  nuxtApp.hook('page:finish', () => {
    void trackPageView()
  })

  // Also cover query-string and hash-only navigation.
  router.afterEach(() => {
    void trackPageView()
  })

  return {
    provide: {
      ym: (method: string, ...args: unknown[]) => {
        window.ym?.(METRIKA_ID, method, ...args)
      },
    },
  }
})

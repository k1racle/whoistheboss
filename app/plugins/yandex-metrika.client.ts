const COUNTER_ID = 112035140
const CONSENT_STORAGE_KEY = 'marshrut-cookie-consent-v1'
const CONSENT_EVENT = 'marshrut-cookie-consent'
const TAG_URL = `https://mc.yandex.ru/metrika/tag.js?id=${COUNTER_ID}`

type MetrikaFunction = ((...args: unknown[]) => void) & {
  a?: unknown[][]
  l?: number
}

declare global {
  interface Window {
    ym?: MetrikaFunction
  }
}

const createMetrikaQueue = () => {
  if (window.ym) return window.ym

  const ym = ((...args: unknown[]) => {
    (ym.a ??= []).push(args)
  }) as MetrikaFunction

  ym.l = Date.now()
  window.ym = ym

  return ym
}

export default defineNuxtPlugin(() => {
  let isInitialized = false

  const initialize = () => {
    if (isInitialized) return
    isInitialized = true

    const ym = createMetrikaQueue()
    const isTagLoaded = Array.from(document.scripts).some(script => script.src === TAG_URL)

    if (!isTagLoaded) {
      const script = document.createElement('script')
      const firstScript = document.scripts[0]

      script.async = true
      script.src = TAG_URL

      if (firstScript?.parentNode) firstScript.parentNode.insertBefore(script, firstScript)
      else document.head.appendChild(script)
    }

    ym(COUNTER_ID, 'init', {
      ssr: true,
      webvisor: true,
      clickmap: true,
      ecommerce: 'dataLayer',
      referrer: document.referrer,
      url: location.href,
      accurateTrackBounce: true,
      trackLinks: true,
    })
  }

  if (localStorage.getItem(CONSENT_STORAGE_KEY) === 'accepted') initialize()

  window.addEventListener(CONSENT_EVENT, (event) => {
    if ((event as CustomEvent<string>).detail === 'accepted') initialize()
  })
})

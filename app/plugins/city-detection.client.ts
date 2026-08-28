import type { PresenceCity } from '@shared/types/city'

const CITY_PREFERENCE_KEY = 'marshrut-presence-city-v1'

export default defineNuxtPlugin(async () => {
  const route = useRoute()
  if (route.path !== '/' || localStorage.getItem(CITY_PREFERENCE_KEY)) return

  try {
    const city = await $fetch<PresenceCity | null>('/api/cities/detect')
    if (!city || useRoute().path !== '/') return
    localStorage.setItem(CITY_PREFERENCE_KEY, city.slug)
    await navigateTo(`/${city.slug}`, { replace: true })
  }
  catch {
    // Geolocation headers are optional; the unfiltered site remains the fallback.
  }
})

import type { PresenceCity } from '@shared/types/city'

const CITY_AWARE_PATH = /^\/(?:entrepreneurs|companies|businesses|blog|interviews|reels)(?:\/|$)/
const CITY_PREFERENCE_KEY = 'marshrut-presence-city-v1'
const CITY_NAVIGATION_BYPASS_KEY = 'marshrut-city-navigation-bypass'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const targetCity = typeof to.params.city === 'string' ? to.params.city.toLowerCase() : ''

  if (targetCity) {
    const cities = useState<PresenceCity[]>('presence-cities', () => [])
    if (!cities.value.length) {
      cities.value = await $fetch<PresenceCity[]>('/api/cities')
    }
    if (!cities.value.some(city => city.slug === targetCity)) {
      throw createError({ statusCode: 404, statusMessage: 'City not found' })
    }
    if (import.meta.client) localStorage.setItem(CITY_PREFERENCE_KEY, targetCity)
    return
  }

  const sourceCity = typeof from.params.city === 'string' ? from.params.city.toLowerCase() : ''
  const shouldKeepCity = to.path === '/' || CITY_AWARE_PATH.test(to.path)
  if (!sourceCity || !shouldKeepCity) return

  if (import.meta.client && sessionStorage.getItem(CITY_NAVIGATION_BYPASS_KEY) === '1') {
    sessionStorage.removeItem(CITY_NAVIGATION_BYPASS_KEY)
    localStorage.setItem(CITY_PREFERENCE_KEY, 'all')
    return
  }

  return navigateTo(`/${sourceCity}${to.fullPath === '/' ? '' : to.fullPath}`)
})

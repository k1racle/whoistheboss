import { z } from 'zod'
import type { H3Event } from 'h3'

const citySlugSchema = z.string().trim().toLowerCase().max(24).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)

export function getRequestedCitySlug(event: H3Event): string | undefined {
  const value = getQuery(event).city
  const parsed = citySlugSchema.safeParse(Array.isArray(value) ? value[0] : value)
  return parsed.success ? parsed.data : undefined
}

export function entrepreneurCityFilter(citySlug?: string) {
  return citySlug
    ? { cityLinks: { some: { city: { slug: citySlug } } } }
    : {}
}

export function businessCityFilter(citySlug?: string) {
  return citySlug ? { presenceCity: { slug: citySlug } } : {}
}

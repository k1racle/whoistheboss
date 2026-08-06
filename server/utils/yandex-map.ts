import type { MapCoordinates } from '@shared/types/map'

function createCoordinates(latitude: number, longitude: number): MapCoordinates | null {
  if (
    !Number.isFinite(latitude)
    || !Number.isFinite(longitude)
    || latitude < -90
    || latitude > 90
    || longitude < -180
    || longitude > 180
  ) {
    return null
  }

  return { latitude, longitude }
}

function parsePair(value: string, order: 'latitude-first' | 'longitude-first'): MapCoordinates | null {
  const [first, second, ...rest] = value
    .trim()
    .split(/[;,\s]+/)
    .filter(Boolean)

  if (!first || !second || rest.length) return null

  const firstNumber = Number(first)
  const secondNumber = Number(second)

  return order === 'latitude-first'
    ? createCoordinates(firstNumber, secondNumber)
    : createCoordinates(secondNumber, firstNumber)
}

export function getYandexMapCoordinates(
  legacyMapEmbed: string | null | undefined,
): MapCoordinates | null {
  const raw = String(legacyMapEmbed || '').trim()
  if (!raw) return null

  const directCoordinates = parsePair(raw, 'latitude-first')
  if (directCoordinates) return directCoordinates

  const srcMatch = raw.match(/src\s*=\s*["']([^"']+)["']/i)
  const candidate = (srcMatch?.[1] ?? raw).replace(/&amp;/g, '&')

  try {
    const url = new URL(candidate)
    if (!/(^|\.)yandex\.(ru|com)$/i.test(url.hostname)) return null

    const point = url.searchParams.get('ll')
      || url.searchParams.get('whatshere[point]')
      || url.searchParams.get('pt')?.split(',').slice(0, 2).join(',')

    return point ? parsePair(point, 'longitude-first') : null
  }
  catch {
    return null
  }
}

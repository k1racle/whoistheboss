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

function parsePair(value: string): MapCoordinates | null {
  const [first, second, ...rest] = value
    .trim()
    .split(/[;,\s]+/)
    .filter(Boolean)

  if (!first || !second || rest.length) return null

  const firstNumber = Number(first)
  const secondNumber = Number(second)

  return createCoordinates(firstNumber, secondNumber)
}

export function getYandexMapCoordinates(
  mapCoordinates: string | null | undefined,
): MapCoordinates[] {
  return String(mapCoordinates || '')
    .split(/\r?\n/)
    .map(line => parsePair(line))
    .filter((coordinates): coordinates is MapCoordinates => coordinates !== null)
}

export type SectionVisibility = Record<string, boolean>

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function parseSectionVisibility(raw: string | null | undefined): SectionVisibility {
  if (!raw) return {}

  try {
    const parsed = JSON.parse(raw) as unknown
    if (!isRecord(parsed)) return {}

    return Object.fromEntries(
      Object.entries(parsed).filter((entry): entry is [string, boolean] => typeof entry[1] === 'boolean')
    )
  }
  catch {
    return {}
  }
}

export function isSectionVisible(
  visibility: SectionVisibility,
  key: string,
  defaultVisible = true,
): boolean {
  return Object.prototype.hasOwnProperty.call(visibility, key)
    ? visibility[key] !== false
    : defaultVisible
}

export function parseSectionOrder<T extends string>(
  raw: string | null | undefined,
  defaults: readonly T[],
): T[] {
  if (!raw) return [...defaults]

  try {
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return [...defaults]

    const uniqueValidKeys = parsed.filter(
      (item, index): item is T =>
        typeof item === 'string'
        && defaults.includes(item as T)
        && parsed.indexOf(item) === index
    )

    return [
      ...uniqueValidKeys,
      ...defaults.filter((key) => !uniqueValidKeys.includes(key)),
    ]
  }
  catch {
    return [...defaults]
  }
}

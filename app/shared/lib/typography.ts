const protectedShortWords = [
  'а', 'без', 'близ', 'в', 'вместо', 'вне', 'во', 'да', 'для', 'до', 'за', 'и', 'из-за', 'из-под', 'из', 'или', 'к', 'ко',
  'кроме', 'либо', 'между', 'на', 'над', 'не', 'ни', 'но', 'о', 'об', 'обо', 'от', 'перед', 'по', 'под', 'при', 'про',
  'ради', 'с', 'сквозь', 'со', 'среди', 'у', 'через',
] as const

const shortWordPattern = new RegExp(
  `(^|[\\s\\(\\[\\{«„"'])(${protectedShortWords.join('|')})[ \\t]+(?=\\S)`,
  'giu',
)

const textLineBreakMarkerPattern = /\\n/gu

export function normalizeTextLineBreaks(text: string): string {
  return text.replace(textLineBreakMarkerPattern, '\n')
}

export function splitPlainTextLines(text: string): string[] {
  return normalizeTextLineBreaks(text).split('\n')
}

export function splitHeroTitle(title: string | null | undefined, fallback: string): [string, string] {
  const customTitle = normalizeTextLineBreaks(title || '').trim()
  const source = customTitle || fallback.trim()
  const explicitLines = source
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean)

  if (explicitLines.length > 1) {
    return [explicitLines[0] || '', explicitLines.slice(1).join(' ')]
  }

  const words = source.split(/\s+/).filter(Boolean)
  return [words[0] || fallback, words.slice(1).join(' ')]
}

export function protectPrepositions(text: string): string {
  let result = normalizeTextLineBreaks(text)

  while (true) {
    const next = result.replace(shortWordPattern, '$1$2\u00A0')
    if (next === result) return result
    result = next
  }
}

export type DisplayNameSize =
  | 'display-title-size--xl'
  | 'display-title-size--lg'
  | 'display-title-size--md'
  | 'display-title-size--sm'

export function getDisplayNameSize(text: string): DisplayNameSize {
  const words = text.trim().split(/\s+/).filter(Boolean)
  if (!words.length) return 'display-title-size--sm'

  const longestWordLength = Math.max(...words.map(word => word.length))
  if (longestWordLength <= 7) return 'display-title-size--xl'
  if (longestWordLength <= 10) return 'display-title-size--lg'
  if (longestWordLength <= 14) return 'display-title-size--md'
  return 'display-title-size--sm'
}

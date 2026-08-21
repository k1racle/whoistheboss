const protectedShortWords = [
  'а', 'в', 'во', 'да', 'до', 'за', 'и', 'из', 'к', 'ко', 'на', 'не', 'ни', 'но', 'о', 'об', 'от', 'по', 'с', 'со', 'у',
] as const

const shortWordPattern = new RegExp(
  `(^|[\\s\\(\\[\\{«„"'])(${protectedShortWords.join('|')})[ \\t]+(?=\\S)`,
  'giu',
)

export function protectPrepositions(text: string): string {
  return text.replace(shortWordPattern, '$1$2\u00A0')
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

const protectedShortWords = [
  'а', 'без', 'близ', 'в', 'вместо', 'вне', 'во', 'да', 'для', 'до', 'за', 'и', 'из-за', 'из-под', 'из', 'или', 'к', 'ко',
  'кроме', 'либо', 'между', 'на', 'над', 'не', 'ни', 'но', 'о', 'об', 'обо', 'от', 'перед', 'по', 'под', 'при', 'про',
  'ради', 'с', 'сквозь', 'со', 'среди', 'у', 'через',
] as const

const shortWordPattern = new RegExp(
  `(^|[\\s\\(\\[\\{«„"'])(${protectedShortWords.join('|')})[ \\t]+(?=\\S)`,
  'giu',
)

export function protectPrepositions(text: string): string {
  let result = text

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

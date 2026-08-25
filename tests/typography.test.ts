import { describe, expect, it } from 'vitest'
import {
  normalizeTextLineBreaks,
  protectPrepositions,
  splitPlainTextLines,
} from '../app/shared/lib/typography'

describe('normalizeTextLineBreaks', () => {
  it('converts the \\n marker to a regular line break', () => {
    expect(normalizeTextLineBreaks('Первая строка\\nВторая строка'))
      .toBe('Первая строка\nВторая строка')
  })

  it('does not interpret arbitrary HTML', () => {
    expect(normalizeTextLineBreaks('Текст<br><strong>важный</strong>'))
      .toBe('Текст<br><strong>важный</strong>')
  })
})

describe('splitPlainTextLines', () => {
  it('splits a single line-break marker into two lines', () => {
    expect(splitPlainTextLines('Первая строка\\nВторая строка'))
      .toEqual(['Первая строка', 'Вторая строка'])
  })

  it('preserves every repeated marker as a separate line', () => {
    expect(splitPlainTextLines('Первый абзац\\n\\n\\nВторой абзац'))
      .toEqual(['Первый абзац', '', '', 'Второй абзац'])
  })
})

describe('protectPrepositions', () => {
  it('keeps Russian prepositions and conjunctions with the following word', () => {
    expect(protectPrepositions('В центре и на окраине'))
      .toBe('В\u00A0центре и\u00A0на\u00A0окраине')
  })

  it('protects longer prepositions and preserves paragraph breaks', () => {
    expect(protectPrepositions('Работа для команды\n\nПроект без ограничений'))
      .toBe('Работа для\u00A0команды\n\nПроект без\u00A0ограничений')
  })

  it('protects prepositions after converting a line-break marker', () => {
    expect(protectPrepositions('Работа для команды\\nПроект без ограничений'))
      .toBe('Работа для\u00A0команды\nПроект без\u00A0ограничений')
  })
})

import { describe, expect, it } from 'vitest'
import { protectPrepositions } from '../app/shared/lib/typography'

describe('protectPrepositions', () => {
  it('keeps Russian prepositions and conjunctions with the following word', () => {
    expect(protectPrepositions('В центре и на окраине'))
      .toBe('В\u00A0центре и\u00A0на\u00A0окраине')
  })

  it('protects longer prepositions and preserves paragraph breaks', () => {
    expect(protectPrepositions('Работа для команды\n\nПроект без ограничений'))
      .toBe('Работа для\u00A0команды\n\nПроект без\u00A0ограничений')
  })
})

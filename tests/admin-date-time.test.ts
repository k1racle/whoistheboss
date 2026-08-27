import { describe, expect, it } from 'vitest'
import { formatDateTimeLocal, toIsoDateTime } from '../src/admin/lib/dateTime'

describe('admin publication date helpers', () => {
  it('converts datetime-local values to a timezone-aware ISO string', () => {
    const localValue = '2026-08-27T19:35'
    const result = toIsoDateTime(localValue)

    expect(result).toMatch(/Z$/)
    expect(Date.parse(result!)).toBe(new Date(localValue).getTime())
  })

  it('keeps the same local date and time when an ISO value is reopened', () => {
    const localValue = '2026-08-27T19:35'
    const isoValue = toIsoDateTime(localValue)

    expect(formatDateTimeLocal(isoValue)).toBe(localValue)
  })

  it('returns null for an empty optional date', () => {
    expect(toIsoDateTime('')).toBeNull()
    expect(toIsoDateTime(null)).toBeNull()
  })

  it('rejects an invalid date before sending it to the API', () => {
    expect(() => toIsoDateTime('not-a-date'))
      .toThrow('Укажите корректную дату и время публикации')
  })
})

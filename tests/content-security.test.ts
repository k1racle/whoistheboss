import { describe, expect, it } from 'vitest'
import { sanitizeRichText } from '../server/utils/content-security'

describe('content security', () => {
  it('removes scripts and event handlers', () => {
    const html = '<p onclick="alert(1)">Hello<script>alert(1)</script></p>'
    expect(sanitizeRichText(html)).toBe('<p>Hello</p>')
  })

  it('adds safe rel attributes to links', () => {
    const html = '<a href="https://example.com" target="_blank">Link</a>'
    expect(sanitizeRichText(html)).toContain('rel="noopener noreferrer"')
  })
})

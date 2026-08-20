import { describe, expect, it } from 'vitest'
import { getSafeUploadedMediaUrl, getTrustedEmbedUrl } from '../app/shared/lib/media-url'

describe('media url safety', () => {
  it('allows only local uploaded media paths', () => {
    expect(getSafeUploadedMediaUrl('/uploads/photo.webp')).toBe('/uploads/photo.webp')
    expect(getSafeUploadedMediaUrl('https://example.com/photo.webp')).toBe('')
    expect(getSafeUploadedMediaUrl('/uploads/nested/photo.webp')).toBe('')
  })

  it('allows only trusted embed hosts', () => {
    expect(getTrustedEmbedUrl('https://www.youtube.com/embed/abc')).toBe('https://www.youtube.com/embed/abc')
    expect(getTrustedEmbedUrl('<iframe src="https://rutube.ru/play/embed/123"></iframe>')).toBe('https://rutube.ru/play/embed/123')
    expect(getTrustedEmbedUrl('https://evil.example/embed/abc')).toBe('')
  })
})

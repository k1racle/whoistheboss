import { defineProvider } from '@nuxt/image/runtime'

const uploadPrefix = '/uploads/'
const optimizableExtensions = /\.(?:avif|jpe?g|png|webp)$/i

function integerModifier(value: unknown): number | undefined {
  const parsed = typeof value === 'number' ? value : Number.parseInt(String(value ?? ''), 10)
  if (!Number.isFinite(parsed) || parsed <= 0) return undefined
  return Math.min(Math.round(parsed), 2560)
}

export default defineProvider({
  getImage(src, { modifiers }) {
    const sourcePath = src.split(/[?#]/, 1)[0] ?? ''
    if (!sourcePath.startsWith(uploadPrefix) || !optimizableExtensions.test(sourcePath)) {
      return { url: src }
    }

    const filename = sourcePath.slice(uploadPrefix.length)
    if (!filename || filename.includes('/')) return { url: src }

    const width = integerModifier(modifiers.width)
    const height = integerModifier(modifiers.height)
    const quality = Math.min(Math.max(integerModifier(modifiers.quality) ?? 76, 55), 85)
    const fit = ['contain', 'cover', 'fill', 'inside', 'outside'].includes(String(modifiers.fit))
      ? String(modifiers.fit)
      : 'inside'
    const query = new URLSearchParams()

    if (width) query.set('w', String(width))
    if (height) query.set('h', String(height))
    query.set('q', String(quality))
    if (width && height) query.set('fit', fit)

    return {
      url: `/media/${encodeURIComponent(filename)}?${query.toString()}`,
      format: 'webp',
    }
  },
})

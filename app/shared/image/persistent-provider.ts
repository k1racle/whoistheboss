import { defineProvider } from '@nuxt/image/runtime'
import {
  clampImageQuality,
  clampImageWidth,
  isOptimizableUploadImage,
} from './image-variants'

const uploadPrefix = '/uploads/'

export default defineProvider({
  getImage(src, { modifiers }) {
    const sourcePath = src.split(/[?#]/, 1)[0] ?? ''
    if (!sourcePath.startsWith(uploadPrefix) || !isOptimizableUploadImage(src)) {
      return { url: src }
    }

    const filename = sourcePath.slice(uploadPrefix.length)
    if (!filename || filename.includes('/')) return { url: src }

    const width = clampImageWidth(typeof modifiers.width === 'number'
      ? modifiers.width
      : Number.parseInt(String(modifiers.width ?? ''), 10))
    const quality = clampImageQuality(typeof modifiers.quality === 'number'
      ? modifiers.quality
      : Number.parseInt(String(modifiers.quality ?? ''), 10))
    const query = new URLSearchParams()

    if (width) query.set('w', String(width))
    // Keep quality in the public URL even for the default preset. This busts
    // immutable browser/CDN caches when the project-wide default is raised.
    query.set('q', String(quality))

    return {
      url: `/media/${encodeURIComponent(filename)}?${query.toString()}`,
      format: 'webp',
    }
  },
})

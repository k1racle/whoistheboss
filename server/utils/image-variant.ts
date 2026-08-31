import { createHash, randomUUID } from 'node:crypto'
import { createReadStream, promises as fs } from 'node:fs'
import { basename, extname, join, resolve } from 'node:path'
import sharp from 'sharp'
import {
  clampImageQuality,
  clampImageWidth,
  DEFAULT_IMAGE_QUALITY,
} from '~~/app/shared/image/image-variants'

const supportedExtensions = new Set(['.avif', '.jpeg', '.jpg', '.png', '.webp'])
const pendingVariants = new Map<string, Promise<void>>()
const CACHE_VERSION = 'v2'
const MAX_PARALLEL_TRANSFORMS = 4
const MAX_PENDING_QUEUE = 64

let activeTransforms = 0
const transformQueue: Array<() => void> = []

export interface ImageVariantOptions {
  filename: string
  width?: number
  quality?: number
}

export interface ImageVariantResult {
  cacheHit: boolean
  path: string
  size: number
}

async function withTransformSlot(task: () => Promise<void>): Promise<void> {
  if (activeTransforms >= MAX_PARALLEL_TRANSFORMS) {
    if (transformQueue.length >= MAX_PENDING_QUEUE) {
      throw createError({ statusCode: 503, statusMessage: 'Image transformation queue is full' })
    }
    await new Promise<void>(resolveSlot => transformQueue.push(resolveSlot))
  }

  activeTransforms += 1
  try {
    await task()
  }
  finally {
    activeTransforms -= 1
    transformQueue.shift()?.()
  }
}

async function fileExists(path: string): Promise<boolean> {
  return fs.access(path).then(() => true).catch(() => false)
}

async function pruneImageCache(cacheDir: string): Promise<void> {
  const maxBytes = useRuntimeConfig().imageCacheMaxMb * 1024 * 1024
  if (!Number.isFinite(maxBytes) || maxBytes <= 0) return

  const entries = await fs.readdir(cacheDir, { withFileTypes: true }).catch(() => [])
  const files = await Promise.all(entries
    .filter(entry => entry.isFile() && entry.name.endsWith('.webp'))
    .map(async (entry) => {
      const path = join(cacheDir, entry.name)
      const stat = await fs.stat(path).catch(() => null)
      return stat ? { path, size: stat.size, mtimeMs: stat.mtimeMs } : null
    }))
  const existingFiles = files.filter((file): file is NonNullable<typeof file> => Boolean(file))
  const totalSize = existingFiles.reduce((sum, file) => sum + file.size, 0)
  if (totalSize <= maxBytes) return

  let currentSize = totalSize
  for (const file of existingFiles.sort((a, b) => a.mtimeMs - b.mtimeMs)) {
    await fs.rm(file.path, { force: true }).catch(() => undefined)
    currentSize -= file.size
    if (currentSize <= maxBytes * 0.9) break
  }
}

export async function resolveImageVariant(options: ImageVariantOptions): Promise<ImageVariantResult> {
  const filename = options.filename
  if (!filename || filename.startsWith('.') || basename(filename) !== filename) {
    throw createError({ statusCode: 404, statusMessage: 'Image not found' })
  }

  const extension = extname(filename).toLowerCase()
  if (!supportedExtensions.has(extension)) {
    throw createError({ statusCode: 404, statusMessage: 'Image not found' })
  }

  const uploadDir = resolve(useRuntimeConfig().uploadDir)
  const sourcePath = join(uploadDir, filename)
  const sourceStat = await fs.stat(sourcePath).catch(() => null)
  if (!sourceStat?.isFile()) {
    throw createError({ statusCode: 404, statusMessage: 'Image not found' })
  }

  const width = clampImageWidth(options.width)
  const quality = clampImageQuality(options.quality)
  const cacheKey = createHash('sha256')
    .update([
      CACHE_VERSION,
      filename,
      sourceStat.size,
      Math.trunc(sourceStat.mtimeMs),
      width ?? 0,
      quality,
    ].join(':'))
    .digest('hex')
    .slice(0, 32)
  const cacheDir = join(uploadDir, '.cache', 'images')
  const cachePath = join(cacheDir, `${cacheKey}.webp`)

  if (await fileExists(cachePath)) {
    const cacheStat = await fs.stat(cachePath)
    return { cacheHit: true, path: cachePath, size: cacheStat.size }
  }

  let pending = pendingVariants.get(cachePath)
  if (!pending) {
    pending = withTransformSlot(async () => {
      if (await fileExists(cachePath)) return

      await fs.mkdir(cacheDir, { recursive: true })
      const temporaryPath = join(cacheDir, `${cacheKey}-${process.pid}-${randomUUID()}.tmp.webp`)

      try {
        let transformer = sharp(sourcePath, {
          failOn: 'error',
          sequentialRead: true,
        }).rotate()

        if (width) {
          transformer = transformer.resize({
            width,
            fit: 'inside',
            withoutEnlargement: true,
            fastShrinkOnLoad: true,
          })
        }

        await transformer
          .webp({
            quality,
            alphaQuality: 85,
            effort: 2,
            smartSubsample: true,
          })
          .toFile(temporaryPath)
        await fs.rename(temporaryPath, cachePath)
        if (quality === DEFAULT_IMAGE_QUALITY) {
          await pruneImageCache(cacheDir)
        }
      }
      finally {
        await fs.rm(temporaryPath, { force: true }).catch(() => undefined)
      }
    }).finally(() => pendingVariants.delete(cachePath))
    pendingVariants.set(cachePath, pending)
  }

  await pending
  const cacheStat = await fs.stat(cachePath)
  return { cacheHit: false, path: cachePath, size: cacheStat.size }
}

export function streamImageVariant(path: string) {
  return createReadStream(path)
}

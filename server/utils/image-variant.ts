import { createHash, randomUUID } from 'node:crypto'
import { createReadStream, promises as fs } from 'node:fs'
import { basename, extname, join, resolve } from 'node:path'
import sharp from 'sharp'

type ImageFit = 'contain' | 'cover' | 'fill' | 'inside' | 'outside'

const supportedExtensions = new Set(['.avif', '.jpeg', '.jpg', '.png', '.webp'])
const allowedFits = new Set<ImageFit>(['contain', 'cover', 'fill', 'inside', 'outside'])
const pendingVariants = new Map<string, Promise<void>>()
const MAX_DIMENSION = 2560
const CACHE_VERSION = 'v1'
const MAX_PARALLEL_TRANSFORMS = 2

let activeTransforms = 0
const transformQueue: Array<() => void> = []

export interface ImageVariantOptions {
  filename: string
  width?: number
  height?: number
  quality?: number
  fit?: string
}

export interface ImageVariantResult {
  cacheHit: boolean
  path: string
  size: number
}

function normalizedInteger(value: number | undefined, fallback?: number): number | undefined {
  if (!Number.isFinite(value) || (value ?? 0) <= 0) return fallback
  return Math.min(Math.round(value!), MAX_DIMENSION)
}

function isImageFit(value: string | undefined): value is ImageFit {
  return Boolean(value && allowedFits.has(value as ImageFit))
}

async function withTransformSlot(task: () => Promise<void>): Promise<void> {
  if (activeTransforms >= MAX_PARALLEL_TRANSFORMS) {
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

  const width = normalizedInteger(options.width)
  const height = normalizedInteger(options.height)
  const quality = Math.min(Math.max(normalizedInteger(options.quality, 76)!, 55), 85)
  const fit: ImageFit = isImageFit(options.fit) ? options.fit : 'inside'
  const cacheKey = createHash('sha256')
    .update([
      CACHE_VERSION,
      filename,
      sourceStat.size,
      Math.trunc(sourceStat.mtimeMs),
      width ?? 0,
      height ?? 0,
      quality,
      fit,
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

        if (width || height) {
          transformer = transformer.resize({
            width,
            height,
            fit,
            position: 'centre',
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

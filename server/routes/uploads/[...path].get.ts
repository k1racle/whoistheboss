import { createReadStream, promises as fs } from 'node:fs'
import { basename, extname, join, resolve } from 'node:path'

const contentTypes: Record<string, string> = {
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.m4v': 'video/x-m4v',
  '.mov': 'video/quicktime',
  '.mp4': 'video/mp4',
  '.png': 'image/png',
  '.webm': 'video/webm',
  '.webp': 'image/webp',
}

function parseRange(value: string, size: number): { start: number, end: number } | null {
  const match = /^bytes=(\d*)-(\d*)$/.exec(value)
  if (!match) return null

  const startValue = match[1]
  const endValue = match[2]
  if (!startValue && !endValue) return null

  let start: number
  let end: number
  if (!startValue) {
    const suffixLength = Number.parseInt(endValue!, 10)
    if (!Number.isFinite(suffixLength) || suffixLength <= 0) return null
    start = Math.max(size - suffixLength, 0)
    end = size - 1
  }
  else {
    start = Number.parseInt(startValue, 10)
    end = endValue ? Number.parseInt(endValue, 10) : size - 1
  }

  if (!Number.isFinite(start) || !Number.isFinite(end) || start < 0 || start >= size || end < start) {
    return null
  }

  return { start, end: Math.min(end, size - 1) }
}

export default defineEventHandler(async (event) => {
  const rawPath = getRouterParam(event, 'path') ?? ''
  let filename: string
  try {
    filename = decodeURIComponent(rawPath)
  }
  catch {
    throw createError({ statusCode: 404, statusMessage: 'File not found' })
  }

  if (!filename || filename.startsWith('.') || basename(filename) !== filename) {
    throw createError({ statusCode: 404, statusMessage: 'File not found' })
  }

  const extension = extname(filename).toLowerCase()
  const contentType = contentTypes[extension]
  if (!contentType) throw createError({ statusCode: 404, statusMessage: 'File not found' })

  const uploadDir = resolve(useRuntimeConfig().uploadDir)
  const filePath = join(uploadDir, filename)
  const stat = await fs.stat(filePath).catch(() => null)
  if (!stat?.isFile()) throw createError({ statusCode: 404, statusMessage: 'File not found' })

  const etag = `W/"${stat.size.toString(16)}-${Math.trunc(stat.mtimeMs).toString(16)}"`
  setHeader(event, 'accept-ranges', 'bytes')
  setHeader(event, 'cache-control', 'public, max-age=31536000, immutable')
  setHeader(event, 'content-type', contentType)
  setHeader(event, 'etag', etag)
  setHeader(event, 'last-modified', stat.mtime.toUTCString())

  if (getHeader(event, 'if-none-match') === etag) {
    setResponseStatus(event, 304)
    return null
  }

  const rangeHeader = getHeader(event, 'range')
  if (rangeHeader) {
    const range = parseRange(rangeHeader, stat.size)
    if (!range) {
      setHeader(event, 'content-range', `bytes */${stat.size}`)
      throw createError({ statusCode: 416, statusMessage: 'Range Not Satisfiable' })
    }

    const length = range.end - range.start + 1
    setResponseStatus(event, 206)
    setHeader(event, 'content-range', `bytes ${range.start}-${range.end}/${stat.size}`)
    setHeader(event, 'content-length', length)
    if (event.method === 'HEAD') return null
    return sendStream(event, createReadStream(filePath, range))
  }

  setHeader(event, 'content-length', stat.size)
  if (event.method === 'HEAD') return null
  return sendStream(event, createReadStream(filePath))
})

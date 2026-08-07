import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { extname, relative, resolve } from 'node:path'

const contentTypes: Record<string, string> = {
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.m4v': 'video/x-m4v',
  '.mov': 'video/quicktime',
  '.mp4': 'video/mp4',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webm': 'video/webm',
  '.webp': 'image/webp',
}

export default defineEventHandler(async (event) => {
  const requestedPath = getRouterParam(event, 'path') || ''
  const uploadDir = resolve(useRuntimeConfig().uploadDir)
  const filePath = resolve(uploadDir, requestedPath)
  const relativePath = relative(uploadDir, filePath)

  if (!requestedPath || relativePath.startsWith('..') || relativePath.includes(':')) {
    throw createError({ statusCode: 404, statusMessage: 'File not found' })
  }

  const fileStat = await stat(filePath).catch(() => null)
  if (!fileStat?.isFile()) {
    throw createError({ statusCode: 404, statusMessage: 'File not found' })
  }

  setHeader(event, 'Content-Type', contentTypes[extname(filePath).toLowerCase()] || 'application/octet-stream')
  setHeader(event, 'Content-Length', fileStat.size)
  setHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable')
  return sendStream(event, createReadStream(filePath))
})

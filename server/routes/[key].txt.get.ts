import { createError, getRouterParam, setHeader } from 'h3'

export default defineEventHandler((event) => {
  const configuredKey = String(useRuntimeConfig(event).indexNowKey || '').trim()
  const requestedKey = getRouterParam(event, 'key') || ''

  if (!configuredKey || requestedKey !== configuredKey) {
    throw createError({ statusCode: 404, statusMessage: 'Not found' })
  }

  setHeader(event, 'content-type', 'text/plain; charset=utf-8')
  setHeader(event, 'cache-control', 'public, max-age=3600')
  setHeader(event, 'x-robots-tag', 'noindex, nofollow')
  return configuredKey
})

import type { H3Event } from 'h3'

interface PaginationOptions {
  defaultLimit: number
  maxLimit: number
}

export interface PaginationResult {
  limit: number
  offset: number
}

function positiveInteger(value: string | undefined): number | undefined {
  if (!value || !/^\d+$/.test(value)) return undefined
  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined
}

export function readPagination(event: H3Event, options: PaginationOptions): PaginationResult {
  const query = getQuery(event)
  const requestedLimit = positiveInteger(typeof query.limit === 'string' ? query.limit : undefined)
  const requestedOffset = positiveInteger(typeof query.offset === 'string' ? query.offset : undefined)

  return {
    limit: Math.min(requestedLimit ?? options.defaultLimit, options.maxLimit),
    offset: requestedOffset ?? 0,
  }
}

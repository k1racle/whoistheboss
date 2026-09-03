import { createHash, createHmac } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { buildBotCanonicalRequest } from '../server/utils/bot-api-auth'

describe('bot API signature', () => {
  it('binds timestamp, method, path, query and body hash', () => {
    const body = Buffer.from('{"name":"Иван"}')
    const contentHash = createHash('sha256').update(body).digest('hex')
    const canonical = buildBotCanonicalRequest(
      '1788444000',
      'post',
      '/api/integrations/bot/requests?source=MAX',
      contentHash,
    )

    expect(canonical).toBe([
      '1788444000',
      'POST',
      '/api/integrations/bot/requests?source=MAX',
      contentHash,
    ].join('\n'))
    expect(createHmac('sha256', 's'.repeat(32)).update(canonical).digest('hex')).toHaveLength(64)
  })
})

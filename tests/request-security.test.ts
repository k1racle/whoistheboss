import { Readable } from 'node:stream'
import type { IncomingHttpHeaders, IncomingMessage } from 'node:http'
import type { H3Event } from 'h3'
import { readMultipartFormData } from 'h3'
import { describe, expect, it } from 'vitest'
import { readLimitedBody, readLimitedRawBody } from '../server/utils/request-security'

function createBodyEvent(
  chunks: Iterable<string | Buffer> | AsyncIterable<string | Buffer>,
  headers: IncomingHttpHeaders,
): H3Event {
  const request = Readable.from(chunks) as IncomingMessage
  request.headers = headers
  request.method = 'POST'
  request.url = '/test'

  return {
    method: 'POST',
    node: { req: request },
  } as H3Event
}

describe('request body limits', () => {
  it('parses a chunked JSON body within the byte limit', async () => {
    const event = createBodyEvent(['{"name":', '"Alice"}'], {
      'content-type': 'application/json',
      'transfer-encoding': 'chunked',
    })

    await expect(readLimitedBody<{ name: string }>(event, 32)).resolves.toEqual({ name: 'Alice' })
  })

  it('rejects a chunked body as soon as its raw bytes exceed the limit', async () => {
    const event = createBodyEvent(['      ', '{}'], {
      'content-type': 'application/json',
      'transfer-encoding': 'chunked',
    })

    await expect(readLimitedBody(event, 7)).rejects.toMatchObject({ statusCode: 413 })
  })

  it('rejects an oversized content length before consuming the stream', async () => {
    let reads = 0
    const chunks = async function* () {
      reads += 1
      yield '{"ok":true}'
    }
    const event = createBodyEvent(chunks(), {
      'content-length': '11',
      'content-type': 'application/json',
    })

    await expect(readLimitedRawBody(event, 10)).rejects.toMatchObject({ statusCode: 413 })
    expect(reads).toBe(0)
  })

  it('keeps URL-encoded form parsing compatible with H3', async () => {
    const event = createBodyEvent(['name=Alice+Smith&role=editor'], {
      'content-type': 'application/x-www-form-urlencoded',
      'transfer-encoding': 'chunked',
    })

    await expect(readLimitedBody<Record<string, string>>(event, 64)).resolves.toMatchObject({
      name: 'Alice Smith',
      role: 'editor',
    })
  })

  it('limits a cached Web request stream before H3 parses it', async () => {
    const event = createBodyEvent([], {
      'content-type': 'application/json',
    })
    event._requestBody = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode('{"payload":"'))
        controller.enqueue(new TextEncoder().encode('too large"}'))
        controller.close()
      },
    })

    await expect(readLimitedBody(event, 16)).rejects.toMatchObject({ statusCode: 413 })
  })

  it('keeps a bounded multipart body available to the H3 parser', async () => {
    const boundary = 'request-security-test'
    const body = [
      `--${boundary}`,
      'Content-Disposition: form-data; name="file"; filename="test.txt"',
      'Content-Type: text/plain',
      '',
      'hello',
      `--${boundary}--`,
      '',
    ].join('\r\n')
    const event = createBodyEvent([body], {
      'content-type': `multipart/form-data; boundary=${boundary}`,
      'transfer-encoding': 'chunked',
    })

    await readLimitedRawBody(event, 512)
    const parts = await readMultipartFormData(event)

    expect(parts).toHaveLength(1)
    expect(parts?.[0]).toMatchObject({
      name: 'file',
      filename: 'test.txt',
      type: 'text/plain',
    })
    expect(parts?.[0]?.data.toString()).toBe('hello')
  })
})

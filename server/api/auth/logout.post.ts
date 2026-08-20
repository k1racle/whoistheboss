import { requestWantsJson } from '@server/utils/request-flow'
import { clearPublicUserSession } from '@server/utils/auth-session'
import { assertSameOriginMutation } from '@server/utils/request-security'

export default defineEventHandler(async (event) => {
  assertSameOriginMutation(event)
  await clearPublicUserSession(event)

  if (requestWantsJson(event)) {
    return { ok: true }
  }

  return sendRedirect(event, '/', 303)
})

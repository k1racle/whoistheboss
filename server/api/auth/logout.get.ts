import { requestWantsJson } from '@server/utils/request-flow'

export default defineEventHandler(async (event) => {
  await clearUserSession(event)

  if (requestWantsJson(event)) {
    return { ok: true }
  }

  return sendRedirect(event, '/', 303)
})

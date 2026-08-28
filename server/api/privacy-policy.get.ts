import { getSiteSetting, getSiteSettings } from '@server/utils/site-settings'

const PRIVACY_POLICY_TEXT_KEY = 'PRIVACY_POLICY_TEXT'

export default defineEventHandler(async () => {
  const settings = await getSiteSettings([PRIVACY_POLICY_TEXT_KEY])
  return {
    text: getSiteSetting(settings, PRIVACY_POLICY_TEXT_KEY),
  }
})

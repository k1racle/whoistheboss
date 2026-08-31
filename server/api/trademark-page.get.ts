import type { TrademarkPageData } from '@features/trademark/model/trademark-page.types'
import { getSiteSetting, getSiteSettings } from '@server/utils/site-settings'
import { normalizeTrademarkPage } from '@server/utils/trademark-page'

export default defineEventHandler(async (): Promise<TrademarkPageData> => {
  const settings = await getSiteSettings(['TRADEMARK_PAGE_JSON'])
  return normalizeTrademarkPage(getSiteSetting(settings, 'TRADEMARK_PAGE_JSON'))
})

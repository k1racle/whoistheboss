import prisma from '~~/lib/prisma'

export type SiteSettingsRecord = Record<string, string>

export async function getSiteSettings(keys?: readonly string[]): Promise<SiteSettingsRecord> {
  const uniqueKeys = keys?.length ? Array.from(new Set(keys)) : undefined

  const settings = await prisma.siteSetting.findMany({
    where: uniqueKeys ? { key: { in: uniqueKeys } } : undefined,
    select: {
      key: true,
      value: true,
    },
  })

  return Object.fromEntries(settings.map((setting) => [setting.key, setting.value]))
}

export function getSiteSetting(
  settings: SiteSettingsRecord,
  key: string,
  fallback = '',
): string {
  const value = settings[key]

  return value?.trim() ? value : fallback
}

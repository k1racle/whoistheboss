import { prisma } from './prisma.js';

export async function getSiteSettings(): Promise<Record<string, string>> {
  const rows = await prisma.siteSetting.findMany();
  const settings: Record<string, string> = {};
  for (const row of rows) {
    settings[row.key] = row.value;
  }
  return settings;
}

export async function getSetting(key: string): Promise<string | null> {
  const settings = await getSiteSettings();
  return settings[key] || null;
}

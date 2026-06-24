import { config } from '../config.js';

export interface SEOMeta {
  title: string;
  description: string;
  image?: string;
  type?: 'website' | 'article' | 'profile' | 'video';
  path?: string;
  publishedAt?: Date | string | null;
  modifiedAt?: Date | string | null;
  author?: string;
}

export function buildSEO(overrides: Partial<SEOMeta> = {}): SEOMeta {
  return {
    title: overrides.title ? `${overrides.title} — ${config.SITE_NAME}` : config.SITE_NAME,
    description: overrides.description || config.SITE_DESCRIPTION,
    image: overrides.image || `${config.SITE_URL}/images/og-default.jpg`,
    type: overrides.type || 'website',
    path: overrides.path || '/',
    publishedAt: overrides.publishedAt,
    modifiedAt: overrides.modifiedAt,
    author: overrides.author,
  };
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[а-яё]/g, (char) => ruToEn[char] || char)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const ruToEn: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'zh', з: 'z', и: 'i',
  й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't',
  у: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '',
  э: 'e', ю: 'yu', я: 'ya',
};

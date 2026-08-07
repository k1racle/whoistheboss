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
    title: overrides.title ? `${overrides.title} - ${config.SITE_NAME}` : config.SITE_NAME,
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
    .replace(/[\u0430-\u044f\u0451]/g, (char) => ruToEn[char] || char)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const ruToEn: Record<string, string> = {
  '\u0430': 'a',
  '\u0431': 'b',
  '\u0432': 'v',
  '\u0433': 'g',
  '\u0434': 'd',
  '\u0435': 'e',
  '\u0451': 'yo',
  '\u0436': 'zh',
  '\u0437': 'z',
  '\u0438': 'i',
  '\u0439': 'y',
  '\u043a': 'k',
  '\u043b': 'l',
  '\u043c': 'm',
  '\u043d': 'n',
  '\u043e': 'o',
  '\u043f': 'p',
  '\u0440': 'r',
  '\u0441': 's',
  '\u0442': 't',
  '\u0443': 'u',
  '\u0444': 'f',
  '\u0445': 'h',
  '\u0446': 'ts',
  '\u0447': 'ch',
  '\u0448': 'sh',
  '\u0449': 'sch',
  '\u044a': '',
  '\u044b': 'y',
  '\u044c': '',
  '\u044d': 'e',
  '\u044e': 'yu',
  '\u044f': 'ya',
};

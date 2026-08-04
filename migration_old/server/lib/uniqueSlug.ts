import { slugify } from './seo.js';

export async function createUniqueSlug(
  source: string,
  exists: (candidate: string) => Promise<boolean>,
): Promise<string> {
  const base = slugify(source) || 'item';
  let candidate = base;
  let suffix = 2;

  while (await exists(candidate)) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }

  return candidate;
}

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

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\u0430-\u044f\u0451]/g, (char) => ruToEn[char] || char)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function bindAutoSlug(formId: string, sourceName: string): void {
  const form = document.getElementById(formId) as HTMLFormElement | null;
  const source = form?.elements.namedItem(sourceName) as HTMLInputElement | null;
  const slug = form?.elements.namedItem('slug') as HTMLInputElement | null;
  if (!source || !slug) return;

  const sync = () => {
    slug.value = slugify(source.value);
  };

  slug.readOnly = true;
  slug.title = 'Auto-generated from title';
  source.addEventListener('input', sync);
  sync();
}

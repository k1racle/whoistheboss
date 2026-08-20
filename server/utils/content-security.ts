import sanitizeHtml from 'sanitize-html'

const allowedTags = [
  'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'blockquote',
  'ul', 'ol', 'li', 'h2', 'h3', 'h4', 'a', 'span', 'figure',
  'figcaption', 'img', 'pre', 'code',
]

export function sanitizeRichText(value: string | null | undefined): string {
  return sanitizeHtml(String(value || ''), {
    allowedTags,
    allowedAttributes: {
      a: ['href', 'title', 'target', 'rel'],
      img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
      p: ['class'],
      span: ['class'],
      h2: ['class'],
      h3: ['class'],
      h4: ['class'],
    },
    allowedClasses: {
      p: ['ql-align-center', 'ql-align-right', 'ql-align-justify', 'ql-indent-*'],
      span: ['ql-size-small', 'ql-size-large', 'ql-size-huge'],
      h2: ['ql-align-center', 'ql-align-right', 'ql-align-justify'],
      h3: ['ql-align-center', 'ql-align-right', 'ql-align-justify'],
      h4: ['ql-align-center', 'ql-align-right', 'ql-align-justify'],
    },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    allowedSchemesByTag: {
      img: ['http', 'https'],
    },
    allowProtocolRelative: false,
    transformTags: {
      a: (_tagName, attribs) => ({
        tagName: 'a',
        attribs: {
          ...attribs,
          ...(attribs.target === '_blank' ? { rel: 'noopener noreferrer' } : {}),
        },
      }),
      img: (_tagName, attribs) => ({
        tagName: 'img',
        attribs: {
          ...attribs,
          loading: 'lazy',
        },
      }),
    },
  })
}


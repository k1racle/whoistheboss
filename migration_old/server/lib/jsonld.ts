import { config } from '../config.js';

export interface JsonLdVideo {
  '@type': 'VideoObject';
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate?: string;
  embedUrl?: string;
  contentUrl?: string;
}

export interface JsonLdArticle {
  '@type': 'Article';
  headline: string;
  description: string;
  image: string;
  datePublished?: string;
  dateModified?: string;
  author?: { '@type': 'Person'; name: string };
}

export interface JsonLdPerson {
  '@type': 'Person';
  name: string;
  jobTitle?: string;
  description?: string;
  image?: string;
}

export interface JsonLdBreadcrumb {
  '@type': 'ListItem';
  position: number;
  name: string;
  item: string;
}

export function renderJsonLd(data: unknown): string {
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
}

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: config.SITE_NAME,
    url: config.SITE_URL,
    logo: `${config.SITE_URL}/images/logo.png`,
    sameAs: [],
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: config.SITE_NAME,
    url: config.SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${config.SITE_URL}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function breadcrumbSchema(items: JsonLdBreadcrumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  };
}

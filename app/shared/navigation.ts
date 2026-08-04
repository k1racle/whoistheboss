export const ROUTES = {
  LANDING: '/',
  ENTREPRENEURS: '/entrepreneurs',
  ENTREPRENEUR: (slug: string) => `/entrepreneurs/${slug}`,
  COMPANIES: '/companies',
  COMPANY: (slug: string) => `/companies/${slug}`,
  INTERVIEWS: '/interviews',
  BLOG: '/blog',
  ARTICLE: (slug: string) => `/blog/${slug}`,
  SHOOTING_REQUEST: '/shooting-request',
  ADMIN: '/admin',
} as const

export const ROUTES = {
  LANDING: '/',
  ENTREPRENEURS: '/entrepreneurs',
  ENTREPRENEUR: (slug: string) => `/entrepreneurs/${slug}`,
  COMPANIES: '/companies',
  BUSINESSES_ALIAS: '/businesses',
  COMPANY: (slug: string) => `/companies/${slug}`,
  INTERVIEWS: '/interviews',
  INTERVIEW: (slug: string) => `/interviews/${slug}`,
  REELS: '/reels',
  REEL: (slug: string) => `/reels/${slug}`,
  BLOG: '/blog',
  ARTICLE: (slug: string) => `/blog/${slug}`,
  CONTACTS: '/contacts',
  SHOOTING_REQUEST: '/shooting-request',
  TRADEMARK: '/tovarnyy-znak-marshrut-postroen/',
  LOGIN: '/login',
  REGISTER: '/register',
  ADMIN: '/admin',
} as const

export const PUBLIC_ROUTE_ALIASES = {
  [ROUTES.COMPANIES]: [ROUTES.BUSINESSES_ALIAS],
} as const

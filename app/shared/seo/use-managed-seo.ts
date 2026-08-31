import { isCrawlableSeoImage } from './page-seo'

type OpenGraphType = 'website' | 'article' | 'profile' | 'video.other'

interface ManagedSeoOptions {
  title: string
  description: string
  image?: string | null
  type?: OpenGraphType
}

const DEFAULT_SOCIAL_IMAGE = '/favicon/web-app-manifest-512x512.png'

export function useManagedSeo(options: ManagedSeoOptions) {
  const route = useRoute()
  const config = useRuntimeConfig()
  const city = typeof route.params.city === 'string' ? route.params.city : ''
  const cityPrefix = city ? `/${city}` : ''
  const canonicalPath = cityPrefix && (route.path === cityPrefix || route.path.startsWith(`${cityPrefix}/`))
    ? route.path.slice(cityPrefix.length) || '/'
    : route.path
  const canonicalUrl = new URL(canonicalPath, `${config.public.siteUrl}/`).toString()
  const imagePath = isCrawlableSeoImage(options.image) ? options.image.trim() : DEFAULT_SOCIAL_IMAGE
  const imageUrl = new URL(imagePath, `${config.public.siteUrl}/`).toString()

  useHead({
    link: [{ key: 'canonical', rel: 'canonical', href: canonicalUrl }],
  })

  useSeoMeta({
    title: options.title,
    description: options.description,
    ogTitle: options.title,
    ogDescription: options.description,
    ogType: options.type || 'website',
    ogUrl: canonicalUrl,
    ogImage: imageUrl,
    ogSiteName: config.public.siteName,
    twitterCard: 'summary_large_image',
    twitterTitle: options.title,
    twitterDescription: options.description,
    twitterImage: imageUrl,
  })

  return { canonicalPath, canonicalUrl, imageUrl }
}

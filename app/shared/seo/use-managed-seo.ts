import { isCrawlableSeoImage } from './page-seo'
import {
  normalizeSeoBrand,
  SEO_FALLBACK_DESCRIPTION,
  SEO_SITE_NAME,
  withSeoSiteName,
} from './brand'
import type { SeoBrandMode } from './brand'

type OpenGraphType = 'website' | 'article' | 'profile' | 'video.other'
type OpenGraphImageType = 'image/avif' | 'image/png' | 'image/webp' | 'image/gif' | 'image/jpeg'

interface ManagedSeoOptions {
  title: string
  description: string
  image?: string | null
  type?: OpenGraphType
  titleBrandMode?: SeoBrandMode
  ogTitle?: string
  ogDescription?: string
  twitterTitle?: string
  twitterDescription?: string
  siteName?: string
  locale?: string
  imageAlt?: string
  imageType?: OpenGraphImageType
  imageWidth?: number
  imageHeight?: number
  normalizeBrand?: boolean
}

const DEFAULT_SOCIAL_IMAGE = '/ogimage.png'
const DEFAULT_SOCIAL_IMAGE_WIDTH = 1200
const DEFAULT_SOCIAL_IMAGE_HEIGHT = 630

function normalizePlainText(value: string | null | undefined) {
  return value?.replace(/\s+/g, ' ').trim() || ''
}

function inferImageType(imageUrl: string): OpenGraphImageType | undefined {
  const pathname = new URL(imageUrl).pathname.toLowerCase()

  if (pathname.endsWith('.png')) return 'image/png'
  if (pathname.endsWith('.jpg') || pathname.endsWith('.jpeg')) return 'image/jpeg'
  if (pathname.endsWith('.webp')) return 'image/webp'

  return undefined
}

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
  const usesDefaultImage = imagePath === DEFAULT_SOCIAL_IMAGE
  const normalizeText = options.normalizeBrand === false ? normalizePlainText : normalizeSeoBrand
  const title = options.normalizeBrand === false
    ? normalizePlainText(options.title)
    : withSeoSiteName(options.title, options.titleBrandMode)
  const description = normalizeText(options.description) || SEO_FALLBACK_DESCRIPTION
  const ogTitle = normalizeText(options.ogTitle) || title
  const ogDescription = normalizeText(options.ogDescription) || description
  const twitterTitle = normalizeText(options.twitterTitle) || ogTitle
  const twitterDescription = normalizeText(options.twitterDescription) || ogDescription
  const siteName = normalizeText(options.siteName) || SEO_SITE_NAME
  const imageAlt = normalizeText(options.imageAlt) || ogTitle
  const imageType = options.imageType || inferImageType(imageUrl)
  const imageWidth = options.imageWidth ?? (usesDefaultImage ? DEFAULT_SOCIAL_IMAGE_WIDTH : undefined)
  const imageHeight = options.imageHeight ?? (usesDefaultImage ? DEFAULT_SOCIAL_IMAGE_HEIGHT : undefined)

  useHead({
    link: [{ key: 'canonical', rel: 'canonical', href: canonicalUrl }],
  })

  useSeoMeta({
    title,
    description,
    ogTitle,
    ogDescription,
    ogType: options.type || 'website',
    ogLocale: options.locale || 'ru_RU',
    ogUrl: canonicalUrl,
    ogImage: imageUrl,
    ogImageSecureUrl: imageUrl.startsWith('https://') ? imageUrl : undefined,
    ogImageType: imageType,
    ogImageWidth: imageWidth,
    ogImageHeight: imageHeight,
    ogImageAlt: imageAlt,
    ogSiteName: siteName,
    twitterCard: 'summary_large_image',
    twitterTitle,
    twitterDescription,
    twitterImage: imageUrl,
    twitterImageAlt: imageAlt,
  })

  return { canonicalPath, canonicalUrl, imageUrl, title, description, ogTitle, ogDescription }
}

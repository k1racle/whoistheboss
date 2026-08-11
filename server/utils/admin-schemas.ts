import { z } from 'zod'

const nullableText = z.string().optional().nullable()
const publishedAt = z.union([z.string().min(1), z.literal('')]).optional().nullable()

const storySectionBase = {
  id: z.string().min(1),
  isVisible: z.boolean().default(true),
  menuLabel: z.string().default(''),
  menuDescription: z.string().default(''),
  menuImage: z.string().nullable().default(null),
}

export const storySectionSchema = z.discriminatedUnion('type', [
  z.object({
    ...storySectionBase,
    type: z.literal('BIOGRAPHY'),
    eyebrow: z.string().default('Биография'),
    title: z.string().default(''),
    textOne: z.string().default(''),
    textTwo: z.string().default(''),
    textThree: z.string().default(''),
    image: z.string().nullable().default(null),
  }),
  z.object({
    ...storySectionBase,
    type: z.literal('ACCENT'),
    title: z.string().default(''),
    textOne: z.string().default(''),
    textTwo: z.string().default(''),
  }),
  z.object({
    ...storySectionBase,
    type: z.literal('PORTRAIT'),
    title: z.string().default(''),
    text: z.string().default(''),
    asideText: z.string().default(''),
    image: z.string().nullable().default(null),
  }),
  z.object({
    ...storySectionBase,
    type: z.literal('WIDE'),
    title: z.string().default(''),
    text: z.string().default(''),
    bottomText: z.string().default(''),
    image: z.string().nullable().default(null),
  }),
])

export const entrepreneurSchema = z.object({
  slug: z.string().optional(),
  name: z.string().min(1),
  title: z.string(),
  heroLeftTeaser: nullableText,
  heroRightTeaser: nullableText,
  heroBottomRightTeaser: nullableText,
  heroMarquee: nullableText,
  aboutIntroTitle: nullableText,
  aboutIntroDescription: nullableText,
  aboutMenuLabels: nullableText,
  aboutMenuDescriptions: nullableText,
  biographyTextOne: nullableText,
  biographyTextTwo: nullableText,
  biographyTextThree: nullableText,
  biographyPhoto: nullableText,
  childhoodTitle: nullableText,
  childhoodTextOne: nullableText,
  childhoodTextTwo: nullableText,
  educationTitle: nullableText,
  educationText: nullableText,
  educationAsideText: nullableText,
  educationPhoto: nullableText,
  turnoverTitle: nullableText,
  turnoverText: nullableText,
  turnoverBottomText: nullableText,
  turnoverPhoto: nullableText,
  storySections: z.array(storySectionSchema).optional(),
  moreCardTitles: nullableText,
  moreCardLinks: nullableText,
  morePhoto: nullableText,
  featuredInterviewVideoType: z.enum(['EMBED', 'SELF_HOSTED']).optional().nullable(),
  featuredInterviewVideoUrl: nullableText,
  featuredInterviewVideoFile: nullableText,
  photo: nullableText,
  aboutGalleryPhotos: nullableText,
  galleryPhotos: nullableText,
  hoverPhoto: nullableText,
  bio: nullableText,
  quote: nullableText,
  sectionVisibility: nullableText,
  sectionOrder: nullableText,
  isPublished: z.boolean().default(false),
})

export const interviewSchema = z.object({
  slug: z.string().optional(),
  title: z.string().min(1),
  subtitle: nullableText,
  entrepreneurId: z.string().min(1),
  coverImage: nullableText,
  videoType: z.enum(['EMBED', 'SELF_HOSTED']),
  videoUrl: nullableText,
  videoFile: nullableText,
  summary: nullableText,
  content: nullableText,
  quote: nullableText,
  isPublished: z.boolean().default(false),
  publishedAt,
  metaTitle: nullableText,
  metaDesc: nullableText,
})

export const reelSchema = z.object({
  slug: z.string().optional(),
  title: z.string().min(1),
  entrepreneurId: nullableText,
  coverImage: nullableText,
  videoType: z.enum(['EMBED', 'SELF_HOSTED']),
  videoUrl: nullableText,
  videoFile: nullableText,
  description: nullableText,
  isPublished: z.boolean().default(false),
})

export const articleSchema = z.object({
  slug: z.string().optional(),
  title: z.string().min(1),
  subtitle: nullableText,
  category: nullableText,
  entrepreneurId: nullableText,
  coverImage: nullableText,
  coverImageSource: nullableText,
  content: z.string().min(1),
  secondaryImage: nullableText,
  secondaryImageSource: nullableText,
  secondaryText: nullableText,
  relatedTitle: nullableText,
  relatedMaterials: nullableText,
  sectionVisibility: nullableText,
  sectionOrder: nullableText,
  isPublished: z.boolean().default(false),
  publishedAt,
  metaTitle: nullableText,
  metaDesc: nullableText,
})

export const businessSchema = z.object({
  slug: z.string().optional(),
  name: z.string().min(1),
  type: z.string().min(1),
  heroTeaser: nullableText,
  heroMarquee: nullableText,
  manifestTitle: nullableText,
  manifestTextOne: nullableText,
  manifestTextTwo: nullableText,
  manifestTextThree: nullableText,
  manifestBackgroundImage: nullableText,
  manifestSquareImage: nullableText,
  aboutTitle: nullableText,
  aboutText: nullableText,
  aboutAsideText: nullableText,
  aboutPhoto: nullableText,
  founderPhoto: nullableText,
  useCustomOwnerBiography: z.boolean().default(false),
  ownerBiographyBlocks: nullableText,
  storySections: z.array(storySectionSchema).optional(),
  specsTitle: nullableText,
  specsDescription: nullableText,
  specsItems: nullableText,
  mapEmbed: nullableText,
  awardsEnabled: z.boolean().default(true),
  awardsTitle: nullableText,
  awardsDescription: nullableText,
  awardsItems: nullableText,
  factsTitle: nullableText,
  factsSubtitle: nullableText,
  factsTextOne: nullableText,
  factsTextTwo: nullableText,
  factsPhoto: nullableText,
  galleryImages: nullableText,
  moreCardTitles: nullableText,
  moreCardLinks: nullableText,
  morePhoto: nullableText,
  relatedTitle: nullableText,
  sectionVisibility: nullableText,
  sectionOrder: nullableText,
  description: nullableText,
  address: nullableText,
  city: nullableText,
  phone: nullableText,
  email: z.string().email().optional().nullable().or(z.literal('')),
  website: z.string().url().optional().nullable().or(z.literal('')),
  coverImage: nullableText,
  entrepreneurId: z.string().min(1),
  isPublished: z.boolean().default(false),
})

export const businessOrderSchema = z.object({
  ids: z.array(z.string().min(1)).min(1).refine(
    ids => new Set(ids).size === ids.length,
    'Business ids must be unique',
  ),
})

export const audienceCardSchema = z.object({
  title: z.string().min(1),
  description: nullableText,
  hoverTitle: nullableText,
  hoverDescription: nullableText,
  sortOrder: z.coerce.number().int().default(0),
  isPublished: z.boolean().default(false),
})

export const commentApprovalSchema = z.object({
  isApproved: z.boolean().default(true),
})

export const shootingRequestStatusSchema = z.object({
  status: z.enum(['NEW', 'IN_PROGRESS', 'COMPLETED', 'ARCHIVED']),
})

export const settingsSchema = z.record(z.string(), z.string())

const roleSchema = z.enum(['ADMIN', 'EDITOR', 'SUBSCRIBER'])

export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
  role: roleSchema,
  isActive: z.boolean().default(true),
})

export const updateUserSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  name: z.string().min(1).optional(),
  role: roleSchema.optional(),
  isActive: z.boolean().optional(),
})

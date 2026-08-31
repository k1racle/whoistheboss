import { z } from 'zod'

const MAX_SHORT_TEXT = 500
const MAX_LONG_TEXT = 250_000
const nullableText = z.string().max(MAX_LONG_TEXT).optional().nullable()
const shortText = z.string().trim().max(MAX_SHORT_TEXT)
const publishedAt = z.union([z.string().datetime(), z.literal('')]).optional().nullable()
const expectedUpdatedAt = z.string().datetime().optional()

const storySectionBase = {
  id: z.string().min(1).max(100),
  isVisible: z.boolean().default(true),
  menuLabel: shortText.default(''),
  menuDescription: shortText.default(''),
  menuImage: z.string().max(2048).nullable().default(null),
}

export const storySectionSchema = z.discriminatedUnion('type', [
  z.object({
    ...storySectionBase,
    type: z.literal('BIOGRAPHY'),
    eyebrow: shortText.default(''),
    title: shortText.default(''),
    textOne: z.string().max(MAX_LONG_TEXT).default(''),
    textTwo: z.string().max(MAX_LONG_TEXT).default(''),
    textThree: z.string().max(MAX_LONG_TEXT).default(''),
    image: z.string().max(2048).nullable().default(null),
  }),
  z.object({
    ...storySectionBase,
    type: z.literal('ACCENT'),
    title: shortText.default(''),
    textOne: z.string().max(MAX_LONG_TEXT).default(''),
    textTwo: z.string().max(MAX_LONG_TEXT).default(''),
  }),
  z.object({
    ...storySectionBase,
    type: z.literal('PORTRAIT'),
    title: shortText.default(''),
    text: z.string().max(MAX_LONG_TEXT).default(''),
    asideText: z.string().max(MAX_LONG_TEXT).default(''),
    image: z.string().max(2048).nullable().default(null),
  }),
  z.object({
    ...storySectionBase,
    type: z.literal('WIDE'),
    title: shortText.default(''),
    text: z.string().max(MAX_LONG_TEXT).default(''),
    bottomText: z.string().max(MAX_LONG_TEXT).default(''),
    image: z.string().max(2048).nullable().default(null),
  }),
])

export const entrepreneurSchema = z.object({
  expectedUpdatedAt,
  slug: z.string().max(200).optional(),
  name: shortText.min(1),
  title: shortText,
  heroTitle: nullableText,
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
  cityIds: z.array(z.string().min(1).max(100)).min(1),
})

export const citySchema = z.object({
  name: shortText.min(1),
  slug: z.string()
    .trim()
    .toLowerCase()
    .min(2)
    .max(24)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must contain lowercase Latin letters, numbers and hyphens only'),
})

export const interviewSchema = z.object({
  slug: z.string().max(200).optional(),
  title: shortText.min(1),
  subtitle: nullableText,
  entrepreneurId: z.string().min(1).max(100),
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
  slug: z.string().max(200).optional(),
  title: shortText.min(1),
  entrepreneurId: nullableText,
  coverImage: nullableText,
  videoType: z.enum(['EMBED', 'SELF_HOSTED']),
  videoUrl: nullableText,
  videoFile: nullableText,
  description: nullableText,
  isPublished: z.boolean().default(false),
})

export const articleSchema = z.object({
  expectedUpdatedAt,
  slug: z.string().max(200).optional(),
  title: shortText.min(1),
  subtitle: nullableText,
  category: nullableText,
  entrepreneurId: nullableText,
  coverImage: nullableText,
  coverImageSource: nullableText,
  content: z.string().min(1).max(MAX_LONG_TEXT),
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
  expectedUpdatedAt,
  slug: z.string().max(200).optional(),
  name: shortText.min(1),
  type: shortText.min(1),
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
  entrepreneurId: z.string().min(1).max(100),
  cityId: z.string().min(1).max(100),
  isPublished: z.boolean().default(false),
})

export const contentOrderSchema = z.object({
  ids: z.array(z.string().min(1)).min(1).refine(
    ids => new Set(ids).size === ids.length,
    'Content ids must be unique',
  ),
})

export const audienceCardSchema = z.object({
  title: shortText.min(1),
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

export const settingsSchema = z.record(
  z.string().regex(/^[A-Z][A-Z0-9_]{1,79}$/),
  z.string().max(MAX_LONG_TEXT),
).superRefine((settings, context) => {
  if (Object.keys(settings).length > 200) {
    context.addIssue({ code: 'custom', message: 'Too many settings in one request' })
  }
})

const roleSchema = z.enum(['ADMIN', 'EDITOR', 'SUBSCRIBER'])

export const createUserSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(10).max(128),
  name: shortText.min(1),
  role: roleSchema,
  isActive: z.boolean().default(true),
})

export const updateUserSchema = z.object({
  email: z.string().email().max(254).optional(),
  password: z.string().min(10).max(128).optional(),
  name: shortText.min(1).optional(),
  role: roleSchema.optional(),
  isActive: z.boolean().optional(),
})

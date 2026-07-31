import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../lib/prisma.js';
import { createUniqueSlug } from '../../lib/uniqueSlug.js';

const router = Router();

const schema = z.object({
  slug: z.string().optional(),
  name: z.string().min(1),
  title: z.string().min(1),
  heroLeftTeaser: z.string().optional().nullable(),
  heroRightTeaser: z.string().optional().nullable(),
  heroBottomRightTeaser: z.string().optional().nullable(),
  heroMarquee: z.string().optional().nullable(),
  aboutIntroTitle: z.string().optional().nullable(),
  aboutIntroDescription: z.string().optional().nullable(),
  aboutMenuLabels: z.string().optional().nullable(),
  aboutMenuDescriptions: z.string().optional().nullable(),
  biographyTextOne: z.string().optional().nullable(),
  biographyTextTwo: z.string().optional().nullable(),
  biographyTextThree: z.string().optional().nullable(),
  biographyPhoto: z.string().optional().nullable(),
  childhoodTitle: z.string().optional().nullable(),
  childhoodTextOne: z.string().optional().nullable(),
  childhoodTextTwo: z.string().optional().nullable(),
  educationTitle: z.string().optional().nullable(),
  educationText: z.string().optional().nullable(),
  educationAsideText: z.string().optional().nullable(),
  educationPhoto: z.string().optional().nullable(),
  turnoverTitle: z.string().optional().nullable(),
  turnoverText: z.string().optional().nullable(),
  turnoverBottomText: z.string().optional().nullable(),
  turnoverPhoto: z.string().optional().nullable(),
  moreCardTitles: z.string().optional().nullable(),
  moreCardLinks: z.string().optional().nullable(),
  morePhoto: z.string().optional().nullable(),
  featuredInterviewVideoType: z.enum(['EMBED', 'SELF_HOSTED']).optional().nullable(),
  featuredInterviewVideoUrl: z.string().optional().nullable(),
  featuredInterviewVideoFile: z.string().optional().nullable(),
  photo: z.string().optional().nullable(),
  aboutGalleryPhotos: z.string().optional().nullable(),
  galleryPhotos: z.string().optional().nullable(),
  hoverPhoto: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  quote: z.string().optional().nullable(),
  sectionVisibility: z.string().optional().nullable(),
  sectionOrder: z.string().optional().nullable(),
  isPublished: z.boolean().default(false),
});

router.get('/', async (_req, res, next) => {
  try {
    const entrepreneurs = await prisma.entrepreneur.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { interviews: true, reels: true, articles: true },
        },
      },
    });
    res.json(entrepreneurs);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Invalid input', issues: parsed.error.issues });
      return;
    }
    const slug = await createUniqueSlug(parsed.data.name, async (candidate) => Boolean(
      await prisma.entrepreneur.findUnique({ where: { slug: candidate }, select: { id: true } }),
    ));
    const entrepreneur = await prisma.entrepreneur.create({ data: { ...parsed.data, slug } });
    res.status(201).json(entrepreneur);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const entrepreneur = await prisma.entrepreneur.findUnique({
      where: { id: req.params.id },
    });
    if (!entrepreneur) {
      res.status(404).json({ error: 'Entrepreneur not found' });
      return;
    }
    res.json(entrepreneur);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Invalid input', issues: parsed.error.issues });
      return;
    }
    const existing = await prisma.entrepreneur.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      res.status(404).json({ error: 'Entrepreneur not found' });
      return;
    }
    const slug = await createUniqueSlug(parsed.data.name, async (candidate) => Boolean(
      await prisma.entrepreneur.findFirst({
        where: { slug: candidate, id: { not: req.params.id } },
        select: { id: true },
      }),
    ));
    const entrepreneur = await prisma.entrepreneur.update({
      where: { id: req.params.id },
      data: { ...parsed.data, slug },
    });
    res.json(entrepreneur);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const existing = await prisma.entrepreneur.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      res.status(404).json({ error: 'Entrepreneur not found' });
      return;
    }
    await prisma.entrepreneur.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;

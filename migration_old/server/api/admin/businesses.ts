import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../lib/prisma.js';
import { createUniqueSlug } from '../../lib/uniqueSlug.js';

const router = Router();

const nullableText = z.string().optional().nullable();
const nullableEmail = z.string().email().optional().nullable().or(z.literal(''));
const nullableUrl = z.string().url().optional().nullable().or(z.literal(''));

const businessSchema = z.object({
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
  email: nullableEmail,
  website: nullableUrl,
  coverImage: nullableText,
  entrepreneurId: z.string().min(1),
  isPublished: z.boolean().default(false),
});

router.get('/', async (_req, res, next) => {
  try {
    const items = await prisma.business.findMany({
      orderBy: { createdAt: 'desc' },
      include: { entrepreneur: { select: { id: true, name: true } } },
    });
    res.json(items);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const item = await prisma.business.findUnique({
      where: { id: req.params.id },
      include: { entrepreneur: { select: { id: true, name: true } } },
    });
    if (!item) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    res.json(item);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const parsed = businessSchema.parse(req.body);
    const slug = await createUniqueSlug(parsed.name, async (candidate) => Boolean(
      await prisma.business.findUnique({ where: { slug: candidate }, select: { id: true } }),
    ));
    const item = await prisma.business.create({
      data: {
        ...parsed,
        slug,
        email: parsed.email || null,
        website: parsed.website || null,
        coverImage: parsed.coverImage || null,
      },
      include: { entrepreneur: { select: { id: true, name: true } } },
    });
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const parsed = businessSchema.parse(req.body);
    const slug = await createUniqueSlug(parsed.name, async (candidate) => Boolean(
      await prisma.business.findFirst({
        where: { slug: candidate, id: { not: req.params.id } },
        select: { id: true },
      }),
    ));
    const item = await prisma.business.update({
      where: { id: req.params.id },
      data: {
        ...parsed,
        slug,
        email: parsed.email || null,
        website: parsed.website || null,
        coverImage: parsed.coverImage || null,
      },
      include: { entrepreneur: { select: { id: true, name: true } } },
    });
    res.json(item);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.business.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;

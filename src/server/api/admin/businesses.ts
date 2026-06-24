import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../lib/prisma.js';

const router = Router();

const businessSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  type: z.string().min(1),
  description: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  website: z.string().url().optional().or(z.literal('')),
  coverImage: z.string().optional().or(z.literal('')),
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
    const item = await prisma.business.create({
      data: {
        ...parsed,
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
    const item = await prisma.business.update({
      where: { id: req.params.id },
      data: {
        ...parsed,
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

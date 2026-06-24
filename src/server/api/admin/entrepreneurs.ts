import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../lib/prisma.js';

const router = Router();

const schema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  title: z.string().min(1),
  photo: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  quote: z.string().optional().nullable(),
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
    const entrepreneur = await prisma.entrepreneur.create({ data: parsed.data });
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
    const entrepreneur = await prisma.entrepreneur.update({
      where: { id: req.params.id },
      data: parsed.data,
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

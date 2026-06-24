import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../lib/prisma.js';

const router = Router();

const schema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  entrepreneurId: z.string().optional().nullable(),
  coverImage: z.string().optional().nullable(),
  videoType: z.enum(['EMBED', 'SELF_HOSTED']),
  videoUrl: z.string().optional().nullable(),
  videoFile: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  isPublished: z.boolean().default(false),
});

router.get('/', async (_req, res, next) => {
  try {
    const reels = await prisma.reel.findMany({
      orderBy: { createdAt: 'desc' },
      include: { entrepreneur: { select: { id: true, name: true } } },
    });
    res.json(reels);
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
    const reel = await prisma.reel.create({
      data: parsed.data,
      include: { entrepreneur: { select: { id: true, name: true } } },
    });
    res.status(201).json(reel);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const reel = await prisma.reel.findUnique({
      where: { id: req.params.id },
    });
    if (!reel) {
      res.status(404).json({ error: 'Reel not found' });
      return;
    }
    res.json(reel);
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
    const existing = await prisma.reel.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      res.status(404).json({ error: 'Reel not found' });
      return;
    }
    const reel = await prisma.reel.update({
      where: { id: req.params.id },
      data: parsed.data,
      include: { entrepreneur: { select: { id: true, name: true } } },
    });
    res.json(reel);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const existing = await prisma.reel.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      res.status(404).json({ error: 'Reel not found' });
      return;
    }
    await prisma.reel.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;

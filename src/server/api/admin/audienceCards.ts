import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../lib/prisma.js';

const router = Router();

const schema = z.object({
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  hoverTitle: z.string().optional().nullable(),
  hoverDescription: z.string().optional().nullable(),
  sortOrder: z.coerce.number().int().default(0),
  isPublished: z.boolean().default(false),
});

router.get('/', async (_req, res, next) => {
  try {
    const items = await prisma.audienceCard.findMany({ orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }] });
    res.json(items);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const item = await prisma.audienceCard.findUnique({ where: { id: req.params.id } });
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
    const item = await prisma.audienceCard.create({ data: schema.parse(req.body) });
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const item = await prisma.audienceCard.update({ where: { id: req.params.id }, data: schema.parse(req.body) });
    res.json(item);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.audienceCard.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;

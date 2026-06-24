import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../lib/prisma.js';

const router = Router();

const schema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().optional().nullable(),
  entrepreneurId: z.string().min(1),
  coverImage: z.string().optional().nullable(),
  videoType: z.enum(['EMBED', 'SELF_HOSTED']),
  videoUrl: z.string().optional().nullable(),
  videoFile: z.string().optional().nullable(),
  summary: z.string().optional().nullable(),
  content: z.string().optional().nullable(),
  quote: z.string().optional().nullable(),
  isPublished: z.boolean().default(false),
  publishedAt: z.union([z.string().min(1), z.literal('')]).optional().nullable(),
  metaTitle: z.string().optional().nullable(),
  metaDesc: z.string().optional().nullable(),
});

function normalizeInput(body: unknown) {
  const parsed = schema.safeParse(body);
  if (!parsed.success) return { success: false as const, error: parsed.error };
  const data = { ...parsed.data };
  if (data.publishedAt === '' || data.publishedAt === undefined) {
    data.publishedAt = null;
  }
  if (data.publishedAt) {
    data.publishedAt = new Date(data.publishedAt).toISOString();
  }
  return { success: true as const, data };
}

router.get('/', async (_req, res, next) => {
  try {
    const interviews = await prisma.interview.findMany({
      orderBy: { createdAt: 'desc' },
      include: { entrepreneur: { select: { id: true, name: true } } },
    });
    res.json(interviews);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const parsed = normalizeInput(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Invalid input', issues: parsed.error.issues });
      return;
    }
    const { publishedAt, ...rest } = parsed.data;
    const interview = await prisma.interview.create({
      data: { ...rest, publishedAt: publishedAt ? new Date(publishedAt) : null },
      include: { entrepreneur: { select: { id: true, name: true } } },
    });
    res.status(201).json(interview);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const interview = await prisma.interview.findUnique({
      where: { id: req.params.id },
    });
    if (!interview) {
      res.status(404).json({ error: 'Interview not found' });
      return;
    }
    res.json(interview);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const parsed = normalizeInput(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Invalid input', issues: parsed.error.issues });
      return;
    }
    const existing = await prisma.interview.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      res.status(404).json({ error: 'Interview not found' });
      return;
    }
    const { publishedAt, ...rest } = parsed.data;
    const interview = await prisma.interview.update({
      where: { id: req.params.id },
      data: { ...rest, publishedAt: publishedAt ? new Date(publishedAt) : null },
      include: { entrepreneur: { select: { id: true, name: true } } },
    });
    res.json(interview);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const existing = await prisma.interview.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      res.status(404).json({ error: 'Interview not found' });
      return;
    }
    await prisma.interview.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;

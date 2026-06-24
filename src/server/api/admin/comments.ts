import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../lib/prisma.js';

const router = Router();

const approveSchema = z.object({
  isApproved: z.boolean().default(true),
});

router.get('/', async (_req, res, next) => {
  try {
    const comments = await prisma.comment.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, email: true } },
        interview: { select: { id: true, title: true, slug: true } },
        article: { select: { id: true, title: true, slug: true } },
        reel: { select: { id: true, title: true, slug: true } },
        entrepreneur: { select: { id: true, name: true, slug: true } },
      },
    });
    res.json(comments);
  } catch (err) {
    next(err);
  }
});

router.post('/:id/approve', async (req, res, next) => {
  try {
    const parsed = approveSchema.safeParse(req.body);
    const isApproved = parsed.success ? parsed.data.isApproved : true;
    const existing = await prisma.comment.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      res.status(404).json({ error: 'Comment not found' });
      return;
    }
    const comment = await prisma.comment.update({
      where: { id: req.params.id },
      data: { isApproved },
      include: {
        user: { select: { id: true, name: true, email: true } },
        interview: { select: { id: true, title: true, slug: true } },
        article: { select: { id: true, title: true, slug: true } },
        reel: { select: { id: true, title: true, slug: true } },
        entrepreneur: { select: { id: true, name: true, slug: true } },
      },
    });
    res.json(comment);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const existing = await prisma.comment.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      res.status(404).json({ error: 'Comment not found' });
      return;
    }
    await prisma.comment.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;

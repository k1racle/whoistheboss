import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

const schema = z.object({
  content: z.string().min(3).max(2000),
  interviewId: z.string().optional(),
  articleId: z.string().optional(),
  reelId: z.string().optional(),
  entrepreneurId: z.string().optional(),
});

function wantsJson(req: import('express').Request): boolean {
  return req.xhr || req.headers.accept?.includes('application/json') || false;
}

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      if (wantsJson(req)) {
        res.status(400).json({ error: 'Invalid input' });
        return;
      }
      res.redirect(303, '/');
      return;
    }

    const data = parsed.data;
    const ids = [data.interviewId, data.articleId, data.reelId, data.entrepreneurId].filter(Boolean);
    if (ids.length !== 1) {
      if (wantsJson(req)) {
        res.status(400).json({ error: 'Exactly one entity id required' });
        return;
      }
      res.redirect(303, '/');
      return;
    }

    const comment = await prisma.comment.create({
      data: {
        content: data.content,
        userId: req.session.userId!,
        interviewId: data.interviewId || null,
        articleId: data.articleId || null,
        reelId: data.reelId || null,
        entrepreneurId: data.entrepreneurId || null,
      },
      include: { user: { select: { id: true, name: true } } },
    });

    let redirectPath = '/';
    if (comment.interviewId) {
      const item = await prisma.interview.findUnique({ where: { id: comment.interviewId } });
      if (item) redirectPath = `/interviews/${item.slug}`;
    } else if (comment.articleId) {
      const item = await prisma.article.findUnique({ where: { id: comment.articleId } });
      if (item) redirectPath = `/blog/${item.slug}`;
    } else if (comment.reelId) {
      const item = await prisma.reel.findUnique({ where: { id: comment.reelId } });
      if (item) redirectPath = `/reels/${item.slug}`;
    } else if (comment.entrepreneurId) {
      const item = await prisma.entrepreneur.findUnique({ where: { id: comment.entrepreneurId } });
      if (item) redirectPath = `/entrepreneurs/${item.slug}`;
    }

    if (wantsJson(req)) {
      res.json({ success: true, comment });
      return;
    }
    res.redirect(303, redirectPath + '?comment=pending');
  } catch (err) {
    next(err);
  }
});

export default router;

import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

const entityTypes = ['INTERVIEW', 'ARTICLE', 'REEL', 'ENTREPRENEUR'] as const;

const toggleSchema = z.object({
  entityType: z.enum(entityTypes),
  entityId: z.string().cuid(),
});

const countSchema = z.object({
  entityType: z.enum(entityTypes),
  entityId: z.string().cuid(),
});

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const parsed = toggleSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Invalid input' });
      return;
    }

    const { entityType, entityId } = parsed.data;
    const userId = req.session.userId!;

    const existing = await prisma.like.findUnique({
      where: {
        userId_entityType_entityId: {
          userId,
          entityType,
          entityId,
        },
      },
    });

    if (existing) {
      await prisma.like.delete({ where: { id: existing.id } });
    } else {
      await prisma.like.create({
        data: { userId, entityType, entityId },
      });
    }

    const count = await prisma.like.count({
      where: { entityType, entityId },
    });

    res.json({ liked: !existing, count });
  } catch (err) {
    next(err);
  }
});

router.get('/count', async (req, res, next) => {
  try {
    const parsed = countSchema.safeParse(req.query);
    if (!parsed.success) {
      res.status(400).json({ error: 'Invalid input' });
      return;
    }

    const { entityType, entityId } = parsed.data;
    const userId = req.session.userId || undefined;

    const [count, userLike] = await Promise.all([
      prisma.like.count({ where: { entityType, entityId } }),
      userId
        ? prisma.like.findUnique({
            where: {
              userId_entityType_entityId: {
                userId,
                entityType,
                entityId,
              },
            },
          })
        : null,
    ]);

    res.json({ count, liked: !!userLike });
  } catch (err) {
    next(err);
  }
});

export default router;

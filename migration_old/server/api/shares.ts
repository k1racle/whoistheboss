import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';

const router = Router();

const entityTypes = ['INTERVIEW', 'ARTICLE', 'REEL', 'ENTREPRENEUR'] as const;
const platforms = ['native', 'vk', 'telegram', 'x', 'whatsapp', 'copy', 'other'] as const;

const shareSchema = z.object({
  entityType: z.enum(entityTypes),
  entityId: z.string().cuid(),
  platform: z.enum(platforms).default('other'),
});

const countSchema = z.object({
  entityType: z.enum(entityTypes),
  entityId: z.string().cuid(),
});

router.post('/', async (req, res, next) => {
  try {
    const parsed = shareSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Invalid input' });
      return;
    }

    const { entityType, entityId, platform } = parsed.data;

    await prisma.shareEvent.create({
      data: { entityType, entityId, platform },
    });

    const count = await prisma.shareEvent.count({
      where: { entityType, entityId },
    });

    res.json({ success: true, count });
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
    const count = await prisma.shareEvent.count({
      where: { entityType, entityId },
    });

    res.json({ count });
  } catch (err) {
    next(err);
  }
});

export default router;

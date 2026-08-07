import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';

const router = Router();

const schema = z.object({
  email: z.string().email(),
});

router.post('/', async (req, res, next) => {
  try {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      if (req.xhr || req.headers.accept?.includes('application/json')) {
        res.status(400).json({ error: 'Invalid input' });
        return;
      }
      res.redirect(303, '/?subscribe=error');
      return;
    }
    await prisma.subscriber.upsert({
      where: { email: parsed.data.email },
      update: { isActive: true },
      create: { email: parsed.data.email },
    });
    if (req.xhr || req.headers.accept?.includes('application/json')) {
      res.json({ success: true });
      return;
    }
    res.redirect(303, '/?subscribe=success');
  } catch (err) {
    next(err);
  }
});

export default router;

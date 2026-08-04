import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../lib/prisma.js';

const router = Router();

const statusSchema = z.object({
  status: z.enum(['NEW', 'IN_PROGRESS', 'COMPLETED', 'ARCHIVED']),
});

router.get('/', async (_req, res, next) => {
  try {
    const requests = await prisma.shootingRequest.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(requests);
  } catch (err) {
    next(err);
  }
});

router.put('/:id/status', async (req, res, next) => {
  try {
    const parsed = statusSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Invalid input', issues: parsed.error.issues });
      return;
    }
    const existing = await prisma.shootingRequest.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      res.status(404).json({ error: 'Request not found' });
      return;
    }
    const request = await prisma.shootingRequest.update({
      where: { id: req.params.id },
      data: { status: parsed.data.status },
    });
    res.json(request);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const existing = await prisma.shootingRequest.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      res.status(404).json({ error: 'Request not found' });
      return;
    }
    await prisma.shootingRequest.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;

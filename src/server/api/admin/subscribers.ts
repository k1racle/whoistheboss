import { Router } from 'express';
import { prisma } from '../../lib/prisma.js';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const subscribers = await prisma.subscriber.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(subscribers);
  } catch (err) {
    next(err);
  }
});

router.get('/export.csv', async (_req, res, next) => {
  try {
    const subscribers = await prisma.subscriber.findMany({
      orderBy: { createdAt: 'desc' },
    });
    const rows = [
      ['Email', 'Active', 'Created At'],
      ...subscribers.map((s) => [
        s.email,
        s.isActive ? 'Yes' : 'No',
        s.createdAt.toISOString(),
      ]),
    ];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="subscribers.csv"');
    res.send(csv);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const existing = await prisma.subscriber.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      res.status(404).json({ error: 'Subscriber not found' });
      return;
    }
    await prisma.subscriber.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;

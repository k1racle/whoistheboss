import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { config } from '../config.js';
import { buildSEO } from '../lib/seo.js';
import { getEngagement } from '../lib/engagement.js';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const reels = await prisma.reel.findMany({
      where: { isPublished: true },
      include: { entrepreneur: true },
      orderBy: { createdAt: 'desc' },
    });

    const seo = buildSEO({
      title: 'Рилсы',
      description: 'Короткие видео с предпринимателями.',
      path: '/reels',
    });

    res.render('reels/index', {
      ...seo,
      siteDescription: config.SITE_DESCRIPTION,
      siteName: config.SITE_NAME,
      siteUrl: config.SITE_URL,
      reels,
    });
  } catch (err) {
    next(err);
  }
});

router.get('/:slug', async (req, res, next) => {
  try {
    const reel = await prisma.reel.findFirst({
      where: { slug: req.params.slug, isPublished: true },
      include: {
        entrepreneur: true,
        comments: {
          where: { isApproved: true },
          include: { user: { select: { id: true, name: true } } },
          orderBy: { createdAt: 'desc' },
        },
        _count: { select: { comments: true } },
      },
    });

    if (!reel) {
      return res.status(404).render('404', {
        title: 'Страница не найдена — ' + config.SITE_NAME,
        description: config.SITE_DESCRIPTION,
        siteName: config.SITE_NAME,
        siteDescription: config.SITE_DESCRIPTION,
      });
    }

    const related = await prisma.reel.findMany({
      where: { isPublished: true, id: { not: reel.id } },
      include: { entrepreneur: true },
      orderBy: { createdAt: 'desc' },
      take: 3,
    });

    const seo = buildSEO({
      title: reel.title,
      description: reel.description || '',
      path: `/reels/${reel.slug}`,
      type: 'video',
    });

    const engagement = await getEngagement('REEL', reel.id, req.session.userId);

    res.render('reels/detail', {
      ...seo,
      siteDescription: config.SITE_DESCRIPTION,
      siteName: config.SITE_NAME,
      siteUrl: config.SITE_URL,
      reel,
      related,
      engagement,
    });
  } catch (err) {
    next(err);
  }
});

export default router;

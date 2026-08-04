import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { config } from '../config.js';
import { buildSEO } from '../lib/seo.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const activeSlug = typeof req.query.play === 'string' ? req.query.play : '';
    const reels = await prisma.reel.findMany({
      where: { isPublished: true },
      include: { entrepreneur: true },
      orderBy: { createdAt: 'desc' },
    });

    const activeReel = activeSlug ? reels.find((item) => item.slug === activeSlug) || null : null;

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
      activeReel,
    });
  } catch (err) {
    next(err);
  }
});

router.get('/:slug', async (req, res, next) => {
  try {
    const reel = await prisma.reel.findFirst({
      where: { slug: req.params.slug, isPublished: true },
      select: { slug: true },
    });

    if (!reel) {
      return res.status(404).render('404', {
        title: 'Страница не найдена — ' + config.SITE_NAME,
        description: config.SITE_DESCRIPTION,
        siteName: config.SITE_NAME,
        siteDescription: config.SITE_DESCRIPTION,
      });
    }

    res.redirect(`/reels?play=${encodeURIComponent(reel.slug)}`);
  } catch (err) {
    next(err);
  }
});

export default router;

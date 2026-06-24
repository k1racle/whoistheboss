import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { config } from '../config.js';
import { buildSEO } from '../lib/seo.js';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const businesses = await prisma.business.findMany({
      where: { isPublished: true },
      include: { entrepreneur: true },
      orderBy: { createdAt: 'desc' },
    });

    const seo = buildSEO({
      title: 'Бизнесы',
      description: 'Рестораны, винодельни, кафе, магазины и другие дела предпринимателей.',
      path: '/businesses',
    });

    res.render('businesses/index', {
      ...seo,
      siteDescription: config.SITE_DESCRIPTION,
      siteName: config.SITE_NAME,
      siteUrl: config.SITE_URL,
      businesses,
    });
  } catch (err) {
    next(err);
  }
});

router.get('/:slug', async (req, res, next) => {
  try {
    const business = await prisma.business.findFirst({
      where: { slug: req.params.slug, isPublished: true },
      include: { entrepreneur: true },
    });

    if (!business) {
      return res.status(404).render('404', {
        title: 'Страница не найдена — ' + config.SITE_NAME,
        description: config.SITE_DESCRIPTION,
        siteName: config.SITE_NAME,
        siteDescription: config.SITE_DESCRIPTION,
      });
    }

    const related = await prisma.business.findMany({
      where: { isPublished: true, id: { not: business.id } },
      include: { entrepreneur: true },
      orderBy: { createdAt: 'desc' },
      take: 3,
    });

    const [likeCount, shareCount, userLiked] = await Promise.all([
      prisma.like.count({ where: { entityType: 'business', entityId: business.id } }),
      prisma.shareEvent.count({ where: { entityType: 'business', entityId: business.id } }),
      req.session.userId
        ? prisma.like.findUnique({
            where: {
              userId_entityType_entityId: {
                userId: req.session.userId,
                entityType: 'business',
                entityId: business.id,
              },
            },
          }).then((like) => like !== null)
        : false,
    ]);

    const seo = buildSEO({
      title: business.name,
      description: business.description?.slice(0, 160) || '',
      path: `/businesses/${business.slug}`,
    });

    res.render('businesses/detail', {
      ...seo,
      siteDescription: config.SITE_DESCRIPTION,
      siteName: config.SITE_NAME,
      siteUrl: config.SITE_URL,
      business,
      related,
      engagement: { likeCount, shareCount, userLiked },
    });
  } catch (err) {
    next(err);
  }
});

export default router;

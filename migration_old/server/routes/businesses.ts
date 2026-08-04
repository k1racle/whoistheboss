import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { config } from '../config.js';
import { buildSEO } from '../lib/seo.js';
import { getSiteSettings } from '../lib/settings.js';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const businesses = await prisma.business.findMany({
      where: { isPublished: true },
      include: { entrepreneur: true },
      orderBy: { createdAt: 'desc' },
    });

    const homeSettings = await getSiteSettings();
    const seo = buildSEO({
      title: 'Компании',
      description: 'Компании, рестораны, кафе, магазины и другие проекты наших предпринимателей.',
      path: '/companies',
    });

    res.render('businesses/index', {
      ...seo,
      siteDescription: config.SITE_DESCRIPTION,
      siteName: config.SITE_NAME,
      siteUrl: config.SITE_URL,
      businesses,
      homeSettings,
      hideSiteHeader: true,
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

    const sameOwnerRelated = await prisma.business.findMany({
      where: {
        isPublished: true,
        id: { not: business.id },
        entrepreneurId: business.entrepreneurId,
      },
      include: { entrepreneur: true },
      orderBy: { createdAt: 'desc' },
      take: 3,
    });

    const [fallbackRelated, homeSettings] = await Promise.all([
      prisma.business.findMany({
        where: {
          isPublished: true,
          id: { notIn: [business.id, ...sameOwnerRelated.map((item) => item.id)] },
          entrepreneurId: { not: business.entrepreneurId },
        },
        include: { entrepreneur: true },
        orderBy: { createdAt: 'desc' },
        take: 3,
      }),
      getSiteSettings(),
    ]);
    const related = [...sameOwnerRelated, ...fallbackRelated].slice(0, 3);

    const seo = buildSEO({
      title: business.name,
      description: business.description?.slice(0, 160) || '',
      path: `/companies/${business.slug}`,
    });

    res.render('businesses/detail', {
      ...seo,
      siteDescription: config.SITE_DESCRIPTION,
      siteName: config.SITE_NAME,
      siteUrl: config.SITE_URL,
      business,
      related,
      homeSettings,
      hideSiteHeader: true,
    });
  } catch (err) {
    next(err);
  }
});

export default router;

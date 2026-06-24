import { Router } from 'express';
import { config } from '../config.js';
import { prisma } from '../lib/prisma.js';
import { buildSEO } from '../lib/seo.js';
import { organizationSchema, renderJsonLd, websiteSchema } from '../lib/jsonld.js';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const [interviews, reels, entrepreneurs, articles, businesses] = await Promise.all([
      prisma.interview.findMany({
        where: { isPublished: true },
        include: { entrepreneur: true },
        orderBy: { publishedAt: 'desc' },
        take: 4,
      }),
      prisma.reel.findMany({
        where: { isPublished: true },
        include: { entrepreneur: true },
        orderBy: { createdAt: 'desc' },
        take: 3,
      }),
      prisma.entrepreneur.findMany({
        where: { isPublished: true },
        orderBy: { createdAt: 'desc' },
        take: 4,
      }),
      prisma.article.findMany({
        where: { isPublished: true },
        include: { entrepreneur: true },
        orderBy: { publishedAt: 'desc' },
        take: 3,
      }),
      prisma.business.findMany({
        where: { isPublished: true },
        include: { entrepreneur: true },
        orderBy: { createdAt: 'desc' },
        take: 3,
      }),
    ]);

    const seo = buildSEO({
      title: '',
      description: config.SITE_DESCRIPTION,
      path: '/',
    });

    res.render('index', {
      ...seo,
      siteDescription: config.SITE_DESCRIPTION,
      siteUrl: config.SITE_URL,
      siteName: config.SITE_NAME,
      interviews,
      reels,
      entrepreneurs,
      articles,
      businesses,
      jsonLd: renderJsonLd([websiteSchema(), organizationSchema()]),
      transparentHeader: true,
    });
  } catch (err) {
    next(err);
  }
});

export default router;

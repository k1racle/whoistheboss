import { Router } from 'express';
import { config } from '../config.js';
import { prisma } from '../lib/prisma.js';
import { buildSEO } from '../lib/seo.js';
import { organizationSchema, renderJsonLd, websiteSchema } from '../lib/jsonld.js';
import { getSiteSettings } from '../lib/settings.js';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const homeSettings = await getSiteSettings();
    const configuredLatestNewsCount = Number.parseInt(homeSettings.HOME_LATEST_NEWS_COUNT || '6', 10);
    const latestNewsCount = Number.isFinite(configuredLatestNewsCount)
      ? Math.min(Math.max(configuredLatestNewsCount, 1), 20)
      : 6;

    const [interviews, reels, entrepreneurs, articles, businesses, audienceCards] = await Promise.all([
      prisma.interview.findMany({
        where: { isPublished: true },
        include: { entrepreneur: true },
        orderBy: { publishedAt: 'desc' },
        take: 12,
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
        take: 6,
      }),
      prisma.article.findMany({
        where: { isPublished: true },
        include: { entrepreneur: true },
        orderBy: { publishedAt: 'desc' },
        take: latestNewsCount,
      }),
      prisma.business.findMany({
        where: { isPublished: true },
        include: { entrepreneur: true },
        orderBy: { createdAt: 'desc' },
        take: 3,
      }),
      prisma.audienceCard.findMany({
        where: { isPublished: true },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
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
      audienceCards,
      homeSettings,
      jsonLd: renderJsonLd([websiteSchema(), organizationSchema()]),
      transparentHeader: true,
      hideSiteHeader: true,
    });
  } catch (err) {
    next(err);
  }
});

export default router;

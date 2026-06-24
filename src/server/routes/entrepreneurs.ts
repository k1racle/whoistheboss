import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { config } from '../config.js';
import { buildSEO } from '../lib/seo.js';
import { renderJsonLd } from '../lib/jsonld.js';
import { getEngagement } from '../lib/engagement.js';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const entrepreneurs = await prisma.entrepreneur.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
    });

    const seo = buildSEO({
      title: 'Бизнесмены',
      description: 'Профили предпринимателей, основателей бизнеса.',
      path: '/entrepreneurs',
    });

    res.render('entrepreneurs/index', {
      ...seo,
      siteDescription: config.SITE_DESCRIPTION,
      siteName: config.SITE_NAME,
      siteUrl: config.SITE_URL,
      entrepreneurs,
    });
  } catch (err) {
    next(err);
  }
});

router.get('/:slug', async (req, res, next) => {
  try {
    const entrepreneur = await prisma.entrepreneur.findFirst({
      where: { slug: req.params.slug, isPublished: true },
      include: {
        comments: {
          where: { isApproved: true },
          include: { user: { select: { id: true, name: true } } },
          orderBy: { createdAt: 'desc' },
        },
        _count: { select: { comments: true } },
      },
    });

    if (!entrepreneur) {
      return res.status(404).render('404', {
        title: 'Страница не найдена — ' + config.SITE_NAME,
        description: config.SITE_DESCRIPTION,
        siteName: config.SITE_NAME,
        siteDescription: config.SITE_DESCRIPTION,
      });
    }

    const [interviews, reels, articles, businesses] = await Promise.all([
      prisma.interview.findMany({
        where: { isPublished: true, entrepreneurId: entrepreneur.id },
        orderBy: { publishedAt: 'desc' },
        take: 6,
      }),
      prisma.reel.findMany({
        where: { isPublished: true, entrepreneurId: entrepreneur.id },
        orderBy: { createdAt: 'desc' },
        take: 6,
      }),
      prisma.article.findMany({
        where: { isPublished: true, entrepreneurId: entrepreneur.id },
        orderBy: { publishedAt: 'desc' },
        take: 6,
      }),
      prisma.business.findMany({
        where: { isPublished: true, entrepreneurId: entrepreneur.id },
        orderBy: { createdAt: 'desc' },
        take: 6,
      }),
    ]);

    const seo = buildSEO({
      title: entrepreneur.name,
      description: entrepreneur.bio?.slice(0, 160) || '',
      path: `/entrepreneurs/${entrepreneur.slug}`,
      type: 'profile',
    });

    const jsonLd = renderJsonLd({
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      mainEntity: {
        '@type': 'Person',
        name: entrepreneur.name,
        jobTitle: entrepreneur.title,
        description: entrepreneur.bio,
        image: entrepreneur.photo,
      },
    });

    const engagement = await getEngagement('ENTREPRENEUR', entrepreneur.id, req.session.userId);

    res.render('entrepreneurs/detail', {
      ...seo,
      siteDescription: config.SITE_DESCRIPTION,
      siteName: config.SITE_NAME,
      siteUrl: config.SITE_URL,
      entrepreneur,
      interviews,
      reels,
      articles,
      businesses,
      jsonLd,
      engagement,
    });
  } catch (err) {
    next(err);
  }
});

export default router;

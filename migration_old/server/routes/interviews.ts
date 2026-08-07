import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { config } from '../config.js';
import { buildSEO } from '../lib/seo.js';
import { renderJsonLd } from '../lib/jsonld.js';
import { getEngagement } from '../lib/engagement.js';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const interviews = await prisma.interview.findMany({
      where: { isPublished: true },
      include: { entrepreneur: true },
      orderBy: { publishedAt: 'desc' },
    });

    const seo = buildSEO({
      title: 'Интервью',
      description: 'Интервью с основателями бизнеса. Видео, рилсы, фото.',
      path: '/interviews',
    });

    res.render('interviews/index', {
      ...seo,
      siteDescription: config.SITE_DESCRIPTION,
      siteName: config.SITE_NAME,
      siteUrl: config.SITE_URL,
      interviews,
    });
  } catch (err) {
    next(err);
  }
});

router.get('/:slug', async (req, res, next) => {
  try {
    const interview = await prisma.interview.findFirst({
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

    if (!interview) {
      return res.status(404).render('404', {
        title: 'Страница не найдена — ' + config.SITE_NAME,
        description: config.SITE_DESCRIPTION,
        siteName: config.SITE_NAME,
        siteDescription: config.SITE_DESCRIPTION,
      });
    }

    const related = await prisma.interview.findMany({
      where: { isPublished: true, id: { not: interview.id } },
      include: { entrepreneur: true },
      orderBy: { publishedAt: 'desc' },
      take: 3,
    });

    const seo = buildSEO({
      title: interview.metaTitle || interview.title,
      description: interview.metaDesc || interview.summary || '',
      path: `/interviews/${interview.slug}`,
      type: 'video',
      publishedAt: interview.publishedAt,
      modifiedAt: interview.updatedAt,
      author: interview.entrepreneur?.name,
    });

    const jsonLd = renderJsonLd({
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      name: interview.title,
      description: seo.description,
      thumbnailUrl: interview.coverImage || interview.entrepreneur?.photo || `${config.SITE_URL}/images/og-default.jpg`,
      uploadDate: interview.publishedAt?.toISOString(),
      embedUrl: interview.videoType === 'EMBED' ? interview.videoUrl : undefined,
      contentUrl: interview.videoType === 'SELF_HOSTED' ? interview.videoFile : undefined,
    });

    const engagement = await getEngagement('INTERVIEW', interview.id, req.session.userId);

    res.render('interviews/detail', {
      ...seo,
      siteDescription: config.SITE_DESCRIPTION,
      siteName: config.SITE_NAME,
      siteUrl: config.SITE_URL,
      interview,
      related,
      jsonLd,
      engagement,
    });
  } catch (err) {
    next(err);
  }
});

export default router;

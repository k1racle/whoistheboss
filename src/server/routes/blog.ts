import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { config } from '../config.js';
import { buildSEO } from '../lib/seo.js';
import { renderJsonLd } from '../lib/jsonld.js';
import { getEngagement } from '../lib/engagement.js';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const articles = await prisma.article.findMany({
      where: { isPublished: true },
      include: { entrepreneur: true },
      orderBy: { publishedAt: 'desc' },
    });

    const seo = buildSEO({
      title: 'Блог',
      description: 'Статьи и колонки о бизнесе и предпринимательстве.',
      path: '/blog',
    });

    res.render('blog/index', {
      ...seo,
      siteDescription: config.SITE_DESCRIPTION,
      siteName: config.SITE_NAME,
      siteUrl: config.SITE_URL,
      articles,
    });
  } catch (err) {
    next(err);
  }
});

router.get('/:slug', async (req, res, next) => {
  try {
    const article = await prisma.article.findFirst({
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

    if (!article) {
      return res.status(404).render('404', {
        title: 'Страница не найдена — ' + config.SITE_NAME,
        description: config.SITE_DESCRIPTION,
        siteName: config.SITE_NAME,
        siteDescription: config.SITE_DESCRIPTION,
      });
    }

    const related = await prisma.article.findMany({
      where: { isPublished: true, id: { not: article.id } },
      include: { entrepreneur: true },
      orderBy: { publishedAt: 'desc' },
      take: 3,
    });

    const seo = buildSEO({
      title: article.metaTitle || article.title,
      description: article.metaDesc || article.subtitle || '',
      path: `/blog/${article.slug}`,
      type: 'article',
      publishedAt: article.publishedAt,
      modifiedAt: article.updatedAt,
      author: article.entrepreneur?.name,
    });

    const jsonLd = renderJsonLd({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      description: seo.description,
      image: article.coverImage || `${config.SITE_URL}/images/og-default.jpg`,
      datePublished: article.publishedAt?.toISOString(),
      dateModified: article.updatedAt.toISOString(),
      author: article.entrepreneur
        ? { '@type': 'Person', name: article.entrepreneur.name }
        : undefined,
    });

    const engagement = await getEngagement('ARTICLE', article.id, req.session.userId);

    res.render('blog/detail', {
      ...seo,
      siteDescription: config.SITE_DESCRIPTION,
      siteName: config.SITE_NAME,
      siteUrl: config.SITE_URL,
      article,
      related,
      jsonLd,
      engagement,
    });
  } catch (err) {
    next(err);
  }
});

export default router;

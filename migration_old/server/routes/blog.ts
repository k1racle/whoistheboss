import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { config } from '../config.js';
import { buildSEO } from '../lib/seo.js';
import { renderJsonLd } from '../lib/jsonld.js';
import { getSiteSettings } from '../lib/settings.js';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const [articles, homeSettings, relatedEntrepreneurs, relatedBusinesses] = await Promise.all([
      prisma.article.findMany({
        where: { isPublished: true },
        include: { entrepreneur: true },
        orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      }),
      getSiteSettings(),
      prisma.entrepreneur.findMany({
        where: { isPublished: true },
        orderBy: { createdAt: 'desc' },
        take: 3,
      }),
      prisma.business.findMany({
        where: { isPublished: true },
        orderBy: { createdAt: 'desc' },
        take: 3,
      }),
    ]);

    let selectedIds: string[] = [];
    try {
      const parsed = JSON.parse(homeSettings.BLOG_PAGE_POPULAR_ARTICLE_IDS || '[]');
      if (Array.isArray(parsed)) selectedIds = parsed.map(String);
    } catch {}

    const selected = selectedIds
      .map((id) => articles.find((article) => article.id === id))
      .filter((article): article is (typeof articles)[number] => Boolean(article));
    const popularArticles = [
      ...selected,
      ...articles.filter((article) => !selectedIds.includes(article.id)),
    ].slice(0, 6);

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
      popularArticles,
      relatedEntrepreneurs,
      relatedBusinesses,
      homeSettings,
      hideSiteHeader: true,
    });
  } catch (err) {
    next(err);
  }
});

router.get('/:slug', async (req, res, next) => {
  try {
    const article = await prisma.article.findFirst({
      where: { slug: req.params.slug, isPublished: true },
      include: { entrepreneur: true },
    });

    if (!article) {
      return res.status(404).render('404', {
        title: 'Страница не найдена — ' + config.SITE_NAME,
        description: config.SITE_DESCRIPTION,
        siteName: config.SITE_NAME,
        siteDescription: config.SITE_DESCRIPTION,
      });
    }

    let selections: Array<{ type: 'entrepreneur' | 'business'; id: string }> = [];
    try {
      const parsed = JSON.parse(article.relatedMaterials || '[]');
      if (Array.isArray(parsed)) {
        selections = parsed.filter(
          (item): item is { type: 'entrepreneur' | 'business'; id: string } =>
            item
            && (item.type === 'entrepreneur' || item.type === 'business')
            && typeof item.id === 'string',
        );
      }
    } catch {}

    const entrepreneurIds = selections.filter((item) => item.type === 'entrepreneur').map((item) => item.id);
    const businessIds = selections.filter((item) => item.type === 'business').map((item) => item.id);
    const [selectedEntrepreneurs, selectedBusinesses, latestArticles, homeSettings] = await Promise.all([
      entrepreneurIds.length
        ? prisma.entrepreneur.findMany({ where: { id: { in: entrepreneurIds }, isPublished: true } })
        : [],
      businessIds.length
        ? prisma.business.findMany({ where: { id: { in: businessIds }, isPublished: true } })
        : [],
      prisma.article.findMany({
        where: { isPublished: true, id: { not: article.id } },
        include: { entrepreneur: true },
        orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
        take: 5,
      }),
      getSiteSettings(),
    ]);

    const entrepreneurMap = new Map(selectedEntrepreneurs.map((item) => [item.id, item]));
    const businessMap = new Map(selectedBusinesses.map((item) => [item.id, item]));
    const relatedMaterials = selections.flatMap((selection) => {
      const item = selection.type === 'entrepreneur'
        ? entrepreneurMap.get(selection.id)
        : businessMap.get(selection.id);
      return item ? [{ type: selection.type, item }] : [];
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

    res.render('blog/detail', {
      ...seo,
      siteDescription: config.SITE_DESCRIPTION,
      siteName: config.SITE_NAME,
      siteUrl: config.SITE_URL,
      article,
      relatedMaterials,
      latestArticles,
      homeSettings,
      jsonLd,
      hideSiteHeader: true,
    });
  } catch (err) {
    next(err);
  }
});

export default router;

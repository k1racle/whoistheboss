import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { config } from '../config.js';

const router = Router();

router.get('/sitemap.xml', async (_req, res, next) => {
  try {
    const [interviews, reels, entrepreneurs, articles] = await Promise.all([
      prisma.interview.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
      prisma.reel.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
      prisma.entrepreneur.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
      prisma.article.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
    ]);

    const pages = [
      { path: '/', priority: '1.0', changefreq: 'daily' },
      { path: '/interviews', priority: '0.8', changefreq: 'weekly' },
      { path: '/reels', priority: '0.8', changefreq: 'weekly' },
      { path: '/entrepreneurs', priority: '0.8', changefreq: 'weekly' },
      { path: '/blog', priority: '0.8', changefreq: 'weekly' },
      { path: '/contacts', priority: '0.6', changefreq: 'monthly' },
      { path: '/shooting-request', priority: '0.5', changefreq: 'monthly' },
    ];

    const urls = [
      ...pages.map((p) => ({ loc: config.SITE_URL + p.path, lastmod: new Date().toISOString(), priority: p.priority, changefreq: p.changefreq })),
      ...interviews.map((i) => ({ loc: `${config.SITE_URL}/interviews/${i.slug}`, lastmod: i.updatedAt.toISOString(), priority: '0.7', changefreq: 'monthly' })),
      ...reels.map((r) => ({ loc: `${config.SITE_URL}/reels/${r.slug}`, lastmod: r.updatedAt.toISOString(), priority: '0.7', changefreq: 'monthly' })),
      ...entrepreneurs.map((e) => ({ loc: `${config.SITE_URL}/entrepreneurs/${e.slug}`, lastmod: e.updatedAt.toISOString(), priority: '0.7', changefreq: 'monthly' })),
      ...articles.map((a) => ({ loc: `${config.SITE_URL}/blog/${a.slug}`, lastmod: a.updatedAt.toISOString(), priority: '0.7', changefreq: 'monthly' })),
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    res.set('Content-Type', 'application/xml');
    res.send(xml);
  } catch (err) {
    next(err);
  }
});

router.get('/robots.txt', (_req, res) => {
  res.set('Content-Type', 'text/plain');
  res.send(`User-agent: *\nAllow: /\nSitemap: ${config.SITE_URL}/sitemap.xml\n`);
});

export default router;

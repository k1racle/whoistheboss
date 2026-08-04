import { Router } from 'express';
import { config } from '../config.js';
import { buildSEO } from '../lib/seo.js';
import { getSiteSettings } from '../lib/settings.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const pageSettings = await getSiteSettings();
    const seo = buildSEO({
      title: pageSettings.SHOOTING_PAGE_TITLE || 'Стать героем',
      description: pageSettings.SHOOTING_PAGE_DESCRIPTION || 'Узнайте, как стать героем проекта «Кто здесь главный?».',
      path: '/shooting-request',
    });

    res.render('shooting-request', {
      ...seo,
      siteDescription: config.SITE_DESCRIPTION,
      siteName: config.SITE_NAME,
      siteUrl: config.SITE_URL,
      pageSettings,
      success: req.query.success === '1',
      error: req.query.error === '1',
    });
  } catch (error) {
    next(error);
  }
});

export default router;

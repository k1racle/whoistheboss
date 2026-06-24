import { Router } from 'express';
import { config } from '../config.js';
import { buildSEO } from '../lib/seo.js';

const router = Router();

router.get('/', (req, res) => {
  const seo = buildSEO({
    title: 'Заявка на съёмку',
    description: 'Оставьте заявку на съёмку интервью для вашего бизнеса.',
    path: '/shooting-request',
  });

  res.render('shooting-request', {
    ...seo,
    siteDescription: config.SITE_DESCRIPTION,
    siteName: config.SITE_NAME,
    siteUrl: config.SITE_URL,
    success: req.query.success === '1',
    error: req.query.error === '1',
  });
});

export default router;

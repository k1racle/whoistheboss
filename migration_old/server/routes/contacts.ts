import { Router } from 'express';
import { config } from '../config.js';
import { buildSEO } from '../lib/seo.js';
import { getSiteSettings } from '../lib/settings.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const settings = await getSiteSettings();
    const seo = buildSEO({
      title: 'Контакты',
      description: 'Контактная информация и заявка на съёмку.',
      path: '/contacts',
    });

    res.render('contacts', {
      ...seo,
      siteDescription: config.SITE_DESCRIPTION,
      siteName: config.SITE_NAME,
      siteUrl: config.SITE_URL,
      address: settings.CONTACT_ADDRESS || '',
      mapEmbed: settings.CONTACT_MAP_EMBED || '',
      phone: settings.CONTACT_PHONE || '',
      email: settings.CONTACT_EMAIL || '',
      success: req.query.success === '1',
      error: req.query.error === '1',
    });
  } catch (err) {
    next(err);
  }
});

export default router;

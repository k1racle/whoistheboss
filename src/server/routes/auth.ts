import { Router } from 'express';
import { config } from '../config.js';
import { buildSEO } from '../lib/seo.js';

const router = Router();

router.get('/login', (req, res) => {
  if (req.session.userId) {
    res.redirect('/');
    return;
  }
  const seo = buildSEO({ title: 'Вход', path: '/login' });
  res.render('auth/login', {
    ...seo,
    siteName: config.SITE_NAME,
    siteDescription: config.SITE_DESCRIPTION,
    error: req.query.error === '1',
  });
});

router.get('/register', (req, res) => {
  if (req.session.userId) {
    res.redirect('/');
    return;
  }
  const seo = buildSEO({ title: 'Регистрация', path: '/register' });
  res.render('auth/register', {
    ...seo,
    siteName: config.SITE_NAME,
    siteDescription: config.SITE_DESCRIPTION,
    error: req.query.error === '1',
  });
});

export default router;

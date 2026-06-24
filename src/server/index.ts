import 'express-async-errors';
import express from 'express';
import session from 'express-session';
import pgSession from 'connect-pg-simple';
import helmet from 'helmet';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config.js';
import { logger } from './lib/logger.js';
import { prisma } from './lib/prisma.js';
import { errorHandler } from './middleware/errorHandler.js';
import { formatDate } from './lib/seo.js';
import rateLimit from 'express-rate-limit';
import authRoutes from './api/auth.js';
import adminRoutes from './api/admin/index.js';
import shootingRequestApi from './api/shootingRequest.js';
import subscribeApi from './api/subscribe.js';
import commentsApi from './api/comments.js';
import likesApi from './api/likes.js';
import sharesApi from './api/shares.js';
import homeRoutes from './routes/home.js';
import interviewsRoutes from './routes/interviews.js';
import reelsRoutes from './routes/reels.js';
import entrepreneursRoutes from './routes/entrepreneurs.js';
import businessesRoutes from './routes/businesses.js';
import blogRoutes from './routes/blog.js';
import contactsRoutes from './routes/contacts.js';
import shootingRequestRoutes from './routes/shootingRequest.js';
import authPageRoutes from './routes/auth.js';
import sitemapRoutes from './routes/sitemap.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

declare module 'express-session' {
  interface SessionData {
    userId?: string;
    role?: string;
    name?: string;
    email?: string;
  }
}

const app = express();

app.use(helmet({
  contentSecurityPolicy: config.NODE_ENV === 'production',
}));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.locals.formatDate = formatDate;
app.locals.siteName = config.SITE_NAME;
app.locals.siteDescription = config.SITE_DESCRIPTION;
app.locals.siteUrl = config.SITE_URL;

const PgSession = pgSession(session);
app.use(session({
  store: new PgSession({
    conString: config.DATABASE_URL,
    createTableIfMissing: true,
  }),
  secret: config.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  name: 'sid',
  cookie: {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
}));

app.use(express.static(path.join(__dirname, '../../public')));
app.use('/admin', express.static(path.join(__dirname, '../../dist/admin')));

app.use((req, res, next) => {
  res.locals.user = req.session.userId
    ? { id: req.session.userId, name: req.session.name, email: req.session.email, role: req.session.role }
    : null;
  next();
});

app.use(async (_req, res, next) => {
  try {
    const keys = ['SOCIAL_TELEGRAM', 'SOCIAL_VK', 'SOCIAL_YOUTUBE', 'SOCIAL_INSTAGRAM', 'SOCIAL_X', 'SOCIAL_WHATSAPP'];
    const rows = await prisma.siteSetting.findMany({ where: { key: { in: keys } } });
    const social: Record<string, string> = {};
    for (const row of rows) {
      if (row.value) {
        social[row.key.replace('SOCIAL_', '').toLowerCase()] = row.value;
      }
    }
    res.locals.social = social;

    const menuRows = await prisma.siteSetting.findMany({ where: { key: 'HEADER_MENU' } });
    const menuRaw = menuRows.find((r) => r.key === 'HEADER_MENU')?.value || '';
    res.locals.siteMenu = parseSiteMenu(menuRaw);

    const logoRows = await prisma.siteSetting.findMany({ where: { key: { in: ['HEADER_LOGO', 'FOOTER_LOGO'] } } });
    res.locals.headerLogo = logoRows.find((r) => r.key === 'HEADER_LOGO')?.value || '';
    res.locals.footerLogo = logoRows.find((r) => r.key === 'FOOTER_LOGO')?.value || '';
    next();
  } catch (err) {
    next(err);
  }
});

function parseSiteMenu(raw: string): { path: string; label: string }[] {
  const defaultMenu = [
    { path: '/interviews', label: 'Интервью' },
    { path: '/reels', label: 'Рилсы' },
    { path: '/entrepreneurs', label: 'Бизнесмены' },
    { path: '/businesses', label: 'Бизнесы' },
    { path: '/blog', label: 'Блог' },
    { path: '/contacts', label: 'Контакты' },
  ];
  const lines = raw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length === 0) return defaultMenu;
  const parsed = lines
    .map((line) => {
      const parts = line.split('|');
      if (parts.length >= 2) {
        return { path: parts[0].trim(), label: parts.slice(1).join('|').trim() };
      }
      const spaceIdx = line.indexOf(' ');
      if (spaceIdx > 0) {
        return { path: line.slice(0, spaceIdx).trim(), label: line.slice(spaceIdx + 1).trim() };
      }
      return null;
    })
    .filter((item): item is { path: string; label: string } => item !== null && item.path.startsWith('/'));
  return parsed.length ? parsed : defaultMenu;
}

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/auth', apiLimiter, authRoutes);
app.use('/api/admin', apiLimiter, adminRoutes);
app.use('/api/shooting-request', formLimiter, shootingRequestApi);
app.use('/api/subscribe', formLimiter, subscribeApi);
app.use('/api/comments', formLimiter, commentsApi);
app.use('/api/likes', apiLimiter, likesApi);
app.use('/api/shares', apiLimiter, sharesApi);
app.use('/interviews', interviewsRoutes);
app.use('/reels', reelsRoutes);
app.use('/entrepreneurs', entrepreneursRoutes);
app.use('/businesses', businessesRoutes);
app.use('/blog', blogRoutes);
app.use('/contacts', contactsRoutes);
app.use('/shooting-request', shootingRequestRoutes);
app.use('/', sitemapRoutes);
app.use('/', authPageRoutes);
app.use('/', homeRoutes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/admin/*', (_req, res) => {
  res.sendFile(path.join(__dirname, '../../dist/admin/index.html'));
});

app.use((_req, res) => {
  res.status(404).render('404', {
    title: 'Страница не найдена — ' + config.SITE_NAME,
    description: config.SITE_DESCRIPTION,
    siteName: config.SITE_NAME,
    siteDescription: config.SITE_DESCRIPTION,
  });
});

app.use(errorHandler);

const server = app.listen(config.PORT, () => {
  logger.info(`Server running on http://localhost:${config.PORT}`);
});

process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down');
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
});

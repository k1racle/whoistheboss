import { Router } from 'express';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';

const router = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

function wantsJson(req: import('express').Request): boolean {
  return (
    req.xhr ||
    req.headers.accept?.includes('application/json') ||
    req.headers['content-type']?.includes('application/json') ||
    false
  );
}

function redirectAfterLogin(req: import('express').Request, res: import('express').Response, role: string) {
  const returnTo = typeof req.query.returnTo === 'string' ? req.query.returnTo : '';
  if (returnTo && returnTo.startsWith('/')) {
    res.redirect(303, returnTo);
    return;
  }
  res.redirect(303, role === 'ADMIN' || role === 'EDITOR' ? '/admin' : '/');
}

router.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    if (wantsJson(req)) {
      res.status(400).json({ error: 'Invalid input' });
      return;
    }
    res.redirect(303, '/login?error=1');
    return;
  }

  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !user.isActive) {
    if (wantsJson(req)) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
    res.redirect(303, '/login?error=1');
    return;
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    if (wantsJson(req)) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
    res.redirect(303, '/login?error=1');
    return;
  }

  req.session.userId = user.id;
  req.session.role = user.role;
  req.session.name = user.name;
  req.session.email = user.email;

  if (wantsJson(req)) {
    res.json({ id: user.id, email: user.email, name: user.name, role: user.role });
    return;
  }
  redirectAfterLogin(req, res, user.role);
});

router.post('/register', async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    if (wantsJson(req)) {
      res.status(400).json({ error: 'Invalid input' });
      return;
    }
    res.redirect(303, '/register?error=1');
    return;
  }

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) {
    if (wantsJson(req)) {
      res.status(409).json({ error: 'Email already registered' });
      return;
    }
    res.redirect(303, '/register?error=2');
    return;
  }

  const password = await bcrypt.hash(parsed.data.password, 10);
  const user = await prisma.user.create({
    data: {
      ...parsed.data,
      password,
      role: 'SUBSCRIBER',
    },
  });

  req.session.userId = user.id;
  req.session.role = user.role;
  req.session.name = user.name;
  req.session.email = user.email;

  if (wantsJson(req)) {
    res.json({ id: user.id, email: user.email, name: user.name, role: user.role });
    return;
  }
  res.redirect(303, '/');
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('sid');
    if (wantsJson(req)) {
      res.json({ ok: true });
      return;
    }
    res.redirect(303, '/');
  });
});

router.get('/me', (req, res) => {
  if (!req.session.userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  res.json({
    id: req.session.userId,
    email: req.session.email,
    name: req.session.name,
    role: req.session.role,
  });
});

export default router;

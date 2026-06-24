import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { notifyAdmin } from '../lib/mailer.js';
import { sendTelegramMessage } from '../lib/telegram.js';

const router = Router();

function isLocalRedirect(url: string | undefined): url is string {
  return typeof url === 'string' && url.startsWith('/') && !url.startsWith('//');
}

const schema = z.object({
  name: z.string().min(2),
  company: z.string().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().optional(),
  redirect: z.string().optional(),
});

router.post('/', async (req, res, next) => {
  try {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      if (req.xhr || req.headers.accept?.includes('application/json')) {
        res.status(400).json({ error: 'Invalid input' });
        return;
      }
      const fallbackRedirect = typeof req.body.redirect === 'string' ? req.body.redirect : undefined;
      const errorUrl = isLocalRedirect(fallbackRedirect)
        ? `${fallbackRedirect.split('?')[0]}?error=1`
        : '/shooting-request?error=1';
      res.redirect(303, errorUrl);
      return;
    }
    const { redirect, ...requestData } = parsed.data;
    const data = await prisma.shootingRequest.create({ data: requestData });
    const emailHtml = `<p><strong>Имя:</strong> ${data.name}</p>
       <p><strong>Email:</strong> ${data.email}</p>
       <p><strong>Компания:</strong> ${data.company || '—'}</p>
       <p><strong>Телефон:</strong> ${data.phone || '—'}</p>
       <p><strong>Сообщение:</strong> ${data.message || '—'}</p>`;
    const telegramText = `Новая заявка на съёмку\n\nИмя: ${data.name}\nEmail: ${data.email}\nКомпания: ${data.company || '—'}\nТелефон: ${data.phone || '—'}\nСообщение: ${data.message || '—'}`;

    try {
      await notifyAdmin('Новая заявка на съёмку', emailHtml);
    } catch (err) {
      // don't block the request if notification fails
    }
    try {
      await sendTelegramMessage(telegramText);
    } catch (err) {
      // don't block the request if notification fails
    }
    if (req.xhr || req.headers.accept?.includes('application/json')) {
      res.json({ success: true, id: data.id });
      return;
    }
    const successUrl = isLocalRedirect(redirect) ? redirect : '/shooting-request?success=1';
    res.redirect(303, successUrl);
  } catch (err) {
    next(err);
  }
});

export default router;

import { logger } from './logger.js';
import { getSiteSettings } from './settings.js';

export async function sendTelegramMessage(text: string) {
  const settings = await getSiteSettings();
  const token = settings.TELEGRAM_BOT_TOKEN;
  const chatId = settings.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    logger.info('Telegram bot not configured, skipping notification');
    return;
  }

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      logger.error({ status: res.status, body }, 'Failed to send Telegram message');
    }
  } catch (err) {
    logger.error({ err }, 'Failed to send Telegram message');
  }
}

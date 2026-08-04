import nodemailer from 'nodemailer';
import { config } from '../config.js';
import { logger } from './logger.js';
import { getSiteSettings } from './settings.js';

const transporter = config.SMTP_HOST
  ? nodemailer.createTransport({
      host: config.SMTP_HOST,
      port: config.SMTP_PORT,
      secure: config.SMTP_PORT === 465,
      auth: {
        user: config.SMTP_USER,
        pass: config.SMTP_PASS,
      },
    })
  : null;

export async function sendMail(to: string, subject: string, html: string) {
  if (!transporter) {
    logger.warn('SMTP not configured, skipping email');
    return;
  }
  try {
    await transporter.sendMail({
      from: config.FROM_EMAIL,
      to,
      subject,
      html,
    });
  } catch (err) {
    logger.error({ err }, 'Failed to send email');
  }
}

export async function notifyAdmin(subject: string, html: string) {
  const adminEmail = config.ADMIN_EMAIL || (await getSiteSettings()).ADMIN_EMAIL;
  if (adminEmail) {
    await sendMail(adminEmail, subject, html);
  }
}

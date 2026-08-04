import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000').transform(Number),
  DATABASE_URL: z.string(),
  SESSION_SECRET: z.string().min(32),
  UPLOAD_DIR: z.string().default('./public/uploads'),
  MAX_UPLOAD_SIZE_MB: z.string().default('100').transform(Number),
  ADMIN_SEED_PASSWORD: z.string().min(6).default('admin123'),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().default('587').transform(Number),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  FROM_EMAIL: z.string().optional(),
  ADMIN_EMAIL: z.string().optional(),
  SITE_URL: z.string().default('http://localhost:3000'),
  SITE_NAME: z.string().default('Кто здесь главный?'),
  SITE_DESCRIPTION: z.string().default('Интервью с основателями бизнеса. Видео, рилсы, фото.'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.format());
  process.exit(1);
}

export const config = parsed.data;

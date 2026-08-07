import multer from 'multer';
import path from 'path';
import { config } from '../config.js';
import { slugify } from '../lib/seo.js';

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, config.UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const originalName = normalizeOriginalName(file.originalname);
    const ext = path.extname(originalName).toLowerCase();
    const base = slugify(path.basename(originalName, ext)) || 'file';
    const unique = `${base}-${Date.now()}${ext}`;
    cb(null, unique);
  },
});

function normalizeOriginalName(value: string): string {
  if (/[а-яё]/i.test(value)) return value;
  if (!/[\u00c0-\u00ff]/.test(value)) return value;
  const decoded = Buffer.from(value, 'latin1').toString('utf8');
  return decoded.includes('\uFFFD') ? value : decoded;
}

export const uploadImage = multer({
  storage,
  limits: { fileSize: config.MAX_UPLOAD_SIZE_MB * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

export const uploadVideo = multer({
  storage,
  limits: { fileSize: config.MAX_UPLOAD_SIZE_MB * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed'));
    }
  },
});

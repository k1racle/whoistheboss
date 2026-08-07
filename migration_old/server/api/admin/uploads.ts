import { Router, type Request, type Response, type NextFunction } from 'express';
import path from 'path';
import { promises as fs } from 'fs';
import { uploadImage, uploadVideo } from '../../middleware/upload.js';
import { config } from '../../config.js';

const router = Router();

function handleUpload(req: Request, res: Response, _next: NextFunction): void {
  const file = req.file;
  if (!file) {
    res.status(400).json({ error: 'No file uploaded' });
    return;
  }
  const url = '/uploads/' + path.basename(file.path);
  res.json({ url });
}

router.post('/image', uploadImage.single('file'), handleUpload);
router.post('/video', uploadVideo.single('file'), handleUpload);

router.get('/', async (_req, res) => {
  const entries = await fs.readdir(config.UPLOAD_DIR, { withFileTypes: true }).catch(() => []);
  const imageExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif', '.svg']);
  const videoExtensions = new Set(['.mp4', '.webm', '.mov', '.m4v']);
  const files = await Promise.all(
    entries
      .filter((entry) => entry.isFile() && !entry.name.startsWith('.'))
      .map(async (entry) => {
        const filePath = path.join(config.UPLOAD_DIR, entry.name);
        const stat = await fs.stat(filePath);
        const extension = path.extname(entry.name).toLowerCase();
        return {
          name: entry.name,
          url: `/uploads/${entry.name}`,
          type: imageExtensions.has(extension) ? 'image' : videoExtensions.has(extension) ? 'video' : 'file',
          size: stat.size,
          updatedAt: stat.mtime.toISOString(),
        };
      })
  );

  files.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  res.json(files);
});

export default router;

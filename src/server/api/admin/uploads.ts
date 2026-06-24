import { Router, type Request, type Response, type NextFunction } from 'express';
import path from 'path';
import { uploadImage, uploadVideo } from '../../middleware/upload.js';

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

export default router;

import { Router } from 'express';
import { requireAuth, requireRole } from '../../middleware/auth.js';
import usersRouter from './users.js';
import entrepreneursRouter from './entrepreneurs.js';
import interviewsRouter from './interviews.js';
import reelsRouter from './reels.js';
import articlesRouter from './articles.js';
import businessesRouter from './businesses.js';
import commentsRouter from './comments.js';
import shootingRequestsRouter from './shootingRequests.js';
import subscribersRouter from './subscribers.js';
import settingsRouter from './settings.js';
import uploadsRouter from './uploads.js';

const router = Router();

router.use(requireAuth);
router.use(requireRole('ADMIN', 'EDITOR'));

router.use('/users', requireRole('ADMIN'), usersRouter);
router.use('/entrepreneurs', entrepreneursRouter);
router.use('/interviews', interviewsRouter);
router.use('/reels', reelsRouter);
router.use('/articles', articlesRouter);
router.use('/businesses', businessesRouter);
router.use('/comments', commentsRouter);
router.use('/shooting-requests', shootingRequestsRouter);
router.use('/subscribers', subscribersRouter);
router.use('/settings', settingsRouter);
router.use('/upload', uploadsRouter);

export default router;

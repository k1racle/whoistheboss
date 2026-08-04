import type { Request, Response, NextFunction } from 'express';
import { config } from '../config.js';
import { logger } from '../lib/logger.js';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  logger.error(err);
  res.status(500).json({
    error: config.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
}

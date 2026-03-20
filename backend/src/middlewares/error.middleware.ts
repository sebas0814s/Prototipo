import { Request, Response, NextFunction } from 'express';
import { ENV } from '../config/env';

/** Global error handler — must be registered LAST in the Express pipeline */
export function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('[Error]', err.message);

  const isDev = ENV.NODE_ENV === 'development';
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    message: err.message ?? 'Internal server error',
    stack: isDev ? err.stack : undefined,
  });
}

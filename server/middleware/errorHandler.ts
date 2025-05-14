import { Request, Response, NextFunction } from 'express';

/**
 * Global error handling middleware
 */
export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const isProduction = process.env.NODE_ENV === 'production';
  const isOperationalError = status < 500; // 4xx errors are usually operational

  // Log errors differently based on severity
  if (status >= 500) {
    console.error(`[ERROR] ${err.stack || err}`);
  } else {
    console.warn(`[WARN] ${err.message}`);
  }

  // Only show detailed error information in development
  res.status(status).json({
    message: isProduction && !isOperationalError
      ? 'Internal Server Error'
      : err.message || 'Internal Server Error',
    ...(isProduction || isOperationalError
      ? {}
      : {
          code: err.code,
          type: err.name || err.constructor.name,
        }),
  });
};
import { Express, Request, Response, NextFunction } from 'express';
import Tokens from 'csrf';
import cookieParser from 'cookie-parser';

// Initialize CSRF token generator
const tokens = new Tokens();

// Set the name of the cookie that will be used to store the secret
const CSRF_COOKIE_NAME = 'csrf_secret';

// The secret expiration time (1 hour)
const CSRF_SECRET_EXPIRY = 60 * 60 * 1000; // 1 hour in milliseconds

/**
 * Middleware to handle CSRF protection
 * This creates a CSRF secret and stores it in a cookie, then uses it to validate tokens
 */
export const configureCSRF = (app: Express) => {
  // Enable cookie parsing
  app.use(cookieParser());

  // Middleware to create or reuse CSRF secret
  app.use((req: Request, res: Response, next: NextFunction) => {
    // Get existing secret from cookie
    let secret = req.cookies[CSRF_COOKIE_NAME];
    
    // If no secret exists or it's expired, create a new one
    if (!secret) {
      secret = tokens.secretSync();
      
      // Set the cookie with the new secret
      const secureOption = process.env.NODE_ENV === 'production';
      res.cookie(CSRF_COOKIE_NAME, secret, {
        secure: secureOption, // Only send over HTTPS in production
        httpOnly: true,       // Not accessible via JavaScript
        sameSite: 'strict',   // Only sent for same-site requests
        maxAge: CSRF_SECRET_EXPIRY,
        path: '/',
      });
    }
    
    // Store the secret in request for use in validation
    req.csrfSecret = secret;
    
    next();
  });
  
  // Create CSRF token endpoint for client use
  app.get('/api/csrf-token', (req: Request, res: Response) => {
    const secret = req.csrfSecret;
    if (!secret) {
      return res.status(500).json({ error: 'CSRF secret not available' });
    }
    
    const token = tokens.create(secret);
    res.json({ csrfToken: token });
  });
};

/**
 * Middleware to validate CSRF token on specified routes
 */
export const csrfProtection = (req: Request, res: Response, next: NextFunction) => {
  // Skip validation for GET, HEAD, OPTIONS requests (they should be safe)
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }
  
  const secret = req.csrfSecret;
  if (!secret) {
    return res.status(403).json({ error: 'CSRF validation failed: missing secret' });
  }
  
  // Get token from request header or body
  const token = 
    req.headers['x-csrf-token'] || 
    req.headers['x-xsrf-token'] || 
    req.body._csrf;
  
  // Validate token
  if (!token || typeof token !== 'string' || !tokens.verify(secret, token)) {
    return res.status(403).json({ 
      error: 'CSRF validation failed',
      message: 'Invalid or missing CSRF token',
    });
  }
  
  next();
};

// Add type definition for the csrfSecret property on Request
declare global {
  namespace Express {
    interface Request {
      csrfSecret?: string;
    }
  }
}
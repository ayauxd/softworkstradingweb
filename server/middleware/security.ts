import helmet from 'helmet';
import crypto from 'crypto';
import { Express, Request, Response, NextFunction } from 'express';

/**
 * Generate a nonce for CSP
 */
const generateNonce = () => {
  return crypto.randomBytes(16).toString('base64');
};

/**
 * Middleware to add nonce to response locals for CSP
 */
const addNonceToResponseLocals = (req: Request, res: Response, next: NextFunction) => {
  res.locals.cspNonce = generateNonce();
  next();
};

/**
 * Configure security middleware with Helmet
 */
export const configureSecurity = (app: Express) => {
  // Add nonce to response locals
  app.use(addNonceToResponseLocals);
  
  // Apply helmet with enhanced security settings
  app.use((req, res, next) => {
    const nonce = res.locals.cspNonce;
    
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          // Use generated nonce for inline scripts instead of unsafe-inline
          scriptSrc: [
            "'self'", 
            `'nonce-${nonce}'`,
            'https://fonts.googleapis.com'
          ],
          // For styles, prefer nonce but keep unsafe-inline temporarily
          // for compatibility with styled-components
          styleSrc: [
            "'self'", 
            `'nonce-${nonce}'`,
            'https://fonts.googleapis.com',
            "'unsafe-inline'" // Will be removed in future updates
          ],
          imgSrc: [
            "'self'",
            'https://*.softworkstrading.com',
            'https://images.unsplash.com',
          ],
          fontSrc: ["'self'", 'https://fonts.gstatic.com'],
          connectSrc: ["'self'", 'https://*.softworkstrading.com'],
          workerSrc: ["'self'"],
          manifestSrc: ["'self'"],
          objectSrc: ["'none'"], // More restrictive
          frameAncestors: ["'none'"],
          frameSrc: ["'self'"], // For embedded iframes if needed
          baseUri: ["'self'"], // Restrict base URI
          formAction: ["'self'"], // Restrict form submissions
          upgradeInsecureRequests: [],
        },
        // Report violations in development mode
        reportOnly: process.env.NODE_ENV === 'development',
      },
      // Enable HSTS with a long max-age
      strictTransportSecurity: {
        maxAge: 63072000, // 2 years
        includeSubDomains: true,
        preload: true,
      },
      // Prevent click-jacking
      frameguard: {
        action: 'deny',
      },
      // Set X-XSS-Protection header
      xssFilter: true,
      // Disable X-Powered-By header
      hidePoweredBy: true,
      // Set X-Content-Type-Options to nosniff
      noSniff: true,
      // Set Referrer-Policy
      referrerPolicy: {
        policy: 'strict-origin-when-cross-origin',
      },
    })(req, res, next);
  });
  
  // Add hook to insert nonce into inline scripts during SSR or static rendering
  app.use((req, res, next) => {
    // Store original send method
    const originalSend = res.send;
    
    // Override send method to add nonce to inline scripts
    res.send = function(body) {
      // Only process HTML responses
      if (typeof body === 'string' && body.includes('<!DOCTYPE html>')) {
        const nonce = res.locals.cspNonce;
        
        // Replace inline script tags with nonced versions (excluding JSON-LD)
        body = body.replace(/<script(?![^>]*type=['"]application\/ld\+json['"])/g, `<script nonce="${nonce}"`);
        
        // Replace inline style tags with nonced versions
        body = body.replace(/<style/g, `<style nonce="${nonce}"`);
      }
      
      // Call original send method
      return originalSend.call(this, body);
    };
    
    next();
  });
};
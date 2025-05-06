import express from 'express';
import request from 'supertest';
import { configureSecurity } from '../../../server/middleware/security';

describe('Security Middleware', () => {
  let app: express.Express;

  beforeEach(() => {
    app = express();
    configureSecurity(app);
    
    // Set up a simple route for testing
    app.get('/test', (req, res) => {
      res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Test</title>
            <script>console.log('test');</script>
            <script type="application/ld+json">{"@context":"https://schema.org"}</script>
            <style>body { color: red; }</style>
          </head>
          <body>
            <h1>Test Page</h1>
          </body>
        </html>
      `);
    });
  });

  test('should add Content-Security-Policy header', async () => {
    const response = await request(app).get('/test');
    expect(response.headers).toHaveProperty('content-security-policy');
  });

  test('should add nonce to script tags', async () => {
    const response = await request(app).get('/test');
    expect(response.text).toMatch(/<script nonce="[A-Za-z0-9+/=]+">/);
  });

  test('should add nonce to style tags', async () => {
    const response = await request(app).get('/test');
    expect(response.text).toMatch(/<style nonce="[A-Za-z0-9+/=]+">/);
  });

  test('should not add nonce to JSON-LD script tags', async () => {
    const response = await request(app).get('/test');
    expect(response.text).toMatch(/<script type="application\/ld\+json">/);
    expect(response.text).not.toMatch(/<script type="application\/ld\+json" nonce="[A-Za-z0-9+/=]+">/);
  });

  test('should set X-Content-Type-Options header', async () => {
    const response = await request(app).get('/test');
    expect(response.headers).toHaveProperty('x-content-type-options', 'nosniff');
  });

  test('should set X-Frame-Options header', async () => {
    const response = await request(app).get('/test');
    expect(response.headers).toHaveProperty('x-frame-options', 'DENY');
  });

  test('should set Strict-Transport-Security header', async () => {
    const response = await request(app).get('/test');
    expect(response.headers).toHaveProperty('strict-transport-security');
    expect(response.headers['strict-transport-security']).toContain('max-age=63072000');
    expect(response.headers['strict-transport-security']).toContain('includeSubDomains');
    expect(response.headers['strict-transport-security']).toContain('preload');
  });

  test('should set Referrer-Policy header', async () => {
    const response = await request(app).get('/test');
    expect(response.headers).toHaveProperty('referrer-policy', 'strict-origin-when-cross-origin');
  });

  test('should add CSP report-only header in development mode', async () => {
    // Save original NODE_ENV
    const originalNodeEnv = process.env.NODE_ENV;
    
    // Set to development mode
    process.env.NODE_ENV = 'development';
    
    // Create new app with development settings
    const devApp = express();
    configureSecurity(devApp);
    devApp.get('/test', (_, res) => res.send('test'));
    
    const response = await request(devApp).get('/test');
    
    // Check for report-only header
    expect(response.headers).toHaveProperty('content-security-policy-report-only');
    
    // Restore original NODE_ENV
    process.env.NODE_ENV = originalNodeEnv;
  });
});
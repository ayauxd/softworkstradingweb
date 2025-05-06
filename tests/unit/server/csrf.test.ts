import express from 'express';
import request from 'supertest';
import { configureCSRF, csrfProtection } from '../../../server/middleware/csrf';
import cookieParser from 'cookie-parser';

describe('CSRF Protection', () => {
  let app: express.Express;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use(cookieParser());
    
    // Configure CSRF protection
    configureCSRF(app);
    
    // Set up protected routes for testing
    app.post('/api/test-protected', csrfProtection, (req, res) => {
      res.json({ success: true });
    });
    
    // Set up unprotected GET route
    app.get('/api/test-unprotected', (req, res) => {
      res.json({ success: true });
    });
  });

  test('should provide CSRF token on request', async () => {
    const response = await request(app).get('/api/csrf-token');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('csrfToken');
    expect(typeof response.body.csrfToken).toBe('string');
    expect(response.body.csrfToken.length).toBeGreaterThan(20); // Tokens are long strings
    
    // Should set a CSRF cookie
    expect(response.headers['set-cookie']).toBeDefined();
    const cookies = response.headers['set-cookie'];
    expect(cookies.some((cookie: string) => cookie.includes('csrf_secret'))).toBe(true);
  });

  test('should allow GET requests without CSRF token', async () => {
    const response = await request(app).get('/api/test-unprotected');
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true });
  });

  test('should reject POST requests without CSRF token', async () => {
    const response = await request(app).post('/api/test-protected').send({});
    
    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty('error', 'CSRF validation failed');
  });

  test('should accept POST requests with valid CSRF token', async () => {
    // First get a token
    const tokenResponse = await request(app).get('/api/csrf-token');
    const csrfToken = tokenResponse.body.csrfToken;
    const cookies = tokenResponse.headers['set-cookie'];
    
    // Then make a protected request with the token
    const response = await request(app)
      .post('/api/test-protected')
      .set('Cookie', cookies)
      .set('X-CSRF-Token', csrfToken)
      .send({});
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true });
  });

  test('should reject POST requests with invalid CSRF token', async () => {
    // First get a token (to get the cookie)
    const tokenResponse = await request(app).get('/api/csrf-token');
    const cookies = tokenResponse.headers['set-cookie'];
    
    // Then make a protected request with an invalid token
    const response = await request(app)
      .post('/api/test-protected')
      .set('Cookie', cookies)
      .set('X-CSRF-Token', 'invalid-token')
      .send({});
    
    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty('error', 'CSRF validation failed');
  });

  test('should accept token in request body', async () => {
    // First get a token
    const tokenResponse = await request(app).get('/api/csrf-token');
    const csrfToken = tokenResponse.body.csrfToken;
    const cookies = tokenResponse.headers['set-cookie'];
    
    // Then make a protected request with the token in the body
    const response = await request(app)
      .post('/api/test-protected')
      .set('Cookie', cookies)
      .send({ _csrf: csrfToken });
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true });
  });
});
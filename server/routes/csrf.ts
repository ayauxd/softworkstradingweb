import { Router } from 'express';
import { csrfProtection } from '../middleware/csrf';

/**
 * CSRF Token routes
 */
const router = Router();

/**
 * GET /api/csrf-token
 * 
 * Returns a CSRF token for the client to use in subsequent requests.
 * This token must be included in the X-CSRF-Token header for all
 * POST, PUT, PATCH, and DELETE requests.
 */
router.get('/csrf-token', csrfProtection, (req, res) => {
  const csrfToken = req.csrfToken?.() || req.csrfSecret;
  
  if (!csrfToken) {
    return res.status(500).json({
      error: 'Failed to generate CSRF token',
      message: 'Server configuration error'
    });
  }
  
  res.json({ csrfToken });
});

export default router;
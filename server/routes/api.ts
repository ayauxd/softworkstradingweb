import { Router } from 'express';
import { apiController } from '../controllers/apiController';

const router = Router();

// API health check route
router.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// API status endpoint - provides info about all APIs
router.get('/status', apiController.getApiStatus);

export default router;
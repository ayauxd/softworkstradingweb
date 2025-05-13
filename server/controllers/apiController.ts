import { Request, Response } from 'express';
import { apiService } from '../services/apiService';

/**
 * API controller with methods for handling API endpoints
 */
export const apiController = {
  /**
   * Get health status of the API
   */
  healthCheck: (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  },

  /**
   * Example endpoint for future implementation
   */
  exampleEndpoint: async (req: Request, res: Response) => {
    try {
      const result = await apiService.exampleMethod();
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred' });
    }
  }
};
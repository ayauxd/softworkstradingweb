import { Request, Response } from 'express';
import { aiConfig } from '../config';

/**
 * API status controller 
 * Provides endpoints to check the status of various API integrations
 */
export const apiController = {
  /**
   * Check status of all APIs
   * Returns status information for all configured APIs
   */
  getApiStatus: async (req: Request, res: Response) => {
    const status = {
      openai: {
        configured: aiConfig.openai.isConfigured,
        status: aiConfig.openai.isConfigured ? 'available' : 'not_configured'
      },
      elevenlabs: {
        configured: aiConfig.elevenlabs.isConfigured,
        status: aiConfig.elevenlabs.isConfigured ? 'available' : 'not_configured'
      },
      gemini: {
        configured: aiConfig.gemini.isConfigured,
        status: aiConfig.gemini.isConfigured ? 'available' : 'not_configured'
      },
      timestamp: new Date().toISOString()
    };

    res.json(status);
  }
};
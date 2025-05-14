import { Router } from 'express';
import { aiConfig } from '../config';
import { aiService } from '../services/aiService';

const router = Router();

/**
 * Debug API configuration endpoint 
 * Only available in development mode
 */
router.get('/api-config', (req, res) => {
  // Allow in any non-production mode for debugging
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({
      error: 'Forbidden in production',
      message: 'Debug endpoints are not available in production mode'
    });
  }
  
  // Return configuration status without exposing actual keys
  const configStatus = {
    openai: {
      isConfigured: aiConfig.openai.isConfigured,
      keyLength: aiConfig.openai.apiKey ? aiConfig.openai.apiKey.length : 0,
      keyPrefix: aiConfig.openai.apiKey ? aiConfig.openai.apiKey.substring(0, 7) + '...' : null,
      keyType: aiConfig.openai.apiKey && aiConfig.openai.apiKey.startsWith('sk-proj-') ? 'project' : 'standard'
    },
    elevenlabs: {
      isConfigured: aiConfig.elevenlabs.isConfigured,
      keyLength: aiConfig.elevenlabs.apiKey ? aiConfig.elevenlabs.apiKey.length : 0,
      keyPrefix: aiConfig.elevenlabs.apiKey ? aiConfig.elevenlabs.apiKey.substring(0, 3) + '...' : null,
      hasVoiceId: !!aiConfig.elevenlabs.defaultVoiceId
    },
    gemini: {
      isConfigured: aiConfig.gemini.isConfigured,
      keyLength: aiConfig.gemini.apiKey ? aiConfig.gemini.apiKey.length : 0,
      keyPrefix: aiConfig.gemini.apiKey ? aiConfig.gemini.apiKey.substring(0, 3) + '...' : null
    },
    environment: process.env.NODE_ENV,
    nodeVersion: process.version,
    server: {
      cors: {
        allowedOrigins: req.headers.origin ? [req.headers.origin] : ['*'],
        credentialsSupported: true
      }
    }
  };
  
  res.json({
    status: 'ok',
    message: 'API configuration debug information',
    config: configStatus
  });
});

/**
 * Test the AI service with a simple request
 */
router.get('/test-ai', async (req, res) => {
  // Allow in any non-production mode for debugging
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({
      error: 'Forbidden in production',
      message: 'Debug endpoints are not available in production mode'
    });
  }
  
  try {
    // Send a simple test message to the AI service
    const response = await aiService.sendChatMessage('Hello, this is a test message. Please respond with a simple greeting.');
    
    res.json({
      status: 'ok',
      message: 'AI service test completed',
      response: response
    });
  } catch (error) {
    console.error('Error testing AI service:', error);
    
    // Return detailed error info
    res.status(500).json({
      status: 'error',
      message: 'AI service test failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : null
    });
  }
});

/**
 * Test CSRF token generation and validation
 */
router.get('/csrf-test', (req, res) => {
  // Allow in any non-production mode for debugging
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({
      error: 'Forbidden in production',
      message: 'Debug endpoints are not available in production mode'
    });
  }
  
  const csrfToken = req.csrfToken ? req.csrfToken() : 'No CSRF token function available';
  const csrfSecret = req.csrfSecret ? 'Secret exists (redacted)' : 'No CSRF secret found';
  
  // Check cookies
  const cookies = req.cookies || {};
  const cookieKeys = Object.keys(cookies);
  
  res.json({
    status: 'ok',
    message: 'CSRF debugging information',
    csrf: {
      token: csrfToken,
      secretStatus: csrfSecret,
      cookies: cookieKeys
    },
    headers: {
      host: req.headers.host,
      origin: req.headers.origin,
      referer: req.headers.referer
    }
  });
});

/**
 * Return environment information (except sensitive values)
 */
router.get('/environment', (req, res) => {
  // Allow in any non-production mode for debugging
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({
      error: 'Forbidden in production',
      message: 'Debug endpoints are not available in production mode'
    });
  }
  
  // Filter out sensitive environment variables
  const safeEnv: Record<string, string> = {};
  const sensitivePatterns = [
    /key/i, /secret/i, /token/i, /password/i, /auth/i, /apikey/i, 
    /account/i, /credential/i, /db/i, /api_key/i, /private/i
  ];
  
  Object.entries(process.env).forEach(([key, value]) => {
    if (!sensitivePatterns.some(pattern => pattern.test(key))) {
      safeEnv[key] = value as string;
    } else {
      safeEnv[key] = value ? '[REDACTED]' : 'undefined';
    }
  });
  
  res.json({
    status: 'ok',
    message: 'Environment debug information',
    environment: {
      node_env: process.env.NODE_ENV,
      port: process.env.PORT,
      platform: process.platform,
      version: process.version,
      serverTime: new Date().toISOString(),
      dirname: __dirname,
      processTitle: process.title,
      apiConfigured: {
        openai: !!process.env.OPENAI_API_KEY,
        gemini: !!process.env.GEMINI_API_KEY,
        elevenlabs: !!process.env.ELEVENLABS_API_KEY
      }
    }
  });
});

export default router;
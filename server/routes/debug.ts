import { Router } from 'express';
import { aiConfig } from '../config';
import { aiService } from '../services/aiService';
import { emailService } from '../services/emailService';
import { OpenAI } from 'openai';
import { ElevenLabs } from 'elevenlabs';

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

/**
 * Basic health check endpoint
 * Always available even in production
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'API is up and running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

/**
 * Check if OpenAI API key is configured and valid
 */
router.get('/check-openai-key', async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(400).json({
        configured: false,
        message: 'OpenAI API key is not configured'
      });
    }

    // Create a minimal client to test the API key
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    // Make a simple models list call to test the API key
    await openai.models.list();
    
    res.json({
      configured: true,
      message: 'OpenAI API key is valid'
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    console.error('Error checking OpenAI API key:', errorMessage);
    res.status(500).json({
      configured: false,
      message: `OpenAI API key validation failed: ${errorMessage}`
    });
  }
});

/**
 * Check if ElevenLabs API key is configured and valid
 */
router.get('/check-elevenlabs-key', async (req, res) => {
  try {
    if (!process.env.ELEVENLABS_API_KEY) {
      return res.status(400).json({
        configured: false,
        message: 'ElevenLabs API key is not configured'
      });
    }

    // Create a minimal client to test the API key
    const elevenlabs = new ElevenLabs({
      apiKey: process.env.ELEVENLABS_API_KEY
    });

    // Make a simple voices list call to test the API key
    await elevenlabs.voices.getAll();
    
    res.json({
      configured: true,
      message: 'ElevenLabs API key is valid',
      hasDefaultVoice: !!process.env.ELEVENLABS_DEFAULT_VOICE_ID
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    console.error('Error checking ElevenLabs API key:', errorMessage);
    res.status(500).json({
      configured: false,
      message: `ElevenLabs API key validation failed: ${errorMessage}`
    });
  }
});

/**
 * Check if email service is configured and valid
 */
router.get('/check-email-config', (req, res) => {
  try {
    // Get status from email service
    const status = emailService.getStatus();
    
    res.json({
      configured: status.configured,
      contactEmail: status.contactEmail,
      smtpHost: process.env.SMTP_HOST || 'not configured',
      smtpUser: process.env.SMTP_USER ? `${process.env.SMTP_USER.substring(0, 5)}...` : 'not configured',
      message: status.configured 
        ? 'Email service is properly configured' 
        : 'Email service is not configured. Check environment variables.'
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    console.error('Error checking email configuration:', errorMessage);
    res.status(500).json({
      configured: false,
      message: `Email configuration check failed: ${errorMessage}`
    });
  }
});

/**
 * Send a test email (protected, only available in development)
 */
router.post('/send-test-email', (req, res) => {
  // Only allow in development environment
  if (process.env.NODE_ENV !== 'development') {
    return res.status(403).json({
      success: false,
      message: 'Test emails can only be sent in development environment'
    });
  }
  
  const { to, subject, message } = req.body;
  
  // Validate inputs
  if (!to || !subject || !message) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: to, subject, message'
    });
  }
  
  // Send test email
  emailService.sendEmail({
    to,
    subject,
    text: message,
    html: `<p>${message.replace(/\\n/g, '<br>')}</p>`,
  })
  .then(success => {
    if (success) {
      res.json({
        success: true,
        message: `Test email sent to ${to}`
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send test email. Email service might not be configured properly.'
      });
    }
  })
  .catch(error => {
    res.status(500).json({
      success: false,
      message: `Error sending test email: ${error.message}`
    });
  });
});

export default router;
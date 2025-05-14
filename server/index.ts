import express, { type Request, Response, NextFunction } from 'express';
import { registerRoutes } from './routes';
import { setupVite, serveStatic, log } from './vite';
import dotenv from 'dotenv';
import { serverConfig } from './config';
import { configureSecurity } from './middleware/security';
import { configureCSRF } from './middleware/csrf';

// Load environment variables from .env file
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Apply security configuration with consolidated CSP
configureSecurity(app);

// Configure CSRF protection
configureCSRF(app);

// Helper function to sanitize sensitive data
function sanitizeLogData(data: Record<string, any>): Record<string, any> {
  if (!data || typeof data !== 'object') return data;

  const sensitiveFields = ['password', 'token', 'apiKey', 'secret', 'email', 'authentication'];
  const sanitized = { ...data };

  Object.keys(sanitized).forEach(key => {
    if (sensitiveFields.some(field => key.toLowerCase().includes(field.toLowerCase()))) {
      sanitized[key] = '***REDACTED***';
    } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      sanitized[key] = sanitizeLogData(sanitized[key]);
    }
  });

  return sanitized;
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on('finish', () => {
    const duration = Date.now() - start;
    if (path.startsWith('/api')) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        // Sanitize sensitive data before logging
        const sanitizedResponse = sanitizeLogData(capturedJsonResponse);
        logLine += ` :: ${JSON.stringify(sanitizedResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + '…';
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: Error & { status?: number; statusCode?: number; code?: string }, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const isProduction = process.env.NODE_ENV === 'production';

    // In production, don't expose detailed error messages
    const message =
      isProduction && status === 500
        ? 'Internal Server Error'
        : err.message || 'Internal Server Error';

    // Log the full error for debugging, but don't expose it to the client
    console.error(`[ERROR] ${err instanceof Error ? err.stack : JSON.stringify(err)}`);

    res.status(status).json({
      message,
      // Only include error code/type in production, not full stack traces
      ...(isProduction
        ? {}
        : {
            code: err.code,
            type: err.name || err.constructor.name,
          }),
    });

    // Don't throw the error again, as it will crash the server
    // Just log it and let the middleware handle the response
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (serverConfig.isDevelopment) {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Log all environment variables for debugging
  log('Environment variables:');
  Object.entries(process.env)
    .filter(([key]) => !key.includes('SECRET') && !key.includes('KEY') && !key.includes('TOKEN') && !key.includes('PASSWORD'))
    .forEach(([key, value]) => {
      log(`  ${key}: ${value}`);
    });
  
  // Debug API configuration
  log('API Configuration:');
  log(`  OpenAI configured: ${process.env.OPENAI_API_KEY ? 'Yes' : 'No'}`);
  log(`  ElevenLabs configured: ${process.env.ELEVENLABS_API_KEY ? 'Yes' : 'No'}`);
  log(`  Default voice ID: ${process.env.ELEVENLABS_DEFAULT_VOICE_ID || 'Not set'}`);
  
  const PORT = process.env.PORT || serverConfig.port;
  
  // Use config values for port and host with fallbacks for cloud environments
  server.listen(
    {
      port: PORT,
      host: '0.0.0.0', // Always listen on all interfaces in production
    },
    () => {
      log(`Server running in ${serverConfig.nodeEnv} mode`);
      // log(`Process running as user: ${require('os').userInfo().username}`);
      log(`Current directory: ${process.cwd()}`);
      log(`Listening on port: ${PORT}`);
      
      // Try to list files in key directories
      try {
        const fs = require('fs');
        log('Checking for static files:');
        const directories = [
          './dist/public',
          './public',
          './dist',
          '.',
        ];
        
        directories.forEach(dir => {
          try {
            const files = fs.readdirSync(dir);
            log(`Files in ${dir}: ${files.length > 0 ? files.join(', ') : 'No files'}`);
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            log(`Error reading directory ${dir}: ${errorMessage}`);
          }
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        log(`Error checking files: ${errorMessage}`);
      }
    }
  );
})();

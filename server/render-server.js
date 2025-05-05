// PRODUCTION SERVER OPTIMIZED FOR RENDER DEPLOYMENT
// This is a minimal Express server that serves the React application
// with extensive logging to help diagnose deployment issues

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import os from 'os';

// -------------------------------------------------------------------
// CONFIGURATION
// -------------------------------------------------------------------

// Get directory name for ESM
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Initialize Express app
const app = express();

// CRITICAL: The PORT must come from environment variable for Render
const PORT = process.env.PORT || 3000;

// Define constants
const NODE_ENV = process.env.NODE_ENV || 'development';
const IS_PRODUCTION = NODE_ENV === 'production';
const SERVER_START_TIME = new Date().toISOString();

// -------------------------------------------------------------------
// SERVER INFORMATION LOGGING
// -------------------------------------------------------------------

// Log key system information
console.log('======================================================');
console.log(`SERVER STARTING AT ${SERVER_START_TIME}`);
console.log('======================================================');
console.log(`Environment: ${NODE_ENV}`);
console.log(`Platform: ${process.platform} (${os.release()})`);
console.log(`Node.js Version: ${process.version}`);
console.log(`CPU Architecture: ${process.arch}`);
console.log(`Memory: ${Math.round(os.totalmem() / (1024 * 1024 * 1024))}GB total`);
console.log(`Process ID: ${process.pid}`);
console.log(`User: ${os.userInfo().username}`);
console.log(`Working Directory: ${process.cwd()}`);
console.log(`Server File: ${__dirname}`);

// Log environment variables that might affect deployment
const IMPORTANT_ENV_VARS = ['PORT', 'NODE_ENV', 'PATH', 'PWD', 'RENDER', 'HOME'];
console.log('\nCRITICAL ENVIRONMENT VARIABLES:');
IMPORTANT_ENV_VARS.forEach(key => {
  console.log(`  ${key}: ${process.env[key] || '(not set)'}`);
});

// -------------------------------------------------------------------
// MIDDLEWARE
// -------------------------------------------------------------------

// Basic request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  
  // Log request details
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} (${req.ip})`);
  
  // Log response details when finished
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} → ${res.statusCode} (${duration}ms)`);
  });
  
  next();
});

// Add basic security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// -------------------------------------------------------------------
// STATIC FILE SERVING SETUP WITH EXTENSIVE LOGGING
// -------------------------------------------------------------------

// Define all possible static file paths in order of priority
const STATIC_PATHS = [
  { path: path.resolve(process.cwd(), 'dist', 'public'), priority: 1, desc: 'Primary build output' },
  { path: path.resolve(process.cwd(), 'dist'), priority: 2, desc: 'Build directory' },
  { path: path.resolve(process.cwd(), 'public'), priority: 3, desc: 'Public assets' },
  { path: path.resolve(process.cwd(), 'client', 'public'), priority: 4, desc: 'Client public assets' },
  { path: path.resolve(process.cwd(), 'client', 'dist'), priority: 5, desc: 'Client build output' },
  { path: path.resolve(__dirname, '..', 'public'), priority: 6, desc: 'Relative public directory' },
  { path: path.resolve(__dirname, '..'), priority: 7, desc: 'Parent directory' }
];

// Log all potential static paths
console.log('\nSTATIC FILE PATHS (IN PRIORITY ORDER):');
STATIC_PATHS.forEach(({ path: dirPath, priority, desc }) => {
  const exists = fs.existsSync(dirPath);
  const status = exists ? 'EXISTS' : 'NOT FOUND';
  console.log(`  [${priority}] ${dirPath} - ${status} (${desc})`);
  
  // If the directory exists, log its contents
  if (exists) {
    try {
      const files = fs.readdirSync(dirPath);
      const indexExists = files.includes('index.html');
      console.log(`     Contains ${files.length} files. index.html: ${indexExists ? 'YES' : 'NO'}`);
      if (files.length > 0) {
        console.log(`     Sample files: ${files.slice(0, 5).join(', ')}${files.length > 5 ? '...' : ''}`);
      }
    } catch (err) {
      console.error(`     Error reading directory: ${err.message}`);
    }
  }
});

// Setup static file serving for all existing paths in priority order
const validStaticPaths = STATIC_PATHS
  .filter(({ path: dirPath }) => fs.existsSync(dirPath))
  .sort((a, b) => a.priority - b.priority);

if (validStaticPaths.length === 0) {
  console.error('\n‼️ CRITICAL ERROR: No static file paths were found!');
} else {
  console.log(`\nServing static files from ${validStaticPaths.length} path(s):`);
  validStaticPaths.forEach(({ path: dirPath }, index) => {
    console.log(`  ${index === 0 ? 'PRIMARY' : 'FALLBACK'}: ${dirPath}`);
    app.use(express.static(dirPath, { 
      maxAge: IS_PRODUCTION ? '1d' : 0,
      etag: true,
      index: false // Don't serve index.html automatically, we'll handle that
    }));
  });
}

// -------------------------------------------------------------------
// SPA ROUTING & FALLBACKS
// -------------------------------------------------------------------

// Single page application route handler - match all routes to serve index.html
app.get('*', (req, res) => {
  console.log(`[SPA Route] Handling request for: ${req.url}`);
  
  // Skip API routes
  if (req.url.startsWith('/api/')) {
    console.log(`[API Request] No API handler for ${req.url}`);
    return res.status(404).json({ 
      error: 'API endpoint not found',
      path: req.url,
      timestamp: new Date().toISOString() 
    });
  }
  
  // Try to find index.html in the static paths
  for (const { path: dirPath } of validStaticPaths) {
    const indexPath = path.join(dirPath, 'index.html');
    
    if (fs.existsSync(indexPath)) {
      console.log(`[SPA] Serving index.html from: ${indexPath}`);
      return res.sendFile(indexPath);
    }
  }
  
  // If no index.html is found in any location, return detailed 404
  console.error('‼️ CRITICAL ERROR: No index.html found in any location!');
  return res.status(404).send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Application Not Found</title>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 
                         'Open Sans', 'Helvetica Neue', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 1rem;
          }
          h1 { color: #e53e3e; border-bottom: 1px solid #ddd; padding-bottom: 0.5rem; }
          h2 { color: #3182ce; margin-top: 2rem; }
          pre { background: #f5f5f5; padding: 1rem; overflow-x: auto; border-radius: 4px; }
          .timestamp { color: #718096; font-size: 0.9rem; }
        </style>
      </head>
      <body>
        <h1>Application Files Not Found</h1>
        <p class="timestamp">Error occurred at ${new Date().toISOString()}</p>
        
        <p>The server is running correctly, but couldn't locate the frontend application files.
           This usually indicates a build process issue or incorrect path configuration.</p>
        
        <h2>Server Information</h2>
        <pre>
Server Start Time: ${SERVER_START_TIME}
Current Time: ${new Date().toISOString()}
Environment: ${NODE_ENV}
Node.js: ${process.version}
Platform: ${process.platform} ${os.release()}
Process ID: ${process.pid}
Working Directory: ${process.cwd()}
Port: ${PORT}
        </pre>
        
        <h2>Search Results</h2>
        <pre>
${STATIC_PATHS.map(({ path: p }) => {
  const exists = fs.existsSync(p);
  const indexExists = exists && fs.existsSync(path.join(p, 'index.html'));
  return `${p} - ${exists ? 'Directory exists' : 'Not found'} ${indexExists ? '(with index.html)' : ''}`;
}).join('\n')}
        </pre>
        
        <h2>File System Check</h2>
        <pre>
${(() => {
  try {
    const rootDir = fs.readdirSync(process.cwd());
    return `Root directory (${process.cwd()}) contains: ${rootDir.join(', ')}`;
  } catch (err) {
    return `Error reading root directory: ${err.message}`;
  }
})()}

${(() => {
  try {
    const distDir = path.resolve(process.cwd(), 'dist');
    if (fs.existsSync(distDir)) {
      const files = fs.readdirSync(distDir);
      return `Dist directory contains: ${files.join(', ')}`;
    }
    return 'Dist directory does not exist';
  } catch (err) {
    return `Error reading dist directory: ${err.message}`;
  }
})()}
        </pre>
        
        <p>If you are the application owner, please check:</p>
        <ul>
          <li>Build process configuration (npm run build)</li>
          <li>Static file output directory settings in vite.config.js</li>
          <li>Render deployment logs</li>
        </ul>
      </body>
    </html>
  `);
});

// -------------------------------------------------------------------
// ERROR HANDLING
// -------------------------------------------------------------------

// Handle server errors
app.use((err, req, res, next) => {
  console.error('‼️ SERVER ERROR:', err);
  res.status(500).send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Server Error</title>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 1rem;
          }
          h1 { color: #e53e3e; }
          .details { 
            background: #f7fafc; 
            border-left: 4px solid #cbd5e0; 
            padding: 1rem;
            margin: 1rem 0;
          }
          .timestamp { color: #718096; font-size: 0.9rem; }
        </style>
      </head>
      <body>
        <h1>Server Error</h1>
        <p class="timestamp">Error occurred at ${new Date().toISOString()}</p>
        <p>The server encountered an unexpected condition that prevented it from fulfilling the request.</p>
        
        <div class="details">
          <p><strong>Request:</strong> ${req.method} ${req.url}</p>
          <p><strong>Error Type:</strong> ${err.name || 'Unknown Error'}</p>
          ${IS_PRODUCTION ? '' : `<p><strong>Message:</strong> ${err.message}</p>`}
        </div>
        
        <p>If this problem persists, please contact the site administrator.</p>
      </body>
    </html>
  `);
});

// -------------------------------------------------------------------
// SERVER STARTUP
// -------------------------------------------------------------------

// Start the server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('\n======================================================');
  console.log(`🚀 SERVER RUNNING - http://localhost:${PORT}`);
  console.log('======================================================');
  console.log(`Time: ${new Date().toISOString()}`);
  console.log(`Environment: ${NODE_ENV}`);
  console.log(`Port: ${PORT}`);
  console.log(`Process ID: ${process.pid}`);
  console.log(`Memory Usage: ${Math.round(process.memoryUsage().rss / (1024 * 1024))}MB`);
  console.log('======================================================\n');
  
  // Check for free disk space (important for deployments)
  try {
    const exec = require('child_process').execSync;
    const diskInfo = exec('df -h /').toString();
    console.log('Disk space information:');
    console.log(diskInfo);
  } catch (err) {
    console.log('Unable to check disk space:', err.message);
  }
});

// -------------------------------------------------------------------
// ERROR HANDLING AND GRACEFUL SHUTDOWN
// -------------------------------------------------------------------

// Handle process errors
process.on('uncaughtException', (err) => {
  console.error('‼️ UNCAUGHT EXCEPTION:', err);
  // Log but don't exit in production - let the platform decide
  if (!IS_PRODUCTION) {
    process.exit(1);
  }
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('‼️ UNHANDLED REJECTION:', reason);
});

// Handle graceful shutdown
['SIGTERM', 'SIGINT'].forEach(signal => {
  process.on(signal, () => {
    console.log(`\n${signal} signal received. Shutting down gracefully...`);
    server.close(() => {
      console.log('HTTP server closed.');
      process.exit(0);
    });
    
    // Force close if it takes too long
    setTimeout(() => {
      console.error('Could not close connections in time, forcefully shutting down.');
      process.exit(1);
    }, 10000);
  });
});
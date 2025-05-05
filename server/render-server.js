// Enhanced production server for Render deployment
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import helmet from 'helmet';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// Enhanced logging middleware with timestamps and colorized output
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method.padEnd(7);
  const url = req.url;
  
  console.log(`\x1b[90m${timestamp}\x1b[0m \x1b[36m${method}\x1b[0m \x1b[33m${url}\x1b[0m`);
  
  // Response time logging
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const statusColor = status >= 500 ? '\x1b[31m' : status >= 400 ? '\x1b[33m' : status >= 300 ? '\x1b[36m' : '\x1b[32m';
    console.log(`\x1b[90m${timestamp}\x1b[0m \x1b[36m${method}\x1b[0m \x1b[33m${url}\x1b[0m ${statusColor}${status}\x1b[0m \x1b[90m${duration}ms\x1b[0m`);
  });
  
  next();
});

// Security headers with Helmet - Configured for a React SPA
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        imgSrc: ["'self'", "data:", "https://*.softworkstrading.com", "https://images.unsplash.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        connectSrc: ["'self'", "https://*.softworkstrading.com"],
      },
    },
    // Other security settings
    xssFilter: true,
    noSniff: true,
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  })
);

// Detect and print build environment
const nodeEnv = process.env.NODE_ENV || 'development';
console.log(`Starting server in ${nodeEnv} environment`);
console.log(`Process running as user: ${require('os').userInfo().username}`);
console.log(`Current working directory: ${process.cwd()}`);
console.log(`Server directory: ${__dirname}`);

// Comprehensive check for static files with detailed logging
const staticPaths = [
  { path: path.resolve(__dirname, '../dist/public'), priority: 1 },
  { path: path.resolve(__dirname, '../dist'), priority: 2 },
  { path: path.resolve(__dirname, '../public'), priority: 3 },
  { path: path.resolve(__dirname, '..'), priority: 4 },
];

console.log('Searching for static files in the following paths:');
staticPaths.forEach(({ path: p, priority }) => {
  const exists = fs.existsSync(p);
  console.log(`  [Priority ${priority}] ${p} - ${exists ? '\x1b[32mExists\x1b[0m' : '\x1b[31mNot Found\x1b[0m'}`);
  if (exists) {
    try {
      const files = fs.readdirSync(p);
      if (files.includes('index.html')) {
        console.log(`    \x1b[32mFound index.html\x1b[0m in this directory`);
      }
      console.log(`    Contains ${files.length} files: ${files.slice(0, 5).join(', ')}${files.length > 5 ? '...' : ''}`);
    } catch (err) {
      console.error(`    Error reading directory: ${err.message}`);
    }
  }
});

// Serve static files from all existing paths, in priority order
let staticPathFound = false;
staticPaths.sort((a, b) => a.priority - b.priority).forEach(({ path: p }) => {
  if (fs.existsSync(p)) {
    if (!staticPathFound) {
      console.log(`\x1b[32mPrimary static path: ${p}\x1b[0m`);
      staticPathFound = true;
    } else {
      console.log(`Additional static path: ${p}`);
    }
    app.use(express.static(p, { maxAge: '1d' })); // Add cache control
  }
});

if (!staticPathFound) {
  console.error('\x1b[31mWARNING: No static file paths found!\x1b[0m');
}

// SPA routing - serve index.html for all routes with robust fallbacks
app.get('*', (req, res) => {
  // Skip API routes if they existed
  if (req.url.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  
  // Attempt to find index.html in all possible locations
  for (const { path: p } of staticPaths) {
    const indexPath = path.join(p, 'index.html');
    if (fs.existsSync(indexPath)) {
      console.log(`Serving SPA from: ${indexPath}`);
      return res.sendFile(indexPath);
    }
  }
  
  // Comprehensive 404 page if no index.html is found
  console.error('\x1b[31mERROR: Could not find index.html in any location\x1b[0m');
  res.status(404).send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <title>Application Not Found</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.5; padding: 2rem; max-width: 800px; margin: 0 auto; color: #333; }
          pre { background: #f5f5f5; padding: 1rem; border-radius: 4px; overflow-x: auto; }
          .error { color: #e53e3e; }
          .info { color: #4299e1; }
        </style>
      </head>
      <body>
        <h1 class="error">Application Frontend Not Found</h1>
        <p>The server is running correctly, but could not locate the frontend files.</p>
        <hr>
        <h2 class="info">Server Information</h2>
        <pre>
Server Time: ${new Date().toISOString()}
Node Environment: ${process.env.NODE_ENV || 'Not set'}
Port: ${PORT}
Current Working Directory: ${process.cwd()}
Server Directory: ${__dirname}
        </pre>
        <hr>
        <h2 class="info">Searched Locations</h2>
        <pre>
${staticPaths.map(({ path: p }) => `${p}/index.html - ${fs.existsSync(path.join(p, 'index.html')) ? 'Exists' : 'Not Found'}`).join('\n')}
        </pre>
        <hr>
        <p>If you are the application owner, please check your build configuration and deployment logs.</p>
      </body>
    </html>
  `);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('\x1b[31mServer Error:\x1b[0m', err);
  res.status(500).send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <title>Server Error</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.5; padding: 2rem; max-width: 800px; margin: 0 auto; color: #333; }
          .error { color: #e53e3e; }
        </style>
      </head>
      <body>
        <h1 class="error">Server Error</h1>
        <p>The server encountered an unexpected condition that prevented it from fulfilling the request.</p>
        <p>Please try again later or contact the site administrator if the problem persists.</p>
      </body>
    </html>
  `);
});

// Start server with improved error handling
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`\x1b[32m✓ Server started successfully\x1b[0m`);
  console.log(`\x1b[32m✓ Listening on port ${PORT}\x1b[0m`);
  
  // Print out some useful information for debugging
  console.log('\nEnvironment Variables:');
  Object.entries(process.env)
    .filter(([key]) => ['NODE_ENV', 'PORT', 'HOST'].includes(key))
    .forEach(([key, value]) => {
      console.log(`  ${key}: ${value}`);
    });
});

// Handle server shutdown gracefully
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
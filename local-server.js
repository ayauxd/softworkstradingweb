// Super simple static file server with minimal dependencies
import { createServer } from 'http';
import { readFile, stat } from 'fs/promises';
import { extname, join, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const PORT = 5002;
const PUBLIC_DIR = join(__dirname, 'dist', 'public');

// MIME types for common file extensions
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp'
};

// Create HTTP server
const server = createServer(async (req, res) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  
  try {
    // Get the file path from the URL
    let filePath = join(PUBLIC_DIR, req.url === '/' ? 'index.html' : req.url);
    
    // Check if the file exists
    try {
      const stats = await stat(filePath);
      if (stats.isDirectory()) {
        filePath = join(filePath, 'index.html');
      }
    } catch (err) {
      // For SPA routing, serve index.html for 404s that aren't files or API requests
      if (!req.url.includes('.') && !req.url.startsWith('/api')) {
        filePath = join(PUBLIC_DIR, 'index.html');
        console.log(`  SPA route detected, serving index.html instead for: ${req.url}`);
      }
    }

    // Read the file
    const data = await readFile(filePath);
    
    // Set content type based on file extension
    const ext = extname(filePath);
    res.setHeader('Content-Type', MIME_TYPES[ext] || 'application/octet-stream');
    
    // Send the file
    res.statusCode = 200;
    res.end(data);
    
  } catch (err) {
    // If file not found, return 404
    console.error(`  Error: ${err.message} for ${req.url}`);
    res.statusCode = 404;
    res.end('File not found');
  }
});

// Start server
server.listen(PORT, () => {
  console.log(`
==================================================
  SIMPLE DEV SERVER - http://localhost:${PORT}
==================================================

Serving files from: ${PUBLIC_DIR}
Time: ${new Date().toISOString()}
Press Ctrl+C to stop the server
`);
});
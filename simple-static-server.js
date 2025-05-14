import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, 'dist', 'public');
const PORT = 9000;

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
  '.woff': 'application/font-woff',
  '.ttf': 'application/font-ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'application/font-otf',
  '.wasm': 'application/wasm'
};

const server = http.createServer((request, response) => {
  console.log(`Request: ${request.method} ${request.url}`);
  
  // Check if the URL has a file extension, if not, serve index.html
  let filePath = path.join(publicDir, request.url === '/' ? 'index.html' : request.url);
  
  // Handle directory URLs
  if (!path.extname(filePath)) {
    filePath = path.join(filePath, 'index.html');
  }
  
  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = mimeTypes[extname] || 'application/octet-stream';
  
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        console.log(`File not found: ${filePath}`);
        // File not found, try serving index.html for SPA routing
        fs.readFile(path.join(publicDir, 'index.html'), (err, content) => {
          if (err) {
            response.writeHead(404);
            response.end('404 Not Found');
            return;
          }
          
          response.writeHead(200, { 'Content-Type': 'text/html' });
          response.end(content, 'utf-8');
        });
      } else {
        // Server error
        console.error(`Server error: ${error.code}`);
        response.writeHead(500);
        response.end(`Server Error: ${error.code}`);
      }
    } else {
      // Success
      response.writeHead(200, { 'Content-Type': contentType });
      response.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(`Serving files from: ${publicDir}`);
});
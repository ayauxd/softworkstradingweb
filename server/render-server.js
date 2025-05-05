// Simple production server for Render deployment
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} [${req.method}] ${req.url}`);
  next();
});

// Serve static files
const staticPath = path.resolve(__dirname, '../dist/public');
console.log(`Checking static path: ${staticPath} (exists: ${fs.existsSync(staticPath)})`);

// If static path exists, serve from there
if (fs.existsSync(staticPath)) {
  console.log(`Serving static files from: ${staticPath}`);
  app.use(express.static(staticPath));
} else {
  console.log(`WARNING: Static path ${staticPath} not found!`);
  
  // Try alternate paths
  const altPaths = [
    path.resolve(__dirname, '../public'),
    path.resolve(__dirname, '../dist'),
    path.resolve(__dirname, '..')
  ];
  
  let foundPath = false;
  for (const altPath of altPaths) {
    if (fs.existsSync(altPath)) {
      console.log(`Using alternate static path: ${altPath}`);
      app.use(express.static(altPath));
      foundPath = true;
      break;
    }
  }
  
  if (!foundPath) {
    console.log('WARNING: No static files found!');
  }
}

// SPA routing - serve index.html for all routes
app.get('*', (req, res) => {
  // List of paths to check for index.html
  const possiblePaths = [
    path.resolve(staticPath, 'index.html'),
    path.resolve(__dirname, '../dist/public/index.html'),
    path.resolve(__dirname, '../public/index.html'),
    path.resolve(__dirname, '../dist/index.html')
  ];
  
  for (const indexPath of possiblePaths) {
    if (fs.existsSync(indexPath)) {
      console.log(`Serving index.html from: ${indexPath}`);
      return res.sendFile(indexPath);
    }
  }
  
  // If no index.html is found
  res.status(404).send(`
    <html>
      <head><title>App Not Found</title></head>
      <body>
        <h1>Application frontend not found</h1>
        <p>The server is running but couldn't find the frontend files.</p>
        <p>Current directory: ${__dirname}</p>
        <p>PORT: ${PORT}</p>
        <p>NODE_ENV: ${process.env.NODE_ENV}</p>
      </body>
    </html>
  `);
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Working directory: ${process.cwd()}`);
  
  // List files in current directory
  try {
    const files = fs.readdirSync('.');
    console.log(`Files in current directory: ${files.join(', ')}`);
  } catch (err) {
    console.error(`Error listing files: ${err.message}`);
  }
});
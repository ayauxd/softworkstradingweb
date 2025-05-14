// Simple static file server for development testing
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 9000;

// Serve all static files from the dist/public directory
app.use(express.static(path.join(__dirname, 'dist', 'public')));

// SPA fallback - serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`=== SIMPLE TEST SERVER ===`);
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Press Ctrl+C to stop`);
});
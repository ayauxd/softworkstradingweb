// Direct server for client files
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;

// Serve all static files from the client/public directory
app.use(express.static(path.join(__dirname, 'client', 'public')));
app.use(express.static(path.join(__dirname, 'client')));

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`=== CLIENT FILES SERVER ===`);
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Press Ctrl+C to stop`);
});
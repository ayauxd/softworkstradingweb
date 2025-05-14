import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5173;

// Serve static files from the client directory
app.use(express.static(path.join(__dirname, 'client')));

// For all other routes, serve the index.html file (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Development test server running on http://localhost:${PORT}`);
});
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create server
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(__dirname));

// Base route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'basic-chat.html'));
});

// Chat API
app.post('/api/basic-chat', (req, res) => {
  console.log('Received message:', req.body);
  
  // Always respond with a fixed message for testing
  res.json({
    text: "This is a fixed response to show the API is working! I've received your message and can respond properly."
  });
});

// Start server
const PORT = 5003; // Using a different port to avoid conflicts
app.listen(PORT, () => {
  console.log(`Basic server is running at http://localhost:${PORT}`);
});
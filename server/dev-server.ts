import express from 'express';
import { setupVite, log } from './vite';
import { serverConfig } from './config';

// Create a simplified express server for testing
const app = express();
app.use(express.json());

// Basic test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Setup for development
(async () => {
  const server = app.listen({
    port: serverConfig.port,
    host: 'localhost', // Force localhost binding
  }, () => {
    log(`Test server running on http://localhost:${serverConfig.port}`);
  });

  // Setup Vite middleware for development
  if (serverConfig.isDevelopment) {
    await setupVite(app, server);
  }
})();
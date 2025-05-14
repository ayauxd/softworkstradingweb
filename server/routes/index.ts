import { Express } from 'express';
import { createServer, Server } from 'http';
import apiRoutes from './api';

/**
 * Register all application routes
 */
export async function registerRoutes(app: Express): Promise<Server> {
  // API routes with /api prefix
  app.use('/api', apiRoutes);
  
  // Create and return HTTP server instance
  const httpServer = createServer(app);
  return httpServer;
}
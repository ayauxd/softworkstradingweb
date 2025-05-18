import { Express } from 'express';
import { createServer, Server } from 'http';
import apiRoutes from './api';
import aiRoutes from './ai';
import csrfRoutes from './csrf';
import debugRoutes from './debug';

/**
 * Register all application routes
 */
export async function registerRoutes(app: Express): Promise<Server> {
  console.log('\n============= ROUTES REGISTRATION =============');
  
  // API routes with /api prefix
  app.use('/api', apiRoutes);
  console.log('✅ API routes registered under /api');
  
  // AI routes with /api/ai prefix
  app.use('/api/ai', aiRoutes);
  console.log('✅ AI routes registered under /api/ai');
  
  // CSRF routes directly under /api
  app.use('/api', csrfRoutes);
  console.log('✅ CSRF routes registered under /api');
  
  // Debug routes under /api/debug
  app.use('/api/debug', debugRoutes);
  console.log('✅ Debug routes registered under /api/debug');
  
  console.log('============================================\n');
  
  // Create and return HTTP server instance
  const httpServer = createServer(app);
  return httpServer;
}
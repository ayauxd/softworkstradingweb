import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });
  
  // Debug endpoint - helps identify if the server is running correctly
  app.get('/api/debug', (req, res) => {
    res.json({
      status: 'ok',
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
      nodeVersion: process.version,
      cwd: process.cwd(),
      files: {
        distExists: require('fs').existsSync(`${process.cwd()}/dist`),
        publicExists: require('fs').existsSync(`${process.cwd()}/public`),
        distPublicExists: require('fs').existsSync(`${process.cwd()}/dist/public`),
      }
    });
  });

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  const httpServer = createServer(app);

  return httpServer;
}

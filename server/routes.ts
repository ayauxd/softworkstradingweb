import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { csrfProtection } from "./middleware/csrf";

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

  // Protected API routes (require CSRF token)
  // Any POST, PUT, DELETE methods will be protected
  
  // Example protected contact form endpoint
  app.post('/api/contact', csrfProtection, (req, res) => {
    // Process contact form submission
    // In a real implementation, this would validate inputs
    // and store the message or send an email
    
    res.json({
      success: true,
      message: 'Contact form submission received',
      timestamp: new Date().toISOString()
    });
  });
  
  // Example protected newsletter subscription endpoint
  app.post('/api/subscribe', csrfProtection, (req, res) => {
    // Process newsletter subscription
    // In a real implementation, this would validate the email
    // and add it to a mailing list
    
    res.json({
      success: true,
      message: 'Subscription successful',
      timestamp: new Date().toISOString()
    });
  });

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  const httpServer = createServer(app);

  return httpServer;
}

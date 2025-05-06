import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { csrfProtection } from "./middleware/csrf";
import { validateAndSanitize } from "./middleware/validation";
import { contactFormSchema, subscriptionSchema } from "./schemas/api";

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
  
  // Contact form endpoint with validation and CSRF protection
  app.post('/api/contact', 
    csrfProtection,
    ...validateAndSanitize(contactFormSchema),
    (req, res) => {
      // At this point, req.body has been validated and sanitized
      const { fullName, email, company, phone, message } = req.body;
      
      // In a real implementation, this would store the message
      // or send an email to the contact address
      
      // Example of how we might log or store the contact form submission
      console.log(`Contact form submission from ${fullName} (${email})`);
      
      // Here we would trigger an email or save to database
      // For now, we just simulate a successful submission
      
      res.json({
        success: true,
        message: 'Contact form submission received',
        timestamp: new Date().toISOString(),
        data: {
          id: Math.random().toString(36).substring(2, 15),
          receivedAt: new Date().toISOString()
        }
      });
    }
  );
  
  // Newsletter subscription endpoint with validation and CSRF protection
  app.post('/api/subscribe', 
    csrfProtection,
    ...validateAndSanitize(subscriptionSchema),
    (req, res) => {
      // At this point, req.body has been validated and sanitized
      const { email, name, interests, marketingConsent } = req.body;
      
      // In a real implementation, this would add the email to a mailing list
      // For now, we just simulate a successful subscription
      
      console.log(`Newsletter subscription from ${email}`);
      
      res.json({
        success: true,
        message: 'Subscription successful',
        timestamp: new Date().toISOString(),
        data: {
          subscriptionId: Math.random().toString(36).substring(2, 15),
          subscribedAt: new Date().toISOString()
        }
      });
    }
  );

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  const httpServer = createServer(app);

  return httpServer;
}

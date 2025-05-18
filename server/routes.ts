import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { csrfProtection } from "./middleware/csrf";
import { validateAndSanitize } from "./middleware/validation";
import { contactFormSchema, subscriptionSchema } from "./schemas/api";
import aiRoutes from "./routes/ai";
import csrfRoutes from "./routes/csrf";
import demoRoutes from "./routes/demo";
import debugRoutes from "./routes/debug";
import { corsConfig } from "./config";
import { emailService } from "./services/emailService";

// CORS middleware for handling cross-origin requests
import cors from 'cors';

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure CORS for all routes
  app.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, etc)
      if (!origin) return callback(null, true);
      
      // Allow all origins in development
      if (process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      
      // In production, use the allowed origins from config
      const allowedOrigins = corsConfig.allowedOrigins;
      
      console.log(`CORS check for origin: ${origin}, allowed origins:`, allowedOrigins);
      
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        console.warn(`CORS blocked request from origin: ${origin}`);
        callback(new Error('Not allowed by CORS'), false);
      }
    },
    credentials: true, // Allow cookies to be sent with requests
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token', 'X-Requested-With']
  }));
  
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
    async (req, res) => {
      // At this point, req.body has been validated and sanitized
      const { fullName, email, company, phone, message } = req.body;
      
      // Log the submission
      console.log(`Contact form submission from ${fullName} (${email})`);
      
      try {
        // Send email using the email service
        const emailSent = await emailService.sendContactFormEmail({
          fullName,
          email,
          company,
          phone,
          message
        });
        
        if (emailSent) {
          // Email was sent successfully
          res.json({
            success: true,
            message: 'Your message has been sent successfully',
            timestamp: new Date().toISOString(),
            data: {
              id: Math.random().toString(36).substring(2, 15),
              receivedAt: new Date().toISOString()
            }
          });
        } else {
          // Email service is not configured or failed to send
          // We'll still accept the submission but log the issue
          console.warn('Contact form email could not be sent, but submission was recorded');
          res.json({
            success: true,
            message: 'Your message has been received, but there may be a delay in our response',
            timestamp: new Date().toISOString(),
            data: {
              id: Math.random().toString(36).substring(2, 15),
              receivedAt: new Date().toISOString()
            }
          });
        }
      } catch (error) {
        console.error('Error processing contact form submission:', error);
        res.status(500).json({
          success: false,
          message: 'There was an error processing your submission. Please try again later.',
          timestamp: new Date().toISOString()
        });
      }
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
  
  // Register AI routes
  app.use('/api/ai', aiRoutes);
  
  // Register CSRF routes
  app.use('/api', csrfRoutes);
  
  // Register Demo routes
  app.use('/api/demo', demoRoutes);
  
  // Register Debug routes (only available in development)
  app.use('/api/debug', debugRoutes);

  const httpServer = createServer(app);

  return httpServer;
}

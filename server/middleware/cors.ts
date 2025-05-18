import cors from 'cors';
import { Express } from 'express';

/**
 * Configure CORS middleware for the application
 * This allows the frontend at www.softworkstrading.com to access the API
 */
export const configureCORS = (app: Express) => {
  // Get allowed origins from environment or set defaults
  const allowedOrigins = [
    // Production website domains
    'https://www.softworkstrading.com',
    'https://softworkstrading.com',
    // Allow the Render domain itself for same-origin requests
    'https://softworks-trading.onrender.com',
    // Development domains
    'http://localhost:3000',
    'http://localhost:5000',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5000',
    'http://127.0.0.1:5173'
  ];

  // Configure CORS with credentials support
  app.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl requests, etc)
      if (!origin) {
        return callback(null, true);
      }

      // Check if the origin is allowed
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // For development, allow all origins if NODE_ENV is development
      if (process.env.NODE_ENV === 'development') {
        return callback(null, true);
      }

      // Otherwise, deny the request
      callback(new Error(`CORS policy violation: ${origin} is not allowed`));
    },
    credentials: true, // Allow cookies and authentication headers
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type', 
      'Authorization', 
      'X-CSRF-Token',
      'X-Requested-With'
    ],
    exposedHeaders: ['X-CSRF-Token']
  }));

  // Add OPTIONS preflight handler
  app.options('*', cors());

  // Log CORS configuration
  console.log(`CORS configured with ${allowedOrigins.length} allowed origins`);
  
  // Handle CORS errors
  app.use((err: Error, req: any, res: any, next: any) => {
    if (err.message.includes('CORS policy violation')) {
      console.error(`CORS Error: ${err.message}`);
      return res.status(403).json({
        error: 'CORS policy violation',
        message: 'This origin is not allowed to access the API'
      });
    }
    next(err);
  });
};
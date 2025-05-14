import { z } from 'zod';
import { log } from './vite';

// Environment validation schema
const envSchema = z.object({
  // Required environment variables
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // Optional environment variables with defaults
  PORT: z.string().transform(Number).default(process.env.PORT || '5000'),
  HOST: z.string().default('0.0.0.0'), // Use 0.0.0.0 to listen on all interfaces
  
  // Database config - optional in development for in-memory mode
  DATABASE_URL: z.string().url().optional(),
  
  // Auth config
  SESSION_SECRET: z.string().min(32).default('very-long-secret-key-for-development-only'),
  
  // API config
  API_TIMEOUT: z.string().transform(Number).default('30000'),
  
  // Frontend config
  CLIENT_URL: z.string().url().default('http://localhost:3000'),
  
  // AI Service API Keys - optional in development for mock responses
  OPENAI_API_KEY: z.string().optional(),
  ELEVENLABS_API_KEY: z.string().optional(),
  ELEVENLABS_DEFAULT_VOICE_ID: z.string().optional(),
});

// Local defaults for development to avoid exposing in .env files
const defaultDevValues: Record<string, string> = {
  SESSION_SECRET: 'very-long-secret-key-that-should-be-changed-in-production',
};

// Load development defaults if needed
const processEnv: Record<string, string | undefined> = { ...process.env };
if (process.env.NODE_ENV !== 'production') {
  Object.entries(defaultDevValues).forEach(([key, value]) => {
    if (!processEnv[key]) {
      processEnv[key] = value;
    }
  });
}

// Parse and validate environment variables
export const config = (() => {
  try {
    return envSchema.parse(processEnv);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors
        .filter(e => e.code === 'invalid_type' && e.received === 'undefined')
        .map(e => e.path.join('.'));
      
      const invalidVars = error.errors
        .filter(e => e.code !== 'invalid_type' || e.received !== 'undefined')
        .map(e => `${e.path.join('.')}: ${e.message}`);
      
      if (missingVars.length > 0) {
        console.error(`❌ Missing required environment variables: ${missingVars.join(', ')}`);
      }
      
      if (invalidVars.length > 0) {
        console.error(`❌ Invalid environment variables:\n${invalidVars.join('\n')}`);
      }
    } else {
      console.error('❌ Error parsing environment variables:', error);
    }
    
    log('Server startup failed due to missing or invalid environment variables');
    process.exit(1);
  }
})();

// Export individual configs for different parts of the application
export const serverConfig = {
  port: config.PORT,
  host: config.HOST,
  nodeEnv: config.NODE_ENV,
  isDevelopment: config.NODE_ENV === 'development',
  isProduction: config.NODE_ENV === 'production',
  isTest: config.NODE_ENV === 'test',
};

export const authConfig = {
  sessionSecret: config.SESSION_SECRET,
};

export const databaseConfig = {
  url: config.DATABASE_URL,
  // Add any other database-specific config
};

export const apiConfig = {
  timeout: config.API_TIMEOUT,
};

export const corsConfig = {
  clientUrl: config.CLIENT_URL,
  // Add any other cors origins if needed
  allowedOrigins: [
    config.CLIENT_URL,
    'https://softworks-trading.onrender.com',
    'https://www.softworkstrading.com',
    'https://softworkstrading.com',
    'http://localhost:3000',
    'http://localhost:5000'
  ],
};

// AI service configuration
export const aiConfig = {
  openai: {
    apiKey: config.OPENAI_API_KEY,
    isConfigured: !!config.OPENAI_API_KEY,
  },
  elevenlabs: {
    apiKey: config.ELEVENLABS_API_KEY,
    defaultVoiceId: config.ELEVENLABS_DEFAULT_VOICE_ID,
    isConfigured: !!config.ELEVENLABS_API_KEY,
  }
};
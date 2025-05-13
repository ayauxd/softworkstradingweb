import { z } from 'zod';

/**
 * Contact form submission schema
 */
export const contactFormSchema = z.object({
  fullName: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .transform(val => val.trim()),
    
  company: z.string()
    .max(100, 'Company name must be less than 100 characters')
    .optional()
    .transform(val => val?.trim() || undefined),
    
  email: z.string()
    .email('Please enter a valid email address')
    .min(5, 'Email must be at least 5 characters')
    .max(100, 'Email must be less than 100 characters')
    .transform(val => val.toLowerCase().trim()),
    
  phone: z.string()
    .max(20, 'Phone number must be less than 20 characters')
    .optional()
    .transform(val => {
      // Remove all non-numeric characters except +
      if (val) {
        return val.replace(/[^\d+]/g, '');
      }
      return undefined;
    }),
    
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be less than 1000 characters')
    .transform(val => val.trim()),
});

/**
 * Newsletter subscription schema
 */
export const subscriptionSchema = z.object({
  email: z.string()
    .email('Please enter a valid email address')
    .min(5, 'Email must be at least 5 characters')
    .max(100, 'Email must be less than 100 characters')
    .transform(val => val.toLowerCase().trim()),
    
  name: z.string()
    .max(100, 'Name must be less than 100 characters')
    .optional()
    .transform(val => val?.trim() || undefined),
    
  interests: z.array(z.string())
    .optional(),
    
  marketingConsent: z.boolean()
    .default(false),
});

/**
 * User account schema (for future use)
 */
export const userAccountSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be less than 30 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
    .transform(val => val.toLowerCase().trim()),
    
  email: z.string()
    .email('Please enter a valid email address')
    .transform(val => val.toLowerCase().trim()),
    
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must be less than 100 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    
  firstName: z.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .optional()
    .transform(val => val?.trim() || undefined),
    
  lastName: z.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .optional()
    .transform(val => val?.trim() || undefined),
});

/**
 * Chat message request schema
 */
export const chatMessageSchema = z.object({
  message: z.string()
    .min(1, 'Message cannot be empty')
    .max(4000, 'Message must be less than 4000 characters')
    .transform(val => val.trim()),
    
  conversationId: z.string()
    .optional()
    .transform(val => val?.trim() || undefined),
});

/**
 * Voice generation request schema
 */
export const voiceGenerationSchema = z.object({
  text: z.string()
    .min(1, 'Text cannot be empty')
    .max(4000, 'Text must be less than 4000 characters')
    .transform(val => val.trim()),
    
  voiceId: z.string()
    .optional()
    .transform(val => val?.trim() || undefined),
});

/**
 * Call summary schema
 */
export const callSummarySchema = z.object({
  summary: z.string()
    .min(1, 'Summary cannot be empty')
    .max(10000, 'Summary must be less than 10000 characters')
    .transform(val => val.trim()),
    
  userEmail: z.string()
    .email('Please enter a valid email address')
    .optional()
    .transform(val => val?.toLowerCase().trim() || undefined),
    
  timestamp: z.string()
    .optional()
    .transform(val => val?.trim() || new Date().toISOString()),
});
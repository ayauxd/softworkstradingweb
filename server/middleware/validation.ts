import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';

/**
 * Creates a middleware that validates request data against a Zod schema
 * @param schema The Zod schema to validate against
 * @param source Where to find the data to validate ('body', 'query', 'params')
 * @returns Express middleware function
 */
export const validate = (schema: z.ZodTypeAny, source: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Get the data from the specified source
      const data = req[source];
      
      // Parse and validate the data
      const validatedData = schema.parse(data);
      
      // Replace the request data with the validated data
      req[source] = validatedData;
      
      next();
    } catch (error) {
      // Convert Zod error to a more user-friendly format
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        
        // Return a 400 Bad Request with detailed validation errors
        return res.status(400).json({
          status: 'error',
          message: 'Validation error',
          errors: validationError.details.map(detail => ({
            path: detail.path,
            message: detail.message
          }))
        });
      }
      
      // For unexpected errors, pass to the next error handler
      next(error);
    }
  };
};

/**
 * Creates a middleware that sanitizes request data 
 * @param sanitizer Function that sanitizes the input data
 * @param source Where to find the data to sanitize ('body', 'query', 'params')
 * @returns Express middleware function
 */
export const sanitize = (
  sanitizer: (data: any) => any,
  source: 'body' | 'query' | 'params' = 'body'
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Get the data from the specified source
    const data = req[source];
    
    if (data) {
      // Sanitize the data
      req[source] = sanitizer(data);
    }
    
    next();
  };
};

/**
 * Default sanitizer that removes HTML tags and trims strings
 * @param data The data to sanitize
 * @returns Sanitized data
 */
export const defaultSanitizer = (data: any): any => {
  if (typeof data === 'string') {
    // Remove HTML tags and trim
    return data.replace(/<[^>]*>/g, '').trim();
  }
  
  if (data === null || data === undefined) {
    return data;
  }
  
  if (typeof data === 'object') {
    if (Array.isArray(data)) {
      // Recursively sanitize array items
      return data.map(item => defaultSanitizer(item));
    }
    
    // Recursively sanitize object properties
    const sanitized: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      sanitized[key] = defaultSanitizer(value);
    }
    return sanitized;
  }
  
  // Return primitive values as is
  return data;
};

/**
 * Combined validation and sanitization middleware
 * @param schema The Zod schema to validate against
 * @param source Where to find the data ('body', 'query', 'params')
 * @returns Express middleware function
 */
export const validateAndSanitize = (
  schema: z.ZodTypeAny,
  source: 'body' | 'query' | 'params' = 'body'
) => {
  return [
    sanitize(defaultSanitizer, source),
    validate(schema, source)
  ];
};
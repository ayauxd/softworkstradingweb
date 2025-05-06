# Input Validation Implementation Guide

This document outlines the input validation and sanitization approach used in the SoftworksTradingWeb application.

## Overview

Input validation is a critical security measure that ensures data received by the application meets expected criteria. The application uses Zod, a TypeScript-first schema validation library, in combination with custom middleware to validate and sanitize all incoming request data.

## Implementation

### Server-Side Validation

The core validation functionality is implemented in `/server/middleware/validation.ts` and consists of:

#### 1. Validation Middleware

The `validate` middleware validates request data against a Zod schema:

```typescript
export const validate = (schema: z.ZodTypeAny, source: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req[source];
      const validatedData = schema.parse(data);
      req[source] = validatedData;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({
          status: 'error',
          message: 'Validation error',
          errors: validationError.details.map(detail => ({
            path: detail.path,
            message: detail.message
          }))
        });
      }
      next(error);
    }
  };
};
```

#### 2. Sanitization Middleware

The `sanitize` middleware applies a sanitization function to the request data:

```typescript
export const sanitize = (
  sanitizer: (data: any) => any,
  source: 'body' | 'query' | 'params' = 'body'
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const data = req[source];
    if (data) {
      req[source] = sanitizer(data);
    }
    next();
  };
};
```

#### 3. Combined Validation and Sanitization

For convenience, the `validateAndSanitize` function combines both operations:

```typescript
export const validateAndSanitize = (
  schema: z.ZodTypeAny,
  source: 'body' | 'query' | 'params' = 'body'
) => {
  return [
    sanitize(defaultSanitizer, source),
    validate(schema, source)
  ];
};
```

### Validation Schemas

Schemas for all API endpoints are defined in `/server/schemas/api.ts`:

#### Contact Form Schema

```typescript
export const contactFormSchema = z.object({
  fullName: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .transform(val => val.trim()),
    
  email: z.string()
    .email('Please enter a valid email address')
    .transform(val => val.toLowerCase().trim()),
    
  // ... other fields
});
```

### Integration with Routes

Validation middleware is applied to routes in `/server/routes.ts`:

```typescript
app.post('/api/contact', 
  csrfProtection,
  ...validateAndSanitize(contactFormSchema),
  (req, res) => {
    // At this point, req.body has been validated and sanitized
    const { fullName, email, company, phone, message } = req.body;
    
    // Process the validated data...
  }
);
```

### Client-Side Integration

The client components are designed to handle validation errors from the server:

```typescript
// Send form data to the server
const response = await fetch('/api/contact', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    ...csrfHeaders
  },
  body: JSON.stringify(formData)
});

const responseData = await response.json();

if (!response.ok) {
  // Handle validation errors from server
  if (response.status === 400 && responseData.errors) {
    const serverErrors: Record<string, string> = {};
    
    // Map server validation errors to form fields
    responseData.errors.forEach((error: any) => {
      const fieldName = error.path.split('.').pop();
      if (fieldName && Object.keys(formData).includes(fieldName)) {
        serverErrors[fieldName] = error.message;
      }
    });
    
    // Set form errors to display to the user
    if (Object.keys(serverErrors).length > 0) {
      setFormErrors(serverErrors);
      throw new Error('Validation failed');
    }
  }
}
```

## Security Benefits

This validation approach provides several security benefits:

1. **Type Safety**: Zod ensures that data matches expected types
2. **Data Sanitization**: Removes potentially harmful HTML and scripts
3. **Business Rule Enforcement**: Validates data against business rules (e.g., minimum length)
4. **Transformation**: Normalizes data (e.g., trimming whitespace, converting to lowercase)
5. **Consistent Error Handling**: Provides uniform error responses for invalid inputs

## Testing Validation

The validation implementation includes comprehensive tests in `/tests/unit/server/validation.test.ts`.

## Future Improvements

1. Add request rate limiting to prevent abuse
2. Implement more sophisticated input sanitization for specific content types
3. Add content validation for file uploads (when implemented)
4. Create a shared validation library for both client and server
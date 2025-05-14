# Server Architecture Improvement Plan

This document outlines a recommended structure for enhancing the server architecture following best practices.

## Current Structure

The current server uses a flat structure with minimal file organization:

```
/server
  ├── config.ts             # Configuration management
  ├── index.ts              # Main server setup
  ├── routes.ts             # Route definitions
  ├── storage.ts            # Data storage utilities
  └── vite.ts               # Vite development server setup
```

## Recommended Structure

```
/server
  ├── controllers/          # Request handlers
  │   └── apiController.ts  # API endpoint controller methods
  │
  ├── middleware/           # Express middleware
  │   ├── errorHandler.ts   # Global error handling
  │   ├── logger.ts         # Request logging
  │   └── security.ts       # Security configuration
  │
  ├── routes/               # API routes
  │   ├── api.ts            # API routes
  │   └── index.ts          # Route registration
  │
  ├── services/             # Business logic
  │   └── apiService.ts     # Service for API operations
  │
  ├── utils/                # Utility functions
  │   ├── logger.ts         # Logging functions
  │   └── sanitize.ts       # Data sanitization utilities
  │
  ├── config.ts             # Configuration management
  ├── index.ts              # Main server entry point
  └── vite.ts               # Vite server setup
```

## Benefits of New Structure

1. **Separation of Concerns**: Each module has a clear, focused purpose
2. **Maintainability**: Easier to find and update specific functionality
3. **Testability**: Components are more isolated, making them easier to test
4. **Scalability**: New features can be added with minimal changes to existing code

## Environment Variables

The server relies on these environment variables:

```
# Server Configuration
NODE_ENV=production    # production, development, or test
PORT=5000              # Server port
HOST=0.0.0.0           # Server host for binding
API_TIMEOUT=30000      # API timeout in milliseconds

# Security Configuration
SESSION_SECRET=secret  # Secret for session management (must be long)
CSRF_SECRET=secret     # Secret for CSRF token generation
CLIENT_URL=https://... # Client URL for CORS configuration

# AI Service API Keys
OPENAI_API_KEY=sk-...  # OpenAI API key
ELEVENLABS_API_KEY=... # ElevenLabs API key
ELEVENLABS_DEFAULT_VOICE_ID=... # ElevenLabs voice ID
GEMINI_API_KEY=...     # Google Gemini API key
```

The server includes fallbacks for development environments when API keys are not available.

## Implementation Steps

1. Create directory structure
2. Refactor route handling into controllers
3. Extract middleware into separate files
4. Create service layer for business logic
5. Centralize utility functions

## Security Enhancements

The security middleware should be updated with these improvements:

1. Remove or restrict `unsafe-inline` and `unsafe-eval` in CSP
2. Add proper nonce generation for inline scripts if needed
3. Set object-src to 'none' instead of 'self'
4. Add missing directives: worker-src, manifest-src

## Error Handling Improvements

1. Better distinguish between operational errors and programming errors
2. Add structured logging for errors
3. Implement global error handling middleware

## Logging Enhancements

1. Use dedicated logger like winston or pino
2. Add request ID for tracing requests
3. Implement proper log levels
4. Add structured logging support
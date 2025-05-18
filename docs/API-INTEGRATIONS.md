# API Integrations

This document outlines the API integrations used in the SoftworksTradingWeb project, including configuration, CORS setup, usage patterns, and fallback strategies.

## Overview

The application integrates with three external AI services:

1. **OpenAI** - Primary service for chat completion and text-to-speech
2. **Google Gemini** - Fallback service for chat completion
3. **ElevenLabs** - Primary service for high-quality voice generation

## Configuration

All API services are configured through environment variables:

```dotenv
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# ElevenLabs Configuration
ELEVENLABS_API_KEY=your_elevenlabs_api_key
ELEVENLABS_DEFAULT_VOICE_ID=your_default_voice_id

# Google Gemini Configuration
GEMINI_API_KEY=your_gemini_api_key
```

## Success Criteria

A successful API integration meets these criteria:

1. **Primary service works** - The primary service (OpenAI for chat, ElevenLabs for voice) responds correctly
2. **Fallback mechanism activates** - If primary service fails, fallback services are used automatically
3. **Graceful failure** - If all services fail, a user-friendly error message is returned
4. **Proper typing** - All responses are strongly typed
5. **Error handling** - Error details are logged but not exposed to clients

## API Status Endpoint

The application provides a status endpoint to verify API configuration:

```
GET /api/status
```

Response example:
```json
{
  "openai": {
    "configured": true,
    "status": "available"
  },
  "elevenlabs": {
    "configured": true,
    "status": "available"
  },
  "gemini": {
    "configured": true,
    "status": "available"
  },
  "timestamp": "2025-05-14T02:30:45.123Z"
}
```

## Chat Integration

The chat integration uses this priority order:
1. Try OpenAI (GPT-3.5 Turbo)
2. If OpenAI fails, try Google Gemini
3. If both fail, return a friendly error message

### Success Response

```json
{
  "text": "This is the AI response to your message",
  "success": true,
  "provider": "openai", // or "gemini"
  "conversationId": "abc123"
}
```

### Error Response

```json
{
  "text": "Sorry, I am currently unable to process your message. Please try again later.",
  "success": false,
  "provider": "none",
  "conversationId": "abc123"
}
```

## Voice Integration

The voice integration uses this priority order:
1. Try ElevenLabs
2. If ElevenLabs fails, try OpenAI TTS
3. If both fail, return a friendly error message

### Success Response

```json
{
  "audioData": "base64_encoded_audio_data",
  "success": true,
  "provider": "elevenlabs" // or "openai"
}
```

### Error Response

```json
{
  "audioData": null,
  "success": false,
  "provider": "none"
}
```

## Testing API Integrations

You can test the API integrations with the provided test script:

```bash
npm run test:api
```

This script checks:
1. API health endpoint
2. API status endpoint
3. Chat endpoint with sample message
4. Voice generation endpoint with sample text

## Troubleshooting

If API integrations fail:

1. **Check API status endpoint** - Verify if APIs are configured properly
2. **Check environment variables** - Ensure all required API keys are set
3. **Check API key validity** - Verify API keys are valid and not expired
4. **Check server logs** - Look for detailed error messages
5. **Check rate limits** - Ensure you haven't exceeded API rate limits
6. **Check CORS configuration** - Verify CORS is properly configured for cross-origin requests

## CORS Configuration

Cross-Origin Resource Sharing (CORS) is configured to allow the frontend to communicate with the backend API.

### How CORS Works

1. The browser sends a preflight request (OPTIONS) to check if the API allows requests from the frontend domain
2. The API server responds with CORS headers that specify which origins, methods, and headers are allowed
3. If allowed, the browser then sends the actual request

### Current CORS Configuration

The server's CORS middleware (`server/middleware/cors.ts`) is configured to allow requests from these origins:

- `https://www.softworkstrading.com` (production site)
- `https://softworkstrading.com` (production without www)
- `https://softworks-trading.onrender.com` (Render backend itself)
- Local development servers (localhost:3000, localhost:5000, localhost:5173)

Additional CORS configuration:

- Credentials are allowed (cookies/authentication)
- All common HTTP methods are supported (GET, POST, PUT, DELETE, OPTIONS)
- Required headers are allowed (Content-Type, Authorization, X-CSRF-Token)

### Troubleshooting CORS Issues

If you encounter CORS errors (visible in browser console), check these common issues:

1. **Origin not in the allowed list**: Add the missing origin to the `allowedOrigins` array in `server/middleware/cors.ts`

2. **Incorrect ordering of middleware**: CORS middleware should be applied before other middleware (especially before security middleware)

3. **Missing credentials**: If your requests include cookies or authentication headers, ensure both client and server are configured for credentials:
   - Client: Set `credentials: 'include'` in fetch options
   - Server: Set `credentials: true` in CORS options

4. **Headers not allowed**: If you're sending custom headers, make sure they're listed in the `allowedHeaders` array

5. **Content Security Policy (CSP) blocking connections**: Check the `connectSrc` directive in the CSP configuration in `server/middleware/security.ts`

### Testing API Connectivity

Use the provided API connectivity testing script to diagnose CORS and API connection issues:

```bash
# Run the API connectivity test
npm run test:api-connectivity

# With custom API URL and frontend domain
API_URL=https://your-api-url.com FRONTEND_DOMAIN=https://your-frontend.com npm run test:api-connectivity
```

The test script checks:
- Basic API health
- CORS configuration for key endpoints
- CSRF token generation
- API key validation for OpenAI and ElevenLabs

## Adding New AI Services

To add a new AI service:

1. Add new environment variables in `server/config.ts`
2. Create integration functions in appropriate service files
3. Implement fallback logic in `aiService.ts`
4. Update the API status endpoint to include the new service
5. Update this documentation
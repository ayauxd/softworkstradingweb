# AI API Integrations

This document outlines the AI API integrations used in the SoftworksTradingWeb project, including configuration, usage patterns, and fallback strategies.

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

## Adding New AI Services

To add a new AI service:

1. Add new environment variables in `server/config.ts`
2. Create integration functions in appropriate service files
3. Implement fallback logic in `aiService.ts`
4. Update the API status endpoint to include the new service
5. Update this documentation
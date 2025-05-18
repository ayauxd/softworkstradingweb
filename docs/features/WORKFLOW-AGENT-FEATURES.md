# Workflow Agent Implementation Guide

This document explains how the chat and voice features work in the Softworks Trading Website, including the technical architecture, data flow, and what's needed for complete functionality.

## Architecture Overview

The Workflow Agent feature consists of two main interaction modes:

1. **Chat Interface** - Text-based interaction with an AI agent
2. **Voice Call Simulation** - Voice-based interaction that simulates a phone call

Both interfaces are powered by a unified backend system that leverages multiple AI services with an intelligent routing and fallback mechanism.

### Component Structure

The feature is organized into modular components:

```
WorkflowAgentModal (container)
├── ChatInterface
│   └── ChatMessage (individual message)
├── VoiceCallInterface
└── CallbackForm
```

This modular structure allows for:
- Better separation of concerns
- Improved performance through memoization
- Reduced risk of rendering bottlenecks
- Easier maintenance and testing

## Data Flow

### Chat Interaction Flow

1. **User Input**: User types a message and sends it
2. **Frontend Processing**:
   - Message is displayed immediately
   - Local storage is updated with the conversation
   - A loading indicator is shown
   - Request is sent to the server

3. **Backend Processing**:
   - `aiRouter.ts` receives the request
   - System selects the optimal AI provider based on:
     - API key availability
     - Response time history
     - Specialized capabilities 
   - Default route: OpenAI → Mock Provider

4. **Memory Management**:
   - `conversationManager` tracks conversations with timestamps
   - Chat history is pruned automatically when it exceeds limits
   - System automatically removes old conversations after 30 days

5. **Response Handling**:
   - AI response is returned to client
   - Loading indicator is replaced with response
   - Voice audio is generated (if enabled)
   - Performance metrics are logged

### Voice Call Flow

1. **Call Initiation**: User clicks "Call an Agent"
2. **Connection Simulation**:
   - 2-second "connecting" animation is shown
   - System prepares initial welcome message
   - Voice audio is generated for welcome

3. **Conversation Simulation**:
   - System alternates between "listening" and "speaking" states
   - Random user questions are simulated at intervals
   - Each AI response generates voice audio
   - A countdown timer tracks call duration (3 minutes)

4. **Call Summary**:
   - When the call ends, the system generates a summary
   - Summary is created from the conversation transcript
   - User is presented with a callback form
   - Form is pre-populated with the call summary

5. **Callback Request**:
   - User completes the form with contact information
   - System sends the data to the server
   - Fallback: Creates a mailto: link if server is unavailable

## Technology Stack

### Frontend
- React components with efficient memoization
- Local storage with size limiting and pruning
- Audio playback system with multiple fallbacks
- Performance tracking with custom metrics

### Backend
- AI Router system for provider selection
- Conversation management with automatic pruning
- Multiple API integrations (OpenAI, ElevenLabs)
- Comprehensive error handling and fallbacks

### Storage
- Conversations stored in local storage with limits
- Server-side storage in the storage manager
- Automatic 30-day cleanup of old conversations

## Required Services & Configuration

For full functionality, the following external services are needed:

### Required API Keys
1. **OpenAI API Key** (`OPENAI_API_KEY`)
   - Used for chat completion (GPT models)
   - Used for text-to-speech as a fallback

2. **ElevenLabs API Key** (`ELEVENLABS_API_KEY` and `ELEVENLABS_DEFAULT_VOICE_ID`)
   - Used for high-quality voice synthesis
   - Primary voice provider when available

### Environment Configuration
```
# Server Configuration
NODE_ENV=production
PORT=5000
HOST=0.0.0.0
API_TIMEOUT=30000

# Security
SESSION_SECRET=your_secure_session_secret
CSRF_SECRET=your_secure_csrf_secret
CLIENT_URL=https://your-domain.com

# AI Services
OPENAI_API_KEY=your_openai_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key
ELEVENLABS_DEFAULT_VOICE_ID=your_voice_id
```

## Fallback Mechanisms

The system includes comprehensive fallbacks for reliability:

1. **Chat Service Fallbacks**:
   - Primary: OpenAI GPT models
   - Fallback: Mock responses with keyword matching

2. **Voice Service Fallbacks**:
   - Primary: ElevenLabs TTS
   - Secondary: OpenAI TTS
   - Fallback: Silent audio with mock response

3. **Storage Fallbacks**:
   - If localStorage is full, oldest conversations are pruned
   - If storage fails, in-memory conversations are used

4. **Network Fallbacks**:
   - Retry logic for transient failures
   - Circuit breaking for persistent failures
   - Graceful degradation to mock services

## Future Enhancements

The following enhancements are planned for the future:

1. **Real-time Voice Streaming**
   - Replace base64 audio with streaming responses
   - Implement WebSocket for bidirectional audio

2. **Advanced Conversation Context**
   - Use vector embeddings for better conversation context
   - Implement semantic memory for personalization

3. **Analytics Integration**
   - Track user engagement metrics
   - Identify common user questions for FAQ optimization

4. **Multi-Platform Support**
   - Add mobile app integration
   - Support for notification systems

## Testing

The system includes automated testing with Puppeteer:

1. **Functional Tests**
   - Verify chat interaction flow
   - Test voice call simulation
   - Validate form submission

2. **Performance Tests**
   - Measure response times
   - Verify memory usage
   - Test under load conditions

3. **Fallback Tests**
   - Validate behavior when APIs are unavailable
   - Test graceful degradation

## Conclusion

The Workflow Agent system provides a sophisticated way for users to interact with AI assistance, either through text or simulated voice calls. The architecture is designed for:

- **Reliability**: Multiple fallback mechanisms
- **Scalability**: Modular components and efficient state management
- **Maintainability**: Clear separation of concerns
- **Performance**: Optimized rendering and memory management

With proper configuration of the required API keys, the system will provide a seamless, professional experience for users seeking AI workflow automation assistance.
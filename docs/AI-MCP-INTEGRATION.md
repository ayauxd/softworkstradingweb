# AI MCP Integration Guide

This document provides guidance on using MCP (Model Context Protocol) servers to interact with AI services in the SoftworksTradingWeb project.

## Available AI MCP Servers

The project includes MCP servers for three key AI services:

1. **OpenAI MCP** (`openai`)
   - Provides direct access to OpenAI's models
   - Allows chat completions, embeddings, and text-to-speech
   - Use for testing and debugging API interactions

2. **ElevenLabs MCP** (`elevenlabs`)
   - Provides voice generation capabilities
   - Allows testing different voices and parameters
   - Useful for optimizing voice responses

3. **Google Gemini MCP** (`gemini`)
   - Provides access to Google's Gemini models
   - Includes chat, content generation, and vision capabilities
   - Useful for multimodal AI interactions

## Setting Up AI MCP Servers

All necessary MCP servers can be set up using the provided script:

```bash
npm run setup-mcp
```

### Manual Setup

If you prefer to set up AI MCP servers manually:

1. Install the required packages:
   ```bash
   npm install -g @angelogiacco/elevenlabs-mcp-server openai-mcp-server mcp-framework @google/genai
   ```

2. Configure each MCP server with Claude:
   ```bash
   claude mcp add elevenlabs @angelogiacco/elevenlabs-mcp-server
   claude mcp add openai openai-mcp-server
   ```

3. Start the Gemini MCP server:
   ```bash
   npm run start:gemini-mcp
   ```

## Environment Variables

Make sure to set the following environment variables for full functionality:

```bash
# OpenAI Configuration
export OPENAI_API_KEY=your_openai_api_key

# ElevenLabs Configuration
export ELEVENLABS_API_KEY=your_elevenlabs_api_key
export ELEVENLABS_DEFAULT_VOICE_ID=your_default_voice_id

# Google Gemini Configuration
export GEMINI_API_KEY=your_gemini_api_key
```

## Using OpenAI MCP

```bash
claude --with openai

# Example commands:
> Generate a product description for our AI automation service.
> Classify this customer feedback: "Your service has been amazing for our team's productivity."
> Create a professional email to send to a potential client.
```

### OpenAI MCP Capabilities

- Chat completions with GPT models
- Text embeddings for semantic search
- Text-to-speech generation
- Image generation with DALL-E
- Image analysis with GPT-4 Vision

## Using ElevenLabs MCP

```bash
claude --with elevenlabs

# Example commands:
> Convert this text to speech: "Welcome to Softworks Trading Company."
> Generate a voice sample using the Rachel voice.
> Create an enthusiastic announcement for our new product launch.
```

### ElevenLabs MCP Capabilities

- High-quality voice generation
- Multiple voice options
- Voice cloning
- Voice design
- Speech-to-speech conversion

## Using Google Gemini MCP

```bash
claude --with gemini

# Example commands:
> Use Gemini to analyze this image of our website design.
> Generate content ideas for our blog about AI automation.
> Summarize this technical document for a non-technical audience.
```

### Gemini MCP Capabilities

- Text generation and summarization
- Image analysis and description
- Multimodal content understanding
- Code generation and explanation

## Combining MCP Servers

For complex tasks, you can combine multiple MCP servers:

```bash
claude --with openai,elevenlabs,gemini

# Example commands:
> Create product description content with OpenAI, then generate a voice-over with ElevenLabs.
> Analyze our interface screenshot with Gemini Vision, then generate improvement suggestions with OpenAI.
```

## Troubleshooting

If you encounter issues with AI MCP servers:

1. Check if the server is properly installed and configured:
   ```bash
   claude mcp list
   ```

2. Verify API keys are set in your environment:
   ```bash
   echo $OPENAI_API_KEY
   echo $ELEVENLABS_API_KEY
   echo $GEMINI_API_KEY
   ```

3. Start the Gemini MCP server in debug mode:
   ```bash
   DEBUG=* npm run start:gemini-mcp
   ```

4. Launch Claude with debug logging:
   ```bash
   claude --with openai --mcp-debug
   ```

## Adding New AI Providers

To add a new AI service provider:

1. Create a new MCP server script using `mcp-framework`
2. Install any required dependencies
3. Add the server configuration to `.mcp.json`
4. Document the server's capabilities and usage examples

## Best Practices

1. Always check API status with `/api/status` before attempting AI operations
2. Test with MCP servers during development to verify interactions
3. Use fallback chains in production for resilience
4. Maintain proper error handling and user-friendly messages
5. Document all AI integrations and their expected behavior
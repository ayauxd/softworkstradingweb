# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Softworks Trading Company is a React-based website for an AI workflow automation platform. It offers a sophisticated landing page with advanced UI components, interactive chat functionality, and AI service integrations.

## Development Commands

### Essential Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start development server with debug logging
npm run dev:debug

# Build the project for production
npm run build

# Start production server
npm run start

# Start production server with debug logging
npm run start:debug

# Type checking
npm run check

# Linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check
```

### Testing Commands

```bash
# Run UI tests with Puppeteer
npm run test:ui

# Using Vitest directly (these commands aren't in package.json but work with the configured vitest.config.ts)
npx vitest run           # Run tests once
npx vitest               # Run tests in watch mode
npx vitest run --coverage  # Run tests with coverage
npx vitest path/to/test/file.test.ts  # Run specific test file

# API testing (note: test-api-endpoints.js may need to be created)
# The advanced-api-test.js file is available for API testing
node advanced-api-test.js
```

### Deployment Commands

```bash
# Build for production deployment
npm run build

# Deploy to Render
npm run deploy:render

# Optimize images
npm run optimize-images

# Copy optimized assets
npm run copy-assets

# Copy server files
npm run copy-server
```

## Architecture Overview

### Project Structure

```
├── client/                # Frontend React application
│   ├── src/
│   │   ├── assets/        # Static assets (images, SVGs)
│   │   ├── components/    # React components
│   │   │   └── ui/        # Reusable UI components (shadcn)
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions and shared logic
│   │   ├── pages/         # Page components
│   │   ├── App.tsx        # Main application component
│   │   └── main.tsx       # Entry point
│   └── index.html         # HTML template
│
├── server/                # Express backend server
│   ├── controllers/       # Request handlers
│   ├── middleware/        # Express middleware
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   ├── utils/             # Utility functions
│   ├── config.ts          # Server configuration
│   └── index.ts           # Server entry point
│
├── shared/                # Shared types and schemas
├── public/                # Static files
└── tests/                 # Test files
    ├── unit/              # Unit tests
    ├── integration/       # Integration tests
    └── e2e/               # End-to-end tests
```

### Technology Stack

- **Frontend**: React, Vite, TailwindCSS, shadcn/ui
- **Backend**: Express, Node.js
- **State Management**: React Query
- **Styling**: TailwindCSS, CSS-in-JS
- **Form Handling**: React Hook Form, Zod
- **Testing**: Vitest, React Testing Library
- **Database ORM**: Drizzle
- **API Integration**: OpenAI, ElevenLabs, Google Gemini
- **Deployment**: Render

## Key Features

1. **Interactive UI Components**:
   - Neural network animation in hero section
   - Chat and call modals for workflow agent interaction
   - Light/dark mode toggle

2. **AI Integration**:
   - Chat functionality with OpenAI/Gemini
   - Voice functionality with ElevenLabs/OpenAI TTS
   - Fallback systems for reliability

3. **Security Features**:
   - Content Security Policy (CSP) with nonce-based approach
   - CSRF protection using double-submit cookie pattern
   - Secure HTTP headers configuration

## Environment Variables

The application relies on these key environment variables:

```
# Server Configuration
NODE_ENV=production
PORT=5000
HOST=0.0.0.0
API_TIMEOUT=30000
DATABASE_URL=your_database_connection_string

# Security
SESSION_SECRET=your_secure_session_secret
CSRF_SECRET=your_secure_csrf_secret
CLIENT_URL=https://your-domain.com

# AI Services
OPENAI_API_KEY=your_openai_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key
ELEVENLABS_DEFAULT_VOICE_ID=your_voice_id
```

## Deployment Guide

The project is configured for deployment to Render:

1. Set all required environment variables in the Render dashboard
2. Build command: `npm install --no-audit --no-fund && npm run build`
3. Start command: `npm start`
4. The build process includes data verification via ensure-data.js

Configuration is managed through render.yaml which defines service settings, environment variables, and URL rewrite rules.

Refer to `RENDER-DEPLOYMENT.md` for more detailed instructions.

## Best Practices

1. Always use the CSRF protection for state-changing API requests
2. Follow the established component structure for new UI elements
3. Implement comprehensive error handling for API interactions
4. Ensure all user-facing strings use proper localization
5. Add unit tests for new functionality
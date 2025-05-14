# Softworks Trading Web - Deployment Guide

This document provides instructions for deploying the Softworks Trading Web application to Render or a similar hosting service.

## Preparation

Before deployment, make sure you have:

1. Pushed your code to a GitHub repository
2. Obtained API keys for the services you want to use (OpenAI, ElevenLabs, Gemini)
3. Created an account on Render or your preferred hosting platform

## Environment Variables

The application needs these environment variables to be set in your hosting platform:

### Required Variables

```
# Server Configuration
NODE_ENV=production
PORT=5000
HOST=0.0.0.0
SESSION_SECRET=replace_with_at_least_32_characters_long_secret_key
```

### AI Service API Keys (At least one is required)

```
# OpenAI (for chat completion and text-to-speech)
OPENAI_API_KEY=your_openai_api_key_here

# ElevenLabs (for high-quality voice generation)
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
ELEVENLABS_DEFAULT_VOICE_ID=your_default_voice_id_here

# Gemini (alternative chat API)
GEMINI_API_KEY=your_gemini_api_key_here
```

### Security Variables

```
# CORS and CSRF protection
CSRF_SECRET=generate_a_random_string_here
CLIENT_URL=https://your-render-deployment-url.onrender.com
```

## Fallback Behavior

The application includes comprehensive fallbacks:

1. **When API keys are not provided:**
   - The system will use mock responses for both chat and voice
   - This enables the demo to work even without proper API configuration
   - However, real API services provide a much better user experience

2. **Progressive fallback chain:**
   - For chat: OpenAI → Gemini → Mock responses
   - For voice: ElevenLabs → OpenAI TTS → Mock responses
   - This ensures maximum reliability in production

## Deployment to Render

### Step 1: Create a New Web Service

1. Log in to your Render dashboard
2. Click "New" and select "Web Service"
3. Connect your GitHub repository

### Step 2: Configure the Service

1. **Name**: Choose a meaningful name for your service
2. **Environment**: Select Node
3. **Region**: Choose the region closest to your target audience
4. **Branch**: Select the branch you want to deploy (usually `main`)
5. **Build Command**: `npm install && npm run build`
6. **Start Command**: `npm start`
7. **Instance Type**: Start with the Free or Individual plan (you can upgrade later)

### Step 3: Set Environment Variables

In the Render dashboard, add all the required environment variables:

1. Click "Environment" in your service settings
2. Add each key-value pair from your `.env` file
3. Make sure to set `NODE_ENV=production`
4. Set `CLIENT_URL` to your Render deployment URL (e.g., `https://your-app.onrender.com`)
5. Click "Save Changes"

### Step 4: Deploy

1. Click "Manual Deploy" and select "Deploy latest commit"
2. Render will build and deploy your application
3. Once deployment is complete, click the URL to view your site

## Verifying Deployment

After deployment, verify the following:

1. **Basic website functionality:**
   - All pages load correctly
   - Light/dark mode toggle works
   - UI looks correct on both mobile and desktop

2. **Chat functionality:**
   - Open the chat modal
   - Send a test message
   - Verify you receive a response (either from the API or the fallback system)

3. **Voice functionality:**
   - Try the voice call feature
   - Verify audio plays (even if it's the fallback audio)

## Troubleshooting

### Issue: API requests fail in production

**Possible causes:**
- CORS configuration issue
- API keys not set correctly
- Environment variables not loaded

**Solutions:**
- Verify the `CLIENT_URL` environment variable is set correctly
- Check that API keys are properly formatted
- Inspect server logs in the Render dashboard

### Issue: Application crashes on startup

**Possible causes:**
- Missing required environment variables
- Database connection issue
- Port conflicts

**Solutions:**
- Check environment variables are properly set
- Review server logs for specific error messages
- Ensure the `PORT` environment variable is set to what Render expects (usually 5000)

### Issue: Chat or voice features not working

**Possible causes:**
- API keys not configured
- Rate limits exceeded
- Network issues

**Solutions:**
- Check the browser console for error messages
- Verify API keys are valid and have sufficient quota
- Test the fallback functionality by temporarily removing API keys

## Monitoring and Maintenance

- Regularly check your application logs in the Render dashboard
- Monitor your API usage to avoid unexpected charges
- Update your API keys if they expire or get compromised
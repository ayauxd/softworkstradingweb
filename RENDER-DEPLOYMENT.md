# Render Deployment Guide

This guide provides step-by-step instructions for deploying the Softworks Trading Web application to Render.

## Prerequisites

Before deploying, ensure you have:

1. A [Render account](https://render.com/)
2. Access to your GitHub repository
3. Your API keys for the following services:
   - OpenAI API
   - ElevenLabs API
   - Google Gemini API

## Deployment Steps

### 1. Connect Your GitHub Repository

1. Log in to your Render dashboard
2. Click on "New" and select "Web Service"
3. Connect your GitHub repository
4. Select the repository containing your Softworks Trading Web code

### 2. Configure the Web Service

The repository includes a `render.yaml` file that will automatically configure most settings, but verify these settings:

1. **Service Name**: softworks-trading (or your preferred name)
2. **Environment**: Node
3. **Region**: Choose the region closest to your users
4. **Branch**: main (or your deployment branch)
5. **Build Command**: `npm install && npm run build`
6. **Start Command**: `npm start`
7. **Plan**: Select an appropriate plan based on your needs

### 3. Set Environment Variables

The `render.yaml` file already defines the required environment variables, but you'll need to provide values for:

| Variable | Description | Value |
|----------|-------------|-------|
| OPENAI_API_KEY | Your OpenAI API key | `sk-proj-xxxx...` |
| ELEVENLABS_API_KEY | Your ElevenLabs API key | `sk_xxxx...` |
| ELEVENLABS_DEFAULT_VOICE_ID | Your ElevenLabs voice ID | `Nhs7eitvQWFTQBsf0yiT` |
| GEMINI_API_KEY | Your Google Gemini API key | `AIzaSy...` |
| SESSION_SECRET | Random string for session security | Generate 32+ character random string |
| CSRF_SECRET | Random string for CSRF protection | Generate 32+ character random string |
| CLIENT_URL | URL of your deployed application | `https://your-app-name.onrender.com` |

You can set these values in two ways:
- Through the Render dashboard in the Environment section
- Using the Render CLI (if you have it installed)

**Important**: The `sync: false` setting in render.yaml means these values will not be automatically loaded from your environment and must be explicitly set in the Render dashboard.

### 4. Deploy Your Application

1. Click "Create Web Service"
2. Render will automatically deploy your application
3. The initial build and deployment may take 5-10 minutes

### 5. Verify Deployment

After deployment completes:

1. Click on the generated URL to access your application
2. Verify that the home page loads correctly
3. Test the chat functionality to ensure API integration works
4. Test the voice functionality to ensure all features work properly

### 6. Set Up Custom Domain (Optional)

If you want to use a custom domain:

1. Go to your Web Service settings
2. Click on "Custom Domain"
3. Follow the instructions to add and verify your domain

### 7. Monitoring & Logs

Monitor your application's performance and troubleshoot issues:

1. Go to your Web Service dashboard
2. Click on "Logs" to view application logs
3. Check for any errors related to API connections or environment variables

## Troubleshooting

If you encounter issues with your deployment:

### API Connections

If chat or voice features aren't working:
1. Check the application logs for API-related errors
2. Verify that your API keys are correctly set in environment variables
3. Test API connections using the health check endpoint: `/api/health`

### Build Failures

If the build process fails:
1. Check the build logs for error messages
2. Ensure all dependencies are correctly listed in package.json
3. Verify that the build command is correct

### Environment Variables

If environment variables aren't being applied:
1. Check the "Environment" section in your Render dashboard
2. Ensure all required variables are set
3. Restart your service after updating environment variables

## Security Notes

1. Your API keys should ONLY be stored as environment variables
2. Never commit API keys to your GitHub repository
3. Regularly rotate your API keys and update them in Render
4. Use strong, randomly generated strings for SESSION_SECRET and CSRF_SECRET
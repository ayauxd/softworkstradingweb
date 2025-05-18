# AI Feature Troubleshooting Guide

This document provides guidance for diagnosing and resolving issues with the AI chat and voice features in the Softworks Trading Web application.

## Overview of AI Features

The website includes two AI-powered features:

1. **AI Chat Assistant**: 
   - Integrated with OpenAI's GPT models
   - Uses custom knowledge base for company-specific information
   - CSRF protected for security

2. **Voice Generation**:
   - Powered by ElevenLabs API
   - Converts text responses to natural-sounding speech
   - Requires separate API authentication

## Common Issues and Solutions

### 1. Knowledge Base Problems

**Symptoms:**
- Chat responses are generic or inaccurate
- Error messages about invalid JSON
- Missing information in responses

**Solutions:**
- Run the repair script to fix JSON syntax errors:
  ```bash
  node repair-json.js
  ```
- Verify knowledge base files are properly formatted:
  ```bash
  node debug-environment.js
  ```
- Check the content of knowledge base files to ensure they contain the expected information.

### 2. API Connectivity Issues

**Symptoms:**
- "Failed to connect" errors
- Timeouts when trying to use chat or voice
- Features work locally but not in production

**Solutions:**
- Verify API keys are properly set in environment variables:
  ```bash
  # Required environment variables
  OPENAI_API_KEY=your_openai_key
  ELEVENLABS_API_KEY=your_elevenlabs_key
  ```
- Test API connectivity with the diagnostic tool:
  ```bash
  node check-api-availability.js
  ```
- Check if there are network restrictions (firewall, proxy, etc.) blocking API access.

### 3. CSRF Token Issues

**Symptoms:**
- "Invalid CSRF token" errors
- Chat messages fail to send
- 403 Forbidden responses

**Solutions:**
- Make sure the client is getting a fresh CSRF token before making requests
- Check browser developer console for any CSRF-related errors
- Verify that CSRF middleware is properly configured in the server

### 4. Browser Compatibility

**Symptoms:**
- Features work in some browsers but not others
- JavaScript console errors
- Interface loads but features don't work

**Solutions:**
- Try using a different modern browser (Chrome, Firefox, Safari, Edge)
- Check browser console for specific errors
- Use 127.0.0.1 instead of localhost in development environments
- Clear browser cache and cookies

## Diagnostic Tools

Several diagnostic tools are included to help troubleshoot issues:

### Knowledge Base Repair

```bash
node repair-json.js
```

This tool automatically fixes common JSON syntax errors in the knowledge base files, focusing on:
- Line breaks in string values
- Missing commas between elements
- Unescaped quotes in strings

### Environment Check

```bash
node debug-environment.js
```

This tool verifies your environment configuration:
- Checks required environment variables
- Validates knowledge base files
- Reports on the content of knowledge base files
- Provides security-conscious reporting (masks API keys)

### API Availability Check

```bash
node check-api-availability.js
```

This tool tests connectivity to the required APIs:
- Tests OpenAI API connectivity for chat functionality
- Tests ElevenLabs API connectivity for voice functionality
- Checks general network connectivity
- Provides troubleshooting guidance based on results

## When to Reinstall Dependencies

If you've tried the above solutions and are still experiencing issues:

1. Delete node_modules directory
2. Clear npm cache:
   ```bash
   npm cache clean --force
   ```
3. Reinstall dependencies:
   ```bash
   npm install
   ```
4. Rebuild the application:
   ```bash
   npm run build
   ```

## Getting Support

If you're still experiencing issues after trying these solutions:

1. File an issue in the GitHub repository
2. Include detailed information about the problem
3. Attach relevant logs and output from diagnostic tools
4. Contact the development team at agent@softworkstrading.com
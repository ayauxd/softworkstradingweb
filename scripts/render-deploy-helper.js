#!/usr/bin/env node

/**
 * Render Deployment Helper
 * 
 * This script helps deploy your application to Render by:
 * 1. Creating or updating a render.yaml file with your environment variables
 * 2. Providing CLI instructions for deployment
 * 3. Verifying your configuration for deployment readiness
 */

import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { execSync } from 'child_process';
import readline from 'readline';

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = promisify(rl.question).bind(rl);

// Print ASCII art header
console.log(`
╭───────────────────────────────────────────╮
│                                           │
│   Render Deployment Helper                │
│   for Softworks Trading Web               │
│                                           │
╰───────────────────────────────────────────╯
`);

// Main function
async function main() {
  try {
    console.log('Checking environment setup...');
    
    // Load environment variables from .env
    const envPath = path.join(process.cwd(), '.env');
    if (!fs.existsSync(envPath)) {
      console.error('❌ No .env file found. Please create one first with your API keys.');
      process.exit(1);
    }
    
    const envFile = fs.readFileSync(envPath, 'utf8');
    const envVars = parseEnvFile(envFile);
    
    // Check for required API keys
    const requiredKeys = [
      'OPENAI_API_KEY',
      'ELEVENLABS_API_KEY',
      'ELEVENLABS_DEFAULT_VOICE_ID',
      'GEMINI_API_KEY'
    ];
    
    const missingKeys = requiredKeys.filter(key => !envVars[key]);
    
    if (missingKeys.length > 0) {
      console.error(`❌ Missing required API keys: ${missingKeys.join(', ')}`);
      console.log('Please add these to your .env file first.');
      process.exit(1);
    }
    
    console.log('✅ Found all required API keys in .env file');
    
    // Check for render.yaml
    const renderYamlPath = path.join(process.cwd(), 'render.yaml');
    if (!fs.existsSync(renderYamlPath)) {
      console.error('❌ No render.yaml file found.');
      const createNew = await question('Would you like to create a new render.yaml file? (y/n): ');
      if (createNew.toLowerCase() !== 'y') {
        console.log('Exiting. Please create a render.yaml file manually.');
        process.exit(1);
      }
      
      // Create basic render.yaml file
      const basicRenderYaml = createBasicRenderYaml();
      fs.writeFileSync(renderYamlPath, basicRenderYaml);
      console.log('✅ Created basic render.yaml file');
    } else {
      console.log('✅ Found render.yaml file');
    }
    
    // Prompt for Render service name
    console.log('\nPreparing Render deployment configuration...');
    
    const serviceName = await question('Enter your Render service name (default: softworks-trading): ') || 'softworks-trading';
    const region = await question('Enter Render region (default: oregon): ') || 'oregon';
    const planType = await question('Enter plan type (free, starter, standard) (default: free): ') || 'free';
    
    // Generate deployment URL for CLIENT_URL
    const deployUrl = `https://${serviceName}.onrender.com`;
    console.log(`\nYour deployment URL will be: ${deployUrl}`);
    
    // Generate a command to deploy with render CLI (if installed)
    console.log('\n=== Render Deployment Guide ===');
    console.log('\nOption 1: Deploy via Render Dashboard');
    console.log('1. Sign in to your Render dashboard: https://dashboard.render.com');
    console.log('2. Click "New" > "Web Service"');
    console.log('3. Connect to your GitHub repository');
    console.log('4. Render will detect render.yaml and configure settings');
    console.log('5. Add the following environment variables:');
    
    // Print environment variables that need to be added
    console.log('\nRequired environment variables:');
    console.log('-------------------------------');
    for (const key of requiredKeys) {
      if (envVars[key]) {
        // Mask the value for security
        const maskedValue = maskApiKey(envVars[key]);
        console.log(`${key}: ${maskedValue}`);
      }
    }
    
    // Add security keys
    console.log('\nSecurity Keys (generate random strings):');
    console.log('--------------------------------------');
    console.log('SESSION_SECRET: [generate a random 32+ character string]');
    console.log('CSRF_SECRET: [generate a random 32+ character string]');
    
    console.log('\nApplication Configuration:');
    console.log('-------------------------');
    console.log(`CLIENT_URL: ${deployUrl}`);
    console.log('NODE_ENV: production');
    
    // Check if git is clean
    try {
      const gitStatus = execSync('git status --porcelain').toString();
      if (gitStatus.trim()) {
        console.log('\n⚠️  Warning: You have uncommitted changes in your repository.');
        console.log('Commit and push your changes before deploying to Render.');
      } else {
        console.log('\n✅ Git repository is clean. Ready to deploy!');
      }
    } catch (error) {
      console.log('\n⚠️  Warning: Could not check git status. Make sure you commit and push your changes before deploying.');
    }
    
    console.log('\n6. Click "Create Web Service" to start the deployment');
    
    console.log('\nOption 2: Deploy via Render CLI (if installed)');
    console.log('run: render blueprint apply');
    
    console.log('\nAfter Deployment:');
    console.log('1. Check the logs for any errors');
    console.log('2. Visit your site at: ' + deployUrl);
    console.log('3. Verify all features are working correctly');
    
    // Generate a helper curl command to verify the deployment
    console.log('\nTo verify your deployment is working, run:');
    console.log(`curl -s ${deployUrl}/api/health | grep ok`);
    
    console.log('\nFor detailed deployment instructions, see:');
    console.log('RENDER-DEPLOYMENT.md in your project root');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    rl.close();
  }
}

// Parse environment file
function parseEnvFile(content) {
  const result = {};
  const lines = content.split('\n');
  
  for (const line of lines) {
    // Skip comments and empty lines
    if (line.startsWith('#') || !line.trim()) continue;
    
    // Parse key=value
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const [, key, value] = match;
      result[key.trim()] = value.trim();
    }
  }
  
  return result;
}

// Create basic render.yaml file
function createBasicRenderYaml() {
  return `services:
  - type: web
    name: softworks-trading
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: PORT
        value: 10000
      - key: NODE_ENV
        value: production
      - key: HOST
        value: 0.0.0.0
      - key: API_TIMEOUT
        value: 30000
      - key: SESSION_SECRET
        sync: false
      - key: CSRF_SECRET
        sync: false
      - key: CLIENT_URL
        value: https://softworks-trading.onrender.com
      - key: OPENAI_API_KEY
        sync: false
      - key: ELEVENLABS_API_KEY
        sync: false
      - key: ELEVENLABS_DEFAULT_VOICE_ID
        sync: false
      - key: GEMINI_API_KEY
        sync: false
    headers:
      - path: /*
        name: Cache-Control
        value: max-age=3600, must-revalidate
      - path: /assets/*
        name: Cache-Control
        value: max-age=31536000, immutable
      - path: /optimized-images/*
        name: Cache-Control
        value: max-age=31536000, immutable
    routes:
      - type: rewrite
        source: /blog
        destination: /blog/index.html
      - type: rewrite
        source: /*
        destination: /index.html

# Additional render.yaml configuration
headers:
  # Security headers for all routes
  "/*":
    # HSTS is a security feature that tells browsers that the site should only be accessed over HTTPS
    Strict-Transport-Security: max-age=31536000; includeSubDomains
    # Prevent MIME type sniffing, which can lead to security vulnerabilities
    X-Content-Type-Options: nosniff
    # Prevents the browser from rendering the page inside a frame/iframe
    X-Frame-Options: DENY
    # Enables XSS filtering in browsers
    X-XSS-Protection: 1; mode=block
    # Controls how much referrer information should be included with requests
    Referrer-Policy: strict-origin-when-cross-origin`;
}

// Mask API key for display
function maskApiKey(key) {
  if (!key) return '';
  
  // Different masking for different key types
  if (key.startsWith('sk-proj-') || key.startsWith('sk-')) {
    // Show first 7 and last 4 characters
    return `${key.substring(0, 7)}...${key.substring(key.length - 4)}`;
  } else if (key.startsWith('AIzaSy')) {
    // For Google API keys
    return `AIzaSy...${key.substring(key.length - 4)}`;
  } else {
    // Generic masking for other keys
    return `${key.substring(0, 4)}...${key.substring(key.length - 4)}`;
  }
}

// Run the script
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
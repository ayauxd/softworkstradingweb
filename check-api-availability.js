/**
 * API Availability Check Utility
 * 
 * Tests if the AI service APIs are available and properly configured.
 * This is a secure, minimal script to diagnose connection issues with:
 *   - OpenAI (for chat features)
 *   - ElevenLabs (for voice features)
 * 
 * Usage: node check-api-availability.js
 */

import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('=== AI Service API Availability Check ===\n');

// Security check - don't continue without keys
if (!process.env.OPENAI_API_KEY || !process.env.ELEVENLABS_API_KEY) {
  console.error('❌ Missing required API keys in environment variables');
  console.error('Please set OPENAI_API_KEY and ELEVENLABS_API_KEY in your environment');
  process.exit(1);
}

// Check functions
async function checkOpenAI() {
  console.log('Testing OpenAI API connectivity...');
  
  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.data && Array.isArray(data.data)) {
        console.log(`✅ OpenAI API is accessible (${data.data.length} models available)`);
        
        // Check for GPT models specifically for chat functionality
        const gptModels = data.data.filter(model => model.id.includes('gpt'));
        if (gptModels.length > 0) {
          console.log(`✅ Found ${gptModels.length} GPT models available for chat`);
          console.log(`  First available model: ${gptModels[0].id}`);
        } else {
          console.log('⚠️ No GPT models found - chat functionality may be limited');
        }
        
        return true;
      } else {
        console.error('❌ OpenAI API response format unexpected');
        return false;
      }
    } else {
      const errorData = await response.json().catch(() => ({}));
      console.error(`❌ OpenAI API error (${response.status}): ${errorData.error?.message || 'Unknown error'}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ OpenAI API connection failed: ${error.message}`);
    return false;
  }
}

async function checkElevenLabs() {
  console.log('\nTesting ElevenLabs API connectivity...');
  
  try {
    const response = await fetch('https://api.elevenlabs.io/v1/voices', {
      method: 'GET',
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.voices && Array.isArray(data.voices)) {
        console.log(`✅ ElevenLabs API is accessible (${data.voices.length} voices available)`);
        
        // Show available voice count
        if (data.voices.length > 0) {
          const defaultVoice = data.voices.find(v => v.category === 'premade') || data.voices[0];
          console.log(`  Available voice example: ${defaultVoice.name} (${defaultVoice.voice_id})`);
        }
        
        return true;
      } else {
        console.error('❌ ElevenLabs API response format unexpected');
        return false;
      }
    } else {
      const errorData = await response.json().catch(() => ({}));
      console.error(`❌ ElevenLabs API error (${response.status}): ${errorData.detail || 'Unknown error'}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ ElevenLabs API connection failed: ${error.message}`);
    return false;
  }
}

// Check network connectivity to common services (as a baseline)
async function checkNetworkConnectivity() {
  console.log('\nTesting general network connectivity...');
  
  const testUrls = [
    { name: 'Google', url: 'https://www.google.com' },
    { name: 'CloudFlare DNS', url: 'https://1.1.1.1' },
    { name: 'GitHub', url: 'https://github.com' }
  ];
  
  let allSuccess = true;
  
  for (const site of testUrls) {
    try {
      const response = await fetch(site.url, { method: 'HEAD' });
      if (response.ok) {
        console.log(`✅ Connection to ${site.name} successful`);
      } else {
        console.log(`⚠️ Connection to ${site.name} failed with status ${response.status}`);
        allSuccess = false;
      }
    } catch (error) {
      console.error(`❌ Connection to ${site.name} failed: ${error.message}`);
      allSuccess = false;
    }
  }
  
  return allSuccess;
}

// Run all checks
async function runChecks() {
  // First check basic network connectivity
  const networkOk = await checkNetworkConnectivity();
  
  if (!networkOk) {
    console.log('\n⚠️ Network connectivity issues detected. This may affect API access.');
  }
  
  // Run API-specific checks
  const openAiOk = await checkOpenAI();
  const elevenLabsOk = await checkElevenLabs();
  
  console.log('\n=== Summary ===');
  console.log(`Network Connectivity: ${networkOk ? '✅ OK' : '❌ Issues detected'}`);
  console.log(`OpenAI API (Chat): ${openAiOk ? '✅ Available' : '❌ Unavailable'}`);
  console.log(`ElevenLabs API (Voice): ${elevenLabsOk ? '✅ Available' : '❌ Unavailable'}`);
  
  if (openAiOk && elevenLabsOk) {
    console.log('\n✅ All API services are available. Chat and voice features should work correctly.');
  } else {
    console.log('\n⚠️ Some API services are unavailable. Features may be limited.');
    
    // Provide troubleshooting guidance
    console.log('\nTroubleshooting steps:');
    if (!networkOk) {
      console.log('- Check your internet connection');
      console.log('- Verify firewall settings allow outbound HTTPS connections');
      console.log('- Try connecting from a different network');
    }
    if (!openAiOk) {
      console.log('- Verify your OpenAI API key is correct and not expired');
      console.log('- Check OpenAI service status at https://status.openai.com');
      console.log('- Ensure your OpenAI account has valid payment information');
    }
    if (!elevenLabsOk) {
      console.log('- Verify your ElevenLabs API key is correct');
      console.log('- Check ElevenLabs service status');
      console.log('- Ensure your ElevenLabs subscription is active');
    }
  }
}

// Execute the checks
runChecks().catch(error => {
  console.error('Error during API checks:', error);
});
// API Availability Check Script
// This script checks connectivity with the OpenAI and ElevenLabs APIs
// Run this with: node check-api-availability.js

require('dotenv').config();
const https = require('https');
const { performance } = require('perf_hooks');

// ANSI color codes for better readability
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// Get the API keys from environment or pass them as arguments
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || '';
const ELEVENLABS_VOICE_ID = process.env.ELEVENLABS_DEFAULT_VOICE_ID || '21m00Tcm4TlvDq8ikWAM'; // Rachel voice

console.log(`${colors.bright}${colors.blue}Workflow Agent Voice Call - API Connectivity Check${colors.reset}`);
console.log(`${colors.dim}Running diagnostics to verify API connectivity...${colors.reset}\n`);

// Check if API keys are configured
function checkApiKeys() {
  console.log(`${colors.bright}Checking API Configuration:${colors.reset}`);
  
  const openaiStatus = OPENAI_API_KEY 
    ? `${colors.green}Configured${colors.reset}` 
    : `${colors.red}Not Configured${colors.reset}`;
  
  const elevenLabsStatus = ELEVENLABS_API_KEY 
    ? `${colors.green}Configured${colors.reset}` 
    : `${colors.red}Not Configured${colors.reset}`;
  
  console.log(`OpenAI API Key: ${openaiStatus}`);
  console.log(`ElevenLabs API Key: ${elevenLabsStatus}`);
  console.log(`ElevenLabs Voice ID: ${ELEVENLABS_VOICE_ID || '(Using default)'}`);
  
  return {
    openaiConfigured: !!OPENAI_API_KEY,
    elevenLabsConfigured: !!ELEVENLABS_API_KEY
  };
}

// Make a test request to OpenAI API
async function testOpenAIConnection() {
  if (!OPENAI_API_KEY) {
    console.log(`\n${colors.yellow}Skipping OpenAI connectivity test (API key not configured)${colors.reset}`);
    return false;
  }
  
  console.log(`\n${colors.bright}Testing OpenAI API Connection:${colors.reset}`);
  const startTime = performance.now();
  
  return new Promise((resolve) => {
    const options = {
      hostname: 'api.openai.com',
      port: 443,
      path: '/v1/models',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      }
    };
    
    const req = https.request(options, (res) => {
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      if (res.statusCode === 200) {
        console.log(`${colors.green}✓ OpenAI API connection successful${colors.reset}`);
        console.log(`${colors.dim}Response time: ${responseTime.toFixed(2)}ms${colors.reset}`);
        
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          try {
            const parsedData = JSON.parse(data);
            const models = parsedData.data.filter(model => 
              model.id.startsWith('gpt-') || model.id.startsWith('tts-')
            ).slice(0, 5);
            
            console.log(`${colors.dim}Available models (sample): ${models.map(m => m.id).join(', ')}${colors.reset}`);
            resolve(true);
          } catch (error) {
            console.log(`${colors.yellow}Could not parse response data: ${error.message}${colors.reset}`);
            resolve(true); // Still connected, just couldn't parse
          }
        });
      } else {
        console.log(`${colors.red}✗ OpenAI API connection failed with status: ${res.statusCode}${colors.reset}`);
        console.log(`${colors.dim}Response time: ${responseTime.toFixed(2)}ms${colors.reset}`);
        
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          try {
            const parsedData = JSON.parse(data);
            console.log(`${colors.red}Error: ${parsedData.error?.message || 'Unknown error'}${colors.reset}`);
          } catch (error) {
            console.log(`${colors.red}Response: ${data}${colors.reset}`);
          }
          resolve(false);
        });
      }
    });
    
    req.on('error', (error) => {
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      console.log(`${colors.red}✗ OpenAI API connection error: ${error.message}${colors.reset}`);
      console.log(`${colors.dim}Response time: ${responseTime.toFixed(2)}ms${colors.reset}`);
      resolve(false);
    });
    
    req.end();
  });
}

// Make a test request to ElevenLabs API
async function testElevenLabsConnection() {
  if (!ELEVENLABS_API_KEY) {
    console.log(`\n${colors.yellow}Skipping ElevenLabs connectivity test (API key not configured)${colors.reset}`);
    return false;
  }
  
  console.log(`\n${colors.bright}Testing ElevenLabs API Connection:${colors.reset}`);
  const startTime = performance.now();
  
  return new Promise((resolve) => {
    const options = {
      hostname: 'api.elevenlabs.io',
      port: 443,
      path: '/v1/voices',
      method: 'GET',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY
      }
    };
    
    const req = https.request(options, (res) => {
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      if (res.statusCode === 200) {
        console.log(`${colors.green}✓ ElevenLabs API connection successful${colors.reset}`);
        console.log(`${colors.dim}Response time: ${responseTime.toFixed(2)}ms${colors.reset}`);
        
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          try {
            const parsedData = JSON.parse(data);
            const voices = parsedData.voices.slice(0, 5);
            
            // Check if configured voice ID exists
            const configuredVoice = parsedData.voices.find(v => v.voice_id === ELEVENLABS_VOICE_ID);
            
            if (configuredVoice) {
              console.log(`${colors.green}✓ Configured voice '${configuredVoice.name}' (${ELEVENLABS_VOICE_ID}) found${colors.reset}`);
            } else if (ELEVENLABS_VOICE_ID) {
              console.log(`${colors.yellow}⚠ Configured voice ID (${ELEVENLABS_VOICE_ID}) not found in your available voices${colors.reset}`);
            }
            
            console.log(`${colors.dim}Available voices (sample): ${voices.map(v => v.name).join(', ')}${colors.reset}`);
            resolve(true);
          } catch (error) {
            console.log(`${colors.yellow}Could not parse response data: ${error.message}${colors.reset}`);
            resolve(true); // Still connected, just couldn't parse
          }
        });
      } else {
        console.log(`${colors.red}✗ ElevenLabs API connection failed with status: ${res.statusCode}${colors.reset}`);
        console.log(`${colors.dim}Response time: ${responseTime.toFixed(2)}ms${colors.reset}`);
        
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          try {
            const parsedData = JSON.parse(data);
            console.log(`${colors.red}Error: ${parsedData.detail || 'Unknown error'}${colors.reset}`);
          } catch (error) {
            console.log(`${colors.red}Response: ${data}${colors.reset}`);
          }
          resolve(false);
        });
      }
    });
    
    req.on('error', (error) => {
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      console.log(`${colors.red}✗ ElevenLabs API connection error: ${error.message}${colors.reset}`);
      console.log(`${colors.dim}Response time: ${responseTime.toFixed(2)}ms${colors.reset}`);
      resolve(false);
    });
    
    req.end();
  });
}

// Test specific voice existence and permissions
async function testSpecificVoice() {
  if (!ELEVENLABS_API_KEY || !ELEVENLABS_VOICE_ID) {
    console.log(`\n${colors.yellow}Skipping voice detail test (API key or voice ID not configured)${colors.reset}`);
    return false;
  }
  
  console.log(`\n${colors.bright}Testing Specific Voice Access:${colors.reset}`);
  const startTime = performance.now();
  
  return new Promise((resolve) => {
    const options = {
      hostname: 'api.elevenlabs.io',
      port: 443,
      path: `/v1/voices/${ELEVENLABS_VOICE_ID}`,
      method: 'GET',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY
      }
    };
    
    const req = https.request(options, (res) => {
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      if (res.statusCode === 200) {
        console.log(`${colors.green}✓ Specific voice access successful${colors.reset}`);
        console.log(`${colors.dim}Response time: ${responseTime.toFixed(2)}ms${colors.reset}`);
        
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          try {
            const parsedData = JSON.parse(data);
            console.log(`${colors.green}Voice details: '${parsedData.name}' (${parsedData.voice_id})${colors.reset}`);
            console.log(`${colors.dim}Category: ${parsedData.category}${colors.reset}`);
            resolve(true);
          } catch (error) {
            console.log(`${colors.yellow}Could not parse response data: ${error.message}${colors.reset}`);
            resolve(true); // Still connected, just couldn't parse
          }
        });
      } else {
        console.log(`${colors.red}✗ Specific voice access failed with status: ${res.statusCode}${colors.reset}`);
        console.log(`${colors.dim}Response time: ${responseTime.toFixed(2)}ms${colors.reset}`);
        
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          try {
            const parsedData = JSON.parse(data);
            console.log(`${colors.red}Error: ${parsedData.detail || 'Unknown error'}${colors.reset}`);
          } catch (error) {
            console.log(`${colors.red}Response: ${data}${colors.reset}`);
          }
          resolve(false);
        });
      }
    });
    
    req.on('error', (error) => {
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      console.log(`${colors.red}✗ Specific voice access error: ${error.message}${colors.reset}`);
      console.log(`${colors.dim}Response time: ${responseTime.toFixed(2)}ms${colors.reset}`);
      resolve(false);
    });
    
    req.end();
  });
}

// Test OpenAI TTS API
async function testOpenAITTS() {
  if (!OPENAI_API_KEY) {
    console.log(`\n${colors.yellow}Skipping OpenAI TTS test (API key not configured)${colors.reset}`);
    return false;
  }
  
  console.log(`\n${colors.bright}Testing OpenAI TTS API:${colors.reset}`);
  const startTime = performance.now();
  
  return new Promise((resolve) => {
    const options = {
      hostname: 'api.openai.com',
      port: 443,
      path: '/v1/audio/speech',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    };
    
    const data = JSON.stringify({
      model: 'tts-1',
      voice: 'nova',
      input: 'This is a test of the OpenAI text to speech API.'
    });
    
    const req = https.request(options, (res) => {
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      if (res.statusCode === 200) {
        console.log(`${colors.green}✓ OpenAI TTS API test successful${colors.reset}`);
        console.log(`${colors.dim}Response time: ${responseTime.toFixed(2)}ms${colors.reset}`);
        console.log(`${colors.dim}Successfully generated speech audio${colors.reset}`);
        
        // Just check that we're getting audio data back
        let dataSize = 0;
        res.on('data', (chunk) => {
          dataSize += chunk.length;
        });
        
        res.on('end', () => {
          console.log(`${colors.dim}Received ${dataSize} bytes of audio data${colors.reset}`);
          resolve(true);
        });
      } else {
        console.log(`${colors.red}✗ OpenAI TTS API test failed with status: ${res.statusCode}${colors.reset}`);
        console.log(`${colors.dim}Response time: ${responseTime.toFixed(2)}ms${colors.reset}`);
        
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          try {
            const parsedData = JSON.parse(data);
            console.log(`${colors.red}Error: ${parsedData.error?.message || 'Unknown error'}${colors.reset}`);
          } catch (error) {
            console.log(`${colors.red}Response: ${data}${colors.reset}`);
          }
          resolve(false);
        });
      }
    });
    
    req.on('error', (error) => {
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      console.log(`${colors.red}✗ OpenAI TTS API error: ${error.message}${colors.reset}`);
      console.log(`${colors.dim}Response time: ${responseTime.toFixed(2)}ms${colors.reset}`);
      resolve(false);
    });
    
    req.write(data);
    req.end();
  });
}

// Test ElevenLabs TTS API
async function testElevenLabsTTS() {
  if (!ELEVENLABS_API_KEY || !ELEVENLABS_VOICE_ID) {
    console.log(`\n${colors.yellow}Skipping ElevenLabs TTS test (API key or voice ID not configured)${colors.reset}`);
    return false;
  }
  
  console.log(`\n${colors.bright}Testing ElevenLabs TTS API:${colors.reset}`);
  const startTime = performance.now();
  
  return new Promise((resolve) => {
    const options = {
      hostname: 'api.elevenlabs.io',
      port: 443,
      path: `/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`,
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Type': 'application/json'
      }
    };
    
    const data = JSON.stringify({
      text: 'This is a test of the ElevenLabs text to speech API.',
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
      }
    });
    
    const req = https.request(options, (res) => {
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      if (res.statusCode === 200) {
        console.log(`${colors.green}✓ ElevenLabs TTS API test successful${colors.reset}`);
        console.log(`${colors.dim}Response time: ${responseTime.toFixed(2)}ms${colors.reset}`);
        console.log(`${colors.dim}Successfully generated speech audio${colors.reset}`);
        
        // Just check that we're getting audio data back
        let dataSize = 0;
        res.on('data', (chunk) => {
          dataSize += chunk.length;
        });
        
        res.on('end', () => {
          console.log(`${colors.dim}Received ${dataSize} bytes of audio data${colors.reset}`);
          resolve(true);
        });
      } else {
        console.log(`${colors.red}✗ ElevenLabs TTS API test failed with status: ${res.statusCode}${colors.reset}`);
        console.log(`${colors.dim}Response time: ${responseTime.toFixed(2)}ms${colors.reset}`);
        
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          try {
            const parsedData = JSON.parse(data);
            console.log(`${colors.red}Error: ${parsedData.detail || 'Unknown error'}${colors.reset}`);
          } catch (error) {
            console.log(`${colors.red}Response: ${data}${colors.reset}`);
          }
          resolve(false);
        });
      }
    });
    
    req.on('error', (error) => {
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      console.log(`${colors.red}✗ ElevenLabs TTS API error: ${error.message}${colors.reset}`);
      console.log(`${colors.dim}Response time: ${responseTime.toFixed(2)}ms${colors.reset}`);
      resolve(false);
    });
    
    req.write(data);
    req.end();
  });
}

// Print diagnostics summary
function printSummary(results) {
  console.log(`\n${colors.bright}${colors.blue}API Connectivity Summary:${colors.reset}`);
  
  console.log(`OpenAI API Configuration: ${results.openaiConfigured ? colors.green + '✓' : colors.red + '✗'}${colors.reset}`);
  console.log(`OpenAI API Connection: ${results.openaiConnection ? colors.green + '✓' : colors.red + '✗'}${colors.reset}`);
  console.log(`OpenAI TTS API: ${results.openaiTTS ? colors.green + '✓' : colors.red + '✗'}${colors.reset}`);
  
  console.log(`ElevenLabs API Configuration: ${results.elevenLabsConfigured ? colors.green + '✓' : colors.red + '✗'}${colors.reset}`);
  console.log(`ElevenLabs API Connection: ${results.elevenLabsConnection ? colors.green + '✓' : colors.red + '✗'}${colors.reset}`);
  console.log(`ElevenLabs Voice Access: ${results.elevenLabsVoice ? colors.green + '✓' : colors.red + '✗'}${colors.reset}`);
  console.log(`ElevenLabs TTS API: ${results.elevenLabsTTS ? colors.green + '✓' : colors.red + '✗'}${colors.reset}`);
  
  // Recommendation based on test results
  console.log(`\n${colors.bright}Recommendation:${colors.reset}`);
  
  if (results.openaiTTS || results.elevenLabsTTS) {
    console.log(`${colors.green}Your voice API connections are working! The issue may be on the client side.${colors.reset}`);
    console.log(`${colors.dim}Check browser console for errors, and ensure audio playback is allowed.${colors.reset}`);
  } else if (!results.openaiConfigured && !results.elevenLabsConfigured) {
    console.log(`${colors.red}No API keys configured. Add API keys to your environment.${colors.reset}`);
    console.log(`${colors.dim}Set OPENAI_API_KEY and/or ELEVENLABS_API_KEY environment variables.${colors.reset}`);
  } else if (!results.openaiConnection && !results.elevenLabsConnection) {
    console.log(`${colors.red}API keys configured but connections failing. Check API key validity and network.${colors.reset}`);
    console.log(`${colors.dim}Ensure your API keys are valid and there are no network issues.${colors.reset}`);
  } else {
    console.log(`${colors.yellow}Some API connections working, but TTS functionality failing.${colors.reset}`);
    console.log(`${colors.dim}Check API rate limits and request parameters.${colors.reset}`);
  }
}

// Main function to run all tests
async function runTests() {
  // Check API keys
  const keyStatus = checkApiKeys();
  
  // Run tests in parallel
  const [
    openaiConnection,
    elevenLabsConnection,
    elevenLabsVoice,
    openaiTTS,
    elevenLabsTTS
  ] = await Promise.all([
    testOpenAIConnection(),
    testElevenLabsConnection(),
    testSpecificVoice(),
    testOpenAITTS(),
    testElevenLabsTTS()
  ]);
  
  // Print summary
  printSummary({
    openaiConfigured: keyStatus.openaiConfigured,
    elevenLabsConfigured: keyStatus.elevenLabsConfigured,
    openaiConnection,
    elevenLabsConnection,
    elevenLabsVoice,
    openaiTTS,
    elevenLabsTTS
  });
}

// Run the tests
runTests().catch(error => {
  console.error(`${colors.red}Unhandled error:${colors.reset}`, error);
});
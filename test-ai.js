// Test script for AI integrations
import { ElevenLabsClient } from 'elevenlabs';
import OpenAI from 'openai';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { promises as fs } from 'fs';

// Load environment variables
dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_VOICE_ID = process.env.ELEVENLABS_DEFAULT_VOICE_ID;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

console.log('Starting AI integration tests...');
console.log(`OpenAI API Key available: ${!!OPENAI_API_KEY}`);
console.log(`ElevenLabs API Key available: ${!!ELEVENLABS_API_KEY}`);
console.log(`ElevenLabs Voice ID configured: ${!!ELEVENLABS_VOICE_ID}`);
console.log(`Gemini API Key available: ${!!GEMINI_API_KEY}`);

async function testOpenAI() {
  if (!OPENAI_API_KEY) {
    console.log('Skipping OpenAI test - API key not configured');
    return false;
  }

  try {
    console.log('Testing OpenAI integration...');
    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
    
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a workflow automation agent. Be concise.' },
        { role: 'user', content: 'What are 3 ways AI can help with email automation?' }
      ],
      temperature: 0.7,
      max_tokens: 150,
    });

    console.log('OpenAI Response:');
    console.log(response.choices[0].message.content);
    return true;
  } catch (error) {
    console.error('OpenAI test failed:', error.message);
    return false;
  }
}

async function testGemini() {
  if (!GEMINI_API_KEY) {
    console.log('Skipping Gemini test - API key not configured');
    return false;
  }

  try {
    console.log('Testing Gemini integration...');
    const genAI = new GoogleGenAI(GEMINI_API_KEY);
    
    // Get the Gemini model
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    // Test simple text generation
    const prompt = 'What are 3 ways AI can help with email automation?';
    console.log(`Sending prompt to Gemini: "${prompt}"`);
    
    const result = await model.generateContent(prompt);
    
    console.log('Gemini Response:');
    console.log(result.text());
    return true;
  } catch (error) {
    console.error('Gemini test failed:', error.message);
    return false;
  }
}

async function testElevenLabs() {
  if (!ELEVENLABS_API_KEY) {
    console.log('Skipping ElevenLabs test - API key not configured');
    return false;
  }

  try {
    console.log('Testing ElevenLabs integration...');
    const voice = new ElevenLabsClient({
      apiKey: ELEVENLABS_API_KEY,
    });

    // Use the voice ID from env, or the Rachel voice ID as a fallback
    const finalVoiceId = ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM'; // Rachel voice
    console.log(`Using voice ID: ${finalVoiceId}`);
    
    const response = await voice.textToSpeech.convert(
      finalVoiceId,
      {
        text: "Hello, this is a test of the ElevenLabs text to speech integration.",
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        }
      }
    );

    console.log('ElevenLabs response received successfully!');
    console.log(`Audio data size: ${response.byteLength} bytes`);
    
    // Save the audio to a file for testing
    await fs.writeFile('./test-voice.mp3', Buffer.from(await response.arrayBuffer()));
    console.log('Audio saved to test-voice.mp3');
    
    return true;
  } catch (error) {
    console.error('ElevenLabs test failed:', error.message);
    return false;
  }
}

async function runTests() {
  const openaiResult = await testOpenAI();
  const geminiResult = false; // Skip Gemini for now
  const elevenLabsResult = false; // Skip ElevenLabs for now
  
  console.log('\nTest Results:');
  console.log('=============');
  console.log(`OpenAI: ${openaiResult ? 'SUCCESS' : 'FAILED'}`);
  console.log(`Gemini: ${geminiResult ? 'SUCCESS' : 'FAILED'}`);
  console.log(`ElevenLabs: ${elevenLabsResult ? 'SUCCESS' : 'FAILED'}`);

  // Check if we have at least one working text model and one working voice model
  const hasWorkingTextModel = openaiResult || geminiResult;
  const hasWorkingVoiceModel = elevenLabsResult;

  if (hasWorkingTextModel && hasWorkingVoiceModel) {
    console.log('\n✅ SUCCESS: System has both working text and voice models');
  } else if (hasWorkingTextModel) {
    console.log('\n⚠️ PARTIAL SUCCESS: System has working text models but voice synthesis is not working');
  } else if (hasWorkingVoiceModel) {
    console.log('\n⚠️ PARTIAL SUCCESS: System has working voice synthesis but text models are not working');
  } else {
    console.log('\n❌ FAILURE: Neither text nor voice models are working');
  }
}

runTests();
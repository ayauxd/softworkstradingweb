import { ElevenLabsClient } from 'elevenlabs';
import OpenAI from 'openai';
import { aiConfig } from '../config';

// Initialize ElevenLabs instance if configured
const elevenlabs = aiConfig.elevenlabs.isConfigured 
  ? new ElevenLabsClient({
      apiKey: aiConfig.elevenlabs.apiKey as string,
    })
  : null;

// Initialize OpenAI client if configured (reusing from chat if already configured)
const openai = aiConfig.openai.isConfigured 
  ? new OpenAI({ apiKey: aiConfig.openai.apiKey as string })
  : null;

/**
 * Generate speech using ElevenLabs
 */
export async function generateElevenLabsSpeech(text: string, voiceId?: string): Promise<string> {
  if (!elevenlabs) {
    throw new Error('ElevenLabs client not configured');
  }

  // Use proper voice ID - not model ID
  const finalVoiceId = voiceId || aiConfig.elevenlabs.defaultVoiceId || '21m00Tcm4TlvDq8ikWAM'; // Rachel voice

  try {
    // Call ElevenLabs API to generate audio
    const response = await elevenlabs.textToSpeech.convert(
      finalVoiceId, 
      {
        text,
        model_id: 'eleven_multilingual_v2', // Updated model
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        }
      }
    );

    // Convert response to base64
    if (!response) {
      throw new Error('Empty response from ElevenLabs API');
    }
    
    // ElevenLabs response might not match the Readable expected type
    // We need to use it as a Blob or Response-like object
    // @ts-ignore - Bypass TypeScript type checking for this operation
    const audioBuffer = await response.arrayBuffer();
    return Buffer.from(audioBuffer).toString('base64');
  } catch (error) {
    console.error('Error generating ElevenLabs speech:', error);
    throw error;
  }
}

/**
 * Generate speech using OpenAI TTS
 */
export async function generateOpenAITTS(text: string): Promise<string> {
  if (!openai) {
    throw new Error('OpenAI client not configured');
  }

  try {
    // Call OpenAI TTS API
    const mp3Response = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'nova', // Options: alloy, echo, fable, onyx, nova, shimmer
      input: text,
    });

    // Convert the response to a buffer
    // @ts-ignore - Response shape might differ from type definitions
    const buffer = Buffer.from(await mp3Response.arrayBuffer());
    
    // Convert buffer to base64
    return buffer.toString('base64');
  } catch (error) {
    console.error('Error generating OpenAI TTS:', error);
    throw error;
  }
}
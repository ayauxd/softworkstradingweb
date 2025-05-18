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
 * Added improved error handling and validation
 */
export async function generateElevenLabsSpeech(text: string, voiceId?: string): Promise<string> {
  // Validate input parameters
  if (!text || typeof text !== 'string') {
    console.error('Invalid text parameter for ElevenLabs TTS');
    throw new Error('Invalid text parameter for speech generation');
  }

  // Ensure client is configured
  if (!elevenlabs) {
    console.error('ElevenLabs client not configured, check API key');
    throw new Error('ElevenLabs client not configured');
  }

  // Use proper voice ID - not model ID
  const finalVoiceId = voiceId || aiConfig.elevenlabs.defaultVoiceId || '21m00Tcm4TlvDq8ikWAM'; // Rachel voice
  
  console.log(`Generating ElevenLabs speech: ${text.length} chars, voice: ${finalVoiceId}`);
  
  try {
    // First verify that the voice exists
    try {
      // This will throw an error if the voice doesn't exist
      await elevenlabs.voices.get(finalVoiceId);
      console.log(`Voice ${finalVoiceId} confirmed available`);
    } catch (voiceError) {
      console.error(`Voice ${finalVoiceId} not found or not accessible:`, voiceError);
      // Fall back to a default voice that should be available if the configured one isn't
      console.log('Falling back to default voices');
      // Get available voices and use the first one
      const voices = await elevenlabs.voices.getAll();
      if (voices && voices.length > 0) {
        const fallbackVoice = voices[0];
        console.log(`Using fallback voice: ${fallbackVoice.name} (${fallbackVoice.voice_id})`);
        finalVoiceId = fallbackVoice.voice_id;
      } else {
        throw new Error('No voices available in ElevenLabs account');
      }
    }

    // Limit text length if needed (elevenlabs has character limits)
    const maxChars = 5000;
    let processedText = text;
    if (text.length > maxChars) {
      console.warn(`Text exceeded ${maxChars} chars, truncating`);
      processedText = text.substring(0, maxChars) + '...';
    }

    // Call ElevenLabs API to generate audio with timeout
    const apiPromise = elevenlabs.textToSpeech.convert(
      finalVoiceId, 
      {
        text: processedText,
        model_id: 'eleven_multilingual_v2', // Updated model
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        }
      }
    );
    
    // Add timeout to ensure we don't wait indefinitely
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('ElevenLabs API request timed out')), 15000);
    });
    
    // Race the promises
    const response = await Promise.race([apiPromise, timeoutPromise]) as any;

    // Convert response to base64
    if (!response) {
      console.error('Empty response from ElevenLabs API');
      throw new Error('Empty response from ElevenLabs API');
    }
    
    // Log successful response
    console.log('Received audio response from ElevenLabs API');
    
    // ElevenLabs response might not match the Readable expected type
    // We need to use it as a Blob or Response-like object
    try {
      // @ts-ignore - Bypass TypeScript type checking for this operation
      const audioBuffer = await response.arrayBuffer();
      if (!audioBuffer || audioBuffer.byteLength === 0) {
        throw new Error('Empty audio buffer received from ElevenLabs API');
      }
      console.log(`Audio buffer received: ${audioBuffer.byteLength} bytes`);
      return Buffer.from(audioBuffer).toString('base64');
    } catch (bufferError) {
      console.error('Error processing audio buffer:', bufferError);
      throw new Error('Failed to process audio data from ElevenLabs');
    }
  } catch (error) {
    console.error('Error generating ElevenLabs speech:', error);
    // Include more details in error message for debugging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`ElevenLabs TTS failed: ${errorMessage}`);
  }
}

/**
 * Generate speech using OpenAI TTS
 * Added improved error handling and validation
 */
export async function generateOpenAITTS(text: string): Promise<string> {
  // Validate input parameters
  if (!text || typeof text !== 'string') {
    console.error('Invalid text parameter for OpenAI TTS');
    throw new Error('Invalid text parameter for speech generation');
  }

  // Ensure client is configured
  if (!openai) {
    console.error('OpenAI client not configured, check API key');
    throw new Error('OpenAI client not configured');
  }
  
  console.log(`Generating OpenAI TTS speech: ${text.length} chars`);

  try {
    // Limit text length if needed (OpenAI has character limits)
    const maxChars = 4096;
    let processedText = text;
    if (text.length > maxChars) {
      console.warn(`Text exceeded ${maxChars} chars, truncating`);
      processedText = text.substring(0, maxChars) + '...';
    }

    // Call OpenAI TTS API with timeout
    const apiPromise = openai.audio.speech.create({
      model: 'tts-1',
      voice: 'nova', // Options: alloy, echo, fable, onyx, nova, shimmer
      input: processedText,
    });
    
    // Add timeout to ensure we don't wait indefinitely
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('OpenAI TTS API request timed out')), 15000);
    });
    
    // Race the promises
    const mp3Response = await Promise.race([apiPromise, timeoutPromise]);

    // Validate response
    if (!mp3Response) {
      throw new Error('Empty response from OpenAI TTS API');
    }

    // Log successful response
    console.log('Received audio response from OpenAI TTS API');

    try {
      // Convert the response to a buffer
      // @ts-ignore - Response shape might differ from type definitions
      const arrayBuffer = await mp3Response.arrayBuffer();
      if (!arrayBuffer || arrayBuffer.byteLength === 0) {
        throw new Error('Empty audio buffer received from OpenAI TTS API');
      }
      const buffer = Buffer.from(arrayBuffer);
      console.log(`Audio buffer received: ${buffer.length} bytes`);
      
      // Convert buffer to base64
      return buffer.toString('base64');
    } catch (bufferError) {
      console.error('Error processing audio buffer:', bufferError);
      throw new Error('Failed to process audio data from OpenAI TTS');
    }
  } catch (error) {
    console.error('Error generating OpenAI TTS:', error);
    // Include more details in error message for debugging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`OpenAI TTS failed: ${errorMessage}`);
  }
}
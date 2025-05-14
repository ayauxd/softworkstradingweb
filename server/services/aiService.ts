import { storage } from '../storage';
import { aiConfig } from '../config';
import { generateOpenAIResponse, generateGeminiResponse } from './aiIntegration';
import { generateElevenLabsSpeech, generateOpenAITTS } from './voiceIntegration';
import { ChatResponse, VoiceResponse } from '../../shared/aiModels';

/**
 * Mock chat response for development mode when API keys are not available
 */
function mockChatResponse(message: string, conversationId?: string): ChatResponse {
  console.log('Using mock AI chat response for:', message);
  const responses: Record<string, string> = {
    'hello': 'Hello! How can I help you with AI automation for your business today?',
    'hi': 'Hi there! I\'m the Workflow Agent for Softworks Trading. What business challenges would you like to discuss?',
    'how are you': 'I\'m doing well, thank you for asking! I\'m ready to help you automate repetitive tasks and implement AI solutions.',
    'what can you do': 'I can help with implementing AI solutions for your business, such as automating email responses, setting up document processing workflows, and creating custom chatbots for your website.',
    'help': 'I\'d be happy to help! I can assist with workflow automation, AI integration, and business process optimization. What specific area are you interested in?',
  };
  
  // Default response
  let response = 'I understand you\'re asking about "' + message + '". As your Workflow Agent, I can help implement practical AI solutions for this. Would you like to schedule a consultation to discuss this further?';
  
  // Check for exact or partial matches
  const lowerMessage = message.toLowerCase();
  
  // Check for exact matches first
  if (responses[lowerMessage]) {
    response = responses[lowerMessage];
  } else {
    // Check for partial matches
    for (const key of Object.keys(responses)) {
      if (lowerMessage.includes(key)) {
        response = responses[key];
        break;
      }
    }
  }
  
  return {
    text: response,
    success: true,
    provider: 'mock',
    conversationId: conversationId || 'mock-conv-' + Date.now()
  };
}

/**
 * Mock voice response for development mode when API keys are not available
 */
function mockVoiceResponse(text: string): VoiceResponse {
  console.log('Using mock voice response for:', text);
  
  return {
    // Return a base64 placeholder - this would usually be audio data
    audioData: 'mockAudioData',
    success: true,
    provider: 'mock'
  };
}

/**
 * Service layer for AI integrations (OpenAI, Gemini, ElevenLabs)
 */
export const aiService = {
  /**
   * Send a message to the chat AI service
   * First tries OpenAI, falls back to Gemini if OpenAI fails, 
   * finally falls back to a mock service in development
   */
  sendChatMessage: async (message: string, conversationId?: string): Promise<ChatResponse> => {
    try {
      // Check if API keys are configured
      if (!aiConfig.openai.isConfigured && !aiConfig.gemini.isConfigured) {
        console.log('No API keys configured, using mock AI service');
        return mockChatResponse(message, conversationId);
      }
      
      // Try OpenAI - our working model
      try {
        const openaiResponse = await sendToOpenAI(message, conversationId);
        return {
          text: openaiResponse,
          success: true,
          provider: 'openai',
          conversationId: conversationId
        };
      } catch (error) {
        console.error('OpenAI chat error:', error);
        
        // Try Gemini as fallback
        try {
          const geminiResponse = await sendToGemini(message, conversationId);
          return {
            text: geminiResponse,
            success: true,
            provider: 'gemini',
            conversationId: conversationId
          };
        } catch (geminiError) {
          console.error('Gemini chat error:', geminiError);
          
          // If in development, use mock service
          if (process.env.NODE_ENV === 'development') {
            return mockChatResponse(message, conversationId);
          }
          
          // All services failed, return graceful error message
          return {
            text: 'Sorry, I am currently unable to process your message. Please try again later.',
            success: false,
            provider: 'none',
            conversationId: conversationId
          };
        }
      }
    } catch (error) {
      console.error('Chat service error:', error);
      return {
        text: 'An unexpected error occurred. Please try again later.',
        success: false,
        provider: 'none',
        conversationId: conversationId
      };
    }
  },
  
  // Mock response for development when API keys are not available
  mockChatResponse: (message: string, conversationId?: string): ChatResponse => {
    return mockChatResponse(message, conversationId);
  },

  /**
   * Generate voice audio from text
   * First tries ElevenLabs, falls back to OpenAI TTS if ElevenLabs fails,
   * finally falls back to a mock service in development
   */
  generateVoiceResponse: async (text: string, voiceId?: string): Promise<VoiceResponse> => {
    try {
      // Check if API keys are configured
      if (!aiConfig.elevenlabs.isConfigured && !aiConfig.openai.isConfigured) {
        console.log('No voice API keys configured, using mock voice service');
        return mockVoiceResponse(text);
      }
      
      // Try ElevenLabs first
      try {
        const elevenLabsAudio = await generateWithElevenLabs(text, voiceId);
        return {
          audioData: elevenLabsAudio,
          success: true,
          provider: 'elevenlabs'
        };
      } catch (elevenLabsError) {
        console.error('ElevenLabs error:', elevenLabsError);
        
        try {
          // Fall back to OpenAI TTS
          const openaiAudio = await generateWithOpenAITTS(text);
          return {
            audioData: openaiAudio,
            success: true,
            provider: 'openai'
          };
        } catch (openaiError) {
          console.error('OpenAI TTS error:', openaiError);
          
          // If in development, use mock service
          if (process.env.NODE_ENV === 'development') {
            return mockVoiceResponse(text);
          }
          
          // Return graceful error response for production
          return {
            audioData: null,
            success: false,
            provider: 'none'
          };
        }
      }
    } catch (error) {
      console.error('Voice service error:', error);
      
      // If in development, use mock service
      if (process.env.NODE_ENV === 'development') {
        return mockVoiceResponse(text);
      }
      
      // Return graceful error response
      return {
        audioData: null,
        success: false,
        provider: 'none'
      };
    }
  },
  
  // Mock voice response for development when API keys are not available
  mockVoiceResponse: (text: string): VoiceResponse => {
    return mockVoiceResponse(text);
  }
};

// Helper functions for API communication

/**
 * Send a message to OpenAI
 */
async function sendToOpenAI(message: string, conversationId?: string): Promise<string> {
  if (!aiConfig.openai.isConfigured) {
    throw new Error('OpenAI API key not configured');
  }

  return await generateOpenAIResponse(message, conversationId);
}

/**
 * Send a message to Gemini (Google's AI model)
 */
async function sendToGemini(message: string, conversationId?: string): Promise<string> {
  if (!aiConfig.gemini.isConfigured) {
    throw new Error('Gemini API key not configured');
  }

  return await generateGeminiResponse(message, conversationId);
}

/**
 * Generate speech audio using ElevenLabs
 */
async function generateWithElevenLabs(text: string, voiceId?: string): Promise<string> {
  if (!aiConfig.elevenlabs.isConfigured) {
    throw new Error('ElevenLabs API key not configured');
  }

  return await generateElevenLabsSpeech(text, voiceId);
}

/**
 * Generate speech audio using OpenAI TTS (Text-to-Speech)
 */
async function generateWithOpenAITTS(text: string): Promise<string> {
  if (!aiConfig.openai.isConfigured) {
    throw new Error('OpenAI API key not configured');
  }

  return await generateOpenAITTS(text);
}
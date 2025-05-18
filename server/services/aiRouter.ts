import { storage } from '../storage';
import { aiConfig } from '../config';
import { generateOpenAIResponse } from './aiIntegration';
import { generateElevenLabsSpeech, generateOpenAITTS } from './voiceIntegration';
import { ChatResponse, VoiceResponse } from '../../shared/aiModels';
import { logger } from '../utils/logger';

// Define provider interface for the strategy pattern
interface AIProvider {
  id: string;
  isConfigured: boolean;
  sendMessage: (message: string, conversationId?: string) => Promise<string>;
  getUsageMetrics: () => {
    tokens: number;
    latency: number;
    cost: number;
  };
}

// Define voice provider interface
interface VoiceProvider {
  id: string;
  isConfigured: boolean;
  generateSpeech: (text: string, voiceId?: string) => Promise<string>;
  getUsageMetrics: () => {
    characters: number;
    latency: number;
    cost: number;
  };
}

// OpenAI provider implementation
class OpenAIProvider implements AIProvider {
  id = 'openai';
  isConfigured = aiConfig.openai.isConfigured;
  totalTokens = 0;
  totalLatency = 0;
  requestCount = 0;

  async sendMessage(message: string, conversationId?: string): Promise<string> {
    if (!this.isConfigured) {
      throw new Error('OpenAI API key not configured');
    }

    const startTime = Date.now();
    try {
      const response = await generateOpenAIResponse(message, conversationId);
      
      // Track metrics
      const endTime = Date.now();
      this.totalLatency += (endTime - startTime);
      this.requestCount++;
      // Estimate tokens (rough approximation - would be better to get from API)
      this.totalTokens += Math.ceil(message.length / 4) + Math.ceil(response.length / 4);
      
      return response;
    } catch (error) {
      logger.error(`OpenAI provider error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }

  getUsageMetrics() {
    return {
      tokens: this.totalTokens,
      latency: this.requestCount > 0 ? this.totalLatency / this.requestCount : 0,
      cost: this.totalTokens * 0.000002, // Approximate cost per token
    };
  }
}

// Mock provider implementation for development
class MockProvider implements AIProvider {
  id = 'mock';
  isConfigured = true;
  
  async sendMessage(message: string, conversationId?: string): Promise<string> {
    logger.debug('Using mock AI provider for:', { messageLength: message.length });
    
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
    
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return response;
  }

  getUsageMetrics() {
    return {
      tokens: 0,
      latency: 0,
      cost: 0,
    };
  }
}

// ElevenLabs voice provider implementation
class ElevenLabsVoiceProvider implements VoiceProvider {
  id = 'elevenlabs';
  isConfigured = aiConfig.elevenlabs.isConfigured;
  totalCharacters = 0;
  totalLatency = 0;
  requestCount = 0;

  async generateSpeech(text: string, voiceId?: string): Promise<string> {
    if (!this.isConfigured) {
      throw new Error('ElevenLabs API key not configured');
    }

    const startTime = Date.now();
    try {
      const audio = await generateElevenLabsSpeech(text, voiceId);
      
      // Track metrics
      const endTime = Date.now();
      this.totalLatency += (endTime - startTime);
      this.requestCount++;
      this.totalCharacters += text.length;
      
      return audio;
    } catch (error) {
      logger.error(`ElevenLabs provider error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }

  getUsageMetrics() {
    return {
      characters: this.totalCharacters,
      latency: this.requestCount > 0 ? this.totalLatency / this.requestCount : 0,
      cost: this.totalCharacters * 0.000003, // Approximate cost per character
    };
  }
}

// OpenAI TTS voice provider implementation
class OpenAITTSVoiceProvider implements VoiceProvider {
  id = 'openai-tts';
  isConfigured = aiConfig.openai.isConfigured;
  totalCharacters = 0;
  totalLatency = 0;
  requestCount = 0;

  async generateSpeech(text: string): Promise<string> {
    if (!this.isConfigured) {
      throw new Error('OpenAI API key not configured');
    }

    const startTime = Date.now();
    try {
      const audio = await generateOpenAITTS(text);
      
      // Track metrics
      const endTime = Date.now();
      this.totalLatency += (endTime - startTime);
      this.requestCount++;
      this.totalCharacters += text.length;
      
      return audio;
    } catch (error) {
      logger.error(`OpenAI TTS provider error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }

  getUsageMetrics() {
    return {
      characters: this.totalCharacters,
      latency: this.requestCount > 0 ? this.totalLatency / this.requestCount : 0,
      cost: this.totalCharacters * 0.000015, // Approximate cost per character
    };
  }
}

// Mock voice provider implementation
class MockVoiceProvider implements VoiceProvider {
  id = 'mock-voice';
  isConfigured = true;
  
  async generateSpeech(text: string): Promise<string> {
    logger.debug('Using mock voice provider for:', { textLength: text.length });
    
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Return a mock audio data string
    return 'mockAudioData';
  }

  getUsageMetrics() {
    return {
      characters: 0,
      latency: 0,
      cost: 0,
    };
  }
}

/**
 * AI Router - Manages provider selection, fallbacks, and metrics
 */
class AIRouter {
  private providers: AIProvider[] = [];
  private voiceProviders: VoiceProvider[] = [];
  
  constructor() {
    // Initialize providers
    this.providers = [
      new OpenAIProvider(),
      new MockProvider()
    ];
    
    this.voiceProviders = [
      new ElevenLabsVoiceProvider(),
      new OpenAITTSVoiceProvider(),
      new MockVoiceProvider()
    ];
  }
  
  /**
   * Send a message to the most appropriate AI provider
   */
  async sendChatMessage(message: string, conversationId?: string): Promise<ChatResponse> {
    logger.info('AI Router processing message', { messageLength: message.length, conversationId });
    
    // Filter out providers that aren't configured
    const availableProviders = this.providers.filter(p => p.isConfigured);
    
    if (availableProviders.length === 0) {
      logger.warn('No AI providers configured');
      return {
        text: 'I\'m sorry, but I\'m currently unable to process messages. Please try again later.',
        success: false,
        provider: 'none',
        conversationId
      };
    }
    
    // Try each provider in priority order
    for (const provider of availableProviders) {
      try {
        logger.debug(`Attempting to use ${provider.id} provider`);
        const response = await provider.sendMessage(message, conversationId);
        
        logger.debug(`${provider.id} provider succeeded`);
        return {
          text: response,
          success: true,
          provider: provider.id,
          conversationId,
          metrics: provider.getUsageMetrics()
        };
      } catch (error) {
        logger.error(`Provider ${provider.id} failed:`, error);
        // Continue to the next provider
      }
    }
    
    // If we get here, all providers failed
    return {
      text: 'I apologize, but I\'m experiencing technical difficulties. Please try again later.',
      success: false,
      provider: 'none',
      conversationId
    };
  }
  
  /**
   * Generate voice audio from text using the most appropriate provider
   */
  async generateVoiceAudio(text: string, voiceId?: string): Promise<VoiceResponse> {
    logger.info('AI Router processing voice request', { textLength: text.length });
    
    // Filter out providers that aren't configured
    const availableProviders = this.voiceProviders.filter(p => p.isConfigured);
    
    if (availableProviders.length === 0) {
      logger.warn('No voice providers configured');
      return {
        audioData: null,
        success: false,
        provider: 'none'
      };
    }
    
    // Try each provider in priority order
    for (const provider of availableProviders) {
      try {
        logger.debug(`Attempting to use ${provider.id} voice provider`);
        const audioData = await provider.generateSpeech(text, voiceId);
        
        logger.debug(`${provider.id} voice provider succeeded`);
        return {
          audioData,
          success: true,
          provider: provider.id,
          metrics: provider.getUsageMetrics()
        };
      } catch (error) {
        logger.error(`Voice provider ${provider.id} failed:`, error);
        // Continue to the next provider
      }
    }
    
    // If we get here, all providers failed
    return {
      audioData: null,
      success: false,
      provider: 'none'
    };
  }
  
  /**
   * Get usage metrics for all providers
   */
  getMetrics() {
    return {
      text: this.providers.map(p => ({
        provider: p.id,
        ...p.getUsageMetrics()
      })),
      voice: this.voiceProviders.map(p => ({
        provider: p.id,
        ...p.getUsageMetrics()
      }))
    };
  }
}

// Singleton instance
const aiRouter = new AIRouter();

export default aiRouter;
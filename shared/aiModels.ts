/**
 * Shared interfaces for AI service
 */

// Chat request interface
export interface ChatRequest {
  message: string;
  conversationId?: string;
}

// Chat response interface
export interface ChatResponse {
  text: string;
  success: boolean;
  provider: string;
  conversationId?: string;
}

// Voice generation request interface
export interface VoiceRequest {
  text: string;
  voiceId?: string;
}

// Voice response interface
export interface VoiceResponse {
  audioData: string | null; // base64 encoded audio
  success: boolean;
  provider: string;
}

// Conversation message interface
export interface ConversationMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// Provider type for AI services
export type AIProvider = 'openai' | 'gemini' | 'elevenlabs' | 'none';
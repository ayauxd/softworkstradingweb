import OpenAI from 'openai';
import { GoogleGenAI } from '@google/genai';
import { aiConfig } from '../config';
import { conversationManager } from '../utils/conversation';
import { ConversationMessage } from '../../shared/aiModels';
import { knowledgeService } from './knowledgeService';

// Initialize OpenAI client if configured with enhanced error handling
let openai = null;
if (aiConfig.openai.isConfigured) {
  try {
    console.log('Initializing OpenAI client with API key format:', 
      aiConfig.openai.apiKey ? 
        `${aiConfig.openai.apiKey.substring(0, 7)}... (length: ${aiConfig.openai.apiKey.length})` : 
        'No API key');
    
    openai = new OpenAI({ 
      apiKey: aiConfig.openai.apiKey as string,
      timeout: 30000,  // 30 second timeout
      maxRetries: 2,   // Retry twice on failures
    });
    
    console.log('OpenAI client successfully initialized');
  } catch (error) {
    console.error('Error initializing OpenAI client:', error);
  }
}

// Initialize Google Generative AI (Gemini) client if configured
const gemini = aiConfig.gemini.isConfigured
  ? new GoogleGenAI({
      apiKey: aiConfig.gemini.apiKey as string
    })
  : null;

/**
 * OpenAI integration for chat
 */
export async function generateOpenAIResponse(message: string, conversationId?: string): Promise<string> {
  console.log('OpenAI Response Request:', { messageLength: message.length, hasConversationId: !!conversationId });
  
  if (!openai) {
    console.error('OpenAI client not configured - API key issue or initialization error');
    throw new Error('OpenAI client not configured - please check your API key and configuration');
  }

  // Create or retrieve conversation ID
  const convId = conversationId || conversationManager.generateConversationId();
  
  // Get comprehensive system prompt with company information
  const systemMessage = knowledgeService.generateSystemPrompt('standard');

  // Get the conversation history
  const conversation = conversationManager.getConversation(convId);
  
  // Add system message if it doesn't exist
  if (!conversation.some(msg => msg.role === 'system')) {
    conversationManager.addMessage(convId, 'system', systemMessage);
  }
  
  // Add user message to history
  conversationManager.addMessage(convId, 'user', message);
  
  // Get recent messages including system message
  const apiMessages = conversationManager.getRecentMessages(convId, 15);
  
  // Call OpenAI API with the conversation history
  console.log('Calling OpenAI API with', apiMessages.length, 'messages');
  
  let response;
  try {
    response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: apiMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      temperature: 0.7,
      max_tokens: 500,
    });
    
    console.log('OpenAI API response received successfully');
  } catch (error) {
    console.error('OpenAI API error:', error);
    
    // For debugging - log additional details
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      // If it's an OpenAI API error with status code, extract more details
      if ('status' in error) {
        console.error('Status code:', (error as any).status);
      }
    }
    
    // Rethrow with more information
    throw new Error(`OpenAI API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  // Get the assistant's response
  const responseContent = response.choices[0]?.message?.content || 'I apologize, but I am unable to process your request at the moment.';

  // Add assistant response to history
  conversationManager.addMessage(convId, 'assistant', responseContent);

  return responseContent;
}

/**
 * Google Gemini integration for chat
 */
export async function generateGeminiResponse(message: string, conversationId?: string): Promise<string> {
  if (!gemini) {
    throw new Error('Gemini client not configured');
  }

  // Create or retrieve conversation ID
  const convId = conversationId || conversationManager.generateConversationId();
  
  // Get comprehensive system prompt with company information
  const systemMessage = knowledgeService.generateSystemPrompt('standard');

  // Get the conversation history
  const conversation = conversationManager.getConversation(convId);
  
  // Add system message if it doesn't exist
  if (!conversation.some(msg => msg.role === 'system')) {
    conversationManager.addMessage(convId, 'system', systemMessage);
  }
  
  // Add user message to history
  conversationManager.addMessage(convId, 'user', message);

  // Get Gemini model
  // @ts-ignore - The type definitions for Google Genai are outdated
  const model = gemini.getGenerativeModel({ modelName: 'gemini-pro' });
  
  // Convert conversation history to Gemini format
  const geminiHistory = conversation
    .filter(msg => msg.role !== 'system') // Gemini doesn't support system messages in the same way
    .map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model' as 'user' | 'model',
      parts: [{ text: msg.content }],
    }));
  
  // Prepare conversation for chat
  const chat = model.startChat({
    history: geminiHistory,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 500,
    },
  });

  // Generate response with system prompt prepended to the message
  // This is our workaround since Gemini doesn't have a system message
  const result = await chat.sendMessage(`${systemMessage}\n\nUser: ${message}`);
  
  const responseText = result.response.text();

  // Add assistant response to history
  conversationManager.addMessage(convId, 'assistant', responseText);

  return responseText;
}

/**
 * Get conversation history (using new conversation manager)
 */
export function getConversationHistory(conversationId: string) {
  return conversationManager.getConversation(conversationId);
}

/**
 * Clear conversation history (using new conversation manager)
 */
export function clearConversationHistory(conversationId: string): boolean {
  return conversationManager.clearConversation(conversationId);
}
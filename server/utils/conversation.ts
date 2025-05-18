import { storage } from '../storage';
import { logger } from './logger';
import { ConversationMessage } from '../../shared/aiModels';

// Extended conversation message interface with timestamp
interface EnhancedConversationMessage extends ConversationMessage {
  timestamp: number;
}

export interface Conversation {
  id: string;
  messages: EnhancedConversationMessage[];
  createdAt: number;
  updatedAt: number;
  metadata?: Record<string, any>;
}

// Maximum number of messages to store in a conversation
const MAX_CONVERSATION_MESSAGES = 100;

// Maximum number of characters per message for storage efficiency
const MAX_MESSAGE_LENGTH = 2000;

/**
 * Enhanced Conversation Manager - Handles storing, retrieving, and optimizing conversation histories
 */
class ConversationManagerClass {
  private conversations: Map<string, Conversation> = new Map();
  
  constructor() {
    // Initialize from storage if available
    this.loadFromStorage();
  }

  /**
   * Generate a unique conversation ID
   */
  generateConversationId(): string {
    return `conv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  }
  
  /**
   * Create a new conversation
   */
  createConversation(systemPrompt?: string): string {
    const id = this.generateConversationId();
    const conversation: Conversation = {
      id,
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    // Add system prompt if provided
    if (systemPrompt) {
      conversation.messages.push({
        role: 'system',
        content: systemPrompt,
        timestamp: Date.now()
      });
    }
    
    this.conversations.set(id, conversation);
    this.saveToStorage();
    
    return id;
  }
  
  /**
   * Get conversation history for a given ID
   */
  getConversation(conversationId: string): ConversationMessage[] {
    const conversation = this.conversations.get(conversationId);
    if (!conversation) return [];
    
    // Convert to standard ConversationMessage format (without timestamps)
    return conversation.messages.map(({ role, content }) => ({ 
      role, 
      content 
    }));
  }
  
  /**
   * Add a message to conversation history
   */
  addMessage(
    conversationId: string, 
    role: 'user' | 'assistant' | 'system', 
    content: string
  ): void {
    // Get or create the conversation
    let conversation = this.conversations.get(conversationId);
    
    if (!conversation) {
      conversationId = this.createConversation();
      conversation = this.conversations.get(conversationId)!;
    }
    
    // Truncate message if needed
    if (content.length > MAX_MESSAGE_LENGTH) {
      logger.warn(`Truncating message from ${content.length} to ${MAX_MESSAGE_LENGTH} characters`);
      content = content.substring(0, MAX_MESSAGE_LENGTH) + '... [truncated]';
    }
    
    // Add the message
    conversation.messages.push({
      role,
      content,
      timestamp: Date.now()
    });
    
    // Update the conversation
    conversation.updatedAt = Date.now();
    
    // Prune if necessary
    if (conversation.messages.length > MAX_CONVERSATION_MESSAGES) {
      this.pruneConversation(conversationId);
    }
    
    // Save to storage
    this.saveToStorage();
  }
  
  /**
   * Prune a conversation to keep it within limits
   * Keeps the first system message and the most recent messages
   */
  pruneConversation(conversationId: string): void {
    const conversation = this.conversations.get(conversationId);
    
    if (!conversation) return;
    
    if (conversation.messages.length <= MAX_CONVERSATION_MESSAGES) return;
    
    logger.info(`Pruning conversation ${conversationId} from ${conversation.messages.length} to ${MAX_CONVERSATION_MESSAGES} messages`);
    
    // Separate system messages from the rest
    const systemMessages = conversation.messages.filter(m => m.role === 'system');
    const nonSystemMessages = conversation.messages.filter(m => m.role !== 'system');
    
    // Keep the most recent non-system messages
    const messagesToKeep = nonSystemMessages.slice(-MAX_CONVERSATION_MESSAGES + systemMessages.length);
    
    // Combine system messages with most recent messages
    conversation.messages = [...systemMessages, ...messagesToKeep];
    
    this.saveToStorage();
  }
  
  /**
   * Clear conversation history
   */
  clearConversation(conversationId: string): boolean {
    const result = this.conversations.delete(conversationId);
    if (result) {
      this.saveToStorage();
    }
    return result;
  }
  
  /**
   * Get most recent messages (useful for context window limits)
   */
  getRecentMessages(conversationId: string, count: number = 10): ConversationMessage[] {
    const conversation = this.conversations.get(conversationId);
    if (!conversation) return [];
    
    // Always include system message if it exists
    const systemMessages = conversation.messages.filter(msg => msg.role === 'system');
    
    // Get the most recent messages
    const recentMessages = conversation.messages
      .filter(msg => msg.role !== 'system')
      .slice(-count);
    
    // Convert to standard ConversationMessage format (without timestamps)
    return [...systemMessages, ...recentMessages].map(({ role, content }) => ({ 
      role, 
      content 
    }));
  }
  
  /**
   * Get all conversation history (for debugging)
   */
  getAllConversations(): Record<string, ConversationMessage[]> {
    const result: Record<string, ConversationMessage[]> = {};
    
    for (const [id, conversation] of this.conversations.entries()) {
      result[id] = conversation.messages.map(({ role, content }) => ({ 
        role, 
        content 
      }));
    }
    
    return result;
  }
  
  /**
   * Save conversations to storage
   */
  private saveToStorage(): void {
    try {
      // Convert Map to array for storage
      const conversationsArray = Array.from(this.conversations.values());
      
      // Only keep conversations from the last 30 days
      const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
      const recentConversations = conversationsArray.filter(c => c.updatedAt >= thirtyDaysAgo);
      
      storage.set('conversations', recentConversations);
    } catch (error) {
      logger.error('Error saving conversations to storage:', error);
    }
  }
  
  /**
   * Load conversations from storage
   */
  private loadFromStorage(): void {
    try {
      const conversationsArray = storage.get('conversations') as Conversation[] || [];
      
      // Convert array to Map
      this.conversations = new Map(
        conversationsArray.map(conversation => [conversation.id, conversation])
      );
      
      logger.info(`Loaded ${this.conversations.size} conversations from storage`);
    } catch (error) {
      logger.error('Error loading conversations from storage:', error);
    }
  }
  
  /**
   * Get metrics about conversations
   */
  getMetrics(): Record<string, any> {
    const conversationsArray = Array.from(this.conversations.values());
    const totalMessages = conversationsArray.reduce(
      (sum, conv) => sum + conv.messages.length, 
      0
    );
    
    return {
      totalConversations: this.conversations.size,
      totalMessages,
      averageMessagesPerConversation: this.conversations.size > 0 
        ? totalMessages / this.conversations.size 
        : 0,
      oldestConversation: conversationsArray.length > 0 
        ? Math.min(...conversationsArray.map(c => c.createdAt))
        : null,
      newestConversation: conversationsArray.length > 0
        ? Math.max(...conversationsArray.map(c => c.createdAt))
        : null
    };
  }
}

// Create and export a singleton instance
export const conversationManager = new ConversationManagerClass();
import { ConversationMessage } from '../../shared/aiModels';

// In-memory conversation store (for development)
// In production, this would be replaced with a database
const conversationStore = new Map<string, ConversationMessage[]>();

/**
 * Utility for managing conversation history
 */
export const conversationManager = {
  /**
   * Generate a unique conversation ID
   */
  generateConversationId(): string {
    return `conv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  },

  /**
   * Get conversation history for a given ID
   */
  getConversation(conversationId: string): ConversationMessage[] {
    return conversationStore.get(conversationId) || [];
  },

  /**
   * Add a message to conversation history
   */
  addMessage(
    conversationId: string, 
    role: 'user' | 'assistant' | 'system', 
    content: string
  ): void {
    if (!conversationStore.has(conversationId)) {
      conversationStore.set(conversationId, []);
    }
    
    const conversation = conversationStore.get(conversationId)!;
    conversation.push({ role, content });
    
    // Limit conversation history to prevent memory issues
    if (conversation.length > 50) {
      // Keep system message if it exists
      const systemMessage = conversation.find(msg => msg.role === 'system');
      
      // Remove oldest messages, but keep the last 20
      const newConversation = conversation.slice(conversation.length - 20);
      
      // Add system message back to the beginning if it existed
      if (systemMessage && !newConversation.some(msg => msg.role === 'system')) {
        newConversation.unshift(systemMessage);
      }
      
      conversationStore.set(conversationId, newConversation);
    }
  },

  /**
   * Clear conversation history
   */
  clearConversation(conversationId: string): boolean {
    return conversationStore.delete(conversationId);
  },

  /**
   * Get all conversation history (for debugging)
   */
  getAllConversations(): Map<string, ConversationMessage[]> {
    return new Map(conversationStore);
  },
  
  /**
   * Get most recent messages (useful for context window limits)
   */
  getRecentMessages(conversationId: string, count: number = 10): ConversationMessage[] {
    const conversation = this.getConversation(conversationId);
    
    // Always include system message if it exists
    const systemMessage = conversation.find(msg => msg.role === 'system');
    
    // Get the most recent messages
    const recentMessages = conversation.slice(-count);
    
    // Add system message at the beginning if it exists and isn't already included
    if (systemMessage && !recentMessages.some(msg => msg.role === 'system')) {
      return [systemMessage, ...recentMessages];
    }
    
    return recentMessages;
  }
};
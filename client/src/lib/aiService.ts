import { getCsrfToken } from './csrf';
import { ChatResponse, VoiceResponse } from '../../../shared/aiModels';
import { generateSystemPrompt } from './companyInfo';

// Helper to manage conversation IDs in localStorage
export const conversationManager = {
  getCurrentConversationId: (): string | null => {
    return localStorage.getItem('currentConversationId');
  },
  
  setCurrentConversationId: (id: string): void => {
    localStorage.setItem('currentConversationId', id);
  },
  
  generateNewConversationId: (): string => {
    const id = `conv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    localStorage.setItem('currentConversationId', id);
    return id;
  },
  
  clearCurrentConversation: (): void => {
    localStorage.removeItem('currentConversationId');
  }
};

/**
 * Client-side service for interacting with AI endpoints
 */
export const aiService = {
  /**
   * Send a chat message to the AI service
   */
  sendChatMessage: async (message: string, conversationId?: string): Promise<ChatResponse> => {
    try {
      // Get CSRF token with error handling
      let csrfToken = '';
      try {
        csrfToken = await getCsrfToken();
      } catch (csrfError) {
        console.error('Error getting CSRF token:', csrfError);
        throw new Error('Could not get CSRF token for API call');
      }
      
      // Get current conversation ID or generate a new one if not provided
      const currentConversationId = conversationId || 
                                   conversationManager.getCurrentConversationId() || 
                                   conversationManager.generateNewConversationId();
      
      // Call the server API endpoint
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken
        },
        body: JSON.stringify({ message, conversationId: currentConversationId })
      });
      
      if (!response.ok) {
        throw new Error(`AI chat request failed: ${response.status}`);
      }
      
      const responseData = await response.json();
      
      // If the server returns a new conversation ID, update our stored one
      if (responseData.conversationId) {
        conversationManager.setCurrentConversationId(responseData.conversationId);
      }
      
      return responseData;
    } catch (error) {
      console.error('Error sending chat message:', error);
      return {
        text: 'Sorry, there was an error processing your message. Please try again.',
        success: false,
        provider: 'none'
      };
    }
  },
  
  /**
   * Generate voice audio from text
   */
  generateVoiceAudio: async (text: string, voiceId?: string): Promise<VoiceResponse> => {
    try {
      // Get CSRF token with error handling
      let csrfToken = '';
      try {
        csrfToken = await getCsrfToken();
      } catch (csrfError) {
        console.error('Error getting CSRF token:', csrfError);
        throw new Error('Could not get CSRF token for API call');
      }
      
      const response = await fetch('/api/ai/voice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken
        },
        body: JSON.stringify({ text, voiceId })
      });
      
      if (!response.ok) {
        throw new Error(`AI voice request failed: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error generating voice audio:', error);
      
      // No fallback, just return error response to ensure security
      return {
        audioData: '',
        success: false,
        provider: 'none'
      };
    }
  },
  
  /**
   * Handle voice call summary and email
   * @param callSummary Summary of the call
   * @param userEmail Optional user email for follow-up
   */
  sendCallSummary: async (callSummary: string, userEmail?: string): Promise<boolean> => {
    try {
      // Get CSRF token
      const csrfToken = await getCsrfToken();
      
      // Send call summary to server
      const response = await fetch('/api/ai/call-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken
        },
        body: JSON.stringify({
          summary: callSummary,
          userEmail: userEmail || 'Not provided',
          timestamp: new Date().toISOString()
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to send call summary: ${response.status}`);
      }
      
      return true;
    } catch (error) {
      console.error('Error sending call summary:', error);
      
      // Fallback: If API fails, try to send email directly
      try {
        // Create a mailto link and open it
        const mailtoLink = `mailto:agents@softworkstrading.com?subject=Call Summary - ${new Date().toLocaleString()}&body=${encodeURIComponent(callSummary)}`;
        window.open(mailtoLink, '_blank');
        
        return true;
      } catch (emailError) {
        console.error('Failed to open email client:', emailError);
        return false;
      }
    }
  },
  
  /**
   * Play audio from data URL or base64 string
   */
  playAudio: (audioData: string): void => {
    try {
      // Check if the audioData is already a data URL
      const dataUrl = audioData.startsWith('data:') 
        ? audioData 
        : `data:audio/mp3;base64,${audioData}`;
      
      const audio = new Audio(dataUrl);
      
      // Add error handling
      audio.onerror = (e) => {
        console.error('Error playing audio:', e);
      };
      
      // Play the audio
      audio.play().catch(error => {
        console.error('Error playing audio:', error);
      });
    } catch (error) {
      console.error('Error initializing audio playback:', error);
    }
  }
};
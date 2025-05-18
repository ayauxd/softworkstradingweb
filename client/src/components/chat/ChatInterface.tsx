import { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { aiService, conversationManager } from "@/lib/aiService";
import ChatMessage from "./ChatMessage";

interface ChatInterfaceProps {
  onClearHistory?: () => void;
}

/**
 * ChatInterface - Handles the chat functionality
 */
const ChatInterface = ({ onClearHistory }: ChatInterfaceProps) => {
  const { toast } = useToast();
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<Array<{from: string, text: string}>>(() => {
    // Load existing conversation from enhanced conversationManager
    const savedMessages = conversationManager.getCurrentMessages();
    if (savedMessages && savedMessages.length > 0) {
      return savedMessages;
    }
    
    // Return default welcome message if no saved messages
    return [{ 
      from: "agent", 
      text: "Hello! I'm your workflow agent. How can I help you today?" 
    }];
  });
  
  // Rotating placeholder suggestions for chat input
  const placeholderSuggestions = [
    "How can I simplify my daily tasks with AI?",
    "How can I automate follow-ups from my inbox?",
    "How can AI improve my client onboarding?",
    "How can I connect AI to my spreadsheets?",
    "How can I reduce repetitive admin work?"
  ];
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Rotate placeholders every 4 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentPlaceholderIndex(prevIndex => 
        (prevIndex + 1) % placeholderSuggestions.length
      );
    }, 4000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Scroll to bottom of chat when messages change and save to localStorage
  useEffect(() => {
    // Scroll to bottom of messages
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
    
    // Save messages to enhanced localStorage manager
    conversationManager.saveMessages(messages);
  }, [messages]);
  
  const handleClearHistory = useCallback(() => {
    // Only clear if we have more than the welcome message
    if (messages.length > 1) {
      const welcomeMessage = { 
        from: "agent", 
        text: "Hello! I'm here to help you implement practical, no-code AI solutions that save time and scale operations for entrepreneurs and SMEs. As Softworks Trading Company's workflow agent, I can assist with automating repetitive processes across services like professional services, e-commerce, and consulting. What specific business challenges are you facing that AI might help solve?" 
      };
      setMessages([welcomeMessage]);
      
      // Clear conversation in the manager
      conversationManager.clearCurrentConversation();
      
      toast({
        title: "Chat history cleared",
        description: "Starting a new conversation",
      });
      
      // Trigger parent callback if provided
      if (onClearHistory) {
        onClearHistory();
      }
    }
  }, [messages.length, toast, onClearHistory]);
  
  const handleSendMessage = useCallback(async () => {
    if (chatInput.trim()) {
      // Add user message to the UI immediately
      setMessages(prev => [...prev, { from: "user", text: chatInput }]);
      
      // Save the message for API call before clearing input
      const messageText = chatInput.trim();
      
      // Clear input field
      setChatInput("");
      
      try {
        // Show typing indicator
        setMessages(prev => [...prev, { from: "agent", text: "..." }]);
        
        // Use the AI service for chat
        const response = await aiService.sendChatMessage(messageText);
        
        // Replace typing indicator with actual response
        setMessages(prev => {
          const newMessages = [...prev];
          // Remove the typing indicator
          newMessages.pop();
          // Add the actual response
          newMessages.push({ from: "agent", text: response.text });
          return newMessages;
        });
        
        // If we have voice support and the response was successful, generate voice
        if (response.success) {
          try {
            const voiceResponse = await aiService.generateVoiceAudio(response.text);
            if (voiceResponse.success && voiceResponse.audioData) {
              await aiService.playAudio(voiceResponse.audioData);
            }
          } catch (voiceError) {
            console.error("Error generating voice response:", voiceError);
            // Don't show error to user, simply continue without voice
          }
        }
      } catch (error) {
        console.error("Error sending message:", error);
        
        // Replace typing indicator with error message
        setMessages(prev => {
          const newMessages = [...prev];
          // Remove the typing indicator
          newMessages.pop();
          // Add error message
          newMessages.push({ 
            from: "agent", 
            text: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment." 
          });
          return newMessages;
        });
        
        // Show toast error
        toast({
          title: "Connection Error",
          description: "Could not connect to the AI service. Please try again.",
          variant: "destructive"
        });
      }
    }
  }, [chatInput, toast]);
  
  const handleChatInputKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  return (
    <div className="mt-2">
      <div 
        className="bg-gray-100 dark:bg-navy-dark p-4 rounded-lg h-60 sm:h-72 overflow-y-auto mb-4 text-left"
        role="log"
        aria-live="polite"
        aria-label="Chat conversation"
      >
        {messages.map((message, index) => (
          <ChatMessage 
            key={index} 
            from={message.from} 
            text={message.text} 
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="flex w-full">
        <Input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={handleChatInputKeyDown}
          placeholder={placeholderSuggestions[currentPlaceholderIndex]}
          aria-label="Chat message"
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md 
                 bg-white dark:bg-navy-dark text-navy dark:text-soft-white focus:ring-2 focus:ring-cyan
                 text-base min-h-[44px]"
        />
        <Button
          onClick={handleSendMessage}
          aria-label="Send message"
          className="bg-cyan hover:bg-cyan-light text-navy font-medium py-2 px-4 
                 rounded-r-md transition-all duration-200 min-h-[44px]"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInterface;
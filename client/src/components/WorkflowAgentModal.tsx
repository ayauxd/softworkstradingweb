import { useState, useEffect, useRef, useCallback, useMemo, memo } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send, X, Phone, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { aiService } from "@/lib/aiService";
import { generateSystemPrompt } from "@/lib/companyInfo";

interface WorkflowAgentModalProps {
  onClose: () => void;
  initialMode?: "chat" | "call" | "none";
  onModeChange?: (mode: "chat" | "call") => void;
}

// Memoized chat message component to avoid unnecessary re-renders
interface ChatMessageProps {
  from: string;
  text: string;
}

const ChatMessage = memo(({ from, text }: ChatMessageProps) => {
  return (
    <div className={`mb-4 ${from === "user" ? "text-right" : ""}`}>
      <div className="font-medium text-navy dark:text-soft-white">
        {from === "agent" ? "Workflow Agent" : "You"}
      </div>
      <div className={cn(
        "p-3 rounded-lg inline-block max-w-[75%] mt-1 text-navy dark:text-soft-white",
        "transition-all duration-200 text-base",
        from === "agent" 
          ? "bg-white dark:bg-navy shadow-md" 
          : "bg-cyan bg-opacity-20"
      )}>
        {text}
      </div>
    </div>
  );
});

const WorkflowAgentModal = ({ 
  onClose, 
  initialMode = "none",
  onModeChange 
}: WorkflowAgentModalProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"none" | "chat" | "call">(initialMode === 'none' ? 'none' : initialMode);
  const [showCallbackForm, setShowCallbackForm] = useState(false);
  const [chatInput, setChatInput] = useState("");
  // Initialize messages from localStorage if available, otherwise use default welcome message
  const [messages, setMessages] = useState<Array<{from: string, text: string}>>(() => {
    // Check if we have saved messages in localStorage
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      try {
        return JSON.parse(savedMessages);
      } catch (e) {
        console.error('Error parsing saved messages:', e);
      }
    }
    // Return default welcome message if no saved messages or error parsing
    return [{ 
      from: "agent", 
      text: "Hello! I'm here to help you implement practical, no-code AI solutions that save time and scale operations for entrepreneurs and SMEs. As Softworks Trading Company's workflow agent, I can assist with automating repetitive processes across services like professional services, e-commerce, and consulting. What specific business challenges are you facing that AI might help solve?" 
    }];
  });
  const [callbackForm, setCallbackForm] = useState({
    fullName: "",
    workEmail: "",
    companyName: "",
    message: "",
    callbackTime: ""
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
  
  // Rotate placeholders every 4 seconds when chat is active
  useEffect(() => {
    if (activeTab === "chat") {
      const intervalId = setInterval(() => {
        setCurrentPlaceholderIndex(prevIndex => 
          (prevIndex + 1) % placeholderSuggestions.length
        );
      }, 4000);
      
      return () => clearInterval(intervalId);
    }
  }, [activeTab]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Reset the active tab when modal is closed
  useEffect(() => {
    return () => {
      setActiveTab("none");
      setShowCallbackForm(false);
    };
  }, []);
  
  // Scroll to bottom of chat when messages change and save to localStorage
  useEffect(() => {
    // Scroll to bottom of messages
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
    
    // Save messages to localStorage
    try {
      localStorage.setItem('chatMessages', JSON.stringify(messages));
    } catch (e) {
      console.error('Error saving messages to localStorage:', e);
    }
  }, [messages]);
  
  // Update parent component when mode changes
  useEffect(() => {
    if (activeTab !== "none" && onModeChange) {
      onModeChange(activeTab as "chat" | "call");
    }
  }, [activeTab, onModeChange]);
  
  const handleChatClick = useCallback(() => {
    setActiveTab("chat");
    if (onModeChange) onModeChange('chat');
  }, [onModeChange]);
  
  // Voice call state
  const [isVoiceCallActive, setIsVoiceCallActive] = useState(false);
  const [voiceCallMessages, setVoiceCallMessages] = useState<Array<{from: string, text: string}>>([]);
  const [callTimeRemaining, setCallTimeRemaining] = useState(180); // 3 minutes in seconds
  const [isProcessingCallSummary, setIsProcessingCallSummary] = useState(false);
  
  // Function to simulate the user speaking and get a response
  const simulateUserVoice = useCallback((message: string) => {
    // Add user message to transcript
    setVoiceCallMessages(prev => [...prev, { from: "user", text: message }]);
    
    // Process response
    aiService.sendChatMessage(message).then(response => {
      if (response.success) {
        // Add agent response to transcript
        setVoiceCallMessages(prev => [...prev, { from: "agent", text: response.text }]);
        
        // Generate and play voice response
        aiService.generateVoiceAudio(response.text).then(voiceResponse => {
          if (voiceResponse.success && voiceResponse.audioData) {
            aiService.playAudio(voiceResponse.audioData);
          }
        }).catch(error => {
          console.error("Error generating voice response:", error);
        });
      }
    }).catch(error => {
      console.error("Error processing voice input:", error);
    });
  }, []);
  
  // Simulate user speaking every ~15 seconds for demo purposes
  useEffect(() => {
    if (isVoiceCallActive) {
      // Sample user questions for the simulation
      const demoUserQuestions = [
        "How can AI help my small business?",
        "What types of automation do you recommend for customer service?",
        "Can you explain how a workflow agent works?",
        "What about data privacy with AI tools?",
      ];
      
      // Pick a random question for the simulation
      const getRandomQuestion = () => {
        const randomIndex = Math.floor(Math.random() * demoUserQuestions.length);
        return demoUserQuestions[randomIndex];
      };
      
      // Set a timeout to simulate the user speaking after 15 seconds
      const timeout = setTimeout(() => {
        // Only continue if the call is still active
        if (isVoiceCallActive && callTimeRemaining > 20) {
          simulateUserVoice(getRandomQuestion());
        }
      }, 15000);
      
      return () => clearTimeout(timeout);
    }
  }, [isVoiceCallActive, voiceCallMessages, callTimeRemaining, simulateUserVoice]);
  
  // Function to handle the voice call with 2-second connecting animation
  const simulateCallConnection = useCallback(() => {
    setActiveTab("call");
    setShowCallbackForm(false); // Ensure form is hidden during simulation
    
    // Show "connecting" animation for 2 seconds
    const connectionTimer = setTimeout(() => {
      // Start the voice call
      setIsVoiceCallActive(true);
      
      // Initialize the call with a welcome message
      const welcomeMessage = "Hello! I'm your Softworks Trading workflow agent. I'm here to help you implement practical AI solutions for your business. This call will last up to 3 minutes. How can I assist you today?";
      
      // Add message to the call history
      setVoiceCallMessages([{
        from: "agent",
        text: welcomeMessage
      }]);
      
      // Generate and play welcome voice message
      aiService.generateVoiceAudio(welcomeMessage).then(response => {
        if (response.success && response.audioData) {
          aiService.playAudio(response.audioData);
        }
      }).catch(error => {
        console.error("Error generating welcome voice:", error);
      });
      
      // Start countdown timer (3 minutes)
      startCallTimer();
    }, 2000);
    
    return () => {
      clearTimeout(connectionTimer);
    };
  }, []);
  
  // Function to start the 3-minute call timer
  const startCallTimer = useCallback(() => {
    const timerInterval = setInterval(() => {
      setCallTimeRemaining(prev => {
        if (prev <= 1) {
          // Time's up - end the call
          clearInterval(timerInterval);
          endVoiceCall();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Store the interval ID for cleanup
    return () => clearInterval(timerInterval);
  }, []);
  
  // Format time remaining as MM:SS
  const formattedTimeRemaining = useMemo(() => {
    const minutes = Math.floor(callTimeRemaining / 60);
    const seconds = callTimeRemaining % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, [callTimeRemaining]);
  
  // Function to end the voice call and generate summary
  const endVoiceCall = useCallback(async () => {
    setIsVoiceCallActive(false);
    setIsProcessingCallSummary(true);
    
    try {
      // If there are no messages other than the welcome message, just show the callback form
      if (voiceCallMessages.length <= 1) {
        setShowCallbackForm(true);
        setIsProcessingCallSummary(false);
        return;
      }
      
      // Prepare the call transcript
      const transcript = voiceCallMessages.map(msg => 
        `${msg.from.toUpperCase()}: ${msg.text}`
      ).join('\n');
      
      // Generate a call summary using OpenAI
      const summaryPrompt = `You are an AI assistant for Softworks Trading Company. Please summarize the following call transcript and extract key action items and follow-up tasks. Keep the summary concise (max 250 words):\n\n${transcript}`;
      
      const summaryResponse = await aiService.sendChatMessage(summaryPrompt);
      
      if (summaryResponse.success) {
        // Send the summary to the server/email
        const emailSent = await aiService.sendCallSummary(
          `Call Summary:\n${summaryResponse.text}\n\nFull Transcript:\n${transcript}`,
          callbackForm.workEmail
        );
        
        // Show the callback form with the summary
        setCallbackForm(prev => ({
          ...prev,
          message: `Call Summary: ${summaryResponse.text}\n\nPlease add any additional context or questions.`
        }));
      }
    } catch (error) {
      console.error('Error processing call summary:', error);
    } finally {
      // Show the callback form regardless of whether summary generation succeeded
      setShowCallbackForm(true);
      setIsProcessingCallSummary(false);
    }
  }, [voiceCallMessages, callbackForm.workEmail]);

  // Effect to trigger simulation if modal opens in 'call' mode
  useEffect(() => {
    let cleanup = () => {};
    if (initialMode === 'call') {
      cleanup = simulateCallConnection();
    } 
    // If initialMode is 'chat' or 'none', useState initialization handles it.
    
    return cleanup; // Cleanup timeout if component unmounts or initialMode changes
  }, [initialMode, simulateCallConnection]);

  const handleCallClick = useCallback(() => {
    const cleanup = simulateCallConnection(); // Start simulation
    if (onModeChange) onModeChange('call');
  }, [simulateCallConnection, onModeChange]);
  
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
        
        // For debugging: log the attempt to call OpenAI
        console.log("Attempting to call OpenAI via API...");
        
        // Note: In production, API keys should NEVER be in client-side code
        // We should use the server's API endpoints instead
        // For security, we'll use the server endpoint only and not attempt direct OpenAI calls
        
        // Get current conversation ID from localStorage or create a new one
        let currentConversationId = localStorage.getItem('currentConversationId');
        if (!currentConversationId) {
          currentConversationId = `conv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
          localStorage.setItem('currentConversationId', currentConversationId);
        }
        
        // Use the AI service for chat (properly routes through server API)
        let response;
        try {
          response = await aiService.sendChatMessage(messageText, currentConversationId);
          console.log("API service response:", response);
          
          // Update local conversation ID if the server returned a new one
          if (response.conversationId && response.conversationId !== currentConversationId) {
            localStorage.setItem('currentConversationId', response.conversationId);
          }
        } catch (apiError) {
          console.error("API service failed", apiError);
          throw new Error("Failed to connect to chat service");
        }
        
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
              aiService.playAudio(voiceResponse.audioData);
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
  
  const [formErrors, setFormErrors] = useState<{[key: string]: boolean}>({});
  const [formShakeEffect, setFormShakeEffect] = useState(false);
  
  const handleCallbackFormChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCallbackForm(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field if it exists and has a value now
    if (formErrors[name] && value.trim()) {
      setFormErrors(prev => ({ ...prev, [name]: false }));
    }
  }, [formErrors]);
  
  // Validate emails using useMemo to avoid re-computation
  const isValidEmail = useMemo(() => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    return (email: string) => emailRegex.test(email);
  }, []);
  
  const handleCallbackFormSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset error states
    const newErrors: {[key: string]: boolean} = {};
    let hasErrors = false;
    
    // Validate form fields
    if (!callbackForm.fullName) {
      newErrors.fullName = true;
      hasErrors = true;
    }
    
    if (!callbackForm.workEmail) {
      newErrors.workEmail = true;
      hasErrors = true;
    } else if (!isValidEmail(callbackForm.workEmail)) {
      // Email validation
      newErrors.workEmail = true;
      hasErrors = true;
    }
    
    if (!callbackForm.message) {
      newErrors.message = true;
      hasErrors = true;
    }
    
    // If there are errors, show error message and trigger shake effect
    if (hasErrors) {
      setFormErrors(newErrors);
      setFormShakeEffect(true);
      
      setTimeout(() => {
        setFormShakeEffect(false);
      }, 500);
      
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    // Attempt to send the call summary/form data to the server or via email
    let emailSent = false;
    try {
      // Send the form data as a summary
      const formSummary = `
        Name: ${callbackForm.fullName}
        Email: ${callbackForm.workEmail}
        Company: ${callbackForm.companyName || 'Not provided'}
        Preferred Callback Time: ${callbackForm.callbackTime || 'Not specified'}
        
        Message/Summary:
        ${callbackForm.message}
      `;
      
      emailSent = await aiService.sendCallSummary(formSummary, callbackForm.workEmail);
    } catch (error) {
      console.error('Error sending callback form:', error);
      // Continue anyway as we'll show success message
    }
    
    // Form is valid, show success message
    toast({
      title: "Callback Requested!",
      description: "One of our workflow agents will contact you shortly.",
    });
    
    // Show email status message if the email wasn't sent
    if (!emailSent) {
      toast({
        title: "Contact Details Saved",
        description: "We have your information but couldn't send an email confirmation.",
        variant: "default"
      });
    }
    
    // Close modal
    onClose();
  }, [callbackForm, isValidEmail, toast, onClose]);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-screen-sm max-h-[85vh] overflow-y-auto [&>button]:hidden"
        aria-describedby="workflow-agent-description"
      >
        <div className="flex justify-between items-center">
          <DialogTitle className="text-lg sm:text-xl">Talk to a Workflow Agent</DialogTitle>
          <div className="flex items-center space-x-2">
            {activeTab === "chat" && messages.length > 1 && (
              <button
                onClick={() => {
                  // Clear chat history and reset to welcome message
                  const welcomeMessage = { 
                    from: "agent", 
                    text: "Hello! I'm here to help you implement practical, no-code AI solutions that save time and scale operations for entrepreneurs and SMEs. As Softworks Trading Company's workflow agent, I can assist with automating repetitive processes across services like professional services, e-commerce, and consulting. What specific business challenges are you facing that AI might help solve?" 
                  };
                  setMessages([welcomeMessage]);
                  localStorage.removeItem('chatMessages');
                  // Also clear the conversation ID to start a fresh conversation
                  localStorage.removeItem('currentConversationId');
                  toast({
                    title: "Chat history cleared",
                    description: "Starting a new conversation",
                  });
                }}
                className="text-xs rounded-md px-2 py-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors text-navy dark:text-soft-white"
                aria-label="Clear chat history"
              >
                Clear History
              </button>
            )}
            <DialogClose asChild>
              <button 
                className="rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan"
                aria-label="Close"
                tabIndex={0}
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </DialogClose>
          </div>
        </div>
        
        {/* Hidden description for accessibility */}
        <div id="workflow-agent-description" className="sr-only">
          Workflow agent dialog for chatting with an AI assistant about business automation solutions
        </div>
        
        {activeTab === "none" && (
          <>
            <DialogDescription>
              How would you like to connect with us?
            </DialogDescription>
            
            <div className="mt-6">
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                <Button 
                  onClick={handleChatClick}
                  className={cn(
                    "flex-1 bg-navy dark:bg-soft-white hover:bg-navy-light dark:hover:bg-gray-200",
                    "text-soft-white dark:text-navy font-medium py-3 px-4 rounded-md",
                    "transition-all duration-200 flex items-center justify-center hover:scale-[1.02]",
                    "min-h-[52px] text-base"
                  )}
                  aria-label="Chat with a workflow agent"
                >
                  <span className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2" /> Chat with an Agent
                  </span>
                </Button>
                
                <Button 
                  onClick={handleCallClick}
                  className={cn(
                    "flex-1 bg-cyan hover:bg-cyan-light text-navy font-medium py-3 px-4",
                    "rounded-md transition-all duration-200 flex items-center justify-center hover:scale-[1.02]",
                    "min-h-[52px] text-base"
                  )}
                  aria-label="Call a workflow agent"
                >
                  <span className="flex items-center">
                    <Phone className="h-5 w-5 mr-2" /> Call an Agent
                  </span>
                </Button>
              </div>
            </div>
          </>
        )}
        
        {/* Chat Interface - without any top buttons */}
        {activeTab === "chat" && (
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
        )}
        
        {/* Call Interface - without any top buttons */}
        {activeTab === "call" && (
          <div className="min-h-[300px]"> {/* Ensure container has min height */}
            {!showCallbackForm ? (
              !isVoiceCallActive ? (
                // Connecting State UI
                <div className="flex flex-col items-center justify-center p-8 h-full">
                  <div className="flex space-x-1 mb-4">
                    <span className="h-2 w-2 bg-cyan rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="h-2 w-2 bg-cyan rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="h-2 w-2 bg-cyan rounded-full animate-bounce"></span>
                  </div>
                  <p className="text-lg font-medium text-navy dark:text-soft-white">Connecting...</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Please wait while we set up the call.</p>
                </div>
              ) : (
                // Active Voice Call UI
                <div className="flex flex-col h-full">
                  {/* Call timer and end call button */}
                  <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                      <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                      <span className="text-sm text-navy dark:text-gray-300">Call in progress</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm mr-4">{formattedTimeRemaining}</span>
                      <button
                        onClick={endVoiceCall}
                        className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors duration-200"
                        aria-label="End call"
                      >
                        <Phone className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Voice call visualization - without text input */}
                  <div className="flex-grow overflow-y-auto p-4 bg-gray-50 dark:bg-gray-800">
                    {/* Voice call message display */}
                    <div className="flex flex-col items-center justify-center text-center mb-8">
                      <div className="w-16 h-16 bg-navy dark:bg-cyan rounded-full flex items-center justify-center mb-4">
                        <Phone className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-lg font-medium text-navy dark:text-soft-white mb-2">
                        Voice Call in Progress
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md">
                        Our AI assistant is listening. Speak naturally about your business challenges and automation needs.
                      </p>
                    </div>
                    
                    {/* AI speaking indicator */}
                    <div className="bg-white dark:bg-navy shadow-md rounded-lg p-4 mb-4">
                      <div className="flex items-center mb-2">
                        <div className={cn(
                          "h-2 w-2 rounded-full mr-2",
                          voiceCallMessages.length > 0 && voiceCallMessages[voiceCallMessages.length - 1].from === "agent"
                            ? "bg-green-500 animate-pulse"
                            : "bg-gray-300"
                        )}></div>
                        <span className="font-medium text-navy dark:text-soft-white">Workflow Agent</span>
                      </div>
                      <p className="text-navy dark:text-soft-white">
                        {voiceCallMessages.length > 0 
                          ? voiceCallMessages[voiceCallMessages.length - 1].text 
                          : "Hello! I'm your Softworks Trading workflow agent. How can I assist you today?"}
                      </p>
                    </div>
                    
                    {/* Visual sound wave effect */}
                    <div className="flex justify-center items-center my-8">
                      <div className="flex items-center justify-center space-x-1">
                        <div className="w-1 h-5 bg-cyan animate-pulse"></div>
                        <div className="w-1 h-8 bg-cyan animate-pulse [animation-delay:75ms]"></div>
                        <div className="w-1 h-12 bg-cyan animate-pulse [animation-delay:150ms]"></div>
                        <div className="w-1 h-8 bg-cyan animate-pulse [animation-delay:225ms]"></div>
                        <div className="w-1 h-5 bg-cyan animate-pulse [animation-delay:300ms]"></div>
                      </div>
                    </div>
                    
                    <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                      Voice processing is simulated for this demo.
                    </div>
                    
                    <div ref={messagesEndRef} />
                  </div>
                  
                  {/* Voice call control area - replaced text input with help text */}
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col w-full items-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Speak clearly and ask questions about AI automation for your business
                      </p>
                      <Button
                        onClick={endVoiceCall}
                        className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-6 rounded-full transition-all duration-200"
                        aria-label="End call"
                      >
                        End Call
                      </Button>
                    </div>
                  </div>
                </div>
              )
            ) : isProcessingCallSummary ? (
              // Processing call summary UI
              <div className="flex flex-col items-center justify-center p-8 h-full">
                <div className="flex space-x-1 mb-4">
                  <span className="h-2 w-2 bg-cyan rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="h-2 w-2 bg-cyan rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="h-2 w-2 bg-cyan rounded-full animate-bounce"></span>
                </div>
                <p className="text-lg font-medium text-navy dark:text-soft-white">Processing call summary...</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">This will just take a moment.</p>
              </div>
            ) : (
              // Callback Form (Existing structure)
              <div className="p-4 sm:p-6">
                <h3 className="text-lg font-medium text-navy dark:text-soft-white mb-4 text-center">
                  Request a Callback
                </h3>
                <p className="text-neutral-gray dark:text-gray-300 text-center text-sm mb-4">
                  Tell us a bit about your business needs so we can prepare for our call.
                </p>
                
                <form 
                  onSubmit={handleCallbackFormSubmit} 
                  className={cn(
                    "space-y-4",
                    formShakeEffect && "animate-shake"
                  )}
                  noValidate // Disable browser validation to use our custom validation
                >
                  <div>
                    <Label htmlFor="fullName" className="text-navy dark:text-gray-300">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={callbackForm.fullName}
                        onChange={handleCallbackFormChange}
                        required
                        aria-invalid={formErrors.fullName ? "true" : "false"}
                        aria-describedby={formErrors.fullName ? "fullName-error" : undefined}
                        className={cn(
                          "w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md",
                          "bg-white dark:bg-navy-dark text-navy dark:text-soft-white", 
                          "focus:ring-2 focus:ring-cyan text-base min-h-[44px]",
                          "transition-all duration-200",
                          formErrors.fullName && "border-red-400 focus:ring-red-400 focus:border-red-400"
                        )}
                      />
                      {formErrors.fullName && (
                        <p id="fullName-error" className="text-red-500 text-sm mt-1 absolute">
                          Please enter your full name
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="workEmail" className="text-navy dark:text-gray-300">
                      Work Email <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        type="email"
                        id="workEmail"
                        name="workEmail"
                        value={callbackForm.workEmail}
                        onChange={handleCallbackFormChange}
                        required
                        aria-invalid={formErrors.workEmail ? "true" : "false"}
                        aria-describedby={formErrors.workEmail ? "workEmail-error" : undefined}
                        className={cn(
                          "w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md",
                          "bg-white dark:bg-navy-dark text-navy dark:text-soft-white", 
                          "focus:ring-2 focus:ring-cyan text-base min-h-[44px]",
                          "transition-all duration-200",
                          formErrors.workEmail && "border-red-400 focus:ring-red-400 focus:border-red-400"
                        )}
                      />
                      {formErrors.workEmail && (
                        <p id="workEmail-error" className="text-red-500 text-sm mt-1 absolute">
                          Please enter a valid email address
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="companyName" className="text-navy dark:text-gray-300">
                      Company Name <span className="text-gray-400 text-sm">(optional)</span>
                    </Label>
                    <Input
                      type="text"
                      id="companyName"
                      name="companyName"
                      value={callbackForm.companyName}
                      onChange={handleCallbackFormChange}
                      className={cn(
                        "w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md",
                        "bg-white dark:bg-navy-dark text-navy dark:text-soft-white", 
                        "focus:ring-2 focus:ring-cyan text-base min-h-[44px]",
                        "transition-all duration-200"
                      )}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="callbackMessage" className="text-navy dark:text-gray-300">
                      What do you need help with? <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Textarea
                        id="callbackMessage"
                        name="message"
                        rows={3}
                        value={callbackForm.message}
                        onChange={handleCallbackFormChange}
                        required
                        aria-invalid={formErrors.message ? "true" : "false"}
                        aria-describedby={formErrors.message ? "message-error" : undefined}
                        className={cn(
                          "w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md",
                          "bg-white dark:bg-navy-dark text-navy dark:text-soft-white", 
                          "focus:ring-2 focus:ring-cyan text-base",
                          "transition-all duration-200 resize-none",
                          formErrors.message && "border-red-400 focus:ring-red-400 focus:border-red-400"
                        )}
                      />
                      {formErrors.message && (
                        <p id="message-error" className="text-red-500 text-sm mt-1 absolute">
                          Please describe what you need help with
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="callbackTime" className="text-navy dark:text-gray-300">
                      Preferred Callback Time <span className="text-gray-400 text-sm">(optional)</span>
                    </Label>
                    <Input
                      type="text"
                      id="callbackTime"
                      name="callbackTime"
                      value={callbackForm.callbackTime}
                      onChange={handleCallbackFormChange}
                      placeholder="e.g., Weekdays 2-5pm EST"
                      className={cn(
                        "w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md",
                        "bg-white dark:bg-navy-dark text-navy dark:text-soft-white", 
                        "focus:ring-2 focus:ring-cyan text-base min-h-[44px]",
                        "transition-all duration-200"
                      )}
                    />
                  </div>
                  
                  <div className="flex justify-center">
                    <Button
                      type="submit"
                      className={cn(
                        "bg-cyan hover:bg-cyan-light text-navy font-medium py-2 px-6", 
                        "rounded-md transition-all duration-200 flex items-center",
                        "min-h-[44px] hover:scale-[1.02]"
                      )}
                      aria-label="Submit callback request"
                    >
                      Request a Callback
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

// Export a memoized version of the component to prevent unnecessary re-renders
export default memo(WorkflowAgentModal);

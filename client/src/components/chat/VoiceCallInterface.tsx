import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Phone, AlertTriangle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { aiService } from "@/lib/aiService";
import ConsultationSummary from "./ConsultationSummary";

interface VoiceCallInterfaceProps {
  onEndCall: () => void;
  isConnecting?: boolean;
  onCallSummary?: (summary: string) => void;
}

/**
 * VoiceCallInterface - Handles voice call simulation and UI
 */
const VoiceCallInterface = ({ 
  onEndCall, 
  isConnecting = false,
  onCallSummary
}: VoiceCallInterfaceProps) => {
  const [isVoiceCallActive, setIsVoiceCallActive] = useState(false);
  const [voiceCallMessages, setVoiceCallMessages] = useState<Array<{from: string, text: string}>>([]);
  const [callTimeRemaining, setCallTimeRemaining] = useState(180); // 3 minutes in seconds
  const [isProcessingCallSummary, setIsProcessingCallSummary] = useState(false);
  const [showConsultationSummary, setShowConsultationSummary] = useState(false);
  const [generatedSummary, setGeneratedSummary] = useState("");
  const [showTimeWarning, setShowTimeWarning] = useState(false);
  const [timeCritical, setTimeCritical] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Initialize the call when not in connecting state
  useEffect(() => {
    if (!isConnecting && !isVoiceCallActive) {
      startVoiceCall();
    }
  }, [isConnecting]);
  
  // Function to start the voice call
  const startVoiceCall = useCallback(() => {
    setIsVoiceCallActive(true);
    
    // Initialize the call with a welcome message
    const welcomeMessage = "Hello! I'm your workflow agent. How can I help you today?";
    
    // Add message to the call history
    setVoiceCallMessages([{
      from: "agent",
      text: welcomeMessage
    }]);
    
    // Generate and play welcome voice message
    aiService.generateVoiceAudio(welcomeMessage).then(response => {
      if (response.success && response.audioData) {
        aiService.playAudio(response.audioData)
          .catch(error => console.error("Error playing welcome audio:", error));
      }
    }).catch(error => {
      console.error("Error generating welcome voice:", error);
      // Continue with call even if voice fails - fault tolerance
    });
    
    // Start countdown timer (3 minutes)
    startCallTimer();
  }, []);
  
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
            aiService.playAudio(voiceResponse.audioData)
              .catch(error => console.error("Error playing voice:", error));
          }
        }).catch(error => {
          console.error("Error generating voice response:", error);
        });
      }
    }).catch(error => {
      console.error("Error processing voice input:", error);
    });
  }, []);
  
  // State to track user speech simulation
  const [isSimulatingUserSpeech, setIsSimulatingUserSpeech] = useState(false);

  // Simulate user speaking every ~8 seconds for demo purposes
  useEffect(() => {
    if (isVoiceCallActive && !isSimulatingUserSpeech) {
      // Sample user questions for the simulation
      const demoUserQuestions = [
        "How can AI help my small business?",
        "What types of automation do you recommend for customer service?",
        "Can you explain how a workflow agent works?",
        "What about data privacy with AI tools?",
        "How much does it cost to implement AI automation?",
        "What's the first step in automating my business processes?",
      ];
      
      // Pick a random question for the simulation
      const getRandomQuestion = () => {
        const randomIndex = Math.floor(Math.random() * demoUserQuestions.length);
        return demoUserQuestions[randomIndex];
      };
      
      // Set a timeout to simulate the user speaking after 8 seconds
      const timeout = setTimeout(() => {
        // Only continue if the call is still active
        if (isVoiceCallActive && callTimeRemaining > 20) {
          // Start user speech simulation
          setIsSimulatingUserSpeech(true);
          
          // Simulate user speaking for 2 seconds before getting response
          setTimeout(() => {
            simulateUserVoice(getRandomQuestion());
            setIsSimulatingUserSpeech(false);
          }, 2000);
        }
      }, 8000);
      
      return () => clearTimeout(timeout);
    }
  }, [isVoiceCallActive, voiceCallMessages, callTimeRemaining, simulateUserVoice, isSimulatingUserSpeech]);
  
  // Function to start the 3-minute call timer with notifications
  const startCallTimer = useCallback(() => {
    const timerInterval = setInterval(() => {
      setCallTimeRemaining(prev => {
        // Time's up - end the call
        if (prev <= 1) {
          clearInterval(timerInterval);
          handleEndCall();
          return 0;
        }
        
        // Show 1-minute remaining warning at 60 seconds
        if (prev === 60 && !showTimeWarning) {
          setShowTimeWarning(true);
          // Add a system message about time remaining
          const timeWarningMsg = "You have 1 minute remaining in this call.";
          setVoiceCallMessages(msgs => [
            ...msgs, 
            { from: "system", text: timeWarningMsg }
          ]);
          
          // Generate and play voice for the warning
          aiService.generateVoiceAudio(timeWarningMsg).then(response => {
            if (response.success && response.audioData) {
              aiService.playAudio(response.audioData)
                .catch(error => console.error("Error playing warning audio:", error));
            }
          }).catch(error => {
            console.error("Error generating warning voice:", error);
          });
        }
        
        // Show 10-seconds warning at 10 seconds
        if (prev === 10) {
          setTimeCritical(true);
          // Add a system message about time remaining
          const finalWarningMsg = "We have 10 seconds left. I've drafted a summary of our conversation for your review.";
          setVoiceCallMessages(msgs => [
            ...msgs, 
            { from: "system", text: finalWarningMsg }
          ]);
          
          // Start generating the summary in the background
          generateCallSummary();
          
          // Generate and play voice for the warning
          aiService.generateVoiceAudio(finalWarningMsg).then(response => {
            if (response.success && response.audioData) {
              aiService.playAudio(response.audioData)
                .catch(error => console.error("Error playing final warning audio:", error));
            }
          }).catch(error => {
            console.error("Error generating final warning voice:", error);
          });
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
  
  // Generate call summary separately so it can be done in the background
  const generateCallSummary = useCallback(async () => {
    try {
      // If there are no messages other than the welcome message, end without summary
      if (voiceCallMessages.length <= 1) {
        return "";
      }
      
      // Prepare the call transcript
      const transcript = voiceCallMessages
        .filter(msg => msg.from !== "system") // Filter out system messages
        .map(msg => `${msg.from.toUpperCase()}: ${msg.text}`)
        .join('\n');
      
      // Generate a call summary using OpenAI
      const summaryPrompt = `You are an AI assistant for Softworks Trading Company. Please summarize the following call transcript and extract key action items and follow-up tasks. Format the summary with clear sections: 1) Key Points Discussed, 2) Potential Solutions, and 3) Recommended Next Steps. Keep the summary concise (max 300 words):\n\n${transcript}`;
      
      const summaryResponse = await aiService.sendChatMessage(summaryPrompt);
      
      if (summaryResponse.success) {
        setGeneratedSummary(summaryResponse.text);
        return summaryResponse.text;
      }
      
      return "";
    } catch (error) {
      console.error('Error generating call summary:', error);
      return "";
    }
  }, [voiceCallMessages]);
  
  // Function to end the voice call and show consultation summary
  const handleEndCall = useCallback(async () => {
    setIsVoiceCallActive(false);
    
    // If summary wasn't generated during the call, generate it now
    if (!generatedSummary) {
      setIsProcessingCallSummary(true);
      try {
        const summary = await generateCallSummary();
        if (summary && onCallSummary) {
          onCallSummary(summary);
        }
      } catch (error) {
        console.error('Error processing call summary:', error);
      } finally {
        setIsProcessingCallSummary(false);
      }
    } else if (onCallSummary) {
      // If summary was already generated, pass it to parent
      onCallSummary(generatedSummary);
    }
    
    // Show the consultation summary screen
    setShowConsultationSummary(true);
  }, [voiceCallMessages, onCallSummary, generatedSummary, generateCallSummary]);
  
  // Scroll to bottom of call transcript when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [voiceCallMessages]);

  // Connecting state UI
  if (isConnecting) {
    return (
      <div className="flex flex-col items-center justify-center p-8 h-full">
        <div className="flex space-x-1 mb-4">
          <span className="h-2 w-2 bg-cyan rounded-full animate-bounce [animation-delay:-0.3s]"></span>
          <span className="h-2 w-2 bg-cyan rounded-full animate-bounce [animation-delay:-0.15s]"></span>
          <span className="h-2 w-2 bg-cyan rounded-full animate-bounce"></span>
        </div>
        <p className="text-lg font-medium text-navy dark:text-soft-white">Connecting...</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Please wait while we set up the call.</p>
      </div>
    );
  }
  
  // Processing call summary UI
  if (isProcessingCallSummary) {
    return (
      <div className="flex flex-col items-center justify-center p-8 h-full">
        <div className="flex space-x-1 mb-4">
          <span className="h-2 w-2 bg-cyan rounded-full animate-bounce [animation-delay:-0.3s]"></span>
          <span className="h-2 w-2 bg-cyan rounded-full animate-bounce [animation-delay:-0.15s]"></span>
          <span className="h-2 w-2 bg-cyan rounded-full animate-bounce"></span>
        </div>
        <p className="text-lg font-medium text-navy dark:text-soft-white">Processing call summary...</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">This will just take a moment.</p>
      </div>
    );
  }
  
  // Consultation summary UI
  if (showConsultationSummary) {
    return (
      <ConsultationSummary
        callSummary={generatedSummary}
        onSubmit={() => onEndCall()}
        onBack={() => {
          setShowConsultationSummary(false);
          setIsVoiceCallActive(true);
        }}
      />
    );
  }
  
  // Active Voice Call UI
  return (
    <div className="flex flex-col h-full">
      {/* Call timer and end call button */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
          <span className="text-sm text-navy dark:text-gray-300">Call in progress</span>
        </div>
        <div className="flex items-center">
          <div className={cn(
            "flex items-center px-2 py-1 rounded",
            showTimeWarning && "bg-yellow-100 dark:bg-yellow-900/30",
            timeCritical && "bg-red-100 dark:bg-red-900/30 animate-pulse"
          )}>
            <Clock className={cn(
              "h-3 w-3 mr-1",
              !showTimeWarning && "text-gray-500",
              showTimeWarning && !timeCritical && "text-yellow-500",
              timeCritical && "text-red-500"
            )} />
            <span className={cn(
              "text-sm",
              !showTimeWarning && "text-gray-500",
              showTimeWarning && !timeCritical && "text-yellow-600 dark:text-yellow-400 font-medium",
              timeCritical && "text-red-600 dark:text-red-400 font-medium"
            )}>
              {formattedTimeRemaining}
            </span>
          </div>
          <button
            onClick={handleEndCall}
            className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors duration-200 ml-4"
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
          
          {/* Time warning message */}
          {showTimeWarning && (
            <div className={cn(
              "mt-4 px-4 py-2 rounded-md max-w-md",
              timeCritical 
                ? "bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800" 
                : "bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800"
            )}>
              <p className={cn(
                "text-sm font-medium flex items-center",
                timeCritical ? "text-red-700 dark:text-red-400" : "text-yellow-700 dark:text-yellow-400"
              )}>
                <AlertTriangle className="h-4 w-4 mr-2" />
                {timeCritical 
                  ? "The call will end in a few seconds. A summary is being prepared."
                  : "This call has a 3-minute limit. You have 1 minute remaining."}
              </p>
            </div>
          )}
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
        
        {/* Visual sound wave effect with different states for AI speaking vs listening */}
        <div className="flex flex-col items-center my-8">
          <div className="flex items-center justify-center space-x-1 mb-2">
            {voiceCallMessages.length > 0 && voiceCallMessages[voiceCallMessages.length - 1].from === "agent" ? (
              /* AI speaking animation */
              <>
                <div className="w-1 h-5 bg-cyan animate-pulse"></div>
                <div className="w-1 h-8 bg-cyan animate-pulse [animation-delay:75ms]"></div>
                <div className="w-1 h-12 bg-cyan animate-pulse [animation-delay:150ms]"></div>
                <div className="w-1 h-8 bg-cyan animate-pulse [animation-delay:225ms]"></div>
                <div className="w-1 h-5 bg-cyan animate-pulse [animation-delay:300ms]"></div>
              </>
            ) : isSimulatingUserSpeech ? (
              /* User speaking animation - active microphone */
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center border-4 border-green-500 border-opacity-70 animate-pulse">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-white"></div>
                </div>
              </div>
            ) : (
              /* Listening animation - inactive microphone */
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center border-4 border-cyan border-opacity-50">
                <div className="w-8 h-8 rounded-full bg-cyan flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-white"></div>
                </div>
              </div>
            )}
          </div>
          
          <div className="text-center text-sm font-medium text-gray-600 dark:text-gray-300">
            {voiceCallMessages.length > 0 && voiceCallMessages[voiceCallMessages.length - 1].from === "agent" 
              ? "AI is speaking..." 
              : isSimulatingUserSpeech
                ? "You are speaking..."
                : "Listening for your voice..."}
          </div>
          
          <div className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2">
            Voice processing is simulated for this demo
          </div>
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
            onClick={handleEndCall}
            className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-6 rounded-full transition-all duration-200"
            aria-label="End call"
          >
            End Call
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VoiceCallInterface;
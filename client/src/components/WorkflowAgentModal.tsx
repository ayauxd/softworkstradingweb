import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Phone, MessageSquare, AlertCircle } from "lucide-react";
import ApiDebugPanel from "./ApiDebugPanel";
import { cn } from "@/lib/utils";
import { conversationManager } from "@/lib/aiService";

// Import refactored components
import ChatInterface from "./chat/ChatInterface";
import VoiceCallInterface from "./chat/VoiceCallInterface";
import CallbackForm from "./chat/CallbackForm";

interface WorkflowAgentModalProps {
  onClose: () => void;
  initialMode?: "chat" | "call" | "none";
  onModeChange?: (mode: "chat" | "call") => void;
}

/**
 * WorkflowAgentModal - Main modal component for chat and call interaction
 * Refactored to use separate components for each functionality
 */
const WorkflowAgentModal = ({ 
  onClose, 
  initialMode = "none",
  onModeChange 
}: WorkflowAgentModalProps) => {
  // Modal state
  const [activeTab, setActiveTab] = useState<"none" | "chat" | "call" | "debug">(initialMode === 'none' ? 'none' : initialMode);
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  
  // Call-specific state
  const [isCallConnecting, setIsCallConnecting] = useState(false);
  const [showCallbackForm, setShowCallbackForm] = useState(false);
  const [callSummary, setCallSummary] = useState("");
  
  // Reset the active tab when modal is closed
  useEffect(() => {
    return () => {
      setActiveTab("none");
      setShowCallbackForm(false);
    };
  }, []);
  
  // Update parent component when mode changes
  useEffect(() => {
    if (activeTab !== "none" && onModeChange) {
      onModeChange(activeTab as "chat" | "call");
    }
  }, [activeTab, onModeChange]);
  
  // Handle chat button click
  const handleChatClick = useCallback(() => {
    setActiveTab("chat");
    if (onModeChange) onModeChange('chat');
  }, [onModeChange]);
  
  // Handle call button click with connection simulation
  const handleCallClick = useCallback(() => {
    setActiveTab("call");
    setIsCallConnecting(true);
    
    // Show "connecting" animation for 2 seconds
    setTimeout(() => {
      setIsCallConnecting(false);
    }, 2000);
    
    if (onModeChange) onModeChange('call');
  }, [onModeChange]);
  
  // Handle call end
  const handleCallEnd = useCallback(() => {
    // Show the callback form only if we have a summary
    if (callSummary) {
      setShowCallbackForm(true);
    } else {
      // If no summary, just close the modal
      onClose();
    }
  }, [callSummary, onClose]);
  
  // Handle call summary from voice interface
  const handleCallSummary = useCallback((summary: string) => {
    setCallSummary(summary);
  }, []);
  
  // Handle callback form submission success
  const handleCallbackSubmitted = useCallback(() => {
    onClose();
  }, [onClose]);
  
  // Handle chat history cleared
  const handleChatHistoryCleared = useCallback(() => {
    // Reset conversation in the manager
    conversationManager.clearCurrentConversation();
  }, []);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-screen-sm max-h-[85vh] overflow-y-auto [&>button]:hidden"
        aria-describedby="workflow-agent-description"
      >
        <div className="flex justify-between items-center">
          <DialogTitle className="text-lg sm:text-xl">Talk to a Workflow Agent</DialogTitle>
          <div className="flex items-center space-x-2">
            {activeTab === "chat" && (
              <button
                onClick={handleChatHistoryCleared}
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
        
        {/* Mode Selection Screen */}
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
              
              {/* Debug button only in development (non-production) */}
              {window.location.hostname === 'localhost' && (
                <div className="mt-4">
                  <Button 
                    onClick={() => setShowDebugPanel(!showDebugPanel)}
                    variant="outline"
                    className="w-full text-xs text-gray-500 dark:text-gray-400"
                    size="sm"
                  >
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {showDebugPanel ? 'Hide' : 'Show'} API Debug Panel
                  </Button>
                  
                  {showDebugPanel && <ApiDebugPanel />}
                </div>
              )}
            </div>
          </>
        )}
        
        {/* Chat Interface */}
        {activeTab === "chat" && (
          <ChatInterface onClearHistory={handleChatHistoryCleared} />
        )}
        
        {/* Call Interface */}
        {activeTab === "call" && !showCallbackForm && (
          <VoiceCallInterface 
            onEndCall={handleCallEnd}
            isConnecting={isCallConnecting}
            onCallSummary={handleCallSummary}
          />
        )}
        
        {/* Callback Form */}
        {activeTab === "call" && showCallbackForm && (
          <CallbackForm 
            initialMessage={`Call Summary: ${callSummary}\n\nPlease add any additional context or questions.`}
            onSubmitSuccess={handleCallbackSubmitted}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default WorkflowAgentModal;
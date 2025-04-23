import { useState, useEffect } from 'react';
import { MessageSquare, Phone } from 'lucide-react';
import { Button } from "@/components/ui/button";
import WorkflowAgentModal from './WorkflowAgentModal';

interface FloatingAgentButtonProps {
  defaultMode?: "chat" | "call";
}

const FloatingAgentButton = ({ defaultMode = "chat" }: FloatingAgentButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeMode, setActiveMode] = useState<"chat" | "call">(defaultMode);
  
  // Get the last mode from localStorage on mount
  useEffect(() => {
    const savedMode = localStorage.getItem('softworks-agent-last-mode');
    if (savedMode === 'chat' || savedMode === 'call') {
      setActiveMode(savedMode);
    }
  }, []);
  
  // Update localStorage when mode changes
  useEffect(() => {
    localStorage.setItem('softworks-agent-last-mode', activeMode);
  }, [activeMode]);
  
  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);
  
  const handleOpenModal = (mode: "chat" | "call") => {
    setActiveMode(mode);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
  // When modal is closed, update the active mode (this would be set from WorkflowAgentModal)
  const handleModalClosed = (mode: "chat" | "call") => {
    setActiveMode(mode);
    handleCloseModal();
  };
  
  // Common button styles
  const buttonBaseClass = "fixed z-50 rounded-full shadow-md flex items-center justify-center " +
    "bg-white dark:bg-gray-800 text-[#0A2A43] dark:text-white hover:scale-105 " +
    "transition-all duration-200 h-12 w-12 sm:h-14 sm:w-14";
  
  return (
    <>
      {/* Floating Chat Button */}
      <Button
        onClick={() => handleOpenModal("chat")}
        className={`${buttonBaseClass} bottom-5 right-5`}
        aria-label="Chat with a workflow agent"
        tabIndex={0}
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
      
      {/* Floating Call Button with Animation */}
      <Button
        onClick={() => handleOpenModal("call")}
        className={`${buttonBaseClass} bottom-[calc(5rem+10px)] right-5 relative`}
        aria-label="Call a workflow agent"
        tabIndex={0}
      >
        <Phone className={`h-6 w-6 ${activeMode === 'call' && isModalOpen ? 'animate-pulse' : ''}`} />
        {/* Ripple effect - only visible when call mode is active */}
        {activeMode === 'call' && isModalOpen && (
          <>
            <span className="absolute inset-0 rounded-full bg-cyan opacity-75 animate-ping"></span>
            <span className="absolute -inset-1 rounded-full bg-cyan opacity-50 animate-ping" style={{ animationDelay: "0.3s" }}></span>
            <span className="absolute -inset-2 rounded-full bg-cyan opacity-25 animate-ping" style={{ animationDelay: "0.6s" }}></span>
          </>
        )}
      </Button>
      
      {/* Modal */}
      {isModalOpen && (
        <WorkflowAgentModal 
          onClose={handleCloseModal} 
          initialMode={activeMode}
          onModeChange={setActiveMode}
        />
      )}
    </>
  );
};

export default FloatingAgentButton;
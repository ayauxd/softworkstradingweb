import { useState, useEffect } from 'react';
import { MessageSquare, Phone, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import WorkflowAgentModal from './WorkflowAgentModal';

interface FloatingAgentButtonProps {
  defaultMode?: "chat" | "call";
}

const FloatingAgentButton = ({ defaultMode = "chat" }: FloatingAgentButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lastMode, setLastMode] = useState<"chat" | "call">(defaultMode);
  
  // Get the last mode from localStorage on mount
  useEffect(() => {
    const savedMode = localStorage.getItem('softworks-agent-last-mode');
    if (savedMode === 'chat' || savedMode === 'call') {
      setLastMode(savedMode);
    }
  }, []);
  
  // Update localStorage when mode changes
  useEffect(() => {
    localStorage.setItem('softworks-agent-last-mode', lastMode);
  }, [lastMode]);
  
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
  
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
  // When modal is closed, update the last mode (this would be set from WorkflowAgentModal)
  const handleModalClosed = (mode: "chat" | "call") => {
    setLastMode(mode);
    handleCloseModal();
  };
  
  return (
    <>
      {/* Floating Button */}
      <Button
        onClick={handleOpenModal}
        className="fixed bottom-5 right-5 z-50 rounded-full shadow-md flex items-center justify-center 
                 bg-white dark:bg-gray-800 text-[#0A2A43] dark:text-white hover:scale-105 
                 transition-all duration-200 h-12 w-12 sm:h-14 sm:w-14 mr-5 mb-5"
        aria-label={lastMode === "chat" ? "Chat with a workflow agent" : "Call a workflow agent"}
        tabIndex={0}
      >
        {lastMode === "chat" ? (
          <span className="text-2xl" role="img" aria-hidden="true">💬</span>
        ) : (
          <span className="text-2xl" role="img" aria-hidden="true">📞</span>
        )}
      </Button>
      
      {/* Modal */}
      {isModalOpen && (
        <WorkflowAgentModal 
          onClose={handleCloseModal} 
          initialMode={lastMode}
          onModeChange={setLastMode}
        />
      )}
    </>
  );
};

export default FloatingAgentButton;
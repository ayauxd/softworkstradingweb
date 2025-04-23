import { useState, useEffect } from 'react';
import { MessageSquare, Phone } from 'lucide-react';
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
        className="fixed bottom-6 right-6 z-50 rounded-full shadow-md p-3 flex items-center justify-center bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 h-14 w-14"
        aria-label={lastMode === "chat" ? "Chat with an agent" : "Call an agent"}
      >
        {lastMode === "chat" ? (
          <span className="text-2xl">💬</span>
        ) : (
          <span className="text-2xl">📞</span>
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
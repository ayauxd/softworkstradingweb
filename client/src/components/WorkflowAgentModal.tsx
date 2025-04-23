import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageSquare, Phone, Send, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface WorkflowAgentModalProps {
  onClose: () => void;
  initialMode?: "chat" | "call" | "none";
  onModeChange?: (mode: "chat" | "call") => void;
}

const WorkflowAgentModal = ({ 
  onClose, 
  initialMode = "none",
  onModeChange 
}: WorkflowAgentModalProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"none" | "chat" | "call">(initialMode);
  const [showCallbackForm, setShowCallbackForm] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<Array<{from: string, text: string}>>([
    { from: "agent", text: "Hello! I'm here to help you automate your workflows. What specific process are you looking to improve?" }
  ]);
  const [callbackForm, setCallbackForm] = useState({
    fullName: "",
    workEmail: "",
    companyName: "",
    message: "",
    callbackTime: ""
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Reset the active tab when modal is closed
  useEffect(() => {
    return () => {
      setActiveTab("none");
      setShowCallbackForm(false);
    };
  }, []);
  
  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  
  // Update parent component when mode changes
  useEffect(() => {
    if (activeTab !== "none" && onModeChange) {
      onModeChange(activeTab as "chat" | "call");
    }
  }, [activeTab, onModeChange]);
  
  const handleChatClick = () => {
    setActiveTab("chat");
  };
  
  const handleCallClick = () => {
    setActiveTab("call");
    
    // Simulate call animation for 2 seconds then show form
    setTimeout(() => {
      setShowCallbackForm(true);
    }, 2000);
  };
  
  const handleSendMessage = () => {
    if (chatInput.trim()) {
      // Add user message
      setMessages(prev => [...prev, { from: "user", text: chatInput }]);
      
      // Clear input
      setChatInput("");
      
      // Simulate response after a short delay
      setTimeout(() => {
        setMessages(prev => [
          ...prev, 
          { 
            from: "agent", 
            text: "Thanks for reaching out! We'll analyze your specific needs and suggest the best automation approach for your business. Would you like to schedule a detailed consultation?" 
          }
        ]);
      }, 1000);
    }
  };
  
  const handleChatInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleCallbackFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCallbackForm(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field if it exists and has a value now
    if (formErrors[name] && value.trim()) {
      setFormErrors(prev => ({ ...prev, [name]: false }));
    }
  };
  
  const [formErrors, setFormErrors] = useState<{[key: string]: boolean}>({});
  const [formShakeEffect, setFormShakeEffect] = useState(false);
  
  const handleCallbackFormSubmit = (e: React.FormEvent) => {
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
    } else if (!/^\S+@\S+\.\S+$/.test(callbackForm.workEmail)) {
      // Simple email validation
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
    
    // Form is valid, show success message
    toast({
      title: "Callback Requested!",
      description: "One of our workflow agents will contact you shortly.",
    });
    
    // Close modal
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-screen-sm max-h-[85vh] overflow-y-auto">
        <div className="flex justify-between items-center">
          <DialogTitle className="text-lg sm:text-xl">Talk to a Workflow Agent</DialogTitle>
          <DialogClose asChild>
            <button 
              className="rounded-full p-1 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan"
              aria-label="Close"
              tabIndex={0}
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </DialogClose>
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
                  variant="outline"
                  className={cn(
                    "flex-1 bg-navy dark:bg-soft-white hover:bg-navy-light dark:hover:bg-gray-200",
                    "text-soft-white dark:text-navy font-medium py-3 px-4 rounded-md",
                    "transition-all duration-200 flex items-center justify-center hover:scale-[1.02]",
                    "min-h-[52px] text-base"
                  )}
                  aria-label="Chat with a workflow agent"
                >
                  <span className="flex items-center">
                    <span className="mr-2 text-xl" role="img" aria-hidden="true">💬</span> Chat with an Agent
                  </span>
                </Button>
                
                <Button 
                  onClick={handleCallClick} 
                  variant="outline"
                  className={cn(
                    "flex-1 bg-cyan hover:bg-cyan-light text-navy font-medium py-3 px-4",
                    "rounded-md transition-all duration-200 flex items-center justify-center hover:scale-[1.02]",
                    "min-h-[52px] text-base"
                  )}
                  aria-label="Call a workflow agent"
                >
                  <span className="flex items-center">
                    <span className="mr-2 text-xl" role="img" aria-hidden="true">📞</span> Call an Agent
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
                <div key={index} className={`mb-4 ${message.from === "user" ? "text-right" : ""}`}>
                  <div className="font-medium text-navy dark:text-soft-white">
                    {message.from === "agent" ? "Workflow Agent" : "You"}
                  </div>
                  <div className={cn(
                    "p-3 rounded-lg inline-block max-w-[75%] mt-1 text-navy dark:text-soft-white shadow-sm",
                    "transition-all duration-200 text-base",
                    message.from === "agent" 
                      ? "bg-white dark:bg-navy border-l-4 border-cyan" 
                      : "bg-cyan bg-opacity-20"
                  )}>
                    {message.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            <div className="flex w-full">
              <Input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={handleChatInputKeyDown}
                placeholder="How can I simplify my daily tasks with AI?"
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
          <div className="mt-2">
            {!showCallbackForm ? (
              <div className="py-8 flex flex-col items-center">
                <div className="rounded-full bg-cyan p-6 mb-4 relative">
                  <Phone className="h-12 w-12 text-navy animate-pulse" />
                  {/* Ripple effect */}
                  <span className="absolute -inset-0.5 rounded-full bg-cyan opacity-75 animate-ping"></span>
                  <span className="absolute -inset-2 rounded-full bg-cyan opacity-50 animate-ping" style={{ animationDelay: "0.3s" }}></span>
                  <span className="absolute -inset-3.5 rounded-full bg-cyan opacity-25 animate-ping" style={{ animationDelay: "0.6s" }}></span>
                </div>
                <p className="text-navy dark:text-soft-white text-lg font-medium mb-2">
                  Calling a workflow agent...
                </p>
                <p className="text-neutral-gray dark:text-gray-300">
                  They'll be with you in a moment
                </p>
              </div>
            ) : (
              <div>
                <p className="text-navy dark:text-soft-white text-center mb-2">
                  Our agents are currently assisting other clients. Leave your details for a callback.
                </p>
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

export default WorkflowAgentModal;

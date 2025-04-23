import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageSquare, Phone, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WorkflowAgentModalProps {
  onClose: () => void;
}

const WorkflowAgentModal = ({ onClose }: WorkflowAgentModalProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"none" | "chat" | "call">("none");
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
  };
  
  const handleCallbackFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!callbackForm.fullName || !callbackForm.workEmail || !callbackForm.message) {
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
      <DialogContent className="sm:max-w-lg">
        <DialogTitle>Talk to a Workflow Agent</DialogTitle>
        
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
                  className="flex-1 bg-navy dark:bg-soft-white hover:bg-navy-light dark:hover:bg-gray-200 
                          text-soft-white dark:text-navy font-medium py-3 px-4 rounded-md 
                          transition-colors duration-300 flex items-center justify-center"
                >
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Chat
                </Button>
                
                <Button 
                  onClick={handleCallClick} 
                  variant="outline"
                  className="flex-1 bg-cyan hover:bg-cyan-light text-navy font-medium py-3 px-4 
                           rounded-md transition-colors duration-300 flex items-center justify-center"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  Call
                </Button>
              </div>
            </div>
          </>
        )}
        
        {/* Chat Interface - without any top buttons */}
        {activeTab === "chat" && (
          <div className="mt-2">
            <div className="bg-gray-100 dark:bg-navy-dark p-4 rounded-lg h-60 overflow-y-auto mb-4 text-left">
              {messages.map((message, index) => (
                <div key={index} className={`mb-4 ${message.from === "user" ? "text-right" : ""}`}>
                  <div className="font-medium text-navy dark:text-soft-white">
                    {message.from === "agent" ? "Workflow Agent" : "You"}
                  </div>
                  <div className={`
                    ${message.from === "agent" 
                      ? "bg-white dark:bg-navy p-3 rounded-lg inline-block max-w-[75%] mt-1 text-navy dark:text-soft-white" 
                      : "bg-cyan bg-opacity-20 p-3 rounded-lg inline-block max-w-[75%] mt-1 text-navy dark:text-soft-white"}
                  `}>
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
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md 
                         bg-white dark:bg-navy-dark text-navy dark:text-soft-white focus:ring-2 focus:ring-cyan"
              />
              <Button
                onClick={handleSendMessage}
                className="bg-cyan hover:bg-cyan-light text-navy font-medium py-2 px-4 
                         rounded-r-md transition-colors duration-300"
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
                
                <form onSubmit={handleCallbackFormSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="fullName" className="text-navy dark:text-gray-300">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={callbackForm.fullName}
                      onChange={handleCallbackFormChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                              bg-white dark:bg-navy-dark text-navy dark:text-soft-white focus:ring-2 focus:ring-cyan"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="workEmail" className="text-navy dark:text-gray-300">
                      Work Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="email"
                      id="workEmail"
                      name="workEmail"
                      value={callbackForm.workEmail}
                      onChange={handleCallbackFormChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                              bg-white dark:bg-navy-dark text-navy dark:text-soft-white focus:ring-2 focus:ring-cyan"
                    />
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
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                              bg-white dark:bg-navy-dark text-navy dark:text-soft-white focus:ring-2 focus:ring-cyan"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="callbackMessage" className="text-navy dark:text-gray-300">
                      What do you need help with? <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="callbackMessage"
                      name="message"
                      rows={3}
                      value={callbackForm.message}
                      onChange={handleCallbackFormChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                               bg-white dark:bg-navy-dark text-navy dark:text-soft-white focus:ring-2 focus:ring-cyan resize-none"
                    />
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
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                              bg-white dark:bg-navy-dark text-navy dark:text-soft-white focus:ring-2 focus:ring-cyan"
                    />
                  </div>
                  
                  <div className="flex justify-center">
                    <Button
                      type="submit"
                      className="bg-cyan hover:bg-cyan-light text-navy font-medium py-2 px-6 
                              rounded-md transition-colors duration-300 flex items-center"
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

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { aiService } from "@/lib/aiService";

interface CallbackFormProps {
  initialMessage?: string;
  onSubmitSuccess: () => void;
}

interface FormData {
  fullName: string;
  workEmail: string;
  companyName: string;
  message: string;
  callbackTime: string;
}

/**
 * CallbackForm - Form for requesting a callback after voice call
 */
const CallbackForm = ({ initialMessage = "", onSubmitSuccess }: CallbackFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    workEmail: "",
    companyName: "",
    message: initialMessage,
    callbackTime: ""
  });
  
  const [formErrors, setFormErrors] = useState<{[key: string]: boolean}>({});
  const [formShakeEffect, setFormShakeEffect] = useState(false);
  
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field if it exists and has a value now
    if (formErrors[name] && value.trim()) {
      setFormErrors(prev => ({ ...prev, [name]: false }));
    }
  }, [formErrors]);
  
  // Validate emails
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    return emailRegex.test(email);
  };
  
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset error states
    const newErrors: {[key: string]: boolean} = {};
    let hasErrors = false;
    
    // Validate form fields
    if (!formData.fullName) {
      newErrors.fullName = true;
      hasErrors = true;
    }
    
    if (!formData.workEmail) {
      newErrors.workEmail = true;
      hasErrors = true;
    } else if (!isValidEmail(formData.workEmail)) {
      // Email validation
      newErrors.workEmail = true;
      hasErrors = true;
    }
    
    if (!formData.message) {
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
    try {
      // Send the form data as a summary
      const formSummary = `
        Name: ${formData.fullName}
        Email: ${formData.workEmail}
        Company: ${formData.companyName || 'Not provided'}
        Preferred Callback Time: ${formData.callbackTime || 'Not specified'}
        
        Message/Summary:
        ${formData.message}
      `;
      
      const emailSent = await aiService.sendCallSummary(formSummary, formData.workEmail);
      
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
      
      // Notify parent component of successful submission
      onSubmitSuccess();
    } catch (error) {
      console.error('Error sending callback form:', error);
      
      toast({
        title: "Error Submitting Form",
        description: "There was a problem sending your information. Please try again.",
        variant: "destructive"
      });
    }
  }, [formData, toast, onSubmitSuccess]);

  return (
    <div className="p-4 sm:p-6">
      <h3 className="text-lg font-medium text-navy dark:text-soft-white mb-4 text-center">
        Request a Callback
      </h3>
      <p className="text-neutral-gray dark:text-gray-300 text-center text-sm mb-4">
        Tell us a bit about your business needs so we can prepare for our call.
      </p>
      
      <form 
        onSubmit={handleSubmit} 
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
              value={formData.fullName}
              onChange={handleInputChange}
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
              value={formData.workEmail}
              onChange={handleInputChange}
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
            value={formData.companyName}
            onChange={handleInputChange}
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
              value={formData.message}
              onChange={handleInputChange}
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
            value={formData.callbackTime}
            onChange={handleInputChange}
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
  );
};

export default CallbackForm;
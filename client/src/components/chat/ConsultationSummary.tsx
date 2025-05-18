import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AlertCircle, Check, Clipboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { aiService } from "@/lib/aiService";

interface ConsultationSummaryProps {
  callSummary: string;
  onSubmit: () => void;
  onBack: () => void;
}

interface FormData {
  fullName: string;
  workEmail: string;
  companyName: string;
  phoneNumber: string;
  additionalNotes: string;
}

/**
 * ConsultationSummary - Shows a summary of the voice call and captures user information
 */
const ConsultationSummary = ({ 
  callSummary, 
  onSubmit, 
  onBack 
}: ConsultationSummaryProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    workEmail: "",
    companyName: "",
    phoneNumber: "",
    additionalNotes: ""
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
    
    setIsSubmitting(true);
    
    // Attempt to send the consultation summary
    try {
      // Prepare the full summary with user details
      const consultationSummary = `
# Consultation Summary
${callSummary}

## Client Information
- Name: ${formData.fullName}
- Email: ${formData.workEmail}
- Company: ${formData.companyName || 'Not provided'}
- Phone: ${formData.phoneNumber || 'Not provided'}

## Additional Notes
${formData.additionalNotes || 'No additional notes provided'}
      `;
      
      const emailSent = await aiService.sendCallSummary(consultationSummary, formData.workEmail);
      
      // Form is valid, show success message
      toast({
        title: "Consultation Summary Sent!",
        description: "Thank you for your time. A Softworks Trading consultant will be in touch shortly.",
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
      setTimeout(() => {
        onSubmit();
      }, 1500);
    } catch (error) {
      console.error('Error sending consultation summary:', error);
      
      toast({
        title: "Error Submitting Form",
        description: "There was a problem sending your information. Please try again.",
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  }, [formData, callSummary, toast, onSubmit]);

  // Function to copy summary to clipboard
  const handleCopySummary = useCallback(() => {
    navigator.clipboard.writeText(callSummary).then(() => {
      setIsCopied(true);
      toast({
        title: "Summary Copied",
        description: "The consultation summary has been copied to your clipboard.",
      });
      
      // Reset the copied state after 3 seconds
      setTimeout(() => setIsCopied(false), 3000);
    }).catch(err => {
      console.error('Error copying to clipboard:', err);
      toast({
        title: "Copy Failed",
        description: "Unable to copy to clipboard. Please try manually selecting the text.",
        variant: "destructive"
      });
    });
  }, [callSummary, toast]);
  
  return (
    <div className="p-4 sm:p-6 max-h-[85vh] overflow-y-auto">
      <h3 className="text-lg font-semibold text-navy dark:text-soft-white mb-3 text-center">
        Consultation Summary
      </h3>
      
      {/* Call Summary Section */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-4 mb-5 relative">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-medium text-navy dark:text-gray-200">Call Highlights</h4>
          <button 
            onClick={handleCopySummary}
            className="text-xs text-cyan hover:text-cyan-dark flex items-center p-1 rounded"
            aria-label="Copy summary to clipboard"
          >
            {isCopied ? (
              <><Check className="h-3 w-3 mr-1" /> Copied</>
            ) : (
              <><Clipboard className="h-3 w-3 mr-1" /> Copy</>
            )}
          </button>
        </div>
        
        <div className="text-sm whitespace-pre-line text-navy dark:text-gray-300">
          {callSummary}
        </div>
      </div>
      
      {/* Contact Information Form */}
      <form 
        onSubmit={handleSubmit} 
        className={cn(
          "space-y-4",
          formShakeEffect && "animate-shake"
        )}
        noValidate
      >
        <p className="text-sm text-neutral-gray dark:text-gray-300 mb-4">
          To receive your consultation summary and schedule a follow-up, please provide your contact information:
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                disabled={isSubmitting}
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
                <p id="fullName-error" className="text-red-500 text-xs mt-1 absolute">
                  Please enter your full name
                </p>
              )}
            </div>
          </div>
          
          <div>
            <Label htmlFor="workEmail" className="text-navy dark:text-gray-300">
              Email Address <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                type="email"
                id="workEmail"
                name="workEmail"
                value={formData.workEmail}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
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
                <p id="workEmail-error" className="text-red-500 text-xs mt-1 absolute">
                  Please enter a valid email address
                </p>
              )}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="companyName" className="text-navy dark:text-gray-300">
              Company Name <span className="text-gray-400 text-xs">(optional)</span>
            </Label>
            <Input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className={cn(
                "w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md",
                "bg-white dark:bg-navy-dark text-navy dark:text-soft-white", 
                "focus:ring-2 focus:ring-cyan text-base min-h-[44px]",
                "transition-all duration-200"
              )}
            />
          </div>
          
          <div>
            <Label htmlFor="phoneNumber" className="text-navy dark:text-gray-300">
              Phone Number <span className="text-gray-400 text-xs">(optional)</span>
            </Label>
            <Input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className={cn(
                "w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md",
                "bg-white dark:bg-navy-dark text-navy dark:text-soft-white", 
                "focus:ring-2 focus:ring-cyan text-base min-h-[44px]",
                "transition-all duration-200"
              )}
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="additionalNotes" className="text-navy dark:text-gray-300">
            Additional Notes <span className="text-gray-400 text-xs">(optional)</span>
          </Label>
          <Textarea
            id="additionalNotes"
            name="additionalNotes"
            rows={3}
            value={formData.additionalNotes}
            onChange={handleInputChange}
            disabled={isSubmitting}
            placeholder="Any other information you'd like to share with our consultants..."
            className={cn(
              "w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md",
              "bg-white dark:bg-navy-dark text-navy dark:text-soft-white", 
              "focus:ring-2 focus:ring-cyan text-base",
              "transition-all duration-200 resize-none"
            )}
          />
        </div>
        
        <div className="bg-cyan/10 dark:bg-cyan/5 rounded p-3 flex items-start">
          <AlertCircle className="text-cyan h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-navy dark:text-gray-300">
            By submitting this form, you agree to be contacted by a Softworks Trading consultant. We'll email you a copy of this consultation summary for your records.
          </p>
        </div>
        
        <div className="flex justify-between pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={isSubmitting}
            className="px-4 py-2"
          >
            Back to Call
          </Button>
          
          <Button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              "bg-cyan hover:bg-cyan-light text-navy font-medium px-6", 
              "rounded-md transition-all duration-200 flex items-center",
              "min-h-[44px]"
            )}
            aria-label="Submit consultation summary"
          >
            {isSubmitting ? 'Sending...' : 'Send Summary'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ConsultationSummary;
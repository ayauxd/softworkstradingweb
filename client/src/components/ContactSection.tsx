import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { getCSRFHeaders } from "@/lib/csrf";

const ContactSection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: "",
    company: "",
    email: "",
    phone: "",
    message: ""
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.fullName.trim()) {
      errors.fullName = "Name is required";
    } else if (formData.fullName.trim().length < 2) {
      errors.fullName = "Name must be at least 2 characters";
    }
    
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    
    if (!formData.message.trim()) {
      errors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      errors.message = "Please provide a more detailed message (at least 10 characters)";
    }
    
    return errors;
  };
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Get CSRF headers for the request
      const csrfHeaders = await getCSRFHeaders();
      
      // Send form data to the server with CSRF token
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...csrfHeaders
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit form');
      }
      
      // Form is valid and submitted successfully, show success message
      toast({
        title: "Message Sent!",
        description: "We'll be in touch with you shortly.",
      });
      
      // Reset form
      setFormData({
        fullName: "",
        company: "",
        email: "",
        phone: "",
        message: ""
      });
    } catch (error) {
      // Show error message
      toast({
        title: "Error",
        description: "There was an error sending your message. Please try again.",
        variant: "destructive"
      });
      
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-12 md:py-20 bg-[#0A2A43] dark:bg-navy-dark text-white transition-colors duration-300">
      <div className="container max-w-screen-xl mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Operations?</h2>
            <p className="text-lg text-gray-100">Let's explore how intelligent systems can streamline your business.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6 bg-navy-dark/50 p-6 rounded-lg shadow-inner max-w-3xl mx-auto">
            <div className="mb-2">
              <Label htmlFor="fullName" className="text-gray-100 flex items-center mb-1.5 text-base">
                Full Name <span className="text-red-400 ml-1">*</span>
              </Label>
              <Input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                aria-required="true"
                aria-invalid={!!formErrors.fullName}
                aria-describedby={formErrors.fullName ? "fullName-error" : undefined}
                placeholder="Enter your full name"
                className={`w-full px-4 py-3 bg-navy-light border border-gray-600 rounded-md
                          text-white focus:ring-2 focus:ring-cyan focus:border-cyan shadow-inner
                          ${formErrors.fullName ? 'border-red-500 focus:ring-red-400' : ''}`}
              />
              {formErrors.fullName && (
                <p id="fullName-error" className="mt-1.5 text-sm text-red-400 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {formErrors.fullName}
                </p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="company" className="text-gray-100 flex items-center mb-1.5 text-base">
                  Company <span className="text-gray-400 ml-1">(Optional)</span>
                </Label>
                <Input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Your company name"
                  className="w-full px-4 py-3 bg-navy-light border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-cyan shadow-inner"
                />
              </div>
              
              <div>
                <Label htmlFor="email" className="text-gray-100 flex items-center mb-1.5 text-base">
                  Email <span className="text-red-400 ml-1">*</span>
                </Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  aria-required="true"
                  aria-invalid={!!formErrors.email}
                  aria-describedby={formErrors.email ? "email-error" : undefined}
                  placeholder="your@email.com"
                  className={`w-full px-4 py-3 bg-navy-light border border-gray-600 rounded-md
                            text-white focus:ring-2 focus:ring-cyan focus:border-cyan shadow-inner
                            ${formErrors.email ? 'border-red-500 focus:ring-red-400' : ''}`}
                />
                {formErrors.email && (
                  <p id="email-error" className="mt-1.5 text-sm text-red-400 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    {formErrors.email}
                  </p>
                )}
              </div>
            </div>
            
            <div>
              <Label htmlFor="phone" className="text-gray-100 flex items-center mb-1.5 text-base">
                Phone <span className="text-gray-400 ml-1">(Optional)</span>
              </Label>
              <Input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Your phone number"
                className="w-full px-4 py-3 bg-navy-light border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-cyan shadow-inner"
              />
            </div>
            
            <div>
              <Label htmlFor="message" className="text-gray-100 flex items-center mb-1.5 text-base">
                Message <span className="text-red-400 ml-1">*</span>
              </Label>
              <Textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                required
                aria-required="true"
                aria-invalid={!!formErrors.message}
                aria-describedby={formErrors.message ? "message-error" : undefined}
                placeholder="Tell us how we can help with your workflow automation needs..."
                className={`w-full px-4 py-3 bg-navy-light border border-gray-600 rounded-md
                          text-white focus:ring-2 focus:ring-cyan focus:border-cyan shadow-inner
                          resize-none ${formErrors.message ? 'border-red-500 focus:ring-red-400' : ''}`}
              />
              {formErrors.message && (
                <p id="message-error" className="mt-1.5 text-sm text-red-400 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {formErrors.message}
                </p>
              )}
            </div>
            
            <div className="mt-6 flex flex-col items-center">
              <div className="text-center text-sm text-gray-300 mb-4">
                <p className="flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Fields marked with <span className="text-red-400 mx-1">*</span> are required
                </p>
              </div>
              
              <Button 
                type="submit" 
                className="w-full max-w-md bg-cyan hover:bg-cyan-light text-navy font-semibold text-sm md:text-base py-3 px-8 
                         rounded-md transition-all duration-300 transform hover:scale-105 
                         flex items-center justify-center h-auto
                         focus:ring-2 focus:ring-cyan-light focus:ring-offset-2 
                         focus:ring-offset-navy focus:outline-none active:translate-y-0.5
                         shadow-lg shadow-cyan/20 hover:shadow-cyan/30"
                aria-label="Submit contact form"
                title="Send your message to our team"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-navy" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    Send Request
                    <ArrowRight className="h-5 w-5 ml-2" aria-hidden="true" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

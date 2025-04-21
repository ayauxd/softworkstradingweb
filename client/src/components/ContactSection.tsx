import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

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
    }
    
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }
    
    if (!formData.message.trim()) {
      errors.message = "Message is required";
    }
    
    return errors;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    // Form is valid, show success message
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
  };

  return (
    <section id="contact" className="py-12 md:py-20 bg-[#0A2A43] dark:bg-navy-dark text-white transition-colors duration-300">
      <div className="container max-w-screen-xl mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Operations?</h2>
            <p className="text-lg text-gray-300">Let's explore how intelligent systems can streamline your business.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="fullName" className="text-gray-100">Full Name</Label>
              <Input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-navy-light border border-gray-600 rounded-md
                          text-white focus:ring-2 focus:ring-cyan ${formErrors.fullName ? 'border-red-500' : ''}`}
              />
              {formErrors.fullName && (
                <p className="mt-1 text-sm text-red-400">{formErrors.fullName}</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="company" className="text-gray-300">Company (Optional)</Label>
                <Input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-navy-light border border-gray-600 rounded-md text-soft-white focus:ring-2 focus:ring-cyan"
                />
              </div>
              
              <div>
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-navy-light border border-gray-600 rounded-md
                            text-soft-white focus:ring-2 focus:ring-cyan ${formErrors.email ? 'border-red-500' : ''}`}
                />
                {formErrors.email && (
                  <p className="mt-1 text-sm text-red-400">{formErrors.email}</p>
                )}
              </div>
            </div>
            
            <div>
              <Label htmlFor="phone" className="text-gray-300">Phone (Optional)</Label>
              <Input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-navy-light border border-gray-600 rounded-md text-soft-white focus:ring-2 focus:ring-cyan"
              />
            </div>
            
            <div>
              <Label htmlFor="message" className="text-gray-300">Message</Label>
              <Textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-navy-light border border-gray-600 rounded-md
                          text-soft-white focus:ring-2 focus:ring-cyan resize-none ${formErrors.message ? 'border-red-500' : ''}`}
              />
              {formErrors.message && (
                <p className="mt-1 text-sm text-red-400">{formErrors.message}</p>
              )}
            </div>
            
            <div className="flex justify-center">
              <Button 
                type="submit" 
                className="w-full bg-cyan hover:bg-cyan-light text-navy font-semibold text-sm md:text-base py-3 px-8 
                         rounded-md transition-colors duration-300 transform hover:scale-105 
                         flex items-center justify-center h-auto"
              >
                Send Request
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

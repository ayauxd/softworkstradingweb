import LogoIcon from "./LogoIcon";
import { Mail, Phone, MapPin, Linkedin, Facebook, Instagram } from "lucide-react";
import { SiX } from "react-icons/si";

const Footer = () => {
  // Smooth scroll function
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth"
      });
    }
  };

  return (
    <footer className="bg-navy-dark text-soft-white py-10 sm:py-12" role="contentinfo">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10">
          {/* Quick Links */}
          <div className="border-b border-gray-700 pb-6 sm:border-0 sm:pb-0">
            <h3 className="text-lg font-semibold mb-4 text-cyan-light">Quick Links</h3>
            <ul className="grid grid-cols-2 sm:grid-cols-1 gap-y-2">
              {["home", "services", "testimonials", "insights", "contact"].map((link) => (
                <li key={link}>
                  <a 
                    href={`#${link}`} 
                    className="text-gray-200 hover:text-cyan transition-colors inline-flex items-center"
                    onClick={(e) => { e.preventDefault(); scrollToSection(link); }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-cyan mr-2"
                      aria-hidden="true"
                    >
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                    {link.charAt(0).toUpperCase() + link.slice(1)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Services */}
          <div className="border-b border-gray-700 pb-6 sm:border-0 sm:pb-0">
            <h3 className="text-lg font-semibold mb-4 text-cyan-light">Services</h3>
            <ul className="space-y-2">
              {[
                "Rapid Automation Deployment", 
                "Founders' Workflow Coaching", 
                "AI Strategy Consultation", 
                "Process Optimization", 
                "AI Implementation"
              ].map((service) => (
                <li key={service}>
                  <a 
                    href="#services" 
                    className="text-gray-200 hover:text-cyan transition-colors inline-flex items-center"
                    onClick={(e) => { e.preventDefault(); scrollToSection("services"); }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-cyan mr-2"
                      aria-hidden="true"
                    >
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-cyan-light">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-cyan" aria-hidden="true" />
                <a href="mailto:agent@softworkstrading.com" className="text-gray-300 hover:text-cyan transition-colors">
                  agent@softworkstrading.com
                </a>
              </li>
            </ul>
            
            {/* Social Media Icons */}
            <div className="mt-6 flex space-x-4">
              <a 
                href="#" 
                className="text-gray-300 hover:text-cyan transition-colors bg-navy-light p-2 rounded-full"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-300 hover:text-cyan transition-colors bg-navy-light p-2 rounded-full"
                aria-label="X (Twitter)"
              >
                <SiX className="h-4 w-4" />
              </a>
              <a 
                href="#" 
                className="text-gray-300 hover:text-cyan transition-colors bg-navy-light p-2 rounded-full"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-300 hover:text-cyan transition-colors bg-navy-light p-2 rounded-full"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-10 pt-8 border-t border-gray-700">
          <div className="flex justify-center mb-8">
            <LogoIcon className="h-9.5 w-auto mx-auto" isWhite={true} />
          </div>
          
          <div className="flex flex-col items-center">
            <div className="text-center mb-6">
              <span className="text-gray-300 text-base">&copy; {new Date().getFullYear()} Softworks Trading Company.</span>
              <div className="text-gray-300 mt-1">All rights reserved.</div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-8 mb-6">
              <a 
                href="/privacy-policy"
                className="text-gray-200 hover:text-cyan transition-colors text-sm"
                aria-label="View our Privacy Policy"
              >
                Privacy Policy
              </a>
              <a 
                href="/terms-of-service"
                className="text-gray-200 hover:text-cyan transition-colors text-sm"
                aria-label="View our Terms of Service"
              >
                Terms of Service
              </a>
              <a 
                href="/cookie-policy"
                className="text-gray-200 hover:text-cyan transition-colors text-sm"
                aria-label="View our Cookie Policy"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

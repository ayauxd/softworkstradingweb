import LogoIcon from "./LogoIcon";
import { Mail, Phone, MapPin, Linkedin, Facebook, Twitter, Instagram } from "lucide-react";

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
    <footer className="bg-navy-dark text-soft-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {["home", "services", "testimonials", "insights", "contact"].map((link) => (
                <li key={link}>
                  <a 
                    href={`#${link}`} 
                    className="text-gray-300 hover:text-cyan transition-colors"
                    onClick={(e) => { e.preventDefault(); scrollToSection(link); }}
                  >
                    {link.charAt(0).toUpperCase() + link.slice(1)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              {[
                "Done-With-You Automation", 
                "Workflow Coaching", 
                "AI Strategy Session", 
                "Process Optimization", 
                "Team Training"
              ].map((service) => (
                <li key={service}>
                  <a href="#services" className="text-gray-300 hover:text-cyan transition-colors">
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-cyan" />
                <a href="mailto:contact@softworks.com" className="text-gray-300 hover:text-cyan transition-colors">
                  contact@softworks.com
                </a>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-cyan" />
                <span className="text-gray-300">(555) 123-4567</span>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 mt-1 text-cyan" />
                <span className="text-gray-300">
                  123 Innovation Drive<br />San Francisco, CA 94103
                </span>
              </li>
            </ul>
            
            {/* Social Media Icons */}
            <div className="mt-6 flex space-x-4">
              {[
                { icon: <Linkedin className="h-6 w-6" />, url: "#" },
                { icon: <Facebook className="h-6 w-6" />, url: "#" },
                { icon: <Twitter className="h-6 w-6" />, url: "#" },
                { icon: <Instagram className="h-6 w-6" />, url: "#" }
              ].map((social, index) => (
                <a 
                  key={index} 
                  href={social.url} 
                  className="text-gray-300 hover:text-cyan transition-colors"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <LogoIcon className="h-8 w-auto" />
              <span className="ml-3 text-gray-300">&copy; {new Date().getFullYear()} Softworks Trading Company. All rights reserved.</span>
            </div>
            <div className="flex space-x-6">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((policy) => (
                <a key={policy} href="#" className="text-gray-300 hover:text-cyan transition-colors text-sm">
                  {policy}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

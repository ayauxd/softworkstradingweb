import { Button } from "@/components/ui/button";
import { ResponsiveImage } from "@/components/ui/responsive-image";
import { useState, useEffect } from "react";

interface ServiceDetail {
  key: string;
  value: string;
}

interface Service {
  title: string;
  description: string;
  imageUrl: string;
  fallbackUrl: string;
  alt: string;
  details: ServiceDetail[];
}

interface ServicesSectionProps {
  onTalkToAgent?: () => void;
}

const ServicesSection = ({ onTalkToAgent }: ServicesSectionProps) => {
  const [activeService, setActiveService] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if we're on mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px is the md breakpoint in Tailwind
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  // Close active service on mobile when clicking outside
  useEffect(() => {
    if (!isMobile) return;
    
    const handleClickOutside = (e: MouseEvent) => {
      if (!activeService) return;
      
      // Check if click target is a service card
      const clickedOnCard = (e.target as Element).closest('.service-card');
      if (!clickedOnCard) {
        setActiveService(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobile, activeService]);
  const services: Service[] = [
    {
      title: "AI Strategy Consultation (No Coding Needed)",
      description: "Get expert guidance on integrating AI into your business strategy without needing technical expertise.",
      imageUrl: "/optimized-images/services/ai-strategy-consultation.webp",
      fallbackUrl: "/assets/images/services/ai-strategy-consultation.jpeg",
      alt: "Business meeting discussing AI strategy charts",
      details: [
        { key: "Assessment", value: "Comprehensive review of your current workflows" },
        { key: "Planning", value: "AI roadmap with concrete implementation steps" },
        { key: "ROI Analysis", value: "Projected cost savings and productivity gains" }
      ]
    },
    {
      title: "Founders' Workflow Coaching",
      description: "Optimize your personal and team workflows for maximum productivity and focus.",
      imageUrl: "/optimized-images/services/founders-workflow-coaching.webp",
      fallbackUrl: "/assets/images/services/founders-workflow-coaching.jpeg",
      alt: "Team collaborating around a table with laptops",
      details: [
        { key: "Time Audit", value: "Identify where your valuable time is being spent" },
        { key: "Task Automation", value: "Set up systems to handle repetitive work" },
        { key: "Decision Frameworks", value: "Streamline your decision-making process" },
        { key: "Knowledge Management", value: "Systems to capture and leverage company knowledge" }
      ]
    },
    {
      title: "Rapid Automation Deployment",
      description: "Implement efficient automation solutions tailored to your business needs.",
      imageUrl: "/optimized-images/services/rapid-automation-deployment.webp",
      fallbackUrl: "/assets/images/services/rapid-automation-deployment.jpeg",
      alt: "Digital workflow automation with computer dashboard",
      details: [
        { key: "Process Analysis", value: "Identify high-impact automation opportunities" },
        { key: "Custom Solutions", value: "Tailor-made workflows for your specific needs" },
        { key: "Integration", value: "Connect your existing tools and software" },
        { key: "Optimization", value: "Continuous improvement of your automated processes" }
      ]
    }
  ];

  return (
    <section id="services" className="py-20 pb-16 bg-soft-white dark:bg-navy transition-colors duration-300 border-b border-neutral-200 dark:border-navy-light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-navy dark:text-soft-white">
            Practical AI Solutions with Rapid ROI
          </h2>
          <p className="text-lg text-neutral-gray dark:text-gray-300 max-w-3xl mx-auto">
            We help non-technical teams implement high-impact AI solutions that deliver measurable results within weeks, not months. 
            Our approach eliminates the need for technical expertise in prompt engineering, APIs, or automation tools.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index} 
              className={`service-card bg-white dark:bg-navy-light rounded-xl shadow-md overflow-hidden 
                         transition-all duration-500 hover:shadow-xl group relative h-full flex flex-col
                         ${isMobile && activeService === index ? 'z-10 ring-2 ring-cyan scale-[1.01]' : 'hover:translate-y-[-4px]'}`}
              tabIndex={0}
              onClick={() => {
                if (isMobile) {
                  setActiveService(activeService === index ? null : index);
                }
              }}
              onKeyDown={(e) => {
                if (isMobile && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  setActiveService(activeService === index ? null : index);
                }
              }}
            >
              <div className="relative w-full pt-[56.25%] bg-gradient-to-b from-gray-100 to-gray-200 dark:from-navy-dark/70 dark:to-navy-dark overflow-hidden">
                <picture className="absolute inset-0">
                  <source srcSet={service.imageUrl} type="image/webp" />
                  <img 
                    src={service.fallbackUrl} 
                    alt={service.alt}
                    className="w-full h-full object-cover transform scale-[1.02] hover:scale-[1.05] transition-transform duration-700"
                    loading="lazy"
                    width="800" 
                    height="450"
                  />
                </picture>
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
              <div className="px-6 py-5 pb-14 relative flex flex-col h-full">
                <h3 className="text-xl font-semibold mb-3 text-navy dark:text-soft-white leading-tight">
                  {service.title}
                </h3>
                <p className="text-neutral-gray dark:text-gray-300 text-base leading-relaxed flex-grow">
                  {service.description}
                </p>
                
                {isMobile && (
                  <div className="absolute bottom-4 right-4 z-10">
                    <div className="w-9 h-9 rounded-full bg-cyan/10 flex items-center justify-center transition-all duration-300 hover:bg-cyan/20 shadow-sm backdrop-blur-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Details Overlay - slides up on hover/focus on desktop, and on tap on mobile */}
              <div 
                className={`absolute inset-0 bg-gradient-to-t from-navy/95 to-navy/90 dark:from-navy-dark/95 dark:to-navy-dark/90 
                          ${isMobile 
                            ? (activeService === index ? 'translate-y-0' : 'translate-y-full')
                            : 'translate-y-full group-hover:translate-y-0 group-focus:translate-y-0'} 
                          transition-transform duration-400 ease-out
                          flex flex-col justify-between p-6 text-white overflow-hidden backdrop-blur-sm shadow-inner`}
                aria-hidden={isMobile ? activeService !== index : true}
                style={{ 
                  transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                <div className="overflow-auto">
                  <h4 className="text-lg font-semibold mb-4 text-cyan-light">
                    {service.title}
                  </h4>
                  
                  <ul className="space-y-3 mb-4">
                    {service.details.map((detail, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-cyan font-semibold mr-2.5 mt-0.5 flex-shrink-0">•</span>
                        <div className="overflow-hidden">
                          <span className="font-medium text-cyan-light">{detail.key}: </span>
                          <span className="text-gray-200 text-sm">{detail.value}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {!isMobile && (
                  <p className="text-xs text-gray-300 mt-auto italic text-right">
                    Hover away to close
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button 
            onClick={onTalkToAgent}
            className="bg-cyan hover:bg-cyan-light text-navy font-semibold text-sm md:text-base py-3 px-8 rounded-md transition-all duration-300 transform hover:scale-105 h-auto shadow-lg shadow-cyan/20 hover:shadow-cyan/30 focus:ring-2 focus:ring-cyan focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-navy active:translate-y-0.5"
            aria-label="Talk to a representative about our services"
            title="Find out more about our automation services"
          >
            Learn More About Our Services
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;

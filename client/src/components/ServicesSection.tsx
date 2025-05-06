import { Button } from "@/components/ui/button";
import { ResponsiveImage } from "@/components/ui/responsive-image";

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
        { key: "Decision Frameworks", value: "Streamline your decision-making process" }
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
        { key: "Integration", value: "Connect your existing tools and software" }
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
              className="bg-white dark:bg-navy-light rounded-lg shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-lg group relative h-full"
              tabIndex={0}
            >
              <div className="h-48 bg-gray-200 dark:bg-navy-dark overflow-hidden">
                <picture>
                  <source srcSet={service.imageUrl} type="image/webp" />
                  <img 
                    src={service.fallbackUrl} 
                    alt={service.alt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    width="800" 
                    height="450"
                  />
                </picture>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-center text-navy dark:text-soft-white">
                  {service.title}
                </h3>
                <p className="text-neutral-gray dark:text-gray-300 text-center">
                  {service.description}
                </p>
              </div>
              
              {/* Hover Details Overlay - slides up on hover/focus */}
              <div 
                className="absolute inset-0 bg-gradient-to-t from-navy/95 to-navy/90 dark:from-navy-dark/95 dark:to-navy-dark/90 
                          translate-y-full group-hover:translate-y-0 group-focus:translate-y-0 
                          transition-transform duration-300 ease-out
                          flex flex-col justify-end p-5 text-white overflow-hidden"
                aria-hidden="true"
              >
                <h4 className="text-lg font-semibold mb-3 text-cyan-light">
                  {service.title}
                </h4>
                
                <ul className="space-y-2 mb-3">
                  {service.details.map((detail, i) => (
                    <li key={i} className="flex">
                      <span className="text-cyan font-semibold mr-2 flex-shrink-0">•</span>
                      <div className="overflow-hidden">
                        <span className="font-medium text-cyan-light">{detail.key}: </span>
                        <span className="text-gray-200 text-sm">{detail.value}</span>
                      </div>
                    </li>
                  ))}
                </ul>
                
                <p className="text-xs text-gray-300 mt-auto italic">
                  Hover away to close
                </p>
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

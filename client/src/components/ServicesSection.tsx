import { Settings, Users, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ServicesSectionProps {
  onTalkToArchitect?: () => void;
}

const ServicesSection = ({ onTalkToArchitect }: ServicesSectionProps) => {
  const services = [
    {
      title: "AI Setup Support",
      description: "Let us co-design one time-saving workflow tailored to your business. Start this week.",
      icon: <Settings className="h-10 w-10 text-cyan" />
    },
    {
      title: "Workflow Coaching for Founders",
      description: "Learn how to use tools like ChatGPT or Gemini to reduce daily bottlenecks.",
      icon: <Users className="h-10 w-10 text-cyan" />
    },
    {
      title: "AI Strategy Session (No Code Required)",
      description: "We'll map where AI can help your specific business—from inbox to delivery.",
      icon: <Shield className="h-10 w-10 text-cyan" />
    }
  ];

  return (
    <section id="services" className="py-20 pb-16 bg-soft-white dark:bg-navy transition-colors duration-300 border-b border-neutral-200 dark:border-navy-light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-navy dark:text-soft-white">
            Start Small. Get Results Fast.
          </h2>
          <p className="text-lg text-neutral-gray dark:text-gray-300 max-w-3xl mx-auto">
            We specialize in helping non-technical teams launch practical AI upgrades—without 
            needing to learn prompt engineering, APIs, or automation tools.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="bg-white dark:bg-navy-light rounded-lg shadow-md overflow-hidden 
                        transition-transform hover:scale-105 duration-300"
            >
              <div className="p-6">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-cyan bg-opacity-20">
                    {service.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-center text-navy dark:text-soft-white">
                  {service.title}
                </h3>
                <p className="text-neutral-gray dark:text-gray-300 text-center">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button 
            onClick={onTalkToArchitect}
            className="bg-cyan hover:bg-cyan-light text-navy font-semibold text-sm md:text-base py-3 px-8 rounded-md transition-all duration-300 transform hover:scale-105 h-auto shadow-lg shadow-cyan/20 hover:shadow-cyan/30"
          >
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;

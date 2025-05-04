import { Button } from "@/components/ui/button";

interface ServicesSectionProps {
  onTalkToAgent?: () => void;
}

const ServicesSection = ({ onTalkToAgent }: ServicesSectionProps) => {
  const services = [
    {
      title: "Rapid Automation Deployment",
      description: "Implement efficient automation solutions tailored to your business needs.",
      imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1650&q=80",
      alt: "Digital workflow automation with computer dashboard"
    },
    {
      title: "Founders' Workflow Coaching",
      description: "Personalized coaching sessions to streamline your operations.",
      imageUrl: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YnVzaW5lc3MlMjBtZWV0aW5nfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
      alt: "Business professionals in a meeting discussing workflow strategies"
    },
    {
      title: "AI Strategy Consultation (No Coding Needed)",
      description: "Strategize AI integration into your business without the need for coding expertise.",
      imageUrl: "https://images.unsplash.com/photo-1581091877018-dac6a371d50f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHRlY2hub2xvZ3klMjBzdHJhdGVneXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
      alt: "Strategic planning session with technology diagrams and charts"
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
              <div className="h-48 bg-gray-200 dark:bg-navy-dark overflow-hidden">
                <img 
                  src={service.imageUrl} 
                  alt={service.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
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

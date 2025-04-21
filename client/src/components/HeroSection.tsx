import { Button } from "@/components/ui/button";
import neuralBackgroundSrc from "../assets/neural-background.svg";

interface HeroSectionProps {
  onTalkToArchitect: () => void;
}

const HeroSection = ({ onTalkToArchitect }: HeroSectionProps) => {
  const scrollToContact = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      const offsetTop = contactSection.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth"
      });
    }
  };

  return (
    <section id="home" className="relative bg-navy dark:bg-navy-dark text-soft-white py-32 md:py-40 transition-colors duration-300 overflow-hidden">
      {/* Pulsating Neural Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src={neuralBackgroundSrc} 
          alt="Animated Neural Workflow Background" 
          className="w-full h-full object-cover animate-pulse-slow opacity-20"
        />
      </div>
      
      {/* Hero Content (Remains on Top) */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Automate Your Business With Intelligent AI Solutions
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-gray-300">
            We help simplify AI adoption for entrepreneurs through seamless, practical agentic workflows.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              onClick={scrollToContact}
              className="bg-cyan hover:bg-cyan-light text-navy font-semibold text-sm md:text-base py-3 px-8 rounded-md transition-colors duration-300 transform hover:scale-105 h-auto"
            >
              Get Your Free AI Consultation
            </Button>
            <Button 
              onClick={onTalkToArchitect}
              variant="outline" 
              className="bg-transparent text-white
                       border border-white
                       hover:bg-white hover:text-[#0A2A43] 
                       font-semibold text-sm md:text-base py-3 px-8 rounded-md 
                       transition-colors duration-300 transform hover:scale-105 h-auto"
            >
              Talk to an AI Workflow Expert
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

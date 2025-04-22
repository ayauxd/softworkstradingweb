import { Button } from "@/components/ui/button";
import neuralBackgroundSrc from "../assets/neural-background-prominent.svg";

interface HeroSectionProps {
  onTalkToAgent: () => void;
}

const HeroSection = ({ onTalkToAgent }: HeroSectionProps) => {
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
    <section id="home" className="relative min-h-[90vh] bg-navy dark:bg-navy-dark text-soft-white py-32 md:py-20 transition-colors duration-300 overflow-hidden flex items-center">
      {/* Pulsating Neural Background */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-navy/60 to-navy/40 dark:from-navy-dark/60 dark:to-navy-dark/40">
        <img 
          src={neuralBackgroundSrc} 
          alt="Animated Neural Workflow Background" 
          className="w-full h-full object-cover animate-pulse-slow mix-blend-screen"
        />
      </div>
      
      {/* Hero Content (Remains on Top) */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight animate-fadeIn">
            Automate Your Business With <span className="text-cyan">Intelligent AI</span> Solutions
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-gray-300 animate-slideUp">
            We help simplify AI adoption for entrepreneurs through seamless, practical agentic workflows.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-5 animate-slideUp">
            <Button 
              onClick={scrollToContact}
              className="bg-cyan hover:bg-cyan-light text-navy font-semibold text-sm md:text-base py-3 px-8 rounded-md transition-all duration-300 transform hover:scale-105 h-auto shadow-lg shadow-cyan/20 hover:shadow-cyan/30 focus:ring-2 focus:ring-cyan focus:ring-offset-2 focus:ring-offset-navy active:translate-y-0.5"
              aria-label="Get your free AI consultation by scrolling to contact form"
              title="Fill out the contact form to get your free AI consultation"
            >
              Get Your Free AI Consultation
            </Button>
            <Button 
              onClick={onTalkToAgent}
              variant="outline" 
              className="bg-transparent text-white
                       border border-white
                       hover:bg-white hover:text-[#0A2A43] 
                       font-semibold text-sm md:text-base py-3 px-8 rounded-md 
                       transition-all duration-300 transform hover:scale-105 h-auto
                       shadow-lg shadow-navy-light/10 focus:ring-2 focus:ring-white 
                       focus:ring-offset-2 focus:ring-offset-navy active:translate-y-0.5"
              aria-label="Open dialog to talk with an AI Workflow Agent"
              title="Speak with our Workflow Agent about your automation needs"
            >
              Talk to a Smart Workflow Assistant
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

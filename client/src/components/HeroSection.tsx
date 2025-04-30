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
    <section id="home" className="relative min-h-[90vh] bg-[#0D3456] dark:bg-[#051525] text-soft-white py-32 md:py-20 transition-colors duration-300 overflow-hidden flex items-center">
      {/* Enhanced Neural Background with symmetric design and random animations */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0D3456]/90 to-[#0D3456]/70 dark:from-[#051525]/95 dark:to-[#051525]/80">
        <img 
          src={neuralBackgroundSrc} 
          alt="Animated Neural Workflow Background" 
          className="w-full h-full object-cover mix-blend-screen dark:mix-blend-lighten opacity-85 dark:opacity-70"
        />
        
        {/* Enhanced gradient overlays for better glow effects */}
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan/10 to-transparent dark:from-cyan/20 dark:to-transparent"></div>
        <div className="absolute inset-0 bg-[#0D3456]/20 dark:bg-[#000]/40 mix-blend-multiply"></div>
        
        {/* Central radial glow effect */}
        <div className="absolute inset-0 bg-gradient-radial opacity-80 dark:opacity-100" 
             style={{ background: 'radial-gradient(circle at 50% 50%, rgba(0, 188, 212, 0.15), transparent 70%)' }}>
        </div>
        
        {/* Additional animated glow points */}
        <div className="absolute w-full h-full">
          <div className="absolute w-20 h-20 rounded-full bg-cyan/10 blur-xl animate-pulse" 
               style={{ top: '15%', left: '25%', animationDuration: '4s' }}></div>
          <div className="absolute w-24 h-24 rounded-full bg-cyan/10 blur-xl animate-pulse" 
               style={{ top: '65%', left: '75%', animationDuration: '5s', animationDelay: '0.7s' }}></div>
          <div className="absolute w-16 h-16 rounded-full bg-cyan/10 blur-xl animate-pulse" 
               style={{ top: '30%', left: '70%', animationDuration: '3.5s', animationDelay: '1.5s' }}></div>
          <div className="absolute w-20 h-20 rounded-full bg-cyan/10 blur-xl animate-pulse" 
               style={{ top: '75%', left: '30%', animationDuration: '4.5s', animationDelay: '1s' }}></div>
          <div className="absolute w-24 h-24 rounded-full bg-cyan/10 blur-xl animate-pulse" 
               style={{ top: '45%', left: '15%', animationDuration: '6s', animationDelay: '2s' }}></div>
          <div className="absolute w-16 h-16 rounded-full bg-cyan/10 blur-xl animate-pulse" 
               style={{ top: '40%', left: '85%', animationDuration: '5.5s', animationDelay: '0.5s' }}></div>
        </div>
      </div>
      
      {/* Hero Content (Remains on Top) */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight animate-fadeIn text-white dark:text-gray-100">
            Automate Your Business With <span className="text-cyan-light dark:text-cyan">Intelligent AI</span> Solutions
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-gray-200 dark:text-gray-300 animate-slideUp">
            We help simplify AI adoption for entrepreneurs through seamless, practical agentic workflows.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-5 animate-slideUp">
            <Button 
              onClick={scrollToContact}
              className="bg-cyan hover:bg-cyan-light text-navy dark:text-navy-dark font-semibold text-sm md:text-base py-3 px-8 rounded-md transition-all duration-300 transform hover:scale-105 h-auto shadow-lg shadow-cyan/20 hover:shadow-cyan/30 focus:ring-2 focus:ring-cyan focus:ring-offset-2 focus:ring-offset-navy active:translate-y-0.5"
              aria-label="Get your free AI consultation by scrolling to contact form"
              title="Fill out the contact form to get your free AI consultation"
            >
              Get Your Free AI Consultation
            </Button>
            <Button 
              onClick={onTalkToAgent}
              variant="outline" 
              className="bg-transparent text-white
                       border border-white/80 dark:border-white/90
                       hover:bg-white/90 hover:text-[#0A2A43] dark:hover:text-[#051525]
                       font-semibold text-sm md:text-base py-3 px-8 rounded-md 
                       transition-all duration-300 transform hover:scale-105 h-auto
                       shadow-lg shadow-navy-light/10 dark:shadow-black/20 focus:ring-2 focus:ring-white 
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

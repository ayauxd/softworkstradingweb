import { Button } from "@/components/ui/button";
import animatedNeuralNetworkSrc from "../assets/animated-neural-network.svg";
import neuralNetworkImageSrc from "../assets/neural-network-base.png";

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
      {/* Background container: Static PNG for all, animated SVG overlay for desktop */}
      <div 
        className="absolute inset-0 z-0 bg-gradient-to-b from-[#0D3456]/95 to-[#0D3456]/90 dark:from-[#051525]/98 dark:to-[#051525]/95 bg-cover bg-center"
        style={{ backgroundImage: `url(${neuralNetworkImageSrc})` }} // Apply static image here
      >
        {/* Animated SVG overlay - Now visible on all screens */}
        <div className="absolute inset-0 overflow-hidden mix-blend-screen dark:mix-blend-lighten opacity-80 dark:opacity-90"> 
          <object
            type="image/svg+xml"
            data={animatedNeuralNetworkSrc}
            className="w-full h-full object-cover"
            aria-hidden="true"
          >
            {/* Minimal fallback inside object if needed, primary is now bg */}
            <div className="w-full h-full bg-transparent"></div> 
          </object>
        </div>

        {/* Gradient overlays (apply over both backgrounds) */}
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan/5 to-transparent dark:from-cyan/10 dark:to-transparent"></div>
        <div className="absolute inset-0 bg-[#0D3456]/10 dark:bg-[#000]/20 mix-blend-multiply"></div>
        
        {/* Central radial glow effect */}
        <div className="absolute inset-0 opacity-80 dark:opacity-90" 
             style={{ background: 'radial-gradient(circle at 50% 50%, rgba(0, 188, 212, 0.12), transparent 70%)' }}>
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

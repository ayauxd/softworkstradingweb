import { Button } from "@/components/ui/button";

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
    <section id="home" className="bg-navy dark:bg-navy-dark text-soft-white py-20 md:py-32 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Automate What Slows You Down—Without the Overwhelm.
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-gray-300">
            We help solo founders and small teams rethink operations using smart, 
            human-friendly AI workflows.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              onClick={scrollToContact}
              className="bg-cyan hover:bg-cyan-light text-navy font-medium py-3 px-8 rounded-md transition-colors duration-300 transform hover:scale-105 h-auto"
            >
              Book My Free AI Consult
            </Button>
            <Button 
              onClick={onTalkToArchitect}
              variant="outline" 
              className="border-2 border-soft-white hover:border-cyan hover:text-cyan text-soft-white font-medium py-3 px-8 rounded-md transition-all duration-300 transform hover:scale-105 h-auto"
            >
              Talk to a Workflow Architect
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

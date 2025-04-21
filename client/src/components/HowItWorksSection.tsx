import howItWorksImage from "../assets/how-it-works.png";

const HowItWorksSection = () => {
  return (
    <section 
      id="how-it-works" 
      className="bg-soft-white dark:bg-navy py-16 md:py-24 transition-colors duration-300"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-screen-lg mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-8 text-navy dark:text-soft-white transition-colors">
            Easy Steps to Start Automating
          </h2>
          
          <div className="flex justify-center mb-12">
            <img 
              src={howItWorksImage} 
              alt="Easy Steps to Start Automating – infographic showing Tell Us Your Needs → Get a Custom Plan → Implement and Improve." 
              className="max-w-full md:max-w-[800px] w-full h-auto" 
              aria-label="Three-step automation process: First, tell us your needs by discussing routine tasks. Second, get a custom plan with actionable AI workflow. Third, implement and improve your automation for better results."
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-screen-md mx-auto">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-3 text-navy dark:text-soft-white transition-colors">
                Tell Us Your Needs
              </h3>
              <p className="text-neutral-gray dark:text-[#E0E0E0] transition-colors">
                Discuss your routine tasks and identify areas ready for AI automation.
              </p>
            </div>
            
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-3 text-navy dark:text-soft-white transition-colors">
                Get a Custom Plan
              </h3>
              <p className="text-neutral-gray dark:text-[#E0E0E0] transition-colors">
                Receive a simple, actionable AI workflow designed specifically for your tasks.
              </p>
            </div>
            
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-3 text-navy dark:text-soft-white transition-colors">
                Implement and Improve
              </h3>
              <p className="text-neutral-gray dark:text-[#E0E0E0] transition-colors">
                Quickly start using your new automation and easily refine it for better results.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
import { MessageSquare, FileText, Rocket } from "lucide-react";

const HowItWorksSection = () => {
  return (
    <div>
      <section id="how-it-works" className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white py-16 pb-24 transition-colors duration-300">
        <div className="max-w-screen-xl mx-auto px-4">
          <h2 className="text-2xl font-semibold text-slate-800 dark:text-white text-center mb-10">
            Easy Steps to Start Automating
          </h2>
          
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-y-8 md:gap-x-12 text-center">
            {/* Step 1 */}
            <div className="flex-1 flex flex-col items-center">
              <div className="bg-cyan/10 dark:bg-cyan/20 rounded-full p-5 mb-4">
                <MessageSquare className="h-10 w-10 text-cyan" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-800 dark:text-white">Tell Us Your Needs</h3>
              <p className="text-sm md:text-base text-slate-600 dark:text-slate-300">
                Discuss your routine tasks and identify areas ready for AI automation.
              </p>
            </div>
            
            {/* Arrow for desktop */}
            <div className="hidden md:flex items-center justify-center">
              <svg width="40" height="24" viewBox="0 0 40 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-cyan">
                <path d="M39.0607 13.0607C39.6464 12.4749 39.6464 11.5251 39.0607 10.9393L29.5147 1.3934C28.9289 0.807611 27.9792 0.807611 27.3934 1.3934C26.8076 1.97919 26.8076 2.92893 27.3934 3.51472L35.8787 12L27.3934 20.4853C26.8076 21.0711 26.8076 22.0208 27.3934 22.6066C27.9792 23.1924 28.9289 23.1924 29.5147 22.6066L39.0607 13.0607ZM0 13.5H38V10.5H0V13.5Z" fill="currentColor"/>
              </svg>
            </div>
            
            {/* Step 2 */}
            <div className="flex-1 flex flex-col items-center">
              <div className="bg-cyan/10 dark:bg-cyan/20 rounded-full p-5 mb-4">
                <FileText className="h-10 w-10 text-cyan" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-800 dark:text-white">Get a Custom Plan</h3>
              <p className="text-sm md:text-base text-slate-600 dark:text-slate-300">
                Receive a simple, actionable AI workflow designed specifically for your tasks.
              </p>
            </div>
            
            {/* Arrow for desktop */}
            <div className="hidden md:flex items-center justify-center">
              <svg width="40" height="24" viewBox="0 0 40 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-cyan">
                <path d="M39.0607 13.0607C39.6464 12.4749 39.6464 11.5251 39.0607 10.9393L29.5147 1.3934C28.9289 0.807611 27.9792 0.807611 27.3934 1.3934C26.8076 1.97919 26.8076 2.92893 27.3934 3.51472L35.8787 12L27.3934 20.4853C26.8076 21.0711 26.8076 22.0208 27.3934 22.6066C27.9792 23.1924 28.9289 23.1924 29.5147 22.6066L39.0607 13.0607ZM0 13.5H38V10.5H0V13.5Z" fill="currentColor"/>
              </svg>
            </div>
            
            {/* Step 3 */}
            <div className="flex-1 flex flex-col items-center">
              <div className="bg-cyan/10 dark:bg-cyan/20 rounded-full p-5 mb-4">
                <Rocket className="h-10 w-10 text-cyan" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-800 dark:text-white">Implement and Improve</h3>
              <p className="text-sm md:text-base text-slate-600 dark:text-slate-300">
                Quickly start using your new automation and easily refine it for better results.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorksSection;
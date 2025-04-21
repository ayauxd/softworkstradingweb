import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { queryClient } from "./lib/queryClient";
import { ThemeProvider } from "./components/ThemeProvider";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import ServicesSection from "./components/ServicesSection";
import HowItWorksSection from "./components/HowItWorksSection";
import TestimonialsSection from "./components/TestimonialsSection";
import InsightsSection from "./components/InsightsSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import WorkflowArchitectModal from "./components/WorkflowArchitectModal";
import { useState } from "react";

// Article Pages
import AiInSupplyChain from "./pages/articles/ai-in-supply-chain";
import AiTeamMembers from "./pages/articles/ai-team-members";
import WorkflowCaseStudy from "./pages/articles/workflow-case-study";

function HomePage() {
  const [showModal, setShowModal] = useState(false);
  
  const openModal = () => {
    setShowModal(true);
  };
  
  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-soft-white dark:bg-navy text-navy dark:text-soft-white transition-colors duration-300">
      <Header />
      <main className="pt-16 flex-grow">
        <HeroSection onTalkToArchitect={openModal} />
        <ServicesSection onTalkToArchitect={openModal} />
        <HowItWorksSection />
        <TestimonialsSection />
        <InsightsSection />
        <ContactSection />
      </main>
      <Footer />
      {showModal && <WorkflowArchitectModal onClose={closeModal} />}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Switch>
            <Route path="/" component={HomePage} />
            <Route path="/articles/ai-in-supply-chain" component={AiInSupplyChain} />
            <Route path="/articles/ai-team-members" component={AiTeamMembers} />
            <Route path="/articles/workflow-case-study" component={WorkflowCaseStudy} />
          </Switch>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;

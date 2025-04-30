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
import WorkflowAgentModal from "./components/WorkflowAgentModal";
import FloatingAgentButton from "./components/FloatingAgentButton";
import ArticlePage from "./pages/ArticlePage";
import { useState } from "react";

function HomePage() {
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'chat' | 'call' | 'none'>('none');
  
  const openModal = (mode: 'chat' | 'call') => {
    setModalMode(mode);
    setShowModal(true);
  };
  
  const closeModal = () => {
    setShowModal(false);
    setModalMode('none');
  };

  return (
    <div className="min-h-screen flex flex-col bg-soft-white dark:bg-navy text-navy dark:text-soft-white transition-colors duration-300">
      <Header />
      <main className="pt-16 flex-grow">
        <HeroSection onTalkToAgent={() => openModal('call')} />
        <ServicesSection onTalkToAgent={() => openModal('chat')} />
        <HowItWorksSection />
        <TestimonialsSection />
        <InsightsSection />
        <ContactSection />
      </main>
      <Footer />
      {showModal && (
        <WorkflowAgentModal 
          onClose={closeModal} 
          initialMode={modalMode} 
        />
      )}
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
            <Route path="/article/:id" component={ArticlePage} />
          </Switch>
          <FloatingAgentButton defaultMode="chat" />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;

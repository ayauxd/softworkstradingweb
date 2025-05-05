import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { queryClient } from "./lib/queryClient";
import { ThemeProvider } from "./components/ThemeProvider";
import { lazy, Suspense, useState } from "react";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import ServicesSection from "./components/ServicesSection";
import Footer from "./components/Footer";
import FloatingAgentButton from "./components/FloatingAgentButton";
import ErrorBoundary from "./components/ErrorBoundary";

// Lazily loaded components for code splitting
const HowItWorksSection = lazy(() => import("./components/HowItWorksSection"));
const TestimonialsSection = lazy(() => import("./components/TestimonialsSection"));
const BlogSection = lazy(() => import("./components/InsightsSection"));
const ContactSection = lazy(() => import("./components/ContactSection"));
const WorkflowAgentModal = lazy(() => import("./components/WorkflowAgentModal"));
const ArticlePage = lazy(() => import("./pages/ArticlePage"));
const BlogPage = lazy(() => import("./pages/InsightsPage"));

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

  // Loading fallback for lazy components
  const SectionFallback = () => (
    <div className="w-full flex justify-center items-center py-24 bg-soft-white dark:bg-navy">
      <div className="flex space-x-2 justify-center items-center">
        <div className="h-3 w-3 bg-cyan rounded-full animate-bounce"></div>
        <div className="h-3 w-3 bg-cyan rounded-full animate-bounce [animation-delay:-.15s]"></div>
        <div className="h-3 w-3 bg-cyan rounded-full animate-bounce [animation-delay:-.3s]"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-soft-white dark:bg-navy text-navy dark:text-soft-white transition-colors duration-300">
      <Header />
      <main id="main-content" className="pt-16 flex-grow">
        {/* Critical path components loaded eagerly for better LCP */}
        <HeroSection onTalkToAgent={() => openModal('call')} />
        <ServicesSection onTalkToAgent={() => openModal('chat')} />
        
        {/* Non-critical components lazily loaded with suspense boundaries */}
        <Suspense fallback={<SectionFallback />}>
          <HowItWorksSection />
        </Suspense>
        
        <Suspense fallback={<SectionFallback />}>
          <TestimonialsSection />
        </Suspense>
        
        <Suspense fallback={<SectionFallback />}>
          <BlogSection />
        </Suspense>
        
        <Suspense fallback={<SectionFallback />}>
          <ContactSection />
        </Suspense>
      </main>
      <Footer />
      
      {/* Modal loaded on demand */}
      {showModal && (
        <Suspense fallback={
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white dark:bg-navy-dark p-8 rounded-lg shadow-xl">
              <SectionFallback />
            </div>
          </div>
        }>
          <WorkflowAgentModal 
            onClose={closeModal} 
            initialMode={modalMode} 
          />
        </Suspense>
      )}
    </div>
  );
}

function App() {
  // Event logging for errors in production
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    // In a production app, you would send this to an error tracking service like Sentry
    console.error('Application error:', error);
    console.error('Error info:', errorInfo);
  };

  return (
    <ErrorBoundary onError={handleError}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <TooltipProvider>
            {/* Skip to content link for keyboard users */}
            <a 
              href="#main-content" 
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] 
                         focus:bg-white focus:text-navy dark:focus:bg-navy-dark dark:focus:text-soft-white
                         focus:px-4 focus:py-2 focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-cyan"
            >
              Skip to main content
            </a>
            <Toaster />
            <Switch>
              <Route path="/">
                <ErrorBoundary>
                  <HomePage />
                </ErrorBoundary>
              </Route>
              <Route path="/blog">
                <ErrorBoundary>
                  <Suspense fallback={
                    <div className="min-h-screen flex flex-col items-center justify-center bg-soft-white dark:bg-navy p-4">
                      <div className="flex space-x-2 justify-center items-center">
                        <div className="h-4 w-4 bg-cyan rounded-full animate-bounce"></div>
                        <div className="h-4 w-4 bg-cyan rounded-full animate-bounce [animation-delay:-.15s]"></div>
                        <div className="h-4 w-4 bg-cyan rounded-full animate-bounce [animation-delay:-.3s]"></div>
                      </div>
                      <p className="text-navy dark:text-soft-white mt-4">Loading blog...</p>
                    </div>
                  }>
                    <BlogPage />
                  </Suspense>
                </ErrorBoundary>
              </Route>
              <Route path="/article/:id">
                <ErrorBoundary>
                  <Suspense fallback={
                    <div className="min-h-screen flex flex-col items-center justify-center bg-soft-white dark:bg-navy p-4">
                      <div className="flex space-x-2 justify-center items-center">
                        <div className="h-4 w-4 bg-cyan rounded-full animate-bounce"></div>
                        <div className="h-4 w-4 bg-cyan rounded-full animate-bounce [animation-delay:-.15s]"></div>
                        <div className="h-4 w-4 bg-cyan rounded-full animate-bounce [animation-delay:-.3s]"></div>
                      </div>
                      <p className="text-navy dark:text-soft-white mt-4">Loading article...</p>
                    </div>
                  }>
                    <ArticlePage />
                  </Suspense>
                </ErrorBoundary>
              </Route>
            </Switch>
            <FloatingAgentButton defaultMode="chat" />
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;

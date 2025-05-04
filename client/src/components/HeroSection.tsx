import { Button } from '@/components/ui/button';
import { lazy, Suspense, useEffect, useState } from 'react';
import animatedNeuralNetworkSrc from '../assets/animated-neural-network.svg';
import neuralNetworkImageSrc from '../assets/neural-network-base.png';

// Define image preload for critical hero image
const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve();
    img.onerror = reject;
  });
};

interface HeroSectionProps {
  onTalkToAgent: () => void;
}

const HeroSection = ({ onTalkToAgent }: HeroSectionProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  // Preload hero background image
  useEffect(() => {
    preloadImage(neuralNetworkImageSrc)
      .then(() => setImageLoaded(true))
      .catch(err => console.error('Error preloading hero image:', err));
  }, []);

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      const offsetTop = contactSection.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-[90vh] bg-[#0D3456] dark:bg-[#051525] text-soft-white py-32 md:py-20 transition-colors duration-300 overflow-hidden flex items-center"
    >
      {/* Background container - with optimized image loading */}
      <div
        className="absolute inset-0 z-0 bg-gradient-to-b from-[#0D3456]/95 to-[#0D3456]/90 dark:from-[#051525]/98 dark:to-[#051525]/95 bg-cover bg-center"
        style={{
          backgroundImage: imageLoaded ? `url(${neuralNetworkImageSrc})` : 'none',
          backgroundColor: '#0A2A43', // Fallback color while image loads
        }}
        aria-hidden="true"
      >
        {/* Animated SVG overlay - Using img tag instead of object for better compatibility */}
        {imageLoaded && (
          <div className="absolute inset-0 overflow-hidden mix-blend-screen dark:mix-blend-lighten opacity-50 dark:opacity-60">
            <img
              src={animatedNeuralNetworkSrc}
              className="w-full h-full object-cover"
              aria-hidden="true"
              loading="lazy"
              alt=""
            />
          </div>
        )}

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan/5 to-transparent dark:from-cyan/10 dark:to-transparent"></div>
        <div className="absolute inset-0 bg-[#0D3456]/10 dark:bg-[#000]/20 mix-blend-multiply"></div>

        {/* Additional Dark Overlay for Text Contrast */}
        <div className="absolute inset-0 bg-black/20 dark:bg-black/30"></div>

        {/* Central radial glow effect */}
        <div
          className="absolute inset-0 opacity-80 dark:opacity-90"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, rgba(0, 188, 212, 0.12), transparent 70%)',
          }}
        ></div>
      </div>

      {/* Hero Content (Remains on Top) */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight animate-fadeIn text-white dark:text-gray-100">
            Automate Your Business With{' '}
            <span className="bg-gradient-to-r from-cyan to-cyan-light bg-clip-text text-transparent">
              Practical
            </span>{' '}
            AI Solutions
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-gray-200 dark:text-gray-300 animate-slideUp">
            Collaborate with us to design a time-saving workflow—beginning this week.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button
              onClick={scrollToContact}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-cyan hover:bg-cyan-light text-navy font-semibold text-sm md:text-base py-3 px-8 rounded-md transition-all duration-300 transform hover:scale-105 h-auto shadow-lg shadow-cyan/20 hover:shadow-cyan/30 focus:ring-2 focus:ring-cyan focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-navy active:translate-y-0.5"
              aria-label="Get your free AI consultation by scrolling to contact form"
              title="Fill out the contact form to get your free AI consultation"
            >
              Learn How We Can Assist You
            </Button>
            <button
              onClick={() => {
                const targetSection = document.getElementById('services');
                targetSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-transparent text-white border border-white/80 dark:border-white/90 hover:bg-white/90 hover:text-[#0A2A43] dark:hover:text-[#051525] font-semibold text-sm md:text-base py-3 px-8 rounded-md transition-all duration-300 transform hover:scale-105 h-auto shadow-lg shadow-navy-light/10 dark:shadow-black/20 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-navy active:translate-y-0.5"
              aria-label="Scroll down to learn more about our services"
              title="Learn more about our AI automation services"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

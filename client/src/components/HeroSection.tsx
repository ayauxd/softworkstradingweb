import { Button } from '@/components/ui/button';
import { useEffect, useState, useCallback } from 'react';
import { withMemo } from '@/components/ui/memo-wrapper';

// Import animation SVG with a more reliable path
// First try direct import, then fallback to a public URL
let animatedNeuralNetworkSrc: string;
try {
  // Dynamic import is not supported for assets, using static path
  animatedNeuralNetworkSrc = '/assets/animated-neural-network-B-Og9IhM.svg';
} catch (e) {
  // Fallback to a built path that should exist in production
  animatedNeuralNetworkSrc = '/assets/animated-neural-network-B-Og9IhM.svg';
}

// Hero image paths
const heroImages = {
  large: '/optimized-images/hero/hero-1920.webp',
  medium: '/optimized-images/hero/hero-960.webp',
  fallback: '/images/hero-image.webp'
};

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
    // Use medium size for mobile devices, large for desktop
    const imageSrcToPreload = window.innerWidth < 1024 ? heroImages.medium : heroImages.large;
    
    preloadImage(imageSrcToPreload)
      .then(() => setImageLoaded(true))
      .catch(err => {
        console.error('Error preloading optimized hero image:', err);
        // Fallback to original image
        preloadImage(heroImages.fallback)
          .then(() => setImageLoaded(true))
          .catch(err => console.error('Error preloading fallback hero image:', err));
      });
  }, []);

  const scrollToContact = useCallback(() => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      const offsetTop = contactSection.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
    }
  }, []);

  return (
    <section
      id="home"
      role="region"
      aria-labelledby="home-heading"
      className="relative min-h-[85vh] sm:min-h-[90vh] bg-[#0D3456] dark:bg-[#051525] text-soft-white pt-28 sm:pt-32 md:pt-32 pb-16 sm:pb-20 transition-colors duration-300 overflow-hidden flex items-center"
    >
      {/* Background container - with optimized image loading */}
      <div
        className="absolute inset-0 z-0 bg-gradient-to-b from-[#0D3456]/95 to-[#0D3456]/90 dark:from-[#051525]/98 dark:to-[#051525]/95 bg-cover bg-center"
        style={{
          backgroundColor: '#0A2A43', // Fallback color while image loads
          filter: 'brightness(0.7)', // Darken the background image
        }}
        aria-hidden="true"
      >
        {imageLoaded && (
          <picture className="absolute inset-0 h-full w-full">
            {/* Responsive hero image with different sizes */}
            <source 
              srcSet={`${heroImages.large} 1920w, ${heroImages.medium} 960w`}
              sizes="100vw"
              type="image/webp"
            />
            <img
              src={heroImages.fallback}
              alt=""
              className="w-full h-full object-cover"
              aria-hidden="true"
              loading="eager"
            />
          </picture>
        )}
        {/* Animated SVG overlay - Using img tag instead of object for better compatibility */}
        {imageLoaded && (
          <div className="absolute inset-0 overflow-hidden mix-blend-color-dodge opacity-90 dark:opacity-100">
            <img
              src={animatedNeuralNetworkSrc}
              className="w-full h-full object-cover animate-subtle-pulse"
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
        <div className="absolute inset-0 bg-black/30 dark:bg-black/40"></div>

        {/* Central radial glow effect - reduced size and intensity */}
        <div
          className="absolute inset-0 opacity-60 dark:opacity-70"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, rgba(12, 74, 110, 0.08), transparent 50%)',
          }}
        ></div>
      </div>

      {/* Hero Content (Remains on Top) */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 id="home-heading" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight animate-fadeIn text-white dark:text-gray-100">
            Automate Your Business With{' '}
            <span className="bg-gradient-to-r from-cyan to-cyan-light bg-clip-text text-transparent">
              Practical
            </span>{' '}
            AI Solutions
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-10 text-gray-200 dark:text-gray-300 animate-slideUp max-w-xl mx-auto">
            Streamline your operations with AI workflows that deliver measurable results.
          </p>
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4">
            <Button
              onClick={scrollToContact}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 whitespace-nowrap ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-cyan hover:bg-cyan-light text-navy font-semibold text-sm md:text-base py-2.5 sm:py-3 px-6 sm:px-8 rounded-md transition-all duration-300 transform hover:scale-105 h-auto shadow-lg shadow-cyan/20 hover:shadow-cyan/30 focus:ring-2 focus:ring-cyan focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-navy active:translate-y-0.5"
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
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 whitespace-nowrap ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-navy/40 backdrop-blur-sm text-white border-2 border-white hover:bg-white hover:text-navy dark:hover:text-navy-dark font-semibold text-sm md:text-base py-2.5 sm:py-3 px-6 sm:px-8 rounded-md transition-all duration-300 transform hover:scale-105 h-auto shadow-lg shadow-black/30 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-navy active:translate-y-0.5"
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

export default withMemo(HeroSection, 'HeroSection');

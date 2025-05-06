import { useState, useEffect, useRef } from "react";
import { useTheme } from "../hooks/use-theme-toggle";
import LogoIcon from "./LogoIcon";
// Import from wouter correctly
import { Link, useLocation } from "wouter";
import { Moon, Sun, Menu, X } from "lucide-react";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const headerRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileToggleRef = useRef<HTMLButtonElement>(null);
  // useLocation returns [location, navigate]
  const [location, navigate] = useLocation();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  // Handle scroll event to add shadow to header when scrolled
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  
  // Handle active section highlighting on scroll
  useEffect(() => {
    // If we're on the blog page, set active section to insights
    if (location === '/blog') {
      setActiveSection('insights');
      return;
    }
    
    const sectionIds = ["home", "services", "how-it-works", "insights", "contact"];
    const sections = sectionIds.map(id => document.getElementById(id)).filter(el => el !== null);
    const headerHeight = headerRef.current?.offsetHeight || 80;

    const handleActiveScroll = () => {
      let currentSection = 'home';
      const scrollPosition = window.scrollY + headerHeight + 50;

      for (const section of sections) {
        if (section && section.offsetTop <= scrollPosition) {
          currentSection = section.id;
        }
      }
      
      // Special case for reaching the bottom of the page
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
         const lastSection = sectionIds[sectionIds.length - 1];
         if (document.getElementById(lastSection)) {
             currentSection = lastSection;
         }
      }

      setActiveSection(currentSection);
    };

    // Only add scroll event listener if we're on the home page
    if (location === '/' || location === '') {
      window.addEventListener('scroll', handleActiveScroll);
      handleActiveScroll();

      return () => {
        window.removeEventListener('scroll', handleActiveScroll);
      };
    }
    return undefined;
  }, [location]);

  // Focus management for mobile menu
  useEffect(() => {
    if (mobileMenuOpen) {
      const menuElement = mobileMenuRef.current;
      if (!menuElement) return;

      const focusableElements = menuElement.querySelectorAll<HTMLElement>('button, [href]');
      const firstElement = focusableElements[0]; // Should be the close button
      const lastElement = focusableElements[focusableElements.length - 1];

      // Focus the first element (close button) when menu opens
      firstElement?.focus();

      const handleTabKeyPress = (event: KeyboardEvent) => {
        if (event.key === 'Tab') {
          if (event.shiftKey) { // Shift + Tab
            if (document.activeElement === firstElement) {
              event.preventDefault();
              lastElement?.focus();
            }
          } else { // Tab
            if (document.activeElement === lastElement) {
              event.preventDefault();
              firstElement?.focus();
            }
          }
        }
      };
      
      // Handle ESC key press to close menu
      const handleEscapeKeyPress = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          setMobileMenuOpen(false);
          // Focus back on the toggle button
          mobileToggleRef.current?.focus(); 
        }
      };

      menuElement.addEventListener('keydown', handleTabKeyPress);
      menuElement.addEventListener('keydown', handleEscapeKeyPress);
      
      return () => {
        menuElement.removeEventListener('keydown', handleTabKeyPress);
        menuElement.removeEventListener('keydown', handleEscapeKeyPress);
        // Return focus to the toggle button when menu closes via other means (e.g., clicking a link)
        if (!mobileMenuOpen) {
          mobileToggleRef.current?.focus();
        }
      };
    }
    return undefined;
  }, [mobileMenuOpen]);

  // Handle smooth scrolling
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerHeight = headerRef.current?.offsetHeight || 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <>
      <header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-soft-white/95 dark:bg-navy/95 shadow-md backdrop-blur-sm"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo Container */}
            <div className="flex-shrink-0 ml-0">
              <a 
                href={location === '/' ? "#home" : '/'} 
                className="flex items-center py-2" 
                onClick={(e) => { 
                  if (location === '/') {
                    e.preventDefault();
                    scrollToSection('home');
                  } else {
                    // Let the link navigate normally to the homepage
                  }
                }}
                aria-label="Softworks Trading Company - Go to homepage"
              >
                <LogoIcon 
                  className="h-6.5 md:h-8 transition-colors duration-300" 
                />
              </a>
            </div>
            
            {/* Right Side Controls Container - Absolute position on mobile */}
            <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 md:relative md:right-auto md:top-auto md:translate-y-0 flex items-center space-x-3 sm:space-x-4 flex-shrink-0">
              {/* Desktop Navigation (remains hidden on mobile) */}
              <nav className="hidden md:flex items-center space-x-6" aria-label="Main Navigation">
                {["home", "services", "how-it-works", "insights", "contact"].map((item) => (
                  <a 
                    key={item}
                    href={item === 'insights' ? '/blog' : `#${item}`}
                    className={`text-navy dark:text-soft-white hover:text-cyan dark:hover:text-cyan-light font-medium transition-colors px-2 py-1 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan ${
                      activeSection === item ? 'text-cyan dark:text-cyan-light font-semibold' : ''
                    }`}
                    onClick={(e) => { 
                      e.preventDefault(); 
                      if (item === 'insights' && location !== '/') {
                        navigate('/blog');
                      } else {
                        scrollToSection(item);
                      }
                    }}
                    aria-current={activeSection === item ? "page" : undefined}
                  >
                    {item.charAt(0).toUpperCase() + item.slice(1).replace(/-/g, " ")}
                  </a>
                ))}
              </nav>
              
              {/* Theme Toggle button */}
              <button 
                onClick={toggleTheme} 
                className="p-2 rounded-full bg-gray-100 dark:bg-navy hover:bg-gray-200 dark:hover:bg-navy-light transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5 text-soft-white" />
                ) : (
                  <Moon className="h-5 w-5 text-navy" />
                )}
              </button>
              
              {/* Mobile Menu Button (remains visible only on mobile) */}
              <button
                onClick={toggleMobileMenu}
                ref={mobileToggleRef}
                className="p-2 md:hidden rounded-full hover:bg-gray-200 dark:hover:bg-navy-light transition-all duration-300 focus:outline-none"
                aria-label="Toggle navigation menu"
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
              >
                <Menu className="h-6 w-6 text-navy dark:text-soft-white" />
              </button>
            </div>
          </div>
          
          {/* Mobile Navigation Menu - Refactored for transform/opacity animation */}
          <div 
            id="mobile-menu"
            ref={mobileMenuRef}
            className={`md:hidden absolute left-0 right-0 top-full bg-soft-white dark:bg-navy-dark shadow-md z-40 
                       transition-all duration-300 ease-in-out border-t border-gray-200 dark:border-navy-light ${ // Base styles
              mobileMenuOpen 
                ? "opacity-100 translate-y-0 pointer-events-auto" // Open state
                : "opacity-0 -translate-y-4 pointer-events-none" // Closed state
            }`}
            role="dialog" 
            aria-modal="true" 
            aria-labelledby="mobile-menu-heading" 
          >
            <div className="flex justify-end p-2 border-b border-gray-100 dark:border-navy-light">
              <button
                  onClick={toggleMobileMenu}
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-navy-light transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
                  aria-label="Close navigation menu"
              >
                  <X className="h-6 w-6 text-navy dark:text-soft-white" />
              </button>
            </div>
            <nav className="flex flex-col p-4" aria-label="Mobile Navigation">
              {["home", "services", "how-it-works", "insights", "contact"].map((item, index) => (
                <a 
                  key={item}
                  href={item === 'insights' ? '/blog' : `#${item}`} 
                  className={`text-navy dark:text-soft-white hover:text-cyan dark:hover:text-cyan-light font-medium 
                             transition-colors px-3 py-3 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan
                             flex items-center justify-between ${
                               activeSection === item ? 'text-cyan dark:text-cyan-light bg-gray-100 dark:bg-navy' : ''
                             } ${
                               index < 4 ? "border-b border-gray-100 dark:border-navy-light" : ""
                             }`}
                  onClick={(e) => { 
                    e.preventDefault(); 
                    if (item === 'insights' && location !== '/') {
                      navigate('/blog');
                    } else {
                      scrollToSection(item);
                    }
                    toggleMobileMenu(); // Close mobile menu when an item is clicked
                  }}
                  aria-current={activeSection === item ? "page" : undefined}
                >
                  <span>{item.charAt(0).toUpperCase() + item.slice(1).replace(/-/g, " ")}</span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="text-cyan"
                  >
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </a>
              ))}
            </nav>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;

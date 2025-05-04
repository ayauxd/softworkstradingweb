import { useState, useEffect } from "react";
import { useTheme } from "../hooks/use-theme-toggle";
import LogoIcon from "./LogoIcon";
import { Link } from "wouter";
import { Moon, Sun, Menu, X } from "lucide-react";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
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
  
  // Handle smooth scrolling
  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth"
      });
    }
  };

  return (
    <>
      {/* Skip to content link - Accessibility improvement */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] bg-cyan text-navy px-4 py-2 rounded-md focus:outline-none"
        onClick={(e) => {
          e.preventDefault();
          const mainContent = document.getElementById("main-content");
          if (mainContent) {
            mainContent.tabIndex = -1;
            mainContent.focus();
            setTimeout(() => {
              mainContent.removeAttribute("tabindex");
            }, 1000);
          }
        }}
      >
        Skip to main content
      </a>
      
      <header 
        className={`fixed top-0 w-full bg-soft-white dark:bg-navy-dark z-50 transition-all duration-300 border-b border-neutral-300 dark:border-neutral-700 ${
          scrolled ? "shadow-md" : ""
        }`}
        role="banner"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Make the parent relative for absolute positioning of children */}
          <div className="relative flex justify-center md:justify-between items-center py-4"> 
            {/* Logo container (will be centered on mobile due to parent justify-center) */}
            <div className="flex items-center">
              <a 
                href="#home" 
                className="flex items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan rounded-md" 
                onClick={(e) => { e.preventDefault(); scrollToSection("home"); }}
                aria-label="Softworks Trading Company Home"
              >
                <LogoIcon 
                  className="h-10 w-auto sm:h-12 md:h-14 lg:h-16 flex-shrink-0 max-w-[250px] sm:max-w-[300px] md:max-w-[350px] lg:max-w-[400px]" // Reduced base height and max-width
                  showText={true} 
                />
              </a>
            </div>
            
            {/* Right Side Controls Container - Absolute position on mobile */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 md:relative md:right-auto md:top-auto md:translate-y-0 flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
              {/* Desktop Navigation (remains hidden on mobile) */}
              <nav className="hidden md:flex items-center space-x-6" aria-label="Main Navigation">
                {["home", "services", "how-it-works", "insights", "contact"].map((item) => (
                  <a 
                    key={item}
                    href={`#${item}`} 
                    className="text-navy dark:text-soft-white hover:text-cyan dark:hover:text-cyan-light font-medium transition-colors px-2 py-1 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
                    onClick={(e) => { e.preventDefault(); scrollToSection(item); }}
                    aria-current={item === "home" ? "page" : undefined}
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
            className={`md:hidden absolute left-0 right-0 top-full bg-soft-white dark:bg-navy-dark shadow-md z-40 
                       transition-all duration-300 ease-in-out border-t border-gray-200 dark:border-navy-light ${ // Base styles
              mobileMenuOpen 
                ? "opacity-100 translate-y-0 pointer-events-auto" // Open state
                : "opacity-0 -translate-y-4 pointer-events-none" // Closed state
            }`}
          >
            <nav className="flex flex-col p-4" aria-label="Mobile Navigation">
              {["home", "services", "how-it-works", "insights", "contact"].map((item, index) => (
                <a 
                  key={item}
                  href={`#${item}`} 
                  className={`text-navy dark:text-soft-white hover:text-cyan dark:hover:text-cyan-light font-medium 
                             transition-colors px-3 py-3 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan
                             flex items-center justify-between ${
                               index < 4 ? "border-b border-gray-100 dark:border-navy-light" : ""
                             }`}
                  onClick={(e) => { 
                    e.preventDefault(); 
                    scrollToSection(item);
                    toggleMobileMenu(); // Close mobile menu when an item is clicked
                  }}
                  aria-current={item === "home" ? "page" : undefined}
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

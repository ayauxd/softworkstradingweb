import { useState, useEffect } from "react";
import { useTheme } from "../hooks/use-theme-toggle";
import LogoIcon from "./LogoIcon";
import { Link } from "wouter";
import { Moon, Sun, Linkedin, Mail, Menu, X } from "lucide-react";

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
    <header 
      className={`fixed top-0 w-full bg-soft-white dark:bg-navy-dark z-50 transition-all transform duration-300 border-b border-neutral-300 dark:border-neutral-700 ${
        scrolled ? "shadow-md" : ""
      }`}
      role="banner"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <a 
            href="#home" 
            className="flex items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan rounded-md" 
            onClick={(e) => { e.preventDefault(); scrollToSection("home"); }}
            aria-label="Softworks Trading Co Home"
          >
            <LogoIcon className="h-12 w-auto" aria-hidden="true" />
            <span className="ml-3 text-lg font-semibold hidden md:block text-navy dark:text-soft-white group-hover:text-cyan dark:group-hover:text-cyan-light transition-colors">
              Softworks Trading Co
            </span>
          </a>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8" aria-label="Main Navigation">
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
          
          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-navy-light transition-all duration-300 
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-soft-white 
                        dark:focus-visible:ring-offset-navy-dark active:scale-95"
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              title={theme === "dark" ? "Enable light theme" : "Enable dark theme"}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5 text-soft-white" aria-hidden="true" />
              ) : (
                <Moon className="h-5 w-5 text-navy" aria-hidden="true" />
              )}
              <span className="sr-only">{theme === "dark" ? "Light mode" : "Dark mode"}</span>
            </button>
            
            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="p-2 md:hidden rounded-full hover:bg-gray-200 dark:hover:bg-navy-light transition-all duration-300
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-soft-white 
                        dark:focus-visible:ring-offset-navy-dark active:scale-95"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              title={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5 text-navy dark:text-soft-white" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5 text-navy dark:text-soft-white" aria-hidden="true" />
              )}
              <span className="sr-only">{mobileMenuOpen ? "Close menu" : "Open menu"}</span>
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        <div 
          id="mobile-menu"
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          } bg-soft-white dark:bg-navy-dark`}
          aria-hidden={!mobileMenuOpen}
        >
          <nav className="flex flex-col space-y-4 p-4" aria-label="Mobile Navigation">
            {["home", "services", "how-it-works", "insights", "contact"].map((item) => (
              <a 
                key={item}
                href={`#${item}`} 
                className="text-navy dark:text-soft-white hover:text-cyan dark:hover:text-cyan-light font-medium transition-colors px-2 py-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
                onClick={(e) => { 
                  e.preventDefault(); 
                  scrollToSection(item);
                  toggleMobileMenu(); // Close mobile menu when an item is clicked
                }}
                aria-current={item === "home" ? "page" : undefined}
              >
                {item.charAt(0).toUpperCase() + item.slice(1).replace(/-/g, " ")}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;

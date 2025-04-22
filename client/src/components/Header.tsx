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
    <header 
      className={`fixed top-0 w-full bg-soft-white dark:bg-navy-dark z-50 transition-all duration-300 border-b border-neutral-300 dark:border-neutral-700 ${
        scrolled ? "shadow-md" : ""
      }`}
      role="banner"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo - Left Side */}
          <div>
            <a 
              href="#home" 
              className="flex items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan rounded-md" 
              onClick={(e) => { e.preventDefault(); scrollToSection("home"); }}
              aria-label="Softworks Trading Co Home"
            >
              <LogoIcon className="h-10 w-auto" />
              <span className="ml-2 text-sm sm:text-base md:text-lg font-semibold text-navy dark:text-soft-white group-hover:text-cyan dark:group-hover:text-cyan-light transition-colors truncate max-w-[150px] sm:max-w-none">
                <span className="hidden xs:inline">Softworks</span> Trading Co
              </span>
            </a>
          </div>
          
          {/* Right Side Content - Navigation and Controls */}
          <div className="flex items-center space-x-2">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6 mr-6" aria-label="Main Navigation">
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
            
            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-navy-light transition-all duration-300 focus:outline-none"
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5 text-soft-white" />
              ) : (
                <Moon className="h-5 w-5 text-navy" />
              )}
            </button>
            
            {/* Mobile Menu Button */}
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
        
        {/* Mobile Navigation Menu */}
        <div 
          id="mobile-menu"
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? "max-h-[300px] opacity-100 border-t border-gray-200 dark:border-navy-light" : "max-h-0 opacity-0 border-none"
          } bg-soft-white dark:bg-navy-dark`}
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
  );
};

export default Header;

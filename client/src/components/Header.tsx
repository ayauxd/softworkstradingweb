import { useState, useEffect } from "react";
import { useTheme } from "../hooks/use-theme-toggle";
import LogoIcon from "./LogoIcon";
import { Link } from "wouter";
import { Moon, Sun, Linkedin, Mail, Menu } from "lucide-react";

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
      className={`fixed top-0 w-full bg-soft-white dark:bg-navy-dark z-50 transition-colors duration-300 border-b border-neutral-300 dark:border-neutral-700 ${
        scrolled ? "shadow-md" : ""
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <a href="#home" className="flex items-center" onClick={(e) => { e.preventDefault(); scrollToSection("home"); }}>
            <LogoIcon className="h-12 w-auto" />
            <span className="ml-3 text-lg font-semibold hidden md:block text-navy dark:text-soft-white">Softworks Trading Co</span>
          </a>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {["home", "services", "how-it-works", "insights", "contact"].map((item) => (
              <a 
                key={item}
                href={`#${item}`} 
                className="text-navy dark:text-soft-white hover:text-cyan dark:hover:text-cyan-light font-medium transition-colors"
                onClick={(e) => { e.preventDefault(); scrollToSection(item); }}
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
                        focus:outline-none focus:ring-2 focus:ring-cyan focus:ring-offset-2 focus:ring-offset-soft-white 
                        dark:focus:ring-offset-navy-dark active:scale-95"
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              title={theme === "dark" ? "Enable light theme" : "Enable dark theme"}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5 text-soft-white" />
              ) : (
                <Moon className="h-5 w-5 text-navy" />
              )}
              <span className="sr-only">{theme === "dark" ? "Light mode" : "Dark mode"}</span>
            </button>
            
            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="p-2 md:hidden rounded-full hover:bg-gray-200 dark:hover:bg-navy-light transition-all duration-300
                        focus:outline-none focus:ring-2 focus:ring-cyan focus:ring-offset-2 focus:ring-offset-soft-white 
                        dark:focus:ring-offset-navy-dark active:scale-95"
              aria-label="Toggle mobile menu"
              aria-expanded={mobileMenuOpen}
              title={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            >
              <Menu className="h-5 w-5 text-navy dark:text-soft-white" />
              <span className="sr-only">{mobileMenuOpen ? "Close menu" : "Open menu"}</span>
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 animate-fadeIn bg-soft-white dark:bg-navy-dark">
            <nav className="flex flex-col space-y-4">
              {["home", "services", "how-it-works", "insights", "contact"].map((item) => (
                <a 
                  key={item}
                  href={`#${item}`} 
                  className="text-navy dark:text-soft-white hover:text-cyan dark:hover:text-cyan-light font-medium transition-colors"
                  onClick={(e) => { e.preventDefault(); scrollToSection(item); }}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1).replace(/-/g, " ")}
                </a>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

import { useState } from "react";
import { useTheme } from "../hooks/use-theme-toggle";
import LogoIcon from "./LogoIcon";
import { Moon, Sun, Menu } from "lucide-react";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
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
    <div className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-navy-dark shadow-md border-b border-gray-200 dark:border-gray-800">
      {/* Simple header for all screen sizes */}
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and text */}
          <div>
            <a 
              href="#home" 
              onClick={(e) => { e.preventDefault(); scrollToSection("home"); }}
              className="flex items-center"
            >
              <LogoIcon className="h-8 w-auto" />
              <span className="ml-2 text-base font-semibold text-navy dark:text-white">
                Softworks
              </span>
            </a>
          </div>
          
          {/* Controls */}
          <div className="flex items-center space-x-2">
            {/* Theme toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-navy-light"
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5 text-white" />
              ) : (
                <Moon className="h-5 w-5 text-navy" />
              )}
            </button>
            
            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-navy-light"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              <Menu className="h-5 w-5 text-navy dark:text-white" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="bg-white dark:bg-navy-dark border-t border-gray-100 dark:border-gray-800">
          <div className="container mx-auto px-4 py-2">
            <nav>
              {["home", "services", "how-it-works", "insights", "contact"].map((item, index) => (
                <a
                  key={item}
                  href={`#${item}`}
                  className="block py-3 text-navy dark:text-white hover:text-cyan border-b border-gray-100 dark:border-gray-800 last:border-0"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(item);
                    toggleMobileMenu();
                  }}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1).replace(/-/g, " ")}
                </a>
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;

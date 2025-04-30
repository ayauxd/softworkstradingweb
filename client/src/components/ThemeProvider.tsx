import { createContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

interface ThemeContextProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextProps>({
  theme: "light",
  setTheme: () => {},
});

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  // Always use system preference
  const getInitialTheme = (): Theme => {
    // Use the system preference
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    
    return "light"; // Default to light theme if media query not supported
  };

  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  // Apply the theme to the document
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove old theme class
    root.classList.remove("light", "dark");
    
    // Add new theme class
    root.classList.add(theme);
    
    // We don't save preference to localStorage anymore since we always use system preference
  }, [theme]);

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = () => {
      // Always update theme based on system preference
      setTheme(mediaQuery.matches ? "dark" : "light");
    };
    
    mediaQuery.addEventListener("change", handleChange);
    
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const contextValue = {
    theme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

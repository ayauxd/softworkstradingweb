import { useRef, useEffect } from 'react';

type FocusableElement = HTMLElement & {
  focus: () => void;
};

export const useFocusTrap = (isActive: boolean = true) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const initialFocusRef = useRef<FocusableElement | null>(null);

  // Function to get all focusable elements within a container
  const getFocusableElements = (container: HTMLElement): FocusableElement[] => {
    const selectors = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
    return Array.from(container.querySelectorAll(selectors)) as FocusableElement[];
  };

  // Handle the tab key to trap focus
  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const focusableElements = getFocusableElements(container);
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      
      // If shift+tab and first element is focused, move to last element
      if (event.shiftKey && document.activeElement === firstElement) {
        lastElement.focus();
        event.preventDefault();
      } 
      // If tab and last element is focused, move to first element
      else if (!event.shiftKey && document.activeElement === lastElement) {
        firstElement.focus();
        event.preventDefault();
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive]);

  // Set focus to the first focusable element when the container is mounted
  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    // Save the current active element to restore focus later
    const previouslyFocused = document.activeElement as FocusableElement | null;
    
    // Set focus to the first focusable element after a small delay
    const timeoutId = setTimeout(() => {
      if (initialFocusRef.current) {
        initialFocusRef.current.focus();
      } else {
        const focusableElements = getFocusableElements(containerRef.current!);
        if (focusableElements.length > 0) {
          focusableElements[0].focus();
        }
      }
    }, 10);

    // Restore focus when component is unmounted
    return () => {
      clearTimeout(timeoutId);
      if (previouslyFocused) {
        previouslyFocused.focus();
      }
    };
  }, [isActive]);

  return { containerRef, initialFocusRef };
};
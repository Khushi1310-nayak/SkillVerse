import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

// Button only appears after the page has been scrolled past this many pixels
const SCROLL_THRESHOLD = 300;

export const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > SCROLL_THRESHOLD);
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });

    // Handle the case where the page is already scrolled on mount
    toggleVisibility();

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      title="Scroll to top"
      aria-label="Scroll to top"
      className={`fixed bottom-6 right-6 z-40 p-3 rounded-full bg-gradient-main text-white shadow-lg shadow-primary/30
        hover:scale-110 hover:shadow-xl transition-all duration-300 ease-out
        focus:outline-none focus:ring-2 focus:ring-primaryLight focus:ring-offset-2 focus:ring-offset-background
        ${isVisible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'}`}
    >
      <ArrowUp size={20} />
    </button>
  );
};
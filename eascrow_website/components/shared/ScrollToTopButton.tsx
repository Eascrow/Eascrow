'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { MoveUp } from 'lucide-react';

const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // Smooth scroll
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <div>
      {isVisible && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-5 right-5 rounded-lg bg-transparent border border-neonMintGreen px-1"
        >
          <MoveUp size={25} />
        </Button>
      )}
    </div>
  );
};

export default ScrollToTop;

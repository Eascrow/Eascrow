'use client';
import React, { useState, useEffect, ReactNode } from 'react';
import { Info } from 'lucide-react';

interface Props {
  children: ReactNode;
}

const IsOnlyAvailableOnDesktopAlert: React.FC<Props> = ({ children }) => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)'); // Adjust the breakpoint as needed
    const handleMediaQueryChange = () => {
      setIsMobile(mediaQuery.matches);
    };

    // Initial check
    handleMediaQueryChange();

    // Add listener for future changes
    mediaQuery.addEventListener('change', handleMediaQueryChange);

    // Cleanup listener on component unmount
    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange);
    };
  }, []);

  return (
    <>
      {isMobile ? (
        <div className="w-screen h-screen absolute z-10 flex items-center justify-center bg-waves ">
          <div className="flex">
            <Info className="mr-2" color="#5CFFB8" size={30} />
            <h2 className="pt-1 sm:text-2xl text-white">
              DApp only available for desktop
            </h2>
          </div>
        </div>
      ) : (
        children
      )}
    </>
  );
};

export default IsOnlyAvailableOnDesktopAlert;

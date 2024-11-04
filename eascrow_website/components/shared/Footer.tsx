import React, { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface FooterProps {
  children?: ReactNode;
}

const Footer: React.FC<FooterProps> = ({ children }) => {
  return (
    <footer className="w-screen flex flex-col items-center space-y-3 py-20 bg-[#10171e]">
      <Link href="/">
        <Image
          src="/logo-white.avif"
          alt="Eascrow website"
          width="230"
          height="30"
        />
      </Link>
      <div className="min-h-20 flex flex-col sm:flex-row justify-between items-center sm:space-x-4">
        <Link href="https://x.com/eascrowapp" target="_blank">
          <Image
            src="/x-logo.svg"
            alt="Eascrow X page"
            width="30"
            height="30"
          />
        </Link>
        <Link href="https://www.linkedin.com/company/eascrow/" target="_blank">
          <Image
            src="/linkedin-logo.webp"
            alt="Eascrow linkedIn page"
            width="30"
            height="30"
          />
        </Link>
      </div>
    </footer>
  );
};

export default Footer;

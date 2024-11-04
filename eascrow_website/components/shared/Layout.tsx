'use client';
import React, { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import ScrollToTop from './ScrollToTopButton';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col items-center">
      <ScrollToTop />
      <Header />
      <main className="mx-4 sm:mx-8 space-y-14">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;

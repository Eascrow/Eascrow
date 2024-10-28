'use client';
import React, { ReactNode } from 'react';
// import Header from './Header';
// import Footer from './Footer';
// import ScrollToTop from './ScrollToTopButton';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div>
      {/* <ScrollToTop /> */}
      {/* <Header /> */}
      <main>{children}</main>
      {/* <Footer /> */}
    </div>
  );
};

export default Layout;

'use client';
import React, { ReactNode } from 'react';
import Sidebar from './Sidebar';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import Link from 'next/link';
// import ScrollToTop from './ScrollToTopButton';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div>
      <div className="flex">
        <Sidebar />
        <div className="w-full">
          <header className="flex items-center justify-between h-[78px] py-[15px] px-[31px] bg-background">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <Link href="/parameters">
              <Avatar className="w-[48px] h-[48px]">
                <AvatarImage src="/images/profile.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </Link>
          </header>
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
};

export default Layout;

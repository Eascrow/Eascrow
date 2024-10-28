'use client';
import React, { ReactNode } from 'react';
import Sidebar from './Sidebar';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
// import ScrollToTop from './ScrollToTopButton';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="h-full">
      <div className="  h-full flex">
        <Sidebar />
        <div className="  h-full w-full">
          <header className=" flex items-center justify-between h-[78px] py-[15px] px-[31px] bg-background">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <Avatar className="w-[48px] h-[48px]">
              <AvatarImage src="/images/profile.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </header>
          <main className=" h-full">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default Layout;

'use client';
import React, { ReactNode } from 'react';
import Link from 'next/link';
import Sidebar from './Sidebar';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Button } from '@/components/ui/button';
import { useFreighterWallet } from '@/app/hooks/useFreighterWallet';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { publicKey, connect, hasFreighter } = useFreighterWallet();

  return (
    <div>
      <div className="flex">
        <Sidebar />
        <div className="w-full">
          <header className="flex items-center justify-between h-[78px] py-[15px] px-[31px] bg-background">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <div className="flex items-center">
              {!hasFreighter && (
                <p className="text-red-500">Freighter Wallet not detected</p>
              )}
              {!publicKey ? (
                <Button
                  onClick={connect}
                  className="w-full mr-5 bg-mintGreen text-background text-sm font-bold"
                >
                  Connect Wallet
                </Button>
              ) : (
                <p className="max-w-80 mr-5 truncate text-mintGreen">
                  Wallet connected: {publicKey}
                </p>
              )}
              <Link href="/parameters">
                <Avatar className="w-[48px] h-[48px]">
                  <AvatarImage src="/images/profile.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </Link>
            </div>
          </header>
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
};

export default Layout;

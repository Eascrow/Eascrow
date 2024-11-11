'use client';
import React, { ReactNode } from 'react';
import Image from 'next/image';
import Sidebar from './Sidebar';
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
                <div className="flex items-center space-x-1">
                  <Image
                    src="/icons/wallet-green.png"
                    alt="Eascrow website"
                    width="20"
                    height="20"
                    priority
                  />
                  <p className="max-w-80 pt-1 truncate text-mintGreen">
                    Connected:{' '}
                    {publicKey
                      ? `${publicKey.slice(0, 3)}...${publicKey.slice(-3)}`
                      : ''}
                  </p>
                </div>
              )}
            </div>
          </header>
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
};

export default Layout;

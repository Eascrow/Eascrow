import React, { ReactNode } from 'react';
import {
  NavigationMenu,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu';
import Image from 'next/image';
import Link from 'next/link';
import MenuBurger from './MenuBurger';
import { Button } from '../ui/button';

interface HeaderProps {
  children?: ReactNode;
}

const Header: React.FC<HeaderProps> = ({ children }) => {
  return (
    <header className="sticky top-0 left-4 w-full h-24 md:h-32 p-4 mb-10 md:mb-20 flex justify-center items-center backdrop-blur-lg brightness-100 z-10">
      <div className="w-full md:max-w-6xl flex justify-between items-center ">
        <div>
          <Link href="/">
            <Image
              src="/logo-white.avif"
              alt="Eascrow website"
              width="230"
              height="30"
              priority
              className="sm:hidden"
            />
            <Image
              src="/logo-white.avif"
              alt="Eascrow website"
              width="230"
              height="30"
              priority
              className="hidden sm:block"
            />
          </Link>
        </div>
        <div>
          <NavigationMenu className="hidden sm:block text-slate-400 text-lg space-x-6">
            <NavigationMenuLink href="/#about" className="hover:opacity-60">
              About
            </NavigationMenuLink>
            <NavigationMenuLink href="/#features" className="hover:opacity-60">
              Features
            </NavigationMenuLink>
            <NavigationMenuLink href="/#pricing" className="hover:opacity-60">
              Pricing
            </NavigationMenuLink>
          </NavigationMenu>
        </div>
        <div>
          <MenuBurger />
          <Link href="/dapp" className="hidden sm:block">
            <Button className="bg-neonMintGreen text-darkBlueGray h-14 text-md rounded-xl hover:bg-[#4ddb98]">
              Launch DApp
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;

'use client';
import { useState } from 'react';
import {
  NavigationMenu,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu';
import { Menu, X } from 'lucide-react';

const MenuBurger = () => {
  const [isOpen, setIsOpen] = useState<Boolean>(false);

  const handleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {isOpen ? (
        <>
          <X onClick={handleOpen} className="sm:hidden" />
          <NavigationMenu className="absolute left-0 top-20 min-w-full flex flex-col items-start p-7 space-y-4 text-slate-400 bg-radial-gradient-center rounded-md">
            <NavigationMenuLink href="/#about">About</NavigationMenuLink>
            <NavigationMenuLink href="/#features">Features</NavigationMenuLink>
            <NavigationMenuLink href="/#pricing">Pricing</NavigationMenuLink>
          </NavigationMenu>
        </>
      ) : (
        <Menu className="sm:hidden " onClick={handleOpen} />
      )}
    </div>
  );
};

export default MenuBurger;

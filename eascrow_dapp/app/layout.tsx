import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import Layout from '@/components/shared/Layout';
import IsOnlyAvailableOnDesktopAlert from '@/components/shared/IsOnlyAvailableOnDesktopAlert';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'Eascrow, when the trusted third is the blockchain',
  description:
    'Eascrow is an innovative web3 escrow service that harnesses the power of Soroban smart contracts to streamline and secure online transactions. It acts as a trusted intermediary, ensuring that funds are safely held and released according to the terms agreed upon by the involved parties. This service is essential for various financial dealings, ranging from material goods trade to freelance services.',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={cn('min-h-screen font-sans antialiased bg-waves')}>
        <IsOnlyAvailableOnDesktopAlert>
          <Toaster />
          <Layout>{children}</Layout>
        </IsOnlyAvailableOnDesktopAlert>
      </body>
    </html>
  );
}

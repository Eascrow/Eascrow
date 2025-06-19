'use client';
import Overview from './overview/page';
import { Toaster } from 'sonner';

export default function Home() {
  return (
    <>
      <Toaster />
      <Overview />
    </>
  );
}

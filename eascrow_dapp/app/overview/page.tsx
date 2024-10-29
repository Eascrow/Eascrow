import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Card from '@/components/shared/Card';
import TableComponent from '@/components/shared/TableComponent';

const Overview = () => {
  return (
    <div className="border border-red-300 pt-[70px] pb-5 px-9">
      <section className="flex items-center justify-between mb-16">
        <div>
          <h2 className="text-6xl text-white font-bold">Welcome [name]</h2>
          <h3 className="text-3xl text-mintGreen">Service Account</h3>
        </div>
        <div className="">
          <Link href="/createEascrow" className="">
            <Button className="w-[195px] h-[60px] px-6 py-7 text-xl font-bold rounded-lg bg-custom-gradient hover:opacity-90 border border-[#34455C] ">
              Initiate Eascrow
            </Button>
          </Link>
        </div>
      </section>
      <section className="flex flex-wrap max-w-[1080px]">
        <Card className="w-[232px] h-[300px] mr-7 mb-7">
          <div className="flex items-center space-x-2.5 mb-5">
            <Image
              src="/icons/wallet-green.png"
              alt="Eascrow website"
              width="36"
              height="36"
              priority
            />
            <h3 className="text-2xl text-white font-bold">My Wallet</h3>
          </div>
          <div className="h-[106px] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div>
                <Image
                  src="/icons/xlm.png"
                  alt="Eascrow website"
                  width="26"
                  height="26"
                  priority
                />
              </div>
              <div>
                <p className="text-white font-bold">XLM</p>
                <p className="text-xs">$3,425</p>
              </div>
            </div>
            <p className="text-xs text-white">38762.21</p>
          </div>
          <div className="h-[106px] flex flex-col justify-end space-y-4">
            <Link href="/wallets">
              <Button className="w-full bg-mintGreen text-background text-sm font-bold">
                Check my wallets
              </Button>
            </Link>
            <Link href="/">
              <Button className="w-full bg-transparent border border-mintGreen text-mintGreen text-sm font-bold">
                Buy $XLM
              </Button>
            </Link>
          </div>
        </Card>
        <Card className="w-[763px] h-[300px] mr-7 mb-7 overflow-scroll overflow-x-hidden">
          <div className="flex justify-between">
            <div className="flex items-center space-x-2.5 mb-5">
              <Image
                src="/icons/arrow-swapp-green.png"
                alt="Eascrow website"
                width="36"
                height="36"
                priority
              />
              <h3 className="text-2xl text-white font-bold">Transactions</h3>
            </div>
            <div>
              <Link href="/transactions">
                <Button className="w-full bg-mintGreen text-background text-sm font-bold">
                  See more
                </Button>
              </Link>
            </div>
          </div>
          <TableComponent />
        </Card>
        {/* <Card className="w-[464px] h-[300px] mr-7 mb-7">card</Card> */}
        {/* <Card className="w-[252px] h-[300px] mr-7 mb-7">card</Card> */}
        {/* <Card className="w-[252px] h-[300px] mr-7 mb-7">card</Card> */}
      </section>
    </div>
  );
};

export default Overview;

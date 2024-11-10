'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Card from '@/components/shared/Card';
import { Button } from '@/components/ui/button';
import { useFreighterWallet } from '@/app/hooks/useFreighterWallet';

const Wallets = () => {
  const { publicKey, connect } = useFreighterWallet();
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(
    !!publicKey
  );

  // Track changes in `publicKey` and update `isWalletConnected`
  useEffect(() => {
    setIsWalletConnected(!!publicKey);
  }, [publicKey]);

  return (
    <div className="pt-[70px] pb-5 px-9">
      <section className="flex items-center justify-between mb-16">
        <div>
          <h2 className="text-6xl text-white font-bold">Wallets</h2>
          <h3 className="text-3xl text-mintGreen">Service Account</h3>
        </div>
        <div className="flex flex-col">
          <Link
            href={isWalletConnected ? '/createEascrow' : '#'}
            className={isWalletConnected ? '' : 'pointer-events-none'}
          >
            <Button
              className="w-[195px] h-[60px] px-6 py-7 text-xl font-bold rounded-lg bg-custom-gradient hover:opacity-90 border border-[#34455C]"
              disabled={!isWalletConnected}
            >
              Initiate Eascrow
            </Button>
          </Link>
          {!isWalletConnected && (
            <span className="ml-2 text-xs">Please Connect</span>
          )}
        </div>
      </section>
      <section className="flex flex-wrap max-w-[1080px]">
        <Card className="w-[237px] h-[266px] mr-7 mb-7 flex flex-col items-center justify-center">
          <div className="w-[198px] h-[198px] flex flex-col items-center relative ">
            <h2 className="mb-[21px] text-lg font-bold text-white">
              Freighter
            </h2>
            <Image
              src="/logos/freighter.png"
              alt="Freighter wallet"
              width={105}
              height={105}
              priority
              className="mb-[21px]"
            />
            <Button
              onClick={connect}
              className="w-[104px] h-[30px] bg-mintGreen text-background text-sm font-bold"
            >
              {isWalletConnected ? 'Connected' : 'Connect'}
            </Button>
          </div>
        </Card>
        <Card className="w-[237px] h-[266px] mr-7 mb-7 flex flex-col items-center justify-center opacity-50">
          <div className="w-[198px] h-[198px] flex flex-col items-center relative ">
            <h2 className="mb-[21px] text-lg font-bold text-white">Albedo</h2>
            <Image
              src="/logos/albedo.png"
              alt="albedo wallet"
              width={105}
              height={105}
              priority
              className="mb-[21px]"
            />
            <Button
              // onClick={connect}
              disabled
              className="w-[104px] h-[30px] bg-mintGreen text-background text-sm font-bold"
            >
              {isWalletConnected ? 'Connected' : 'Coming soon'}
            </Button>
          </div>
        </Card>
        <Card className="w-[237px] h-[266px] mr-7 mb-7 flex flex-col items-center justify-center opacity-50">
          <div className="w-[198px] h-[198px] flex flex-col items-center relative ">
            <h2 className="mb-[21px] text-lg font-bold text-white">Infinity</h2>
            <Image
              src="/logos/infinity.png"
              alt="Infinity wallet"
              width={105}
              height={105}
              priority
              className="mb-[21px]"
            />
            <Button
              // onClick={connect}
              disabled
              className="w-[104px] h-[30px] bg-mintGreen text-background text-sm font-bold"
            >
              {isWalletConnected ? 'Connected' : 'Coming soon'}
            </Button>
          </div>
        </Card>
        <Card className="w-[237px] h-[266px] mr-7 mb-7 flex flex-col items-center justify-center opacity-50">
          <div className="w-[198px] h-[198px] flex flex-col items-center relative ">
            <h2 className="mb-[21px] text-lg font-bold text-white">Hana</h2>
            <Image
              src="/logos/hana.png"
              alt="Hana wallet"
              width={105}
              height={105}
              priority
              className="mb-[21px]"
            />
            <Button
              // onClick={connect}
              disabled
              className="w-[104px] h-[30px] bg-mintGreen text-background text-sm font-bold"
            >
              {isWalletConnected ? 'Connected' : 'Coming soon'}
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
};

export default Wallets;

'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Card from '@/components/shared/Card';
// import { Button } from '@/components/ui/button';
import { useFreighterWallet } from '@/app/hooks/useFreighterWallet';
import TableComponent from '@/components/shared/TableComponent';

const Transactions = () => {
  const { publicKey, transactions } = useFreighterWallet();
  const [isWalletConnected, setIsWalletConnected] =
    useState<boolean>(!!publicKey);

  // Track changes in `publicKey` and update `isWalletConnected`
  useEffect(() => {
    setIsWalletConnected(!!publicKey);
  }, [publicKey]);

  return (
    <div className="pt-[70px] pb-5 px-9">
      <section className="flex items-center justify-between mb-16">
        <div>
          <h2 className="text-6xl text-white font-bold">Transactions</h2>
          <h3 className="text-3xl text-mintGreen">Service Account</h3>
        </div>
        <div className="flex flex-col">
          <Link
            href={isWalletConnected ? '/createEascrow' : '#'}
            className={isWalletConnected ? '' : 'pointer-events-none'}
          >
            {/* <Button
              className="w-[195px] h-[60px] px-6 py-7 text-xl font-bold rounded-lg bg-custom-gradient hover:opacity-90 border border-[#34455C]"
              disabled={!isWalletConnected}
            >
              Initiate Eascrow
            </Button> */}
          </Link>
          {!isWalletConnected && (
            <span className="ml-2 text-xs">Please Connect</span>
          )}
        </div>
      </section>
      <section>
        <Card className=" mr-7 mb-7 flex flex-col items-center justify-center">
          <div className="flex items-center  w-full space-x-2.5 mb-5">
            <Image
              src="/icons/arrow-swapp-green.png"
              alt="Eascrow website"
              width="36"
              height="36"
              priority
            />
            <h3 className="text-2xl text-white font-bold">Transactions</h3>
          </div>
          <TableComponent transactions={transactions} />
        </Card>
      </section>
    </div>
  );
};

export default Transactions;

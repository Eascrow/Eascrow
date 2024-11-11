import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Sidebar = () => {
  return (
    <div className=" w-[248px] min-h-screen py-[30px] px-[24px] bg-background flex flex-col justify-between">
      <div className=" w-[174px] h-[243px] flex flex-col justify-between">
        <Link href="/">
          <Image
            src="/logos/logo-white.png"
            alt="Eascrow website"
            width="174"
            height="38"
            priority
          />
        </Link>
        <ul className=" w-[174px] h-[170px] flex flex-col justify-between">
          <Link href="/">
            <li className=" flex h-[34px] py-[7px] px-[8px] gap-x-2 rounded-md hover:text-white hover:bg-backgroundHover">
              <Image
                src="/icons/3dcube.png"
                alt="Overview link"
                width="20"
                height="20"
                priority
              />
              Overview
            </li>
          </Link>
          <Link href="/transactions">
            <li className=" flex h-[34px] py-[7px] px-[8px] gap-x-2 rounded-md hover:text-white hover:bg-backgroundHover">
              <Image
                src="/icons/arrow-swapp.png"
                alt="Transactions link"
                width="20"
                height="20"
                priority
              />
              Transactions
            </li>
          </Link>
          <Link href="/wallets">
            <li className=" flex h-[34px] py-[7px] px-[8px] gap-x-2 rounded-md hover:text-white hover:bg-backgroundHover">
              <Image
                src="/icons/wallet.png"
                alt="Wallet link"
                width="20"
                height="20"
                priority
              />
              Wallets
            </li>
          </Link>
          <Link href="/chart">
            <li className=" flex h-[34px] py-[7px] px-[8px] gap-x-2 rounded-md hover:text-white hover:bg-backgroundHover">
              <Image
                src="/icons/chart.png"
                alt="Chart link"
                width="20"
                height="20"
                priority
              />
              Chart
            </li>
          </Link>
        </ul>
      </div>
      <ul className=" w-[174px] h-[92px] flex flex-col justify-between">
        <Link href="/parameters">
          <li className=" flex h-[34px] py-[7px] px-[8px] gap-x-2 rounded-md hover:text-white hover:bg-backgroundHover">
            <Image
              src="/icons/setting.png"
              alt="Settings link"
              width="20"
              height="20"
              priority
            />
            Settings
          </li>
        </Link>
        <Link href="/sign-in">
          <li className=" flex h-[34px] py-[7px] px-[8px] gap-x-2 rounded-md hover:text-white hover:bg-backgroundHover">
            <Image
              src="/icons/logout.png"
              alt="Logout link"
              width="20"
              height="20"
              priority
            />
            Logout
          </li>
        </Link>
      </ul>
    </div>
  );
};

export default Sidebar;

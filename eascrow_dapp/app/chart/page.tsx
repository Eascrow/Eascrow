import React from 'react';
import Image from 'next/image';
import Card from '@/components/shared/Card';

const Chart = () => {
  return (
    <div className="pt-[70px] pb-5 px-9">
      <Card className="max-w-[1080px]">
        <div className="m-8 flex flex-col">
          <div className="flex mb-2.5">
            <h2 className="text-2xl text-white font-bold">Chart</h2>
          </div>
          <div className="w-[967px] h-[575px] relative">
            <a
              href="https://fr.tradingview.com/chart/"
              target="_blank"
              rel="noreferrer noopener"
            >
              <Image
                src="/images/xlm-graph-large.png"
                alt="Escrow website"
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Chart;

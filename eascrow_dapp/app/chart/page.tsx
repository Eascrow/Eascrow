'use client';
import React from 'react';
import Card from '@/components/shared/Card';
import ChartWidget from '@/components/shared/ChartWidget';

const Chart = () => {
  return (
    <div className="pt-[70px] pb-5 px-9">
      <Card className="max-w-[1080px]">
        <div className="m-8 flex flex-col">
          <div className="flex mb-2.5">
            <h2 className="text-2xl text-white font-bold">Chart</h2>
          </div>
          <ChartWidget />
        </div>
      </Card>
    </div>
  );
};

export default Chart;

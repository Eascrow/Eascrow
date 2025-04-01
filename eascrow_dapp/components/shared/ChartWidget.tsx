'use client';
import React, { useEffect } from 'react';

const ChartWidget = () => {
  useEffect(() => {
    if (!document.querySelector('#coingecko-widget-script')) {
      const script = document.createElement('script');
      script.src =
        'https://widgets.coingecko.com/gecko-coin-price-chart-widget.js';
      script.async = true;
      script.id = 'coingecko-widget-script';
      document.body.appendChild(script);
    }
  }, []);

  return (
    <gecko-coin-price-chart-widget
      locale="fr"
      dark-mode="true"
      transparent-background="true"
      outlined="true"
      coin-id="stellar"
      initial-currency="usd"
    />
  );
};

export default ChartWidget;

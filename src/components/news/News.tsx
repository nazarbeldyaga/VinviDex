"use client"

import { useEffect, useRef } from 'react';
import "./News.css"

const News = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-timeline.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      feedMode: 'market',
      market: 'crypto',
      colorTheme: 'dark',
      isTransparent: false,
      displayMode: 'adaptive',
      width: '900',
      height: '550',
      locale: 'en',
    });

    if (containerRef.current) {
      containerRef.current.innerHTML = ''; // очистити попередній скрипт
      containerRef.current.appendChild(script);
    }
  }, []);

  return (
    <div className="tradingview-widget-container">
      <div ref={containerRef} className="tradingview-widget-container__widget" />
    </div>
  );
};

export default News;

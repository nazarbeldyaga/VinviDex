"use client";

import { useEffect, useRef } from "react";

const TickerTape = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = JSON.stringify({
            symbols: [
                { proName: "BITSTAMP:BTCUSD", title: "Bitcoin" },
                { proName: "BITSTAMP:ETHUSD", title: "Ethereum" },
                { proName: "BINANCE:XRPUSDT", title: "XRP" },
                { proName: "BINANCE:DOGEUSDT", title: "DOGE Coin" },
                { proName: "BINANCE:TRUMPUSDT", title: "Trump Coin" },
                { proName: "BINANCE:SOLUSDT", title: "Solana" },
                { proName: "BINANCE:PEPEUSDT", title: "PEPE coin" },
                { proName: "BINANCE:AAVEUSDT", title: "Avalanche" },
                { proName: "BINANCE:BNBUSDT", title: "BNB" }
            ],
            showSymbolLogo: true,
            isTransparent: false,
            largeChartUrl: "http://localhost:3000/trading",
            displayMode: "compact",
            colorTheme: "dark",
            locale: "en"
        });

        if (containerRef.current) {
            containerRef.current.innerHTML = ""; // очищення попереднього
            containerRef.current.appendChild(script);
        }
    }, []);

    return (
        <div className="tradingview-widget-container">
            <div
                ref={containerRef}
                className="tradingview-widget-container__widget"
            />
        </div>
    );
};

export default TickerTape;

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

import "./MainPage.css";

const TickerTape = dynamic(
    () => import("@/components/ticker/TickerTape").then((mod) => mod.default),
    {
        ssr: true,
        loading: () => <div>Loading Ticker...</div>
    }
);

const News = dynamic(
    () => import("@/components/news/News").then((mod) => mod.default),
    {
        ssr: true,
        loading: () => <div>Loading News...</div>
    }
);

const MainPage: React.FC = () => {
    const [componentsLoaded, setComponentsLoaded] = useState({
        ticker: false,
        news: false
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            setComponentsLoaded({
                ticker: true,
                news: true
            });
        }, 100);
        
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <div className="ticker">
                {componentsLoaded.ticker ? <TickerTape /> : <div>Loading Ticker...</div>}
            </div>

            <div className="slogan">
                <h1>Trade Crypto with Confidence</h1>
                <p>Experience the future of decentralized trading with VINVI. Fast, secure, and non-custodial trading at your fingertips.</p>
            </div>

            <div className="news">
                {componentsLoaded.news ? <News /> : <div>Loading News...</div>}
            </div>
        </>
    );
};

export default MainPage;
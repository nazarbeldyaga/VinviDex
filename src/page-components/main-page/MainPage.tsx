import React from "react";

import "./MainPage.css";
import TickerTape from "@/components/ticker/TickerTape";
import News from "@/components/news/News";

const MainPage: React.FC = () => {
    return (
        <>
            <div className="ticker">
                <TickerTape />
            </div>

            <div className="slogan">
                <h1>Trade Crypto with Confidence</h1>
                <p>Experience the future of decentralized trading with VINVI. Fast, secure, and non-custodial trading at your fingertips.</p>
            </div>

            <div className="news">
                <News />
            </div>
        </>
    );
};

export default MainPage;

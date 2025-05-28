"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

import "./TradingPage.css";
import StatusMessage from "@/components/common/StatusMessage";

// Інтерфейс для статусного повідомлення
interface StatusMessageData {
  type: 'success' | 'error' | 'info';
  message: string;
  details?: string;
}

const UniswapWidget = dynamic(
    () => import("../../components/uniswap/UniswapWidget").then((mod) => mod.UniswapWidget),
    {
        ssr: true,
        loading: () => <div>Loading Uniswap Widget...</div>
    }
);

const LiquidityForm = dynamic(
    () => import("../../components/pool/LiquidityForm").then((mod) => mod.default),
    {
        ssr: true,
        loading: () => <div>Loading LiquidityForm...</div>
    }
);

const TradingViewChart = dynamic(
    () =>
      import("../../components/chart/TradingViewChart").then(
        (mod) => mod.default
      ),
    {
      ssr: true,
      loading: () => <div>Loading TradingView Chart...</div>,
    }
);

const TradingPage: React.FC = () => {
    const [chartMode, setChartMode] = useState<number>(1);
    const [uniMode, setUniMode] = useState(1);
    const [componentsLoaded, setComponentsLoaded] = useState({
        uniswap: false,
        liquidity: false
    });
    // Додаємо стан для статусного повідомлення
    const [statusMessage, setStatusMessage] = useState<StatusMessageData | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Перехоплюємо запити на рівні fetch API
            const originalFetch = window.fetch;
            window.fetch = function(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
                if (typeof input === 'string' && input.endsWith('/t')) {
                    return Promise.resolve(new Response(JSON.stringify({}), {
                        status: 200,
                        headers: { 'Content-Type': 'application/json' }
                    }));
                }
                return originalFetch(input, init);
            };
        }
    }, []);

    // Завантажуємо обидва компоненти при першому рендері
    useEffect(() => {
        const timer = setTimeout(() => {
            setComponentsLoaded({
                uniswap: true,
                liquidity: true
            });
        }, 100);
        
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <div className="container">
                <div className="content">
                    <div className="chart-controls">
                        <button 
                            className={`chart-toggle-btn ${chartMode === 1 ? 'active' : ''}`} 
                            onClick={() => setChartMode(1)}
                        >
                            Single Chart
                        </button>
                        <button 
                            className={`chart-toggle-btn ${chartMode === 2 ? 'active' : ''}`} 
                            onClick={() => setChartMode(2)}
                        >
                            Dual Charts
                        </button>
                        <button 
                            className={`chart-toggle-btn ${chartMode === 3 ? 'active' : ''}`} 
                            onClick={() => setChartMode(3)}
                        >
                            Dual Vertical Charts
                        </button>
                    </div>
                    
                    <div className={`content__chart
                        ${chartMode === 2 ? 'dual-charts horizontal' : ''}
                        ${chartMode === 3 ? 'dual-charts vertical' : ''}
                    `}>
                        {chartMode === 1 && (
                            <TradingViewChart chartId="chart2" />
                        )}

                        {(chartMode === 2 || chartMode === 3) && (
                            <>
                                <TradingViewChart chartId="chart1" />
                                <TradingViewChart chartId="chart2" />
                            </>
                        )}
                    </div>
                </div>
                
                <div className="widget-container">     
                    <div className="widget-background"></div>

                    <div className="uniswap-widget-mode">
                        <button className={`mode-button ${uniMode === 1 ? 'active' : ''}`} onClick={() => setUniMode(1)}>Swap</button>
                        <button className={`mode-button ${uniMode === 2 ? 'active' : ''}`} onClick={() => setUniMode(2)}>Pool</button>
                    </div>

                    <div className="widget">
                        {componentsLoaded.uniswap && (
                            <div style={{ display: uniMode === 1 ? 'block' : 'none' }}>
                                <UniswapWidget />
                            </div>
                        )}
                        
                        {componentsLoaded.liquidity && (
                            <div style={{ display: uniMode === 2 ? 'block' : 'none' }}>
                                <LiquidityForm />
                            </div>
                        )}
                    </div>
                </div>
                {statusMessage && (
                    <StatusMessage 
                        type={statusMessage.type} 
                        message={statusMessage.message} 
                        details={statusMessage.details} 
                        onClose={() => setStatusMessage(null)} 
                    />
                )}
            </div>
        </>
    );
};

export default TradingPage;
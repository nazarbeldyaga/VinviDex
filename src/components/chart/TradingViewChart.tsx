"use client";

import { useEffect, useRef } from "react";
import "./TradingViewChart.css"

interface TradingViewChartProps {
    chartId: string;
}

declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        TradingView: any | undefined;
    }
}

const TradingViewChart = ({ chartId }: TradingViewChartProps) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const containerId = `tradingview_chart_${chartId}`;

        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/tv.js";
        script.async = true;
        script.onload = () => {
            if (window.TradingView) {
                try {
                    // Очищаємо контейнер перед створенням нового віджета
                    const container = document.getElementById(containerId);
                    if (container) container.innerHTML = "";

                    new window.TradingView.widget({
                        symbol: "BINANCE:BTCUSDT",
                        interval: "D",
                        timezone: "Etc/UTC",
                        theme: "dark",
                        style: "1",
                        locale: "en",
                        container_id: containerId,
                        save_image: false,
                        hide_top_toolbar: false,
                        hide_legend: false,
                        hide_side_toolbar: false,
                        enable_publishing: false,
                        withdateranges: true,
                        allow_symbol_change: true,
                        autosize: true,
                        watchlist: [
                            "BINANCE:BTCUSDT",
                            "BINANCE:ETHUSDT",
                            "BINANCE:SOLUSDT",
                            "BINANCE:XRPUSDT",
                            "BINANCE:BNBUSDT",
                            "BINANCE:AAVEUSDT",
                            "BINANCE:TRUMPUSDT",
                            "BINANCE:DOGEUSDT",
                            "BINANCE:PEPEUSDT",
                            "BINANCE:SHIBUSDT",
                        ],
                        details: true,
                    });
                } catch (error) {
                    console.error(`Widget creating error:`, error);
                }
            }
        };

        // Перевіряємо, чи скрипт вже завантажено
        if (!document.querySelector('script[src="https://s3.tradingview.com/tv.js"]')) {
            document.body.appendChild(script);
        }
        else if (script.onload) {
            script.onload(new Event("load"));
        }

        return () => {
            const oldWidget = document.getElementById(containerId);
            if (oldWidget) oldWidget.innerHTML = "";
        };
    }, [chartId]);

    return (
        <div className="chart-container">
            <div
                id={`tradingview_chart_${chartId}`}
                ref={containerRef}
            ></div>
        </div>
    );
};

export default function TokenChart({ chartId = "chart1" }) {
    return (
        <div>
            <TradingViewChart chartId={chartId}/>
        </div>
    );
}
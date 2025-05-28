"use client";

import { AiOutlineLoading3Quarters } from "react-icons/ai";
import TOKEN_LIST from "../../data/uniswap-default.tokenlist.json";
import './Widget.css'
import { JSON_RPC_URL } from '@/constants'
import dynamic from "next/dynamic"
import { darkTheme } from "@uniswap/widgets";
import { useProviders } from './useProviders';
import { CHAIN_NAMES_TO_IDS, SupportedChainId } from '@/constants/chains'
import useOption from './useOption'
import { useCallback, useState, useEffect } from 'react'
import EventFeed, { Event } from './EventFeed'
import { useAuth } from '@/context/AuthContext';
import { HANDLERS } from './EventFeed'

const FilteredSwapWidget = dynamic(async () => {
    const { SwapWidget } = await import("@dex-swap/widgets");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function WrappedSwapWidget(props: any) {
        const problematicProps = ['approved', 'isExpandable'];

        // Створюємо новий об'єкт пропсів без проблемних атрибутів
        const filteredProps = Object.keys(props).reduce((acc, key) => {
            if (!problematicProps.includes(key)) {
                acc[key] = props[key];
            }
            return acc;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }, {} as any);

        return <SwapWidget {...filteredProps} />;
    };
}, {
    ssr: true,
    loading: () => <AiOutlineLoading3Quarters className="animate-spin"/>,
});

const UNI = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984";

export function UniswapWidget() {
    const [events, setEvents] = useState<Event[]>([]);
    const [showEventFeed, setShowEventFeed] = useState<boolean>(false);
    const [selectedChainId, setSelectedChainId] = useState<number | undefined>(undefined);

    const createEventHandler = useCallback(
        (name: string) => (...data: unknown[]) => {
            const newEvent = {
                name,
                data,
                timestamp: Date.now()
            };
            setEvents((prevEvents) => [newEvent, ...prevEvents]);
            console.log(`Event: ${name}`, data);
        },
        []
    );

    const defaultNetwork = useOption('defaultChainId', {
        options: Object.keys(CHAIN_NAMES_TO_IDS),
        defaultValue: 'mainnet',
    })
    const defaultChainId = defaultNetwork ? CHAIN_NAMES_TO_IDS[defaultNetwork] : SupportedChainId.MAINNET;

    // Використовуємо defaultChainId як початкове значення для selectedChainId
    useEffect(() => {
        setSelectedChainId(defaultChainId);
    }, [defaultChainId]);

    const { provider, isConnected, connectWallet, chainId } = useProviders();
    const { connectWallet: authConnectWallet } = useAuth();

    // Підключаємо гаманець автоматично, якщо віджет завантажився, а гаманець ще не підключений
    useEffect(() => {
        const autoConnectWallet = async () => {
            if (!isConnected) {
                console.log("Автоматичне підключення гаманця для Uniswap віджета");
                await connectWallet();
            }
        };

        // Перевіряємо, чи користувач вже авторизований
        if (localStorage.getItem("isLoggedIn") === "true") {
            autoConnectWallet();
        }
    }, [isConnected, connectWallet]);

    // Оновлюємо selectedChainId, коли змінюється chainId у провайдері
    useEffect(() => {
        if (chainId) {
            setSelectedChainId(chainId);
        }
    }, [chainId]);

    const onTxSuccess = (tx: unknown) => {
        // Додаткова логіка для успішних транзакцій
        console.log('Транзакція успішна:', tx);
        addEvent('onTxSuccess', [tx]);
    };

    const onConnectWalletClick = async () => {
        addEvent('onConnectWalletClick', []);
        await authConnectWallet();
    };
    const addEvent = (name: string, data: unknown[]) => {
        setEvents((events) => [
            { name, data, timestamp: Date.now() },
            ...events,
        ]);
    };

    const clearEvents = () => {
        setEvents([]);
    };

    const eventHandlers = HANDLERS.reduce((handlers, name) => ({
        ...handlers,
        [name]: createEventHandler(name)
    }), {});

    const widgetConfig = {
        permit2: true,
        brandedFooter: true,
        dialogOptions: {
            pageCentered: false,
        },
        routerUrl: 'https://api.uniswap.org/v1/',
        width: '100%',
    };
    return (
        <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ flex: '1 1 360px', minWidth: '360px' }}>
                    <FilteredSwapWidget
                        provider={provider}
                        onTxSuccess={onTxSuccess}
                        onConnectWalletClick={onConnectWalletClick}
                        jsonRpcUrlMap={JSON_RPC_URL}
                        tokenList={TOKEN_LIST}
                        defaultInputTokenAddress="NATIVE"
                        defaultInputAmount="1"
                        defaultOutputTokenAddress={UNI}
                        theme={darkTheme}
                        chainId={selectedChainId}
                        {...widgetConfig}
                        {...eventHandlers}
                    />
                </div>

                <div style={{ display: 'none', justifyContent: 'center', marginTop: '10px' }}>
                    <button
                        onClick={() => setShowEventFeed(!showEventFeed)}
                        className="event-feed-button"
                        style={{
                            backgroundColor: '#4D78FF',
                            color: 'black',
                            border: 'none',
                            borderRadius: '20px',
                            padding: '10px 20px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: '500',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        {showEventFeed ? 'Hide Event Feed' : 'Show Event Feed'}
                    </button>
                </div>

                {showEventFeed && (
                    <div style={{ flex: '1 1 360px', minWidth: '360px', marginTop: '10px' }}>
                        <EventFeed
                            events={events}
                            onClear={clearEvents}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
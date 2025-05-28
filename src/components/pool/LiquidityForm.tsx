import React, { useState, useEffect } from "react";
import Image from "next/image";
import tokenList from "../../data/pool_tokens.json";
import "./LiquidityForm.css";
import { fetchTokenBalances, addLiquidity, addLiquidityETH  } from "@/services/liquidityService";
import {useProviders} from "@/components/uniswap/useProviders";

interface Token {
    name: string;
    symbol: string;
    address: string;
    decimals: number;
    chainId: number;
    logoURI: string;
}

interface TokenSelectorProps {
    selectedToken: Token;
    onSelectToken: (token: Token) => void;
    tokens: Token[];
    side: "left" | "right";
}

// Додаємо інтерфейс для статусу операції
export interface LiquidityStatus {
  type: 'success' | 'error' | 'info';
  message: string;
  details?: string;
}

interface LiquidityFormProps {
  onStatusChange?: (status: LiquidityStatus | null) => void;
}

// Function to get token logo path
const getTokenLogoPath = (token: Token): string => {
    const path = `/token_logos/${token.symbol}.png`;
    console.log(`Loading token logo from: ${path}`);
    return path;
};

const TokenSelector: React.FC<TokenSelectorProps> = ({ selectedToken, onSelectToken, tokens, side }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredTokens = tokens.filter(token =>
        token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="token-selector">
            <button
                className="token-selector-button"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="token-selector-content">
                    <Image
                        src={getTokenLogoPath(selectedToken)}
                        alt={selectedToken.symbol}
                        width={24}
                        height={24}
                        className="token-logo"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = "/token_logos/default.png";
                        }}
                    />
                    <span className="token-symbol">{selectedToken.symbol}</span>
                </div>
                <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </button>

            {isOpen && (
                <div className={`token-dropdown ${side === "left" ? "left" : "right"}`}>
                    <div className="token-search">
                        <input
                            type="text"
                            placeholder="Token Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="token-list">
                        {filteredTokens.map((token) => (
                            <div
                                key={token.address}
                                className="token-item"
                                onClick={() => {
                                    onSelectToken(token);
                                    setIsOpen(false);
                                }}
                            >
                                <Image
                                    src={getTokenLogoPath(token)}
                                    alt={token.symbol}
                                    width={24}
                                    height={24}
                                    className="token-logo"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = "/token_logos/default.png";
                                    }}
                                />
                                <div className="token-info">
                                    <div className="token-symbol">{token.symbol}</div>
                                    <div className="token-name">{token.name}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const LiquidityForm: React.FC<LiquidityFormProps> = ({ onStatusChange }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [token0, setToken0] = useState<Token>(tokenList.find(t => t.symbol === "ETH") || tokenList[0]);
    const [token1, setToken1] = useState<Token>(tokenList.find(t => t.symbol === "USDT") || tokenList[1]);
    const [amount0, setAmount0] = useState("");
    const [amount1, setAmount1] = useState("");
    const [marketPrice, setMarketPrice] = useState("2668.03");
    const [tokenBalances, setTokenBalances] = useState<Record<string, string>>({});
    const [isProcessing, setIsProcessing] = useState(false);
    const { provider } = useProviders();

    // Function to get token balance
    const getTokenBalance = (symbol: string) => {
        return tokenBalances[symbol] || '0.00';
    };

    const handleStart = async () => {
        if (!amount0 || !amount1) {
            onStatusChange?.({
                type: 'error',
                message: 'Invalid input',
                details: 'Please enter valid amounts for both tokens.'
            });
            return;
        }

        setIsProcessing(true);
        
        try {
            if (!provider) {
                throw new Error("No provider available. Please connect your wallet.");
            }

            const signer = provider.getSigner();
            const userAddress = await signer.getAddress();

            // Check if one of the tokens is ETH
            const isToken0ETH = token0.symbol === "ETH";
            const isToken1ETH = token1.symbol === "ETH";

            let result;

            // If one of the tokens is ETH, use addLiquidityETH
            if (isToken0ETH || isToken1ETH) {
                // Determine which token is ETH and which is the ERC20 token
                const ethAmount = isToken0ETH ? amount0 : amount1;
                const tokenAmount = isToken0ETH ? amount1 : amount0;
                const tokenAddress = isToken0ETH ? token1.address : token0.address;

                result = await addLiquidityETH(
                    {
                        tokenAddress,
                        tokenAmount,
                        ethAmount,
                        recipient: userAddress
                    },
                    provider
                );
            } else {
                // If neither token is ETH, use the regular addLiquidity function
                result = await addLiquidity(
                    {
                        token0: token0.symbol,
                        token1: token1.symbol,
                        amount0,
                        amount1,
                        recipient: userAddress
                    },
                    provider
                );
            }

            console.log("Liquidity provision started:", result);
            onStatusChange?.({
                type: 'success',
                message: 'Liquidity provision successful',
                details: JSON.stringify(result)
            });

        } catch (error) {
            console.error("Error starting liquidity provision:", error);            
            onStatusChange?.({
                type: 'error',
                message: 'Error starting liquidity provision',
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                details: error.message
            });
        } finally {
            setIsProcessing(false);
        }
    };

    // Fetch token balances
    useEffect(() => {
        const fetchBalances = async () => {
            try {
                // Use the service function to get real balances
                const tokenAddresses = {
                    [token0.symbol]: token0.address,
                    [token1.symbol]: token1.address
                };

                if (provider && provider.getSigner) {
                    const account = await provider.getSigner().getAddress();
                    const balances = await fetchTokenBalances(tokenAddresses, provider, account);
                    setTokenBalances(balances);
                }
            } catch (error) {
                console.error("Error fetching token balances:", error);
                // Fallback to empty balances in case of error
                setTokenBalances({});
            }
        };

        fetchBalances();
    }, [token0, token1, provider]);

    // Симуляція отримання ринкової ціни
    useEffect(() => {
        const fetchPrice = async () => {
            if (token0.symbol === "ETH" && token1.symbol === "USDT") {
                const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usdt");
                const data = await res.json();
                setMarketPrice(data.ethereum.usdt.toString());
            } else {
                setMarketPrice("0.00");
            }
        };

        fetchPrice();
    }, [token0, token1]);


    const handleContinue = () => {
        if (currentStep === 1) {
            setCurrentStep(2);
        } else {
            console.log("Adding liquidity", {
                token0, token1, amount0, amount1
            });
        }
    };

    const handleBack = () => {
        if (currentStep === 2) {
            setCurrentStep(1);
        }
    };

    const handleSwapTokens = () => {
        const temp = token0;
        setToken0(token1);
        setToken1(temp);
    };

    return (
        <div className="liquidity-form">
            {currentStep === 1 ? (
                <div className="step-content">
                    <div className="step-header">
                        <h2>Choose pair</h2>
                        <p>Select the tokens you want to provide liquidity for.</p>
                    </div>

                    <div className="token-selectors">
                        <div className="token-selector-wrapper">
                            <TokenSelector
                                selectedToken={token0}
                                onSelectToken={setToken0}
                                tokens={tokenList}
                                side="left"
                            />
                        </div>

                        <button className="swap-tokens-button" onClick={handleSwapTokens} aria-label="Swap tokens">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 4L8 0L4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M4 12L8 16L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M8 0V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>

                        <div className="token-selector-wrapper">
                            <TokenSelector
                                selectedToken={token1}
                                onSelectToken={setToken1}
                                tokens={tokenList}
                                side="right"
                            />
                        </div>
                    </div>

                    <div className="fee-level">
                        <h3>Commission level</h3>
                        <p>The amount earned for providing liquidity. All v2 pools have a flat fee of 0.3%.</p>
                    </div>

                    <button className="continue-button" onClick={handleContinue}>
                        Continue
                    </button>
                </div>
            ) : (
                <div className="step-content">
                    <div className="pair-info">
                        <div className="pair-tokens">
                            <div className="token-icons">
                                <Image
                                    src={getTokenLogoPath(token0)}
                                    alt={token0.symbol}
                                    width={32}
                                    height={32}
                                    className="token-logo"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = "/token_logos/default.png";
                                    }}
                                />
                                <Image
                                    src={getTokenLogoPath(token1)}
                                    alt={token1.symbol}
                                    width={32}
                                    height={32}
                                    className="token-logo second"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = "/token_logos/default.png";
                                    }}
                                />
                            </div>
                            <div className="pair-name">
                                {token0.symbol} / {token1.symbol}
                                <span className="fee-badge">v2 0.3%</span>
                            </div>
                        </div>
                        <div className="market-price">
                            Market price: {marketPrice} {token1.symbol} = 1 {token0.symbol} ({Number(marketPrice).toFixed(2)} $)
                        </div>
                    </div>

                    <div className="deposit-section">
                        <h3>Deposit tokens</h3>
                        <p>Please enter the token amounts for your liquidity contribution.</p>

                        <div className="input-container">
                            <input
                                type="number"
                                value={amount0}
                                onChange={(e) => setAmount0(e.target.value)}
                                placeholder="0"
                                className="token-amount-input"
                            />
                            <div className="token-indicator">
                                <Image
                                    src={getTokenLogoPath(token0)}
                                    alt={token0.symbol}
                                    width={24}
                                    height={24}
                                    className="token-logo"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = "/token_logos/default.png";
                                    }}
                                />
                                <span>{token0.symbol}</span>
                            </div>
                            <div className="balance-indicator">
                                {getTokenBalance(token0.symbol)} {token0.symbol}
                            </div>
                        </div>

                        <div className="input-container">
                            <input
                                type="number"
                                value={amount1}
                                onChange={(e) => setAmount1(e.target.value)}
                                placeholder="0"
                                className="token-amount-input"
                            />
                            <div className="token-indicator">
                                <Image
                                    src={getTokenLogoPath(token1)}
                                    alt={token1.symbol}
                                    width={24}
                                    height={24}
                                    className="token-logo"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = "/token_logos/default.png";
                                    }}
                                />
                                <span>{token1.symbol}</span>
                            </div>
                            <div className="balance-indicator">
                                {getTokenBalance(token1.symbol)} {token1.symbol}
                            </div>
                        </div>

                        <button className="max-button" onClick={handleStart} disabled={isProcessing}> 
                            Continue
                        </button>
                        <button className="continue-button" onClick={handleBack}>
                            Back
                        </button>
                    </div>
                </div>
            )}

            <div className="steps-indicator">
                <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
                    <div className="step-number">1</div>
                    <div className="step-text">
                        <div className="step-title">Step 1</div>
                        <div className="step-description">Select a pair of tokens and fees</div>
                    </div>
                </div>
                <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
                    <div className="step-number">2</div>
                    <div className="step-text">
                        <div className="step-title">Step 2</div>
                        <div className="step-description">Enter the deposit amount</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiquidityForm;
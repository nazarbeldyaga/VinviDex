/**
 * List of all the networks supported by the Uniswap Interface
 */
export enum SupportedChainId {
    MAINNET = 1,

    ARBITRUM_ONE = 42161,

    OPTIMISM = 10,

    POLYGON = 137,

    BNB = 56,

    BASE = 8453,
}

export enum ChainName {
    MAINNET = 'mainnet',
    OPTIMISM = 'optimism-mainnet',
    ARBITRUM_ONE = 'arbitrum-mainnet',
    POLYGON = 'polygon-mainnet',
    BNB = 'bnb',
    BASE = 'base',
}

export const CHAIN_NAMES_TO_IDS: { [chainName: string]: SupportedChainId } = {
    [ChainName.MAINNET]: SupportedChainId.MAINNET,
    [ChainName.POLYGON]: SupportedChainId.POLYGON,
    [ChainName.ARBITRUM_ONE]: SupportedChainId.ARBITRUM_ONE,
    [ChainName.OPTIMISM]: SupportedChainId.OPTIMISM,
    [ChainName.BNB]: SupportedChainId.BNB,
    [ChainName.BASE]: SupportedChainId.BASE,
}

/**
 * Array of all the supported chain IDs
 */
export const ALL_SUPPORTED_CHAIN_IDS: SupportedChainId[] = Object.values(SupportedChainId).filter(
    (id) => typeof id === 'number'
) as SupportedChainId[]

export const SUPPORTED_GAS_ESTIMATE_CHAIN_IDS = [
    SupportedChainId.MAINNET,
    SupportedChainId.POLYGON,
    SupportedChainId.OPTIMISM,
    SupportedChainId.ARBITRUM_ONE,
    SupportedChainId.BNB,
    SupportedChainId.BASE,
]

/**
 * All the chain IDs that are running the Ethereum protocol.
 */
export const L1_CHAIN_IDS = [
    SupportedChainId.MAINNET,
    SupportedChainId.POLYGON
] as const

export type SupportedL1ChainId = typeof L1_CHAIN_IDS[number]

/**
 * Controls some L2 specific behavior, e.g. slippage tolerance, special UI behavior.
 * The expectation is that all of these networks have immediate transaction confirmation.
 */
export const L2_CHAIN_IDS = [
    SupportedChainId.ARBITRUM_ONE,
    SupportedChainId.OPTIMISM,
    SupportedChainId.BASE,
] as const

export type SupportedL2ChainId = typeof L2_CHAIN_IDS[number]

export function isPolygonChain(chainId: number): chainId is SupportedChainId.POLYGON{
    return chainId === SupportedChainId.POLYGON
}
import type { NextConfig } from 'next';

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                "protocol": "https",
                "hostname": "assets.coingecko.com"
            },
            {
                "protocol": "https",
                "hostname": "coin-images.coingecko.com"
            },
            {
                "protocol": "https",
                "hostname": "arbitrum.foundation"
            },
            {
                "protocol": "https",
                "hostname": "raw.githubusercontent.com"
            },
            {
                "protocol": "https",
                "hostname": "s2.coinmarketcap.com"
            },
            {
                "protocol": "https",
                "hostname": "assets.kraken.com"
            },
            {
                "protocol": "https",
                "hostname": "ethereum-optimism.github.io"
            },
            {
                "protocol": "https",
                "hostname": "basescan.org"
            },
            {
                "protocol": "https",
                "hostname": "dynamic-assets.coinbase.com"
            }
        ],
    },

    webpack: (config) => {
        config.resolve = {
            ...config.resolve,
            fallback: {
                ...config.resolve?.fallback,
                fs: false,
            },
        };
        return config;
    },

    transpilePackages: [
        '@uniswap/widgets',
        '@uniswap/conedison',
    ],
};

export default nextConfig;

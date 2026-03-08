"use client";

import "@rainbow-me/rainbowkit/styles.css";
import {
    getDefaultConfig,
    RainbowKitProvider,
    darkTheme,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import {
    arbitrumSepolia,
    hardhat,
    sepolia,
} from "wagmi/chains";
import {
    QueryClientProvider,
    QueryClient,
} from "@tanstack/react-query";
import { ReactNode } from "react";
import { defineChain } from "viem";

// RPC URL from env (update in .env when Tenderly vnet expires)
const TENDERLY_RPC = process.env.NEXT_PUBLIC_TENDERLY_RPC
    || "https://virtual.sepolia.eu.rpc.tenderly.co/7611135a-8515-41d7-8146-9390be57f949";

const tenderlySepolia = defineChain({
    id: 99911155111,
    name: "Tenderly Sepolia",
    nativeCurrency: { name: "Sepolia Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: {
        // Multiple fallbacks: Tenderly first, then public Sepolia
        default: { http: [TENDERLY_RPC] },
        public: { http: ["https://rpc.sepolia.ethpandaops.io", "https://ethereum-sepolia-rpc.publicnode.com"] },
    },
    blockExplorers: {
        default: { name: "Tenderly", url: "https://dashboard.tenderly.co" },
    },
});

const config = getDefaultConfig({
    appName: "PrivaCRE",
    // Use env var for WalletConnect project ID (get free one at https://cloud.walletconnect.com)
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "3fbb6bba6f1de962d911bb5b5c9dba88",
    chains: [tenderlySepolia, arbitrumSepolia, sepolia, hardhat],
    ssr: true,
});

const queryClient = new QueryClient();

export function Web3Provider({ children }: { children: ReactNode }) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider theme={darkTheme({
                    accentColor: '#0df26c',
                    borderRadius: 'medium',
                })}>
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}

"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createConfig, http, WagmiProvider } from "wagmi";
import { sepolia } from "viem/chains";
import { ReactNode } from "react";
import { PermissionProvider } from "@/providers/PermissionProvider";
import { SessionAccountProvider } from "./SessionAccountProvider";
import { OmniShieldProvider } from "./OmniShieldProvider";

// Create a minimal wagmi config without any connectors to avoid crypto issues
// Users can still connect via window.ethereum directly
export const connectors: any[] = [];

const queryClient = new QueryClient();

export const wagmiConfig = createConfig({
    chains: [sepolia],
    connectors,
    multiInjectedProviderDiscovery: false,
    ssr: true,
    transports: {
        [sepolia.id]: http(process.env.NEXT_PUBLIC_RPC_URL),
    },
});

export function AppProvider({ children }: { children: ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <WagmiProvider config={wagmiConfig}>
                <SessionAccountProvider>
                    <PermissionProvider>
                        <OmniShieldProvider>
                            {children}
                        </OmniShieldProvider>
                    </PermissionProvider>
                </SessionAccountProvider>
            </WagmiProvider>
        </QueryClientProvider>
    );
}
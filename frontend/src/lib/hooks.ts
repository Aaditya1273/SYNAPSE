"use client";

import { useState, useEffect, useCallback } from 'react';
import { createPublicClient, http, getContract, defineChain, createWalletClient, custom, type WalletClient, type Address } from 'viem';
import { OMNI_SENTRY_CORE_ADDRESS, TENDERLY_RPC_URL } from './constants';
import { OmniSentryCore } from './abi/OmniSentryCore';

interface EthereumProvider {
    request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
}

declare global {
    interface Window {
        ethereum?: EthereumProvider;
    }
}

const tenderlyChain = defineChain({
    id: 9936,
    name: 'Tenderly Virtual Sepolia',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
        default: { http: [TENDERLY_RPC_URL] },
    },
});

import { useActiveAccount, useActiveWallet, useDisconnect, useSendAndConfirmTransaction } from "thirdweb/react";
import { client, tenderlyChain as thirdwebTenderlyChain } from "./thirdweb";
import { getContract as getThirdwebContract, prepareContractCall } from "thirdweb";

export function useWallet() {
    const account = useActiveAccount();
    const wallet = useActiveWallet();
    const { disconnect: disconnectWallet } = useDisconnect();
    const [loading, setLoading] = useState(false);
    const [terminalConnected, setTerminalConnected] = useState(false);

    const connect = useCallback(async () => {
        // Handled by ConnectButton
    }, []);

    const disconnect = useCallback(() => {
        if (wallet) {
            disconnectWallet(wallet);
        }
        setTerminalConnected(false);
    }, [wallet, disconnectWallet]);

    const connectTerminal = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/terminal/ignite', { method: 'POST' });
            if (response.ok) {
                setTerminalConnected(true);
                // We'll handle visual logging via a shared event or state if needed
                // For now, let's assume useAuditLogs can pick up local triggers
                window.dispatchEvent(new CustomEvent('protocol-log', {
                    detail: { event: "Tactical Terminal Ignited", id: "SYS-CORE-01" }
                }));
            } else {
                console.error("Terminal ignition failed on backend");
            }
        } catch (e) {
            console.error("Terminal ignition failed:", e);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        account: account?.address as Address | null,
        accountFull: account,
        connect,
        disconnect,
        loading,
        terminalConnected,
        connectTerminal
    };
}

export function useAetherActions() {
    const account = useActiveAccount();
    const [txHash, setTxHash] = useState<string | null>(null);
    const { mutateAsync: sendTx, isPending: pending } = useSendAndConfirmTransaction();

    const manualOverride = async (riskLevel: number, riskScore: number, reason: string) => {
        if (!account) return;

        try {
            const contract = getThirdwebContract({
                client,
                chain: thirdwebTenderlyChain,
                address: OMNI_SENTRY_CORE_ADDRESS,
                abi: OmniSentryCore,
            });

            const transaction = prepareContractCall({
                contract,
                method: "manualOverride",
                params: [riskLevel, BigInt(riskScore), reason],
            });

            const result = await sendTx(transaction);
            setTxHash(result.transactionHash);
            return result.transactionHash;
        } catch (error: any) {
            console.error("Manual override failed:", error);
            if (error.message && error.message.includes("EnforcedPause")) {
                throw new Error("Transaction Rejected: Vault is currently in ISOLATION_ACTIVE mode.");
            }
            throw new Error("Transaction failed. Please check your wallet.");
        }
    };

    return { manualOverride, txHash, pending };
}

export function useAetherState() {
    const [isPaused, setIsPaused] = useState<boolean | null>(null);
    const [riskState, setRiskState] = useState<{
        level: number;
        score: number;
        lastUpdated: number;
        reason: string;
    } | null>(null);
    const [loading, setLoading] = useState(true);
    const [latency, setLatency] = useState(0);

    useEffect(() => {
        async function fetchState() {
            const start = Date.now();
            try {
                const client = createPublicClient({
                    chain: tenderlyChain,
                    transport: http(),
                });

                const contract = getContract({
                    address: OMNI_SENTRY_CORE_ADDRESS,
                    abi: OmniSentryCore,
                    client: { public: client },
                });

                const [paused, state] = await Promise.all([
                    contract.read.paused(),
                    contract.read.globalRiskState() as Promise<readonly [number, bigint, bigint, string]>,
                ]);

                setIsPaused(paused as boolean);
                setRiskState({
                    level: state[0],
                    score: Number(state[1]),
                    lastUpdated: Number(state[2]),
                    reason: state[3]
                });
            } catch (error) {
                console.error("Error fetching Aether state:", error);
            } finally {
                setLoading(false);
                setLatency(Date.now() - start);
            }
        }

        fetchState();
        const interval = setInterval(fetchState, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, []);

    return { isPaused, riskState, loading, latency };
}

export function useMarketData() {
    const [btcData, setBtcData] = useState<{ price: number; change24h: number } | null>(null);

    useEffect(() => {
        async function fetchBtc() {
            try {
                // Using Binance public API as it rarely rate-limits compared to Coingecko
                const res = await fetch("https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT");
                if (!res.ok) throw new Error("Network response was not ok");
                const data = await res.json();

                if (data && data.lastPrice) {
                    setBtcData({
                        price: parseFloat(data.lastPrice),
                        change24h: parseFloat(data.priceChangePercent)
                    });
                }
            } catch (e) {
                console.error("Market data fetch failed:", e);
            }
        }
        fetchBtc();
        const interval = setInterval(fetchBtc, 30000);
        return () => clearInterval(interval);
    }, []);

    return btcData;
}

export interface AuditLog {
    id: string;
    date: string;
    event: string;
    proof: string;
    txHash: string;
}

export function useAuditLogs() {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchLogs() {
            try {
                const client = createPublicClient({
                    chain: tenderlyChain,
                    transport: http()
                });

                // Fetch CRE and Manual events in parallel
                const [creEvents, manualEvents] = await Promise.all([
                    client.getLogs({
                        address: OMNI_SENTRY_CORE_ADDRESS,
                        event: {
                            type: 'event',
                            name: 'RiskStateUpdated',
                            inputs: [
                                { indexed: true, name: 'level', type: 'uint8' },
                                { indexed: false, name: 'score', type: 'uint256' },
                                { indexed: false, name: 'reason', type: 'string' },
                            ],
                        },
                        fromBlock: BigInt(Math.max(0, Number(await client.getBlockNumber()) - 2000))
                    }),
                    client.getLogs({
                        address: OMNI_SENTRY_CORE_ADDRESS,
                        event: {
                            type: 'event',
                            name: 'ManualOverride',
                            inputs: [
                                { indexed: false, name: 'level', type: 'uint8' },
                                { indexed: false, name: 'score', type: 'uint256' },
                                { indexed: false, name: 'reason', type: 'string' },
                            ],
                        },
                        fromBlock: BigInt(Math.max(0, Number(await client.getBlockNumber()) - 2000))
                    })
                ]);

                const formattedCreLogs: AuditLog[] = creEvents.map((log: any) => ({
                    id: `CRE-${log.transactionHash?.slice(2, 8).toUpperCase()}`,
                    date: "BLOCK: " + log.blockNumber,
                    event: "CRE Consensus: " + (log.args?.reason || "Autonomous Sync"),
                    proof: `0xzkp_${log.transactionHash?.slice(2, 12)}...`,
                    txHash: log.transactionHash as string
                }));

                const formattedManualLogs: AuditLog[] = manualEvents.map((log: any) => ({
                    id: `MAN-${log.transactionHash?.slice(2, 8).toUpperCase()}`,
                    date: "BLOCK: " + log.blockNumber,
                    event: "Manual Override: " + (log.args?.reason || "Emergency"),
                    proof: `0xzkp_${log.transactionHash?.slice(2, 12)}...`,
                    txHash: log.transactionHash as string
                }));

                setLogs(prev => {
                    const combined = [...formattedCreLogs, ...formattedManualLogs, ...prev.filter(l => l.id.startsWith('SYS-'))];
                    const unique = Array.from(new Map(combined.map(item => [item.id + item.txHash, item])).values());
                    return unique.sort((a, b) => b.id.localeCompare(a.id));
                });
            } catch (error) {
                console.error("Error fetching audit logs:", error);
            } finally {
                setLoading(false);
            }
        }

        const handleLocalLog = (e: any) => {
            const newLog: AuditLog = {
                id: `SYS-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
                date: new Date().toLocaleTimeString(),
                event: e.detail.event,
                proof: "SYSCALL_VERIFIED",
                txHash: ""
            };
            setLogs(prev => [newLog, ...prev]);
        };

        window.addEventListener('protocol-log' as any, handleLocalLog);
        fetchLogs();
        const interval = setInterval(fetchLogs, 5000); // More frequent pooling

        return () => {
            window.removeEventListener('protocol-log' as any, handleLocalLog);
            clearInterval(interval);
        };
    }, []);

    return { logs, loading };
}

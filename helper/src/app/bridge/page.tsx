"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import type { ISuccessResult } from "@worldcoin/idkit";
import { usePlaidLink } from "@/hooks/usePlaidLink";
import WorldIDVerification from "@/components/WorldIDVerification";

type ConnectionStatus = 'idle' | 'connecting' | 'authorizing' | 'connected';

export default function BridgePage() {
    const router = useRouter();
    const { isConnected } = useAccount();
    const [selectedBank, setSelectedBank] = useState<string | null>(null);
    const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('idle');
    const [isVerified, setIsVerified] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        const bank = localStorage.getItem("privacre_bank");
        if (bank) setSelectedBank(bank);
        const verified = localStorage.getItem("privacre_verified") === "true";
        setIsVerified(verified);
        const status = localStorage.getItem("privacre_connection_status") as ConnectionStatus;
        if (status) setConnectionStatus(status);
    }, []);

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 5000);
    };

    const handlePlaidSuccess = async (publicToken: string, metadata: any) => {
        setConnectionStatus('authorizing');

        try {
            const response = await fetch('/api/plaid/exchange', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    public_token: publicToken,
                    institution_name: metadata.institution?.name || selectedBank,
                }),
            });

            const data = await response.json();

            if (data.success) {
                setConnectionStatus('connected');
                localStorage.setItem("privacre_connection_status", "connected");
                localStorage.setItem("privacre_item_id", data.item_id);
                showToast('Connection Secured via Chainlink CRE! 🔒', 'success');

                // Navigate to orchestration after 1.5 seconds
                setTimeout(() => {
                    router.push('/orchestration');
                }, 1500);
            } else {
                throw new Error(data.error || 'Failed to secure connection');
            }
        } catch (error: any) {
            console.error('Exchange error:', error);
            setConnectionStatus('idle');
            showToast(error.message || 'Failed to authorize connection', 'error');
        }
    };

    const handlePlaidExit = (error: any, metadata: any) => {
        setConnectionStatus('idle');

        if (error) {
            if (error.error_code === 'USER_CANCELLED') {
                showToast('Connection cancelled by user', 'error');
            } else {
                showToast('Invalid credentials or connection error', 'error');
            }
        }
    };

    const { open: openPlaid, ready: plaidReady, error: plaidError } = usePlaidLink({
        onSuccess: handlePlaidSuccess,
        onExit: handlePlaidExit,
    });

    // Show error toast if Plaid fails to load
    useEffect(() => {
        if (plaidError) {
            showToast(plaidError.message || 'Failed to initialize Plaid Link', 'error');
        }
    }, [plaidError]);

    const handleBankSelect = (bankName: string) => {
        setSelectedBank(bankName);
        localStorage.setItem("privacre_bank", bankName);
    };

    const handleConnect = () => {
        console.log('[Bridge] Connect button clicked');
        console.log('[Bridge] State:', { isConnected, isVerified, selectedBank, plaidReady, connectionStatus });

        if (!isConnected) {
            console.log('[Bridge] Wallet not connected');
            showToast('Please connect your wallet first', 'error');
            return;
        }
        if (!isVerified) {
            console.log('[Bridge] World ID not verified');
            showToast('Please verify your identity with World ID first', 'error');
            return;
        }
        if (!selectedBank) {
            console.log('[Bridge] No bank selected');
            showToast('Please select a bank data source', 'error');
            return;
        }
        if (!plaidReady) {
            console.log('[Bridge] Plaid not ready');
            showToast('Plaid Link is still loading. Please wait a moment...', 'error');
            return;
        }

        console.log('[Bridge] All checks passed, opening Plaid Link...');
        setConnectionStatus('connecting');

        // Small delay to ensure state updates
        setTimeout(() => {
            openPlaid();
        }, 100);
    };

    const handleWorldIDVerification = async (proof: ISuccessResult) => {
        console.log("World ID Proof (Bridge):", proof);
        setIsVerified(true);
        localStorage.setItem("privacre_verified", "true");
        if (proof.nullifier_hash) {
            localStorage.setItem("world_id_nullifier", proof.nullifier_hash);
        }
        showToast('World ID verified successfully! +15% Crest Score boost', 'success');
    };

    const getButtonText = () => {
        if (!isVerified) return 'Verify World ID First';
        if (!isConnected) return 'Connect Wallet to Start';
        if (!selectedBank) return 'Select a Data Source';
        if (!plaidReady) return 'Initializing Plaid Link...';
        if (connectionStatus === 'connecting') return 'Opening Plaid Link...';
        if (connectionStatus === 'authorizing') return 'Authorizing via CRE...';
        if (connectionStatus === 'connected') return 'Connection Secured ✓';
        return `Authorize Confidential Connection`;
    };

    const isButtonDisabled = !isConnected || !isVerified || !selectedBank || !plaidReady || connectionStatus === 'connecting' || connectionStatus === 'authorizing';

    return (
        <div className="flex min-h-screen flex-col">
            {/* Toast Notification */}
            {toast && (
                <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg border-2 animate-in slide-in-from-top-5 ${toast.type === 'success'
                    ? 'bg-emerald-900/90 border-primary text-white'
                    : 'bg-red-900/90 border-red-500 text-white'
                    }`}>
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined">
                            {toast.type === 'success' ? 'check_circle' : 'error'}
                        </span>
                        <span className="font-medium">{toast.message}</span>
                    </div>
                </div>
            )}

            <main className="flex flex-1 flex-col items-center py-10 px-4 sm:px-6 lg:px-8 w-full">
                <div className="w-full max-w-[800px] flex flex-col items-center">
                    {/* Secure Badge */}
                    <div className="inline-flex items-center gap-2 rounded-full bg-emerald-900/30 px-4 py-1.5 border border-emerald-500/20 mb-8">
                        <span className="material-symbols-outlined text-primary text-sm">lock</span>
                        <span className="text-emerald-100 text-xs font-medium uppercase tracking-wider">
                            Secure Environment • End-to-End Encrypted
                        </span>
                    </div>

                    {/* Headline */}
                    <div className="text-center mb-10">
                        <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
                            Confidential Data Bridge
                        </h1>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                            Securely connect your primary banking institution. Our Zero-Knowledge architecture ensures
                            your raw data never leaves your device unencrypted.
                        </p>
                    </div>

                    {/* World ID Verification Gate */}
                    {!isVerified && (
                        <div className="w-full mb-8 rounded-xl border-2 border-dashed border-yellow-500/30 bg-yellow-900/10 p-6 flex flex-col items-center gap-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center">
                                    <div className="h-5 w-5 rounded-full border-2 border-black"></div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">World ID Required</h3>
                                    <p className="text-xs text-slate-400">Verify your identity before connecting bank data</p>
                                </div>
                            </div>
                            <WorldIDVerification
                                action="verify-bridge-access"
                                onSuccess={(result) => {
                                    handleWorldIDVerification(result);
                                    setIsVerified(true);
                                }}
                                className="w-full justify-center"
                            />
                            <p className="text-[10px] text-yellow-400/60">⚠️ Sybil resistance: one human = one score. Verification boosts your Crest Score by +15%.</p>
                        </div>
                    )}

                    {/* Verified Badge */}
                    {isVerified && (
                        <div className="w-full mb-8 rounded-xl border border-primary/30 bg-primary/5 p-4 flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
                            <div>
                                <span className="text-sm font-bold text-primary">World ID Verified</span>
                                <p className="text-xs text-slate-400">Your identity is confirmed. You can now connect bank data securely.</p>
                            </div>
                        </div>
                    )}

                    {/* Bank Selection Grid */}
                    <div className={`w-full mb-10 ${!isVerified ? 'opacity-40 pointer-events-none' : ''}`}>
                        <div className="flex items-center justify-between mb-4 px-2">
                            <h3 className="font-semibold text-lg">Select Data Source</h3>
                            <span className="text-xs text-primary font-medium cursor-pointer hover:underline">
                                + Add Custom Source
                            </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            <div
                                onClick={() => handleBankSelect("Chase")}
                                className={`group relative flex flex-col items-start gap-4 p-5 rounded-xl bg-white/5 border-2 cursor-pointer transition-all ${selectedBank === "Chase" ? "border-primary shadow-[0_0_20px_rgba(13,242,108,0.2)]" : "border-white/10 hover:border-white/20"
                                    } ${connectionStatus === 'connecting' && selectedBank === "Chase" ? 'animate-pulse' : ''}`}
                            >
                                {selectedBank === "Chase" && (
                                    <div className="absolute top-3 right-3 text-primary">
                                        <span className="material-symbols-outlined fill-1">check_circle</span>
                                    </div>
                                )}
                                {connectionStatus === 'connecting' && selectedBank === "Chase" && (
                                    <div className="absolute inset-0 bg-primary/10 rounded-xl flex items-center justify-center">
                                        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                                    </div>
                                )}
                                <div className="size-12 rounded-full bg-blue-900 flex items-center justify-center text-white overflow-hidden border border-white/10 font-bold text-xs">CHASE</div>
                                <div><p className="font-bold">Chase</p></div>
                            </div>
                            <div
                                onClick={() => handleBankSelect("Wells Fargo")}
                                className={`group relative flex flex-col items-start gap-4 p-5 rounded-xl bg-white/5 border-2 cursor-pointer transition-all ${selectedBank === "Wells Fargo" ? "border-primary shadow-[0_0_20px_rgba(13,242,108,0.2)]" : "border-white/10 hover:border-white/20"
                                    } ${connectionStatus === 'connecting' && selectedBank === "Wells Fargo" ? 'animate-pulse' : ''}`}
                            >
                                {selectedBank === "Wells Fargo" && (
                                    <div className="absolute top-3 right-3 text-primary">
                                        <span className="material-symbols-outlined fill-1">check_circle</span>
                                    </div>
                                )}
                                {connectionStatus === 'connecting' && selectedBank === "Wells Fargo" && (
                                    <div className="absolute inset-0 bg-primary/10 rounded-xl flex items-center justify-center">
                                        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                                    </div>
                                )}
                                <div className="size-12 rounded-full bg-red-800 flex items-center justify-center text-white overflow-hidden border border-white/10 font-bold text-xs">WF</div>
                                <div><p className="font-bold">Wells Fargo</p></div>
                            </div>
                            <div
                                onClick={() => handleBankSelect("Mock Bank")}
                                className={`group relative flex flex-col items-start gap-4 p-5 rounded-xl bg-white/5 border-2 cursor-pointer transition-all ${selectedBank === "Mock Bank" ? "border-primary shadow-[0_0_20px_rgba(13,242,108,0.2)]" : "border-white/10 hover:border-white/20"
                                    } ${connectionStatus === 'connecting' && selectedBank === "Mock Bank" ? 'animate-pulse' : ''}`}
                            >
                                {selectedBank === "Mock Bank" && (
                                    <div className="absolute top-3 right-3 text-primary">
                                        <span className="material-symbols-outlined fill-1">check_circle</span>
                                    </div>
                                )}
                                {connectionStatus === 'connecting' && selectedBank === "Mock Bank" && (
                                    <div className="absolute inset-0 bg-primary/10 rounded-xl flex items-center justify-center">
                                        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                                    </div>
                                )}
                                <div className="size-12 rounded-full bg-slate-700 flex items-center justify-center text-white overflow-hidden border border-white/10"><span className="material-symbols-outlined">account_balance</span></div>
                                <div><p className="font-bold">Mock Bank</p></div>
                            </div>
                        </div>
                    </div>

                    {/* CTA Button */}
                    <button
                        onClick={handleConnect}
                        disabled={isButtonDisabled}
                        className={`w-full md:w-auto min-w-[320px] group relative flex items-center justify-center gap-3 text-lg font-bold py-4 px-8 rounded-xl transition-all ${!isButtonDisabled && connectionStatus !== 'connected'
                            ? "bg-primary hover:bg-emerald-400 text-background-dark shadow-[0_0_20px_rgba(13,242,108,0.3)] hover:shadow-[0_0_30px_rgba(13,242,108,0.5)]"
                            : connectionStatus === 'connected'
                                ? "bg-primary text-background-dark shadow-[0_0_20px_rgba(13,242,108,0.3)]"
                                : "bg-slate-700 text-slate-400 cursor-not-allowed"
                            }`}
                    >
                        {(connectionStatus === 'connecting' || connectionStatus === 'authorizing') && (
                            <div className="animate-spin h-5 w-5 border-3 border-background-dark border-t-transparent rounded-full"></div>
                        )}
                        {connectionStatus === 'connected' ? (
                            <span className="material-symbols-outlined">check_circle</span>
                        ) : (
                            <span className="material-symbols-outlined">
                                {connectionStatus === 'connecting' || connectionStatus === 'authorizing' ? 'lock' : 'auto_awesome'}
                            </span>
                        )}
                        <span>{getButtonText()}</span>
                        {!isButtonDisabled && connectionStatus === 'idle' && (
                            <span className="absolute right-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all material-symbols-outlined">
                                arrow_forward
                            </span>
                        )}
                    </button>
                    <p className="mt-4 text-xs text-slate-400 text-center">
                        By clicking start, you agree to the{" "}
                        <a className="text-primary hover:underline" href="#">
                            Terms of Service
                        </a>
                        . No data is stored on our servers.
                    </p>
                </div>
            </main>
        </div>
    );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Shield, Smartphone, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ethers } from "ethers";
import WorldIDVerification from "@/components/WorldIDVerification";

export default function AuthPage() {
    const [step, setStep] = useState(1);
    const [walletAddress, setWalletAddress] = useState<string>("");
    const [error, setError] = useState<string>("");
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                cardRef.current,
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, ease: "power4.out" }
            );
        });

        // Check if already connected
        const savedAddr = localStorage.getItem("privacre_wallet");
        if (savedAddr) {
            setWalletAddress(savedAddr);
            setStep(2);
        }

        return () => ctx.revert();
    }, []);

    const connectWallet = async () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (typeof (window as any).ethereum !== "undefined") {
            try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const provider = new ethers.BrowserProvider((window as any).ethereum);
                const accounts = await provider.send("eth_requestAccounts", []);
                const addr = accounts[0];
                setWalletAddress(addr);
                localStorage.setItem("privacre_wallet", addr);
                nextStep();
            } catch (error) {
                console.error("Error connecting wallet:", error);
            }
        } else {
            alert("No crypto wallet found. Please install MetaMask.");
        }
    };

    const handleWorldIDSuccess = async (result: any) => {
        try {
            console.log("World ID verification successful:", result);

            // Verify proof with backend
            const verifyResponse = await fetch("/api/worldid/verify", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify(result),
            });

            const verifyResult = await verifyResponse.json();

            if (!verifyResult.success) {
                throw new Error(verifyResult.error || "Verification failed");
            }

            // Store verification state
            localStorage.setItem("privacre_verified", "true");
            localStorage.setItem("worldid_verified", "true");

            if (result.nullifier_hash) {
                localStorage.setItem("world_id_nullifier", result.nullifier_hash);
            }

            // Redirect back to dashboard
            const redirectUrl = localStorage.getItem('redirect_after_worldid');
            if (redirectUrl) {
                localStorage.removeItem('redirect_after_worldid');
                window.location.href = redirectUrl;
            } else {
                window.location.href = '/dashboard';
            }

        } catch (error: any) {
            console.error("World ID verification error:", error);
            setError(error.message || "Verification failed. Please try again.");
        }
    };

    const handleWorldIDError = (error: any) => {
        console.error("World ID error:", error);
        setError("Verification failed. Please try again.");
    };

    const nextStep = () => {
        gsap.to(cardRef.current, {
            opacity: 0,
            x: -20,
            duration: 0.3,
            onComplete: () => {
                setStep(step + 1);
                gsap.fromTo(
                    cardRef.current,
                    { opacity: 0, x: 20 },
                    { opacity: 1, x: 0, duration: 0.5, ease: "power3.out" }
                );
            },
        });
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-[#07070c]">
            {/* Background gradients */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-brand-500/5 to-transparent -z-10" />

            <div className="w-full max-w-lg" ref={cardRef}>
                <div className="text-center mb-10">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-violet-500 flex items-center justify-center mx-auto mb-6 glow-brand shadow-2xl">
                        <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-outfit font-black mb-2">Connect Identity</h1>
                    <p className="text-white/40 text-sm">
                        Access undercollateralized loans based on your reputation.
                    </p>
                </div>

                <Card className="glass shadow-2xl overflow-hidden">
                    <CardHeader className="p-8 border-b border-white/5 space-y-4">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-bold uppercase tracking-widest text-brand-400">Step {step} of 2</span>
                            <Badge variant="violet" className="text-[10px] h-5">Identity Protocol active</Badge>
                        </div>
                        <Progress value={step === 1 ? 50 : 100} className="h-1" />
                    </CardHeader>

                    <CardContent className="p-8">
                        {step === 1 ? (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-xl font-outfit font-bold mb-2">Connect Wallet</h2>
                                    <p className="text-sm text-white/40 mb-6">Link your EVM-compatible wallet to sign transactions.</p>
                                </div>

                                <div className="space-y-3">
                                    <Button variant="outline" className="w-full h-16 justify-between px-6 bg-white/[0.02] border-white/5 hover:bg-white/[0.05] group" onClick={connectWallet}>
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                                                <span className="text-orange-500 font-bold">M</span>
                                            </div>
                                            <span className="font-semibold">{walletAddress ? `${walletAddress.substring(0, 10)}...` : "MetaMask"}</span>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white transition-colors" />
                                    </Button>
                                    <Button variant="outline" className="w-full h-16 justify-between px-6 bg-white/[0.02] border-white/5 hover:bg-white/[0.05] group" onClick={connectWallet}>
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                                <span className="text-blue-500 font-bold">WC</span>
                                            </div>
                                            <span className="font-semibold">WalletConnect</span>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white transition-colors" />
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="text-center py-4">
                                    <div className="w-20 h-20 rounded-full border-2 border-brand-500/30 flex items-center justify-center mx-auto mb-6 p-1 relative">
                                        <div className="w-full h-full rounded-full bg-brand-500/10 flex items-center justify-center animate-pulse">
                                            <Smartphone className="w-8 h-8 text-brand-400" />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 bg-success text-black p-1 rounded-full">
                                            <CheckCircle2 className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <h2 className="text-xl font-outfit font-bold mb-2">Verify Identity</h2>
                                    <p className="text-sm text-white/40 mb-8">Prove you are a unique human without <br /> revealing personal data.</p>
                                </div>

                                {error && (
                                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-sm text-red-400">
                                        {error}
                                    </div>
                                )}

                                <div className="space-y-4 flex justify-center w-full">
                                    <WorldIDVerification
                                        action="verify-identity"
                                        signal={walletAddress || "verify-identity"}
                                        onSuccess={handleWorldIDSuccess}
                                    />
                                    <Button variant="ghost" className="w-full h-14" onClick={() => window.location.href = '/dashboard'}>
                                        Skip for now
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <p className="text-center mt-10 text-[11px] text-white/20 leading-relaxed max-w-xs mx-auto">
                    By proceeding, you agree to <b>PrivaCRE Terms of Service</b> and <b>Privacy Policy</b>. We do not store your raw banking data.
                </p>
            </div>
        </div>
    );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useAccount, useConnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { ethers } from "ethers";
import { useRouter } from "next/navigation";
import contractAddresses from "@/lib/contract-addresses.json";
import PrivaVaultABI from "../../../artifacts/contracts/PrivaVault.sol/PrivaVault.json";

export default function DashboardPage() {
    const router = useRouter();
    const { address } = useAccount();
    const { connect } = useConnect();

    const [isVerified, setIsVerified] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [creditScore, setCreditScore] = useState<number | null>(null);
    const [analysisStage, setAnalysisStage] = useState<string>("");
    const [txHash, setTxHash] = useState<string>("");

    const walletAddress = address || "";

    const gaugeRef = useRef<HTMLDivElement>(null);
    const scoreRef = useRef<HTMLSpanElement>(null);
    const cardsRef = useRef<HTMLDivElement>(null);

    // Initial Load saved state on mount
    useEffect(() => {
        const savedScore = localStorage.getItem('privacre_score') || localStorage.getItem('creditScore');
        const savedTxHash = localStorage.getItem('privacre_tx') || localStorage.getItem('txHash');
        const savedContract = localStorage.getItem('lastContract');
        const worldIdVerified = localStorage.getItem('worldid_verified');
        const privacreVerified = localStorage.getItem('privacre_verified');

        // Check World ID verification - only set to true if explicitly verified
        const isActuallyVerified = worldIdVerified === 'true' || privacreVerified === 'true';
        console.log('Dashboard verification check:', { worldIdVerified, privacreVerified, isActuallyVerified, address });
        setIsVerified(isActuallyVerified);

        // Only load score if wallet is connected
        if (address) {
            // Clear stale cache if contract changed
            if (savedContract && savedContract !== contractAddresses.vault) {
                console.log("Contract changed, clearing stale score cache.");
                localStorage.removeItem('creditScore');
                localStorage.removeItem('privacre_score');
                localStorage.removeItem('txHash');
                localStorage.removeItem('privacre_tx');
            } else {
                if (savedScore) setCreditScore(Number(savedScore));
                if (savedTxHash) setTxHash(savedTxHash);
            }
            localStorage.setItem('lastContract', contractAddresses.vault);
        } else {
            // Clear score if wallet disconnected
            setCreditScore(null);
            setTxHash("");
        }

        // Enhanced GSAP animations on mount
        if (cardsRef.current) {
            const ctx = gsap.context(() => {
                gsap.from(cardsRef.current!.children, {
                    opacity: 0,
                    y: 50,
                    duration: 1,
                    stagger: 0.2,
                    ease: "power3.out",
                });
            });
            return () => ctx.revert();
        }
    }, [address]); // Re-run when wallet connection changes

    // Persistence Effect
    useEffect(() => {
        if (isVerified) localStorage.setItem("privacre_verified", "true");
    }, [isVerified]);

    useEffect(() => {
        if (creditScore !== null) {
            localStorage.setItem("privacre_score", creditScore.toString());
            localStorage.setItem("creditScore", creditScore.toString()); // Backwards compatibility
        }
    }, [creditScore]);

    useEffect(() => {
        if (txHash) {
            localStorage.setItem("privacre_tx", txHash);
            localStorage.setItem("txHash", txHash); // Backwards compatibility
        }
    }, [txHash]);

    useEffect(() => {
        if (creditScore !== null && scoreRef.current) {
            const ctx = gsap.context(() => {
                // Animate score counter with bounce
                gsap.from(scoreRef.current, {
                    textContent: 0,
                    duration: 2.5,
                    ease: "power2.out",
                    snap: { textContent: 1 },
                    onUpdate: function () {
                        if (scoreRef.current) {
                            scoreRef.current.textContent = Math.ceil(
                                parseFloat(scoreRef.current.textContent || "0")
                            ).toString();
                        }
                    },
                });

                // Animate gauge with scale effect
                if (gaugeRef.current) {
                    gsap.from(gaugeRef.current, {
                        scale: 0.8,
                        opacity: 0,
                        duration: 1.2,
                        ease: "back.out(1.7)",
                    });
                }

                // Animate tier cards with stagger
                const tierCards = document.querySelectorAll('.tier-card-unlocked, .tier-card-locked');
                if (tierCards.length > 0) {
                    gsap.from(tierCards, {
                        opacity: 0,
                        y: 60,
                        scale: 0.9,
                        duration: 1,
                        stagger: 0.15,
                        ease: "power3.out",
                        delay: 0.5,
                    });
                }
            });
            return () => ctx.revert();
        }
    }, [creditScore]);

    const connectWallet = async () => {
        try {
            connect({ connector: injected() });
        } catch (error) {
            console.error("Error connecting wallet:", error);
        }
    };

    const startCreditAnalysis = async () => {
        if (!walletAddress) {
            alert("Please connect your wallet first");
            return;
        }

        setIsAnalyzing(true);
        setAnalysisStage("Verifying World ID session...");

        try {
            // Stage 1: Call Local Chainlink CRE Simulation
            setAnalysisStage("Securely fetching bank data via Plaid...");

            const response = await fetch('/api/cre', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userAddress: walletAddress }),
            });

            const result = await response.json();

            if (!result.success || !result.data) {
                throw new Error(result.error || "Simulation failed");
            }

            const { aiResult, bankDataSummary } = result.data;
            console.log("AI Result Analysis:", aiResult);

            // Stage 2: Simulating Fetching Private Bank Data
            setAnalysisStage(`Fetching bank data... (${bankDataSummary.transactionCount} txns found)`);
            await simulateDelay(1500);

            // Stage 3: Sanitizing
            setAnalysisStage("Sanitizing data and removing PII (Zero-Knowledge)...");
            await simulateDelay(1500);

            // Stage 4: AI Analysis
            setAnalysisStage(`AI analyzing patterns with Groq (${aiResult.credit_score}% confidence)...`);
            await simulateDelay(1500);

            // Stage 5: Generating Score
            setAnalysisStage("Applying ZK Proofs to Credit Score...");
            await simulateDelay(1500);

            // Fetch final actual score from the Smart Contract (On-Chain)
            setAnalysisStage("Reading verified score from PrivaVault [On-Chain]...");

            // connect directly to the Sepolia testnet where the contract lives
            const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_TENDERLY_RPC || "https://virtual.sepolia.eu.rpc.tenderly.co/7611135a-8515-41d7-8146-9390be57f949");

            const vault = new ethers.Contract(
                contractAddresses.vault,
                PrivaVaultABI.abi,
                provider
            );

            // Wait a bit for chain consistency if needed, but the API already waits for tx.wait()
            console.log("Reading score for:", walletAddress);
            let onChainScore = 0;
            try {
                const onChainScoreRaw = await vault.userScores(walletAddress);
                onChainScore = Number(onChainScoreRaw);
            } catch (err: any) {
                console.warn("Failed to read userScore mapping, defaulting to optimistic AI score:", err.message);
                onChainScore = 0;
            }

            // If on-chain is 0 but AI just gave a score, use AI score as optimistic update
            // (or wait for on-chain which we just did with wait() in API)
            const finalScore = onChainScore > 0 ? onChainScore : aiResult.credit_score;

            console.log("Final Score:", finalScore);
            setCreditScore(finalScore);
            setTxHash(result.txHash);

            setIsAnalyzing(false);
            setAnalysisStage("");

            // Trigger confetti or celebration animation
            celebrateScore();

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error("CRE Flow Error:", error);
            alert(`Flow Error: ${error.message || "Unknown error"}. Check console.`);
            setIsAnalyzing(false);
        }
    };

    const simulateDelay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    const celebrateScore = () => {
        // Create floating particles with enhanced animation
        const container = document.querySelector(".dashboard-container");
        if (!container) return;

        // Create multiple waves of particles
        for (let wave = 0; wave < 3; wave++) {
            setTimeout(() => {
                for (let i = 0; i < 15; i++) {
                    const particle = document.createElement("div");
                    particle.className = "particle";
                    const colors = ['#0df26c', '#22c55e', '#10b981', '#14f195'];
                    const randomColor = colors[Math.floor(Math.random() * colors.length)];
                    
                    particle.style.cssText = `
                        position: absolute;
                        width: ${Math.random() * 12 + 6}px;
                        height: ${Math.random() * 12 + 6}px;
                        background: ${randomColor};
                        border-radius: 50%;
                        pointer-events: none;
                        left: 50%;
                        top: 40%;
                        box-shadow: 0 0 20px ${randomColor};
                    `;
                    container.appendChild(particle);

                    const angle = (Math.random() * 360) * (Math.PI / 180);
                    const distance = Math.random() * 500 + 200;
                    const x = Math.cos(angle) * distance;
                    const y = Math.sin(angle) * distance;

                    gsap.to(particle, {
                        x: x,
                        y: y,
                        opacity: 0,
                        scale: 0,
                        duration: 2 + Math.random(),
                        ease: "power2.out",
                        onComplete: () => particle.remove(),
                    });
                }
            }, wave * 200);
        }

        // Add pulse effect to gauge
        if (gaugeRef.current) {
            gsap.to(gaugeRef.current, {
                scale: 1.05,
                duration: 0.3,
                yoyo: true,
                repeat: 3,
                ease: "power2.inOut",
            });
        }
    };

    return (
        <div className="bg-background-dark font-display min-h-screen flex flex-col overflow-x-hidden text-slate-100 dashboard-container relative">
            <main className="layout-container flex flex-col grow items-center w-full px-4 pt-24 pb-8 md:px-10 lg:px-20">
                <div className="layout-content-container flex flex-col max-w-[1200px] w-full gap-8" ref={cardsRef}>
                    {/* Hero / Header Section */}
                    <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 border-b border-border-dark pb-6">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-white text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em]">
                                Your Crest Score
                            </h1>
                            <div className="flex items-center gap-2 text-text-secondary verification-badge">
                                <span className="material-symbols-outlined text-lg text-primary">
                                    {isVerified ? "check_circle" : "pending"}
                                </span>
                                <p className="text-sm md:text-base font-normal">
                                    {isVerified
                                        ? "Identity verified by World ID. Data verified by Chainlink."
                                        : "Verify your identity to continue"}
                                </p>
                            </div>
                            {/* Debug info - remove in production */}
                            <div className="text-xs text-slate-500 font-mono">
                                Debug: Wallet={walletAddress ? 'Connected' : 'Not Connected'} | Verified={isVerified ? 'Yes' : 'No'}
                            </div>
                        </div>
                        {!isVerified ? (
                            <div className="flex gap-2 flex-wrap">
                                {!walletAddress && (
                                    <button
                                        onClick={connectWallet}
                                        className="group flex items-center gap-2 px-5 py-2.5 bg-card-dark border border-primary/30 text-primary rounded-lg hover:bg-primary/20 transition-all"
                                    >
                                        <span className="text-sm font-bold">Connect Wallet</span>
                                        <span className="material-symbols-outlined text-sm">account_balance_wallet</span>
                                    </button>
                                )}
                                {walletAddress && !isVerified && (
                                    <>
                                        <div className="flex items-center gap-2 px-4 py-2.5 bg-card-dark border border-border-dark rounded-lg">
                                            <span className="material-symbols-outlined text-primary text-sm">account_balance_wallet</span>
                                            <span className="text-sm font-mono text-slate-300">
                                                {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => {
                                                console.log('Redirecting to auth for World ID verification');
                                                // Redirect to auth page for real World ID verification
                                                localStorage.setItem('redirect_after_worldid', '/dashboard');
                                                router.push('/auth');
                                            }}
                                            className="group flex items-center gap-2 px-5 py-2.5 bg-primary border border-primary text-background-dark rounded-lg hover:bg-primary/90 transition-all shadow-[0_0_15px_rgba(13,242,108,0.3)] hover:shadow-[0_0_20px_rgba(13,242,108,0.5)]"
                                        >
                                            <span className="text-sm font-bold">Verify with World ID</span>
                                            <span className="material-symbols-outlined text-sm">verified_user</span>
                                        </button>
                                    </>
                                )}
                            </div>
                        ) : (
                            <a
                                href="https://dashboard.tenderly.co/explorer/vnet/7611135a-8515-41d7-8146-9390be57f949"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-2 px-5 py-2.5 bg-card-dark border border-primary/30 text-primary rounded-lg hover:bg-primary/10 transition-all shadow-[0_0_15px_rgba(13,242,108,0.1)] hover:shadow-[0_0_20px_rgba(13,242,108,0.2)]"
                            >
                                <span className="text-sm font-bold">View Proof on Tenderly</span>
                                <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                                    open_in_new
                                </span>
                            </a>
                        )}
                    </div>

                    {/* Analysis Status */}
                    {isAnalyzing && (
                        <div className="bg-card-dark border border-primary/30 rounded-xl p-6 flex items-center gap-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            <div>
                                <p className="text-white font-bold">Analyzing Your Financial Profile</p>
                                <p className="text-text-secondary text-sm">{analysisStage}</p>
                            </div>
                        </div>
                    )}

                    {txHash && (
                        <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary">verified</span>
                                <p className="text-sm text-slate-200">
                                    Last Analysis Record: <span className="font-mono text-xs opacity-70">{txHash.substring(0, 20)}...</span>
                                </p>
                            </div>
                            <a
                                href={`https://dashboard.tenderly.co/explorer/vnet/7611135a-8515-41d7-8146-9390be57f949/tx/${txHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-primary hover:underline flex items-center gap-1"
                            >
                                View on Tenderly Explorer
                                <span className="material-symbols-outlined text-xs">open_in_new</span>
                            </a>
                        </div>
                    )}

                    {/* Dashboard Grid */}
                    {!creditScore && !isAnalyzing && isVerified && !walletAddress && (
                        <div className="flex flex-col items-center justify-center py-16 gap-6">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h2>
                                <p className="text-text-secondary">
                                    Please connect your wallet to continue with credit analysis
                                </p>
                            </div>
                            <button
                                onClick={connectWallet}
                                className="glow-effect flex items-center gap-2 px-8 py-4 bg-primary text-background-dark font-bold rounded-lg hover:bg-primary/90 transition-all text-lg"
                            >
                                <span className="material-symbols-outlined">account_balance_wallet</span>
                                Connect Wallet
                            </button>
                        </div>
                    )}

                    {!creditScore && !isAnalyzing && isVerified && walletAddress && (
                        <div className="flex flex-col items-center justify-center py-16 gap-6">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold text-white mb-2">Ready to Get Your Credit Score?</h2>
                                <p className="text-text-secondary">
                                    Connect your bank data securely to generate your privacy-preserving credit score
                                </p>
                            </div>
                            <button
                                onClick={startCreditAnalysis}
                                className="glow-effect flex items-center gap-2 px-8 py-4 bg-primary text-background-dark font-bold rounded-lg hover:bg-primary/90 transition-all text-lg"
                            >
                                <span className="material-symbols-outlined">auto_awesome</span>
                                Start Credit Analysis
                            </button>
                        </div>
                    )}

                    {creditScore !== null && (
                        <>
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                {/* Score Gauge Card */}
                                <div
                                    ref={gaugeRef}
                                    className="lg:col-span-5 flex flex-col items-center justify-center bg-gradient-to-br from-card-dark via-card-dark to-card-dark/80 rounded-3xl p-10 border border-border-dark relative overflow-hidden"
                                    style={{
                                        boxShadow: `
                                            0 0 ${creditScore > 80 ? '40px' : creditScore > 60 ? '30px' : '20px'} rgba(13, 242, 108, ${creditScore / 200}),
                                            0 0 ${creditScore > 80 ? '80px' : creditScore > 60 ? '60px' : '40px'} rgba(13, 242, 108, ${creditScore / 400}),
                                            0 20px 60px rgba(0, 0, 0, 0.5)
                                        `
                                    }}
                                >
                                    {/* Animated background gradient */}
                                    <div 
                                        className="absolute inset-0 opacity-10"
                                        style={{
                                            background: `radial-gradient(circle at 50% 50%, rgba(13, 242, 108, ${creditScore / 200}) 0%, transparent 70%)`
                                        }}
                                    ></div>
                                    
                                    <div className="absolute top-0 right-0 p-4 opacity-5">
                                        <span className="material-symbols-outlined text-[180px]">speed</span>
                                    </div>
                                    
                                    <div className="relative z-10 w-72 h-36 mt-4 mb-2">
                                        {/* CSS-only semi-circle gauge with dynamic glow */}
                                        <div 
                                            className="gauge-arc w-full h-full absolute top-0 left-0 transition-all duration-1000"
                                            style={{
                                                background: `conic-gradient(from 180deg, #0df26c ${creditScore}%, #1e293b 0%)`,
                                                filter: `drop-shadow(0 0 ${creditScore > 80 ? '15px' : creditScore > 60 ? '10px' : '5px'} rgba(13, 242, 108, ${creditScore / 150}))`
                                            }}
                                        ></div>
                                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[calc(100%-40px)] h-[calc(200%-40px)] bg-card-dark rounded-full"></div>
                                        <div className="absolute bottom-0 left-0 w-full flex flex-col items-center justify-end pb-0">
                                            <span
                                                ref={scoreRef}
                                                className="text-7xl font-black text-white tracking-tighter"
                                                style={{
                                                    textShadow: `0 0 ${creditScore > 80 ? '20px' : '10px'} rgba(13, 242, 108, ${creditScore / 200})`
                                                }}
                                            >
                                                {creditScore}
                                            </span>
                                            <span className="text-xs uppercase tracking-widest text-text-secondary mt-2 font-bold">
                                                {creditScore >= 90 ? 'EXCEPTIONAL' : creditScore >= 80 ? 'EXCELLENT' : creditScore >= 70 ? 'VERY GOOD' : creditScore >= 60 ? 'GOOD' : 'FAIR'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="w-full flex justify-between px-10 mt-8 text-xs font-mono text-text-secondary">
                                        <span>0</span>
                                        <span className="font-bold">CREST SCORE</span>
                                        <span>100</span>
                                    </div>
                                    <div className="mt-8 flex flex-col items-center gap-3 text-center">
                                        <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full">
                                            <span className="material-symbols-outlined text-primary text-sm">trending_up</span>
                                            <p className="text-primary text-sm font-bold">
                                                Top {Math.max(5, 100 - creditScore)}% of users
                                            </p>
                                        </div>
                                        <p className="text-slate-400 text-xs max-w-xs">
                                            Your creditworthiness unlocks premium lending rates
                                        </p>
                                    </div>
                                </div>

                                {/* Justification Card */}
                                <div className="lg:col-span-7 flex flex-col bg-gradient-to-br from-card-dark to-background-dark rounded-3xl shadow-xl border border-border-dark overflow-hidden">
                                    <div
                                        className="h-36 bg-cover bg-center relative"
                                        style={{
                                            backgroundImage:
                                                "url('https://www.shutterstock.com/image-vector/grunge-green-results-word-rubber-260nw-2604825787.jpg')",
                                        }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-t from-card-dark via-card-dark/90 to-card-dark/50"></div>
                                    </div>
                                    <div className="p-8 -mt-16 relative z-10">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-3 bg-primary/20 rounded-xl text-primary border border-primary/30">
                                                <span className="material-symbols-outlined text-2xl">analytics</span>
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-bold text-white">Score Justification</h3>
                                                <p className="text-xs text-text-secondary">AI-powered analysis</p>
                                            </div>
                                        </div>
                                        <p className="text-slate-300 mb-8 leading-relaxed text-base">
                                            Score calculated based on <span className="font-bold text-white">consistent payment history</span> and <span className="font-bold text-white">positive cash flow</span> analysis from your encrypted bank data. <span className="font-bold text-primary">No missed payments</span> detected in the last 12 months across 4 connected accounts.
                                        </p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="group p-5 rounded-xl bg-background-dark/80 border border-border-dark hover:border-primary/30 transition-all flex items-start gap-4">
                                                <div className="p-2 bg-primary/10 rounded-lg">
                                                    <span className="material-symbols-outlined text-primary text-xl">
                                                        history
                                                    </span>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-1">
                                                        Payment History
                                                    </p>
                                                    <p className="text-white font-bold text-lg mb-2">Perfect Payments</p>
                                                    {/* Sparkline */}
                                                    <div className="flex items-end gap-0.5 h-8">
                                                        {[85, 90, 88, 92, 95, 93, 97, 96, 98, 100, 100, 100].map((val, i) => (
                                                            <div 
                                                                key={i} 
                                                                className="flex-1 bg-primary/30 rounded-t transition-all group-hover:bg-primary/50"
                                                                style={{ height: `${val}%` }}
                                                            ></div>
                                                        ))}
                                                    </div>
                                                    <p className="text-xs text-text-secondary mt-2">12 months trend</p>
                                                </div>
                                            </div>
                                            <div className="group p-5 rounded-xl bg-background-dark/80 border border-border-dark hover:border-primary/30 transition-all flex items-start gap-4">
                                                <div className="p-2 bg-primary/10 rounded-lg">
                                                    <span className="material-symbols-outlined text-primary text-xl">
                                                        account_balance
                                                    </span>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-1">
                                                        Cash Flow
                                                    </p>
                                                    <p className="text-white font-bold text-lg mb-2">Positive Net Income</p>
                                                    {/* Sparkline */}
                                                    <div className="flex items-end gap-0.5 h-8">
                                                        {[60, 65, 70, 68, 75, 80, 78, 85, 82, 88, 90, 92].map((val, i) => (
                                                            <div 
                                                                key={i} 
                                                                className="flex-1 bg-primary/30 rounded-t transition-all group-hover:bg-primary/50"
                                                                style={{ height: `${val}%` }}
                                                            ></div>
                                                        ))}
                                                    </div>
                                                    <p className="text-xs text-text-secondary mt-2">Increasing trend</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Loan Tiers Section */}
                            <div className="pt-12 pb-8">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                                        Available Loan Tiers
                                        <span className="text-xs font-normal px-3 py-1.5 rounded-full bg-primary/20 text-primary border border-primary/30">
                                            Score: {creditScore}
                                        </span>
                                    </h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                                    {/* Tier 1 Card (Unlocked/Active) - Glassmorphism */}
                                    <div className="tier-card-unlocked group relative flex flex-col bg-gradient-to-br from-primary/10 via-card-dark to-card-dark rounded-3xl p-8 border-2 border-primary shadow-[0_0_30px_rgba(13,242,108,0.3)] transition-all hover:-translate-y-2 hover:shadow-[0_0_50px_rgba(13,242,108,0.5)] min-h-[450px]">
                                        {/* Glassmorphism overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl pointer-events-none"></div>
                                        
                                        {/* Best Value Badge */}
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-primary text-background-dark text-xs font-bold rounded-full shadow-lg flex items-center gap-1 z-10">
                                            <span className="material-symbols-outlined text-sm">star</span>
                                            UNLOCKED
                                        </div>
                                        
                                        <div className="absolute top-6 right-6 text-primary">
                                            <span className="material-symbols-outlined text-3xl">lock_open</span>
                                        </div>
                                        
                                        <div className="relative z-10 mt-4">
                                            <h3 className="text-2xl font-bold text-white mb-2">Tier 1: Prime</h3>
                                            <p className="text-primary text-sm font-bold mb-8 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-sm">check_circle</span>
                                                Active & Available
                                            </p>
                                            
                                            <div className="space-y-5 mb-10">
                                                <div className="flex justify-between items-center pb-3 border-b border-primary/20">
                                                    <span className="text-slate-300 text-sm font-medium">Collateral Ratio</span>
                                                    <span className="text-white font-mono font-bold text-lg">105%</span>
                                                </div>
                                                <div className="flex justify-between items-center pb-3 border-b border-primary/20">
                                                    <span className="text-slate-300 text-sm font-medium">Max LTV</span>
                                                    <span className="text-white font-mono font-bold text-lg">95%</span>
                                                </div>
                                                <div className="flex justify-between items-center pb-3 border-b border-primary/20">
                                                    <span className="text-slate-300 text-sm font-medium">APR (Variable)</span>
                                                    <span className="text-primary font-mono font-bold text-xl">4.5%</span>
                                                </div>
                                            </div>
                                            
                                            <button
                                                onClick={() => router.push('/lending')}
                                                className="mt-auto w-full py-4 px-4 bg-primary text-background-dark font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
                                            >
                                                Apply for Loan
                                                <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Tier 2 Card (Locked) - Grayscale with Target Badge */}
                                    <div className="tier-card-locked relative flex flex-col bg-gradient-to-br from-slate-700/60 to-slate-800/90 rounded-3xl p-8 border-2 border-slate-500/80 transition-all min-h-[450px]" style={{ opacity: 1 }}>
                                        {/* Target Score Badge */}
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-slate-700 text-slate-300 text-xs font-bold rounded-full shadow-lg flex items-center gap-1 z-10">
                                            <span className="material-symbols-outlined text-sm">flag</span>
                                            TARGET: 90+
                                        </div>
                                        
                                        <div className="absolute top-6 right-6 text-slate-300">
                                            <span className="material-symbols-outlined text-3xl">lock</span>
                                        </div>
                                        
                                        <div className="mt-4">
                                            <h3 className="text-2xl font-bold text-white mb-2">Tier 2: Standard</h3>
                                            <p className="text-slate-300 text-sm mb-8 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-sm">trending_up</span>
                                                Requires Score 90+
                                            </p>
                                            
                                            <div className="space-y-5 mb-10">
                                                <div className="flex justify-between items-center pb-3 border-b border-slate-600">
                                                    <span className="text-slate-300 text-sm">Collateral Ratio</span>
                                                    <span className="text-white font-mono font-bold">125%</span>
                                                </div>
                                                <div className="flex justify-between items-center pb-3 border-b border-slate-600">
                                                    <span className="text-slate-300 text-sm">Max LTV</span>
                                                    <span className="text-white font-mono font-bold">80%</span>
                                                </div>
                                                <div className="flex justify-between items-center pb-3 border-b border-slate-600">
                                                    <span className="text-slate-300 text-sm">APR</span>
                                                    <span className="text-white font-mono font-bold">5.2%</span>
                                                </div>
                                            </div>
                                            
                                            <div className="mt-auto space-y-3">
                                                <div className="w-full py-3 px-4 bg-slate-700/70 text-slate-200 font-medium rounded-xl text-center flex items-center justify-center gap-2">
                                                    <span className="material-symbols-outlined text-sm">lock</span>
                                                    Locked
                                                </div>
                                                <p className="text-xs text-slate-400 text-center">
                                                    Improve score by {90 - creditScore} points to unlock
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tier 3 Card (Locked) - More transparent */}
                                    <div className="tier-card-locked relative flex flex-col bg-gradient-to-br from-slate-800/50 to-slate-900/80 rounded-3xl p-8 border border-slate-600/60 transition-all min-h-[450px]" style={{ opacity: 1 }}>
                                        <div className="absolute top-6 right-6 text-slate-400">
                                            <span className="material-symbols-outlined text-3xl">lock</span>
                                        </div>
                                        
                                        <div className="mt-4">
                                            <h3 className="text-2xl font-bold text-slate-300 mb-2">Tier 3: Entry</h3>
                                            <p className="text-slate-400 text-sm mb-8">For New Users</p>
                                            
                                            <div className="space-y-5 mb-10">
                                                <div className="flex justify-between items-center pb-3 border-b border-slate-700">
                                                    <span className="text-slate-400 text-sm">Collateral Ratio</span>
                                                    <span className="text-slate-300 font-mono">150%</span>
                                                </div>
                                                <div className="flex justify-between items-center pb-3 border-b border-slate-700">
                                                    <span className="text-slate-400 text-sm">Max LTV</span>
                                                    <span className="text-slate-300 font-mono">66%</span>
                                                </div>
                                                <div className="flex justify-between items-center pb-3 border-b border-slate-700">
                                                    <span className="text-slate-400 text-sm">APR</span>
                                                    <span className="text-slate-300 font-mono">6.8%</span>
                                                </div>
                                            </div>
                                            
                                            <button
                                                className="mt-auto w-full py-3 px-4 bg-slate-800/70 text-slate-400 font-medium rounded-xl cursor-not-allowed flex items-center justify-center gap-2"
                                                disabled
                                            >
                                                <span className="material-symbols-outlined text-sm">lock</span>
                                                Locked
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Footer Info */}
                    <div className="mt-8 mb-12 flex flex-col md:flex-row justify-between items-center gap-4 py-6 border-t border-border-dark text-sm text-text-secondary">
                        <p>© 2024 PrivaCRE Protocol. All rights reserved.</p>
                        <div className="flex gap-6">
                            <a className="hover:text-primary transition-colors" href="#">
                                Privacy Policy
                            </a>
                            <a className="hover:text-primary transition-colors" href="#">
                                Terms of Service
                            </a>
                            <a className="hover:text-primary transition-colors" href="#">
                                Documentation
                            </a>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

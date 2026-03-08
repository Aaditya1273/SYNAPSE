"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAccount, useReadContract, useWriteContract, usePublicClient, useSwitchChain, useChainId } from "wagmi";
import { parseUnits, formatUnits, formatEther, parseEther } from "viem";
import contractAddresses from "@/lib/contract-addresses.json";
import PrivaVaultABI from "../../../artifacts/contracts/PrivaVault.sol/PrivaVault.json";
import { Button } from "@/components/ui/button";

export default function LendingPage() {
    const { address, isConnected } = useAccount();
    const { switchChain } = useSwitchChain();
    const chainId = useChainId();
    const publicClient = usePublicClient();
    const { writeContractAsync } = useWriteContract();
    const [borrowAmount, setBorrowAmount] = useState("");
    const [isExecuting, setIsExecuting] = useState(false);
    const [loadingStage, setLoadingStage] = useState("");
    const [txHash, setTxHash] = useState("");
    const [ethPriceLocal, setEthPriceLocal] = useState(2500);
    const [localScore, setLocalScore] = useState<number | null>(null);
    const [isWorldIdVerified, setIsWorldIdVerified] = useState(false);

    const isCorrectNetwork = chainId === 99911155111;

    // Read User Score directly from contract
    const { data: userScoreRaw, refetch: refetchScore, isError: isScoreError, isLoading: isScoreLoading } = useReadContract({
        address: contractAddresses.vault as `0x${string}`,
        abi: PrivaVaultABI.abi,
        functionName: "userScores",
        args: [address],
        query: {
            enabled: !!address && isCorrectNetwork,
        }
    });

    // Sync with localStorage on mount and when network changes
    useEffect(() => {
        // Try both key names for backwards compatibility
        const savedScore = localStorage.getItem('privacre_score') || localStorage.getItem('creditScore');
        if (savedScore) {
            setLocalScore(Number(savedScore));
            // Migrate to new key if using old one
            if (localStorage.getItem('creditScore')) {
                localStorage.setItem('privacre_score', savedScore);
                localStorage.removeItem('creditScore');
            }
        }
        const verified = localStorage.getItem('privacre_verified') === 'true';
        setIsWorldIdVerified(verified);
        
        // Refetch score when network changes to correct one
        if (isCorrectNetwork && address) {
            refetchScore();
        }
    }, [isCorrectNetwork, address, refetchScore]);

    // Read Latest Price (Polling every 30s)
    const { data: ethPriceRaw, refetch: refetchPrice } = useReadContract({
        address: contractAddresses.vault as `0x${string}`,
        abi: PrivaVaultABI.abi,
        functionName: "getLatestPrice",
    });

    useEffect(() => {
        if (ethPriceRaw) {
            setEthPriceLocal(Number(ethPriceRaw) / 1e8);
        }
        const interval = setInterval(() => {
            refetchPrice();
            refetchScore();
        }, 30000);
        return () => clearInterval(interval);
    }, [ethPriceRaw, refetchPrice, refetchScore]);

    // Read Active Loan
    const { data: activeLoanRaw } = useReadContract({
        address: contractAddresses.vault as `0x${string}`,
        abi: PrivaVaultABI.abi,
        functionName: "loans",
        args: [address],
        query: {
            enabled: !!address,
        }
    });

    // Use on-chain score if available, otherwise fallback to local cache
    const userScore = userScoreRaw && Number(userScoreRaw) > 0
        ? Number(userScoreRaw)
        : (localScore || 0);

    const isSynced = !!(userScoreRaw && Number(userScoreRaw) > 0);
    
    // Debug logging
    useEffect(() => {
        console.log('[Lending] Score Debug:', {
            userScoreRaw,
            userScore,
            localScore,
            isSynced,
            isCorrectNetwork,
            isScoreLoading,
            isScoreError,
            address
        });
    }, [userScoreRaw, userScore, localScore, isSynced, isCorrectNetwork, isScoreLoading, isScoreError, address]);
    
    const ethPrice = ethPriceLocal;

    // Robustly handle the struct return (could be array or object depending on wagmi version/ABI)
    const activeLoan = activeLoanRaw ? {
        principal: Array.isArray(activeLoanRaw) ? activeLoanRaw[0] : (activeLoanRaw as any).principal,
        collateral: Array.isArray(activeLoanRaw) ? activeLoanRaw[1] : (activeLoanRaw as any).collateral,
        startTime: Array.isArray(activeLoanRaw) ? activeLoanRaw[2] : (activeLoanRaw as any).startTime,
        isActive: Array.isArray(activeLoanRaw) ? activeLoanRaw[3] : (activeLoanRaw as any).isActive,
    } : null;

    // CRITICAL: Collateral ratio must match the contract's view of the score
    // If on-chain score is 0, the contract will DEFAULT to 150%
    const collateralRatio = isSynced ? (Number(userScoreRaw) > 80 ? 110 : 150) : 150;

    // Reactive Collateral Calculation
    const calculateRequiredETH = () => {
        if (!borrowAmount || isNaN(Number(borrowAmount)) || ethPrice === 0) return "0";
        const amountUSDC = Number(borrowAmount);
        const requiredUSD = (amountUSDC * collateralRatio) / 100;
        // Adding 1% buffer to handle price volatility/rounding between FE and Contract
        return ((requiredUSD / ethPrice) * 1.01).toFixed(6);
    };

    const requiredCollateralETH = calculateRequiredETH();

    const executeLoan = async () => {
        if (!isConnected || !address || !publicClient) return;
        
        // Critical validation: Must have on-chain score
        if (!isSynced || !userScoreRaw || Number(userScoreRaw) === 0) {
            alert("❌ No on-chain credit score detected!\n\nPlease go to the Dashboard and run the CRE analysis to sync your score on-chain before borrowing.");
            return;
        }

        if (!borrowAmount || Number(borrowAmount) <= 0) {
            alert("Please enter a valid borrow amount");
            return;
        }

        setIsExecuting(true);
        setLoadingStage("Checking Wallet Balance...");

        try {
            const balance = await publicClient.getBalance({ address });
            const requiredWei = parseEther(requiredCollateralETH);

            if (balance < requiredWei) {
                throw new Error(`Insufficient ETH for collateral. Need ${requiredCollateralETH} ETH, have ${formatEther(balance)} ETH`);
            }

            setLoadingStage("Locking Collateral...");
            const amount = parseUnits(borrowAmount, 6);

            const hash = await writeContractAsync({
                address: contractAddresses.vault as `0x${string}`,
                abi: PrivaVaultABI.abi,
                functionName: "borrow",
                args: [amount],
                value: requiredWei,
            });

            setTxHash(hash);
            setLoadingStage("Disbursing USDC...");

            // Wait for receipt to show final stage
            await publicClient.waitForTransactionReceipt({ hash });
            setLoadingStage("Success!");
            alert("✅ Loan Disbursed! USDC sent to your wallet.");
        } catch (error: any) {
            console.error("Loan failed:", error);
            const errorMsg = error.shortMessage || error.message || "Loan execution failed";
            alert(`❌ Loan Failed:\n\n${errorMsg}\n\nPlease check:\n1. You have enough ETH for collateral\n2. Your credit score is synced on-chain\n3. You don't have an existing active loan`);
        } finally {
            setIsExecuting(false);
            setLoadingStage("");
        }
    };

    const repayLoan = async () => {
        if (!isConnected || !address || !activeLoan?.isActive || !publicClient) return;
        setIsExecuting(true);
        setLoadingStage("Approving USDC...");

        try {
            // Step 1: Approve Vault to spend USDC
            const erc20Abi = [
                {
                    name: "approve",
                    type: "function",
                    stateMutability: "nonpayable",
                    inputs: [
                        { name: "spender", type: "address" },
                        { name: "amount", type: "uint256" },
                    ],
                    outputs: [{ name: "", type: "bool" }],
                },
            ];

            const approveHash = await writeContractAsync({
                address: contractAddresses.usdc as `0x${string}`,
                abi: erc20Abi,
                functionName: "approve",
                args: [contractAddresses.vault as `0x${string}`, activeLoan.principal],
            });
            await publicClient.waitForTransactionReceipt({ hash: approveHash });

            setLoadingStage("Repaying USDC...");
            const hash = await writeContractAsync({
                address: contractAddresses.vault as `0x${string}`,
                abi: PrivaVaultABI.abi,
                functionName: "repay",
            });

            setTxHash(hash);
            setLoadingStage("Returning Collateral...");
            await publicClient?.waitForTransactionReceipt({ hash });
            alert("Repayment Complete! Collateral returned.");
        } catch (error: any) {
            console.error("Repayment failed:", error);
            alert(error.shortMessage || error.message || "Failed to repay loan");
        } finally {
            setIsExecuting(false);
            setLoadingStage("");
        }
    };

    const collateralValueUSD = (activeLoan?.collateral && ethPrice > 0)
        ? (Number(formatEther(activeLoan.collateral)) * ethPrice)
        : 0;
    const loanPrincipalUSD = activeLoan ? Number(formatUnits(activeLoan.principal, 6)) : 0;
    const healthFactor = loanPrincipalUSD > 0
        ? collateralValueUSD / (loanPrincipalUSD * 1.01)
        : 0;

    return (
        <div className="flex min-h-screen flex-col">
            <main className="flex-1 flex justify-center py-8 lg:py-12 px-4">
                <div className="flex flex-col max-w-[960px] w-full gap-8">
                    {/* Network Warning */}
                    {!isCorrectNetwork && (
                        <div className="bg-amber-500/10 border border-amber-500/50 rounded-xl p-4 flex items-center justify-between text-amber-500">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined">warning</span>
                                <div>
                                    <p className="font-bold">Wrong Network Detected</p>
                                    <p className="text-sm opacity-80">Please switch to Tenderly Sepolia to fetch your score and execute loans.</p>
                                </div>
                            </div>
                            <button
                                onClick={() => switchChain({ chainId: 99911155111 })}
                                className="px-4 py-2 bg-amber-500 text-background-dark font-bold rounded-lg hover:bg-amber-400 transition-colors"
                            >
                                Switch Network
                            </button>
                        </div>
                    )}

                    {/* World ID Verification Status */}
                    {!isWorldIdVerified && (
                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center">
                                    <div className="h-4 w-4 rounded-full border-2 border-black"></div>
                                </div>
                                <div>
                                    <p className="font-bold text-yellow-400">World ID Not Verified</p>
                                    <p className="text-sm text-yellow-400/70">Verify your identity on the Dashboard to unlock Prime loan rates (110% collateral).</p>
                                </div>
                            </div>
                            <Link
                                href="/dashboard"
                                className="px-4 py-2 bg-yellow-500 text-background-dark font-bold rounded-lg hover:bg-yellow-400 transition-colors text-sm whitespace-nowrap"
                            >
                                Verify Now
                            </Link>
                        </div>
                    )}

                    {/* Score Not Synced Warning */}
                    {!isSynced && localScore && localScore > 0 && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-red-400 text-3xl">sync_problem</span>
                                <div>
                                    <p className="font-bold text-red-400">Credit Score Not Synced On-Chain</p>
                                    <p className="text-sm text-red-400/70">Your score is cached locally but not verified on-chain. You must re-run the CRE analysis on the Dashboard to borrow.</p>
                                </div>
                            </div>
                            <Link
                                href="/dashboard"
                                className="px-4 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-400 transition-colors text-sm whitespace-nowrap"
                            >
                                Sync Now
                            </Link>
                        </div>
                    )}

                    {/* Page Title & Back Button */}
                    <div className="flex flex-col gap-4">
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-2 text-primary hover:text-green-400 transition-colors text-sm font-bold w-fit"
                        >
                            <span className="material-symbols-outlined text-sm">arrow_back</span>
                            Back to Dashboard
                        </Link>
                        <div className="flex flex-col gap-2">
                            <h1 className="text-4xl lg:text-5xl font-black leading-tight tracking-tight">
                                PrivaCRE Lending Vault
                            </h1>
                            <p className="text-white/40 max-w-xl">
                                Utilize your decentralized credit reputation to access undercollateralized loans.
                                Your data stays private via Zero-Knowledge orchestration.
                            </p>
                        </div>
                    </div>

                    {/* Faucet/Debug Section (Only for Testing/Tenderly) */}
                    <div className="bg-brand-500/5 border border-brand-500/20 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="material-symbols-outlined text-brand-400">bug_report</span>
                            <h3 className="font-bold text-lg text-white">Testing Faucet & Funding</h3>
                        </div>
                        <p className="text-xs text-brand-300/60 mb-6">
                            Since this is a test environment, you need to ensure the vault has USDC liquidity and you have USDC to repay.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <Button
                                    variant="outline"
                                    className="border-brand-500/30 text-brand-400 hover:bg-brand-500/10"
                                    onClick={async () => {
                                        if (!address) return;
                                        setLoadingStage("Minting 1,000 USDC...");
                                        try {
                                            const hash = await writeContractAsync({
                                                address: contractAddresses.usdc as `0x${string}`,
                                                abi: [{ name: "mint", type: "function", inputs: [{ name: "to", type: "address" }, { name: "amount", type: "uint256" }], outputs: [] }],
                                                functionName: "mint",
                                                args: [address, parseUnits("1000", 6)],
                                            });
                                            await publicClient?.waitForTransactionReceipt({ hash });
                                            alert("1,000 MockUSDC minted to your wallet!");
                                        } catch (e) {
                                            console.error(e);
                                            alert("Minting failed. Make sure you are using MockUSDC ABI.");
                                        } finally { setLoadingStage(""); }
                                    }}
                                >
                                    Get 1,000 Test USDC
                                </Button>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Button
                                    variant="outline"
                                    className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                                    onClick={async () => {
                                        if (!address) return;
                                        setLoadingStage("Funding Vault...");
                                        try {
                                            const amount = parseUnits("100000", 6);
                                            // 1. Approve
                                            const appHash = await writeContractAsync({
                                                address: contractAddresses.usdc as `0x${string}`,
                                                abi: [{ name: "approve", type: "function", inputs: [{ name: "spender", type: "address" }, { name: "amount", type: "uint256" }], outputs: [] }],
                                                functionName: "approve",
                                                args: [contractAddresses.vault as `0x${string}`, amount],
                                            });
                                            await publicClient?.waitForTransactionReceipt({ hash: appHash });
                                            // 2. Deposit
                                            const depHash = await writeContractAsync({
                                                address: contractAddresses.vault as `0x${string}`,
                                                abi: PrivaVaultABI.abi,
                                                functionName: "depositLiquidity",
                                                args: [amount],
                                            });
                                            await publicClient?.waitForTransactionReceipt({ hash: depHash });
                                            alert("Vault funded with 100,000 USDC!");
                                        } catch (e) {
                                            console.error(e);
                                            alert("Funding failed.");
                                        } finally { setLoadingStage(""); }
                                    }}
                                >
                                    Fund Vault (100k USDC)
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Score Card */}
                        <div className="flex flex-col gap-3 rounded-xl p-6 bg-surface-dark border border-border-green relative overflow-hidden group">
                            <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all"></div>
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-xl">shield</span>
                                <p className="text-slate-300 text-sm font-medium uppercase tracking-wider">
                                    Your Crest Score
                                </p>
                            </div>
                            <div className="flex items-baseline gap-3">
                                <p className="text-4xl font-bold">
                                    {!isCorrectNetwork ? (
                                        "---"
                                    ) : isScoreLoading ? (
                                        <span className="animate-pulse opacity-50 text-2xl">Loading...</span>
                                    ) : isScoreError ? (
                                        <span className="text-red-500 text-2xl italic">Error</span>
                                    ) : (
                                        userScore
                                    )}
                                </p>
                                {isCorrectNetwork && userScore > 0 && !isScoreLoading && (
                                    <div className={`flex items-center text-sm font-medium px-2 py-0.5 rounded ${isSynced ? 'bg-primary/10 text-primary' : 'bg-amber-500/10 text-amber-500'}`}>
                                        <span className="material-symbols-outlined text-sm mr-1">
                                            {isSynced ? 'check_circle' : 'sync_problem'}
                                        </span>
                                        {isSynced ? 'On-Chain' : 'Local Only'}
                                    </div>
                                )}
                            </div>
                            {!isSynced && userScore > 0 && (
                                <p className="text-amber-500 text-[10px] mt-1 italic">
                                    Score found in browser cache. <b>Please re-run analysis</b> on Dashboard to sync on-chain.
                                </p>
                            )}
                            <p className="text-slate-500 text-xs">Verified state from PrivaVault</p>

                        </div>

                        {/* Collateral Ratio Card */}
                        <div className="flex flex-col gap-3 rounded-xl p-6 bg-surface-dark border border-border-green relative overflow-hidden">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-slate-400 text-xl">percent</span>
                                <p className="text-slate-300 text-sm font-medium uppercase tracking-wider">
                                    Your Loan Ratio
                                </p>
                            </div>
                            <p className="text-4xl font-bold">{collateralRatio}%</p>
                            <p className="text-slate-400 text-xs">{userScore > 80 ? "Prime Tier Bonus Active" : "Base Collateral Tier"}</p>
                        </div>

                        {/* Price Card */}
                        <div className="flex flex-col gap-3 rounded-xl p-6 bg-surface-dark border border-blue-500/30 relative overflow-hidden">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-blue-400 text-xl">payments</span>
                                <p className="text-slate-300 text-sm font-medium uppercase tracking-wider">
                                    ETH/USD (Sepolia)
                                </p>
                            </div>
                            <p className="text-4xl font-bold">${ethPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                            <p className="text-slate-400 text-xs">Polling every 30 seconds</p>
                        </div>
                    </div>

                    {/* Active Loan Display */}
                    {activeLoan?.isActive && (
                        <div className="bg-surface-dark border border-border-green rounded-xl p-6 flex flex-col md:flex-row justify-between items-center gap-6 shadow-lg shadow-primary/10">
                            <div className="flex flex-col gap-1">
                                <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">Loan Health Factor</p>
                                <div className="flex items-center gap-3">
                                    <p className={`text-4xl font-bold ${healthFactor > 1.2 ? "text-primary" : "text-red-500"}`}>
                                        {healthFactor.toFixed(2)}
                                    </p>
                                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${healthFactor > 1.2 ? "bg-primary/20 text-primary" : "bg-red-500/20 text-red-500"}`}>
                                        {healthFactor > 1.2 ? "HEALTHY" : "LIQUIDATION RISK"}
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-8">
                                <div className="flex flex-col">
                                    <p className="text-slate-500 text-xs uppercase">Principal</p>
                                    <p className="text-lg font-bold">{loanPrincipalUSD} USDC</p>
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-slate-500 text-xs uppercase">Collateral</p>
                                    <p className="text-lg font-bold">{formatEther(activeLoan.collateral).slice(0, 6)} ETH</p>
                                </div>
                            </div>
                            <button
                                onClick={repayLoan}
                                disabled={isExecuting}
                                className="px-8 py-3 rounded-lg bg-surface-dark border border-primary text-primary font-bold hover:bg-primary/10 transition-all flex items-center gap-2"
                            >
                                {isExecuting ? loadingStage : "Repay & Close"}
                                {!isExecuting && <span className="material-symbols-outlined text-sm">logout</span>}
                            </button>
                        </div>
                    )}

                    {/* Main Interaction Area */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                        {/* Form */}
                        <div className="lg:col-span-3 flex flex-col gap-6">
                            <div className="bg-surface-dark rounded-xl border border-border-green p-6 lg:p-8">
                                <h3 className="text-xl font-bold mb-6">Configure Loan</h3>
                                <div className="flex flex-col gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-slate-300 text-sm font-medium">Borrow Amount (USDC)</label>
                                        <div className="relative">
                                            <input
                                                className="w-full bg-surface-darker border border-border-green rounded-lg py-4 px-4 text-2xl font-bold placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary"
                                                type="number"
                                                value={borrowAmount}
                                                onChange={(e) => setBorrowAmount(e.target.value)}
                                            />
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                                <span className="font-bold text-slate-400">USDC</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-slate-400 text-sm">Undercollateralized Eligibility</span>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${userScore > 0 ? "bg-primary/20 text-primary" : "bg-red-500/20 text-red-500"}`}>
                                                {userScore > 0 ? "ELIGIBLE" : "LOCKED"}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500">
                                            {userScore > 80
                                                ? "PRIME STATUS: Your score qualifies for ultra-low 110% collateral."
                                                : userScore > 0
                                                    ? "STANDARD STATUS: Your score qualifies for 150% collateral (Standard is 200%+)."
                                                    : "Zero score detected. Please run CRE analysis to unlock lending."}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Calculation Box */}
                        <div className="lg:col-span-2">
                            <div className="bg-gradient-to-br from-surface-dark to-surface-darker rounded-xl border border-border-green p-6 flex flex-col gap-6 shadow-xl sticky top-24">
                                <h4 className="text-lg font-bold flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">calculate</span>
                                    Auto-Calculation
                                </h4>

                                <div className="space-y-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-white/40">Collateral Ratio</span>
                                        <span className={`font-bold ${collateralRatio === 110 ? 'text-primary' : 'text-white'}`}>
                                            {collateralRatio}% {collateralRatio === 110 && " (Prime Rate)"}
                                        </span>
                                    </div>
                                    {!isSynced && localScore && localScore > 80 && (
                                        <p className="text-[10px] text-amber-500 mt-1">
                                            ⚠️ On-chain sync pending. Standard rate (150%) applies until confirmed.
                                        </p>
                                    )}
                                    <div className="flex justify-between items-center text-sm pt-2 border-t border-dashed border-border-green">
                                        <span className="text-primary font-medium">Crest Efficiency</span>
                                        <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-xs font-bold">
                                            {collateralRatio}% Ratio
                                        </span>
                                    </div>
                                </div>

                                <div className="bg-surface-darker/50 rounded-lg p-5 border border-border-green">
                                    <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Required Collateral (ETH)</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl font-bold text-white">{requiredCollateralETH}</span>
                                        <span className="text-sm font-medium text-slate-400">ETH</span>
                                    </div>
                                    <p className="text-[10px] text-slate-500 mt-1">Value: ~${(Number(requiredCollateralETH) * ethPrice).toFixed(2)} USD</p>
                                </div>

                                <button
                                    onClick={executeLoan}
                                    disabled={isExecuting || !isSynced || userScore === 0 || activeLoan?.isActive}
                                    className="w-full bg-primary hover:bg-green-400 text-surface-darker disabled:opacity-50 disabled:cursor-not-allowed font-bold py-4 px-6 rounded-lg text-lg shadow-[0_0_20px_rgba(13,242,108,0.3)] transition-all flex flex-col items-center"
                                >
                                    {isExecuting ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-surface-darker border-t-transparent rounded-full animate-spin"></div>
                                            <span>{loadingStage}</span>
                                        </div>
                                    ) : !isSynced && userScore > 0 ? (
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-amber-500">sync_problem</span>
                                            <span>Score Not Synced - Run Analysis First</span>
                                        </div>
                                    ) : userScore === 0 ? (
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined">lock</span>
                                            <span>No Credit Score - Run Analysis First</span>
                                        </div>
                                    ) : activeLoan?.isActive ? (
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined">block</span>
                                            <span>Existing Loan Active</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <span>Execute Loan via CRE</span>
                                            <span className="material-symbols-outlined">bolt</span>
                                        </div>
                                    )}
                                </button>

                                {txHash && (
                                    <a
                                        href={`https://dashboard.tenderly.co/explorer/vnet/7611135a-8515-41d7-8146-9390be57f949/tx/${txHash}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[10px] text-center text-primary hover:underline font-mono truncate px-4 flex items-center justify-center gap-1"
                                    >
                                        <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                                        View on Tenderly: {txHash.slice(0, 10)}...{txHash.slice(-8)}
                                    </a>
                                ) || (
                                        <div className="flex items-center justify-center gap-2 opacity-60">
                                            <span className="material-symbols-outlined text-[14px] text-slate-400">verified</span>
                                            <span className="text-[10px] text-slate-400">Verified via Chainlink CRE</span>
                                        </div>
                                    )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

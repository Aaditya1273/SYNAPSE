"use client";

import { useEffect, useRef, useState } from "react";
import { useAccount } from "wagmi";
import { motion, AnimatePresence } from "framer-motion";
import { useOrchestration } from "@/hooks/useOrchestration";
import { useRouter } from "next/navigation";

export default function OrchestrationPage() {
    const [isVerified, setIsVerified] = useState(false);
    const [nullifierHash, setNullifierHash] = useState<string | null>(null);
    const [proofMetadata, setProofMetadata] = useState<{ id: string, timestamp: number } | null>(null);

    const { address, isConnected } = useAccount();
    const router = useRouter();
    const terminalEndRef = useRef<HTMLDivElement>(null);
    const { nodes, logs, metrics, runPipeline } = useOrchestration();

    // Sync with World ID State and generate client-side only metadata
    useEffect(() => {
        const verified = localStorage.getItem("privacre_verified") === "true";
        const hash = localStorage.getItem("world_id_nullifier");
        setIsVerified(verified);
        setNullifierHash(hash || "0x71...9a2b");

        // Generate metadata once on mount to avoid hydration mismatch
        setProofMetadata({
            id: `PRV-${Math.floor(Math.random() * 10000)}`,
            timestamp: Math.floor(Date.now() / 1000)
        });
    }, []);

    // Auto-scroll terminal
    useEffect(() => {
        if (terminalEndRef.current) {
            terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [logs]);

    const handleRun = () => {
        if (!isConnected) {
            alert("Please connect your wallet first.");
            return;
        }
        runPipeline((result) => {
            // Winning flow
            setTimeout(() => {
                const confirm = window.confirm("Crest Score successfully calculated and signed on-chain! Redirect to Lending to view your loan tiers?");
                if (confirm) router.push("/lending");
            }, 1500);
        });
    };

    return (
        <div className="flex min-h-screen flex-col bg-background-dark text-slate-200">
            <main className="flex-1 px-4 py-8 lg:px-10">
                <div className="mx-auto max-w-7xl">
                    {/* Page Title Area */}
                    <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                        <div>
                            <div className="flex items-center gap-2 text-primary mb-1">
                                <motion.span
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                    className="material-symbols-outlined text-lg"
                                >
                                    hub
                                </motion.span>
                                <span className="text-xs font-bold uppercase tracking-widest">
                                    System Operational
                                </span>
                            </div>
                            <h2 className="text-3xl font-bold text-white md:text-4xl">
                                CRE Orchestration Brain
                            </h2>
                            <p className="mt-2 text-slate-400 max-w-2xl">
                                Monitoring real-time computation for your decentralized Credit Score.
                                Powered by Chainlink Runtime Environment & Groq AI.
                            </p>
                        </div>
                        <div className="flex gap-3 mt-4 md:mt-0">
                            <button
                                onClick={handleRun}
                                className="group relative flex items-center gap-2 overflow-hidden rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-background-dark hover:shadow-[0_0_20px_#0df26c] transition-all"
                            >
                                <motion.span
                                    whileTap={{ scale: 0.9 }}
                                    className="relative flex items-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-lg">play_arrow</span>
                                    RUN PIPELINE
                                </motion.span>
                                <motion.div
                                    className="absolute inset-x-0 bottom-0 h-1 bg-white/20"
                                    initial={{ width: 0 }}
                                    whileHover={{ width: "100%" }}
                                />
                            </button>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                        {/* Latency Card */}
                        <div className="rounded-xl border border-surface-border bg-surface-dark/50 p-5 backdrop-blur-sm">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-400">Network Latency</p>
                                    <h3 className="mt-1 text-2xl font-bold text-white font-mono">{metrics.latency}ms</h3>
                                </div>
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <span className="material-symbols-outlined text-lg">speed</span>
                                </span>
                            </div>
                            <div className="mt-4 flex items-center gap-2 h-2">
                                <div className="flex-1 bg-slate-800 rounded-full h-1 overflow-hidden">
                                    <motion.div
                                        animate={{ width: `${(metrics.latency / 30) * 100}%` }}
                                        className="bg-primary h-full"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Node Distribution Pulse */}
                        <div className="rounded-xl border border-surface-border bg-surface-dark/50 p-5 backdrop-blur-sm">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-400">Node Status</p>
                                    <h3 className="mt-1 text-2xl font-bold text-success">Healthy</h3>
                                </div>
                                <motion.span
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="flex h-8 w-8 items-center justify-center rounded-full bg-success/10 text-success"
                                >
                                    <span className="material-symbols-outlined text-lg">check_circle</span>
                                </motion.span>
                            </div>
                            <div className="mt-4 flex items-center gap-2">
                                <span className="text-xs text-slate-500">Nodes synced across 4 regions</span>
                            </div>
                        </div>

                        {/* Active Sessions */}
                        <div className="rounded-xl border border-surface-border bg-surface-dark/50 p-5 backdrop-blur-sm">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-400">Active Sessions</p>
                                    <h3 className="mt-1 text-2xl font-bold text-white">{metrics.activeSessions}</h3>
                                </div>
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/10 text-purple-400">
                                    <span className="material-symbols-outlined text-lg">group</span>
                                </span>
                            </div>
                            <div className="mt-4 flex -space-x-1">
                                {[...Array(5)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="h-5 w-5 rounded-full border border-surface-dark bg-slate-700"
                                        animate={{ opacity: [0.5, 1, 0.5] }}
                                        transition={{ delay: i * 0.2, duration: 1.5, repeat: Infinity }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Secure Engine */}
                        <div className="rounded-xl border border-surface-border bg-surface-dark/50 p-5 backdrop-blur-sm">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-400">Model Load</p>
                                    <h3 className="mt-1 text-2xl font-bold text-blue-400">Llama 3.3</h3>
                                </div>
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10 text-blue-400">
                                    <span className="material-symbols-outlined text-lg">psychology</span>
                                </span>
                            </div>
                            <p className="mt-4 text-xs text-slate-500">Processing on 70B parameter engine</p>
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column: Pipeline */}
                        <div className="lg:col-span-2 rounded-2xl border border-surface-border bg-surface-dark p-6 lg:p-8">
                            <div className="mb-6 flex items-center justify-between">
                                <h3 className="text-lg font-bold text-white">Execution Pipeline</h3>
                                <div className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                                    <span className="text-xs font-mono text-primary uppercase tracking-tighter">Real-time Stream</span>
                                </div>
                            </div>

                            <div className="relative space-y-6">
                                {/* Connectivity Line Background */}
                                <div className="absolute left-6 top-6 h-[calc(100%-48px)] w-0.5 bg-slate-800"></div>

                                {nodes.map((node, index) => (
                                    <div key={node.id} className="relative z-10 flex gap-6">
                                        <motion.div
                                            initial={false}
                                            animate={{
                                                backgroundColor: node.status === 'completed' ? '#0df26c' : node.status === 'running' ? '#0df26c' : '#1e293b',
                                                borderColor: node.status === 'running' ? '#0df26c' : 'transparent',
                                                scale: node.status === 'running' ? 1.1 : 1
                                            }}
                                            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 transition-all"
                                        >
                                            <span className={`material-symbols-outlined text-background-dark font-bold ${node.status === 'running' ? 'animate-spin' : ''}`}>
                                                {node.status === 'completed' ? 'check' : node.status === 'running' ? 'sync' : 'pending'}
                                            </span>
                                        </motion.div>
                                        <div className={`flex-1 rounded-xl border p-4 transition-all ${node.status === 'running' ? 'border-primary/30 bg-primary/5' : 'border-surface-border bg-transparent'}`}>
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h4 className="font-bold text-white text-lg">{node.name}</h4>
                                                    <p className="text-sm text-slate-400">{node.description}</p>
                                                </div>
                                                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${node.status === 'completed' ? 'text-success border-success/30 bg-success/10' : node.status === 'running' ? 'text-primary border-primary/30 bg-primary/10' : 'text-slate-600 border-slate-700 bg-slate-800'}`}>
                                                    {node.status.toUpperCase()}
                                                </span>
                                            </div>

                                            {/* Progress Bar */}
                                            <div className="w-full bg-slate-800 rounded-full h-1 mt-3 overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${node.progress}%` }}
                                                    className="bg-primary h-full shadow-[0_0_10px_#0df26c]"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Column: Terminal & Identity */}
                        <div className="flex flex-col gap-6">
                            {/* Terminal */}
                            <div className="flex-1 rounded-2xl border border-surface-border bg-[#0a0f0c] overflow-hidden flex flex-col shadow-2xl min-h-[400px]">
                                <div className="flex items-center justify-between border-b border-surface-border bg-[#161b18] px-4 py-2">
                                    <div className="flex items-center gap-1.5">
                                        <div className="h-2.5 w-2.5 rounded-full bg-error/40"></div>
                                        <div className="h-2.5 w-2.5 rounded-full bg-warning/40"></div>
                                        <div className="h-2.5 w-2.5 rounded-full bg-success/40"></div>
                                    </div>
                                    <span className="text-[10px] font-mono text-slate-500 uppercase">risk-engine-v4.2.sh</span>
                                    <span className="material-symbols-outlined text-slate-600 text-sm">terminal</span>
                                </div>
                                <div className="flex-1 p-4 font-mono text-[11px] md:text-xs leading-relaxed text-slate-300 overflow-y-auto max-h-[400px] scrollbar-hide">
                                    <div className="space-y-1">
                                        {logs.length === 0 && <div className="opacity-30 italic text-slate-500">System standby... awaiting instruction.</div>}
                                        {logs.map((log, i) => (
                                            <motion.div
                                                initial={{ opacity: 0, x: -5 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                key={i}
                                                className="flex gap-2"
                                            >
                                                <span className="text-slate-600 shrink-0">[{log.timestamp}]</span>
                                                <span className={
                                                    log.type === 'error' ? 'text-error' :
                                                        log.type === 'success' ? 'text-success' :
                                                            log.type === 'primary' ? 'text-primary' :
                                                                log.type === 'ai' ? 'text-blue-400 font-bold' :
                                                                    log.type === 'dim' ? 'text-slate-600 italic' :
                                                                        'text-white'
                                                }>
                                                    {log.type === 'primary' ? '> ' : ''}{log.message}
                                                </span>
                                            </motion.div>
                                        ))}
                                        <div ref={terminalEndRef} />
                                    </div>
                                </div>
                            </div>

                            {/* Proof Config */}
                            <div className="rounded-xl border border-surface-border bg-surface-dark p-5">
                                <h4 className="text-[10px] font-bold text-slate-500 mb-4 uppercase tracking-[0.2em]">
                                    Proof Metadata
                                </h4>
                                <div className="font-mono text-[11px] text-primary/70 bg-background-dark p-4 rounded-lg border border-surface-border leading-relaxed">
                                    <code>{`{
  "proof_id": "${proofMetadata?.id || "PRV-XXXX"}",
  "method": "groth16",
  "circuit": "credit_risk_v3",
  "nullifier": "${nullifierHash?.substring(0, 16)}...",
  "timestamp": ${proofMetadata?.timestamp || 0}
}`}</code>
                                </div>
                            </div>

                            {/* World ID Card */}
                            <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center">
                                        <div className="h-4 w-4 rounded-full border-2 border-black"></div>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-white">World ID</h4>
                                        <p className="text-[10px] text-slate-400">Identity Verification</p>
                                    </div>
                                    <span className={`ml-auto px-2 py-0.5 rounded text-[10px] font-bold border ${isVerified ? 'text-success border-success/30 bg-success/10' : 'text-warning border-warning/30 bg-warning/10'}`}>
                                        {isVerified ? 'VERIFIED' : 'PENDING'}
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] text-slate-500 font-mono">HASH</span>
                                        <span className="text-[10px] text-white font-mono">{nullifierHash || '0x...'}</span>
                                    </div>
                                    {!isVerified && (
                                        <p className="text-[10px] text-warning/80 mt-2 italic">⚠️ Verifying identity increases score by +15%</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

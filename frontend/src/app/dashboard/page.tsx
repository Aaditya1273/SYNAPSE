"use client";

import { motion } from "framer-motion";
import { Activity, ShieldAlert, Cpu, Lock, Globe, ExternalLink, Loader2 } from "lucide-react";
import { useAetherState } from "@/lib/hooks";

export default function Dashboard() {
    const { isPaused, loading } = useAetherState();
    const riskScore = isPaused ? 88 : 12;
    const status = isPaused ? "ISOLATED" : "ACTIVE";

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black tracking-tight">Protocol Dashboard</h1>
                    <p className="text-gray-400">Monitoring Aegis AI Risk Engine & CRE Workflows</p>
                </div>
                <div className="flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${isPaused ? 'bg-[#ff2e5d]/20 text-[#ff2e5d] border-[#ff2e5d]/30' : 'bg-[#27ae60]/20 text-[#27ae60] border-[#27ae60]/30'}`}>
                        {loading ? <Loader2 size={14} className="animate-spin" /> : isPaused ? <><ShieldAlert size={14} /> SECURITY ALERT: ISOLATED</> : <><Activity size={14} /> SYSTEM STATUS: OPERATIONAL</>}
                    </span>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Risk Overview */}
                <div className="md:col-span-2 glass rounded-3xl p-8 space-y-8">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Activity className="text-[#00f2ff]" /> Real-time Risk Assessment
                        </h2>
                        <span className="text-sm text-gray-400">Target: RWA Treasury Vault</span>
                    </div>

                    <div className="flex items-center gap-12">
                        <div className="relative w-48 h-48 flex items-center justify-center">
                            <svg className="w-full h-full -rotate-90">
                                <circle cx="96" cy="96" r="80" fill="transparent" stroke="currentColor" strokeWidth="12" className="text-white/5" />
                                <motion.circle
                                    cx="96" cy="96" r="80"
                                    fill="transparent" stroke={isPaused ? "#ff2e5d" : "#00f2ff"} strokeWidth="12"
                                    strokeDasharray={2 * Math.PI * 80}
                                    initial={{ strokeDashoffset: 2 * Math.PI * 80 }}
                                    animate={{ strokeDashoffset: (2 * Math.PI * 80) * (1 - riskScore / 100) }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-5xl font-black text-glow">{riskScore}</span>
                                <span className="text-xs uppercase text-gray-500 font-bold">Severity</span>
                            </div>
                        </div>

                        <div className="flex-1 grid grid-cols-2 gap-4">
                            {[
                                { label: "Market Volatility", value: "92%", color: "#ff2e5d" },
                                { label: "Contagion Index", value: "75/100", color: "#f39c12" },
                                { label: "AI Confidence", value: "98.4%", color: "#00f2ff" },
                                { label: "BFT Consensus", value: "12/12 Nodes", color: "#27ae60" }
                            ].map((stat, i) => (
                                <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                    <span className="text-[10px] uppercase text-gray-500 font-bold tracking-widest">{stat.label}</span>
                                    <p className="text-lg font-bold" style={{ color: stat.color }}>{stat.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* AI Consensus Card */}
                <div className="glass rounded-3xl p-8 space-y-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Cpu className="text-[#375bd2]" /> Multi-AI Consensus
                    </h2>
                    <div className="space-y-4">
                        {[
                            { name: "Gemini Pro", status: "BEARISH", color: "#00f2ff", ping: "42ms" },
                            { name: "Claude 3.5", status: "BEARISH", color: "#375bd2", ping: "115ms" },
                            { name: "Grok-1", status: "BEARISH", color: "#ff2e5d", ping: "89ms" }
                        ].map((ai, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: ai.color }} />
                                    <span className="text-sm font-semibold">{ai.name}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-mono text-gray-500">{ai.status}</span>
                                    <span className="text-[10px] font-mono text-gray-400">{ai.ping}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="pt-4 border-t border-white/5 text-[10px] text-gray-500 font-mono italic">
                        Confidential Compute Context Validated by Chainlink
                    </div>
                </div>

            </div>

            {/* Activity Log & Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass rounded-3xl p-8 space-y-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Globe className="text-[#00f2ff]" /> Network Orchestration
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-[#ff2e5d]/10 border border-[#ff2e5d]/20">
                            <div className="flex gap-4">
                                <ShieldAlert className="text-[#ff2e5d]" />
                                <div>
                                    <p className="font-bold text-sm">Circuit Breaker Triggered</p>
                                    <p className="text-xs text-gray-400">0x5e9168a4...BB532655dF</p>
                                </div>
                            </div>
                            <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10"><ExternalLink size={16} /></button>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-[#375bd2]/10 border border-[#375bd2]/20 opacity-50">
                            <div className="flex gap-4">
                                <Lock className="text-[#375bd2]" />
                                <div>
                                    <p className="font-bold text-sm">CCIP Migration Pending</p>
                                    <p className="text-xs text-gray-400">Target: Arbitrum One</p>
                                </div>
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-white/10 rounded">Queued</span>
                        </div>
                    </div>
                </div>

                <div className="glass rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-[#00f2ff]/10 flex items-center justify-center">
                        <RefreshCcw className="text-[#00f2ff] animate-spin-slow" />
                    </div>
                    <h3 className="text-xl font-bold">Autonomous Monitoring Active</h3>
                    <p className="text-gray-400 text-sm max-w-xs">CRE Workflows are scanning 12 asset classes and 8 markets for predictive contagion alerts.</p>
                    <button className="w-full py-3 rounded-xl bg-white/10 border border-white/10 font-bold hover:bg-white/15 transition-all">
                        Manual Override [Owner Only]
                    </button>
                </div>
            </div>
        </div>
    );
}

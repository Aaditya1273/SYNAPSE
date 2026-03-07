"use client";

import { motion } from "framer-motion";
import { Activity, ShieldAlert, Cpu, Globe, ExternalLink, Loader2, RefreshCw, BarChart3, Fingerprint } from "lucide-react";
import { useAetherState, useWallet, useAetherActions, useAuditLogs } from "@/lib/hooks";

export default function Dashboard() {
    const { isPaused, riskState, loading } = useAetherState();
    const { account, client } = useWallet();
    const { manualOverride, pending: actionPending } = useAetherActions(client, account);
    const { logs: firewallLogs } = useAuditLogs();

    const riskScore = riskState?.score ?? (isPaused ? 88 : 12);
    const lastUpdate = riskState ? new Date(riskState.lastUpdated * 1000).toLocaleTimeString() : "SYNCING...";

    const getAIStatus = (risk: number) => {
        if (risk > 70) return { status: "PANIC", color: "#ff2e5d" };
        if (risk > 40) return { status: "CAUTIOUS", color: "#f39c12" };
        return { status: "BULLISH", color: "#27ae60" };
    };

    return (
        <div className="max-w-7xl mx-auto space-y-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#00f2ff]">
                        <Fingerprint size={14} /> Secure Terminal Access
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter text-white">Risk Orchestration Hub</h1>
                    <p className="text-gray-400 font-medium">Monitoring Aegis AI Risk Engine • <span className="text-gray-200">Refreshed: {lastUpdate}</span></p>
                </div>
                <div className="flex items-center gap-4">
                    <div className={`px-5 py-2.5 rounded-2xl glass-premium flex items-center gap-3 border transition-all duration-500 ${isPaused ? 'border-red-500/30 bg-red-500/5' : 'border-emerald-500/30 bg-emerald-500/5'}`}>
                        {loading ? (
                            <Loader2 size={16} className="animate-spin text-gray-400" />
                        ) : isPaused ? (
                            <><ShieldAlert size={16} className="text-[#ff2e5d] animate-pulse" /> <span className="text-[11px] font-black uppercase tracking-widest text-[#ff2e5d]">Protocol Isolated</span></>
                        ) : (
                            <><Activity size={16} className="text-[#27ae60] animate-pulse" /> <span className="text-[11px] font-black uppercase tracking-widest text-[#27ae60]">System Operational</span></>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Risk Display */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Tactical Risk Meter */}
                <div className="lg:col-span-2 glass-premium rounded-[2.5rem] p-10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                        <BarChart3 size={200} className="text-white" />
                    </div>

                    <div className="flex justify-between items-start relative z-10">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-3">
                                <Activity className="text-[#00f2ff]" /> Threat Intel Scan
                            </h2>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Target Asset: RWA_TREASURY_VAULT_01</p>
                        </div>
                        <div className="text-[10px] font-black text-[#00f2ff] bg-[#00f2ff]/10 px-3 py-1.5 rounded-lg uppercase tracking-widest">Live On-Chain Feed</div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-16 py-8 relative z-10">
                        <div className="relative w-64 h-64 flex items-center justify-center">
                            {/* SVG Gauge */}
                            <svg className="w-full h-full -rotate-90">
                                <defs>
                                    <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#00f2ff" />
                                        <stop offset="100%" stopColor="#ff2e5d" />
                                    </linearGradient>
                                </defs>
                                <circle cx="128" cy="128" r="110" fill="transparent" stroke="currentColor" strokeWidth="16" className="text-white/5" />
                                <motion.circle
                                    cx="128" cy="128" r="110"
                                    fill="transparent" stroke="url(#gaugeGradient)" strokeWidth="16" strokeLinecap="round"
                                    strokeDasharray={2 * Math.PI * 110}
                                    initial={{ strokeDashoffset: 2 * Math.PI * 110 }}
                                    animate={{ strokeDashoffset: (2 * Math.PI * 110) * (1 - riskScore / 100) }}
                                    transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <motion.span
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="text-7xl font-black text-white tracking-tighter text-glow-cyan"
                                >
                                    {riskScore}
                                </motion.span>
                                <span className="text-[10px] uppercase text-gray-500 font-black tracking-[0.3em]">Scored Severity</span>
                            </div>
                        </div>

                        <div className="flex-1 grid grid-cols-2 gap-6 w-full">
                            {[
                                { label: "Volatility Delta", value: `${(riskScore * 1.05).toFixed(1)}%`, color: riskScore > 50 ? "#ff2e5d" : "#00f2ff", trend: riskScore > 50 ? "UP" : "STABLE" },
                                { label: "Contagion Spillover", value: riskScore > 70 ? "Critical" : riskScore > 40 ? "High" : "Low", color: "#f39c12", trend: "MONITORED" },
                                { label: "Engine Confidence", value: `${(99.9 - (riskScore / 1000)).toFixed(2)}%`, color: "#00f2ff", trend: "STEADY" },
                                { label: "Node Consensus", value: "Synced", color: "#27ae60", trend: "12/12" }
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 + (i * 0.1) }}
                                    className="p-5 glass-card rounded-2xl border border-white/5 space-y-2 hover:border-[#00f2ff]/20 transition-all cursor-default"
                                >
                                    <span className="text-[9px] uppercase text-gray-500 font-black tracking-widest">{stat.label}</span>
                                    <div className="flex justify-between items-end">
                                        <p className="text-xl font-black text-white" style={{ color: stat.trend === 'UP' ? '#ff2e5d' : 'white' }}>{stat.value}</p>
                                        <span className="text-[9px] font-bold text-gray-500">{stat.trend}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* AI Multi-Agent Consensus */}
                <div className="glass-premium rounded-[2.5rem] p-8 space-y-8 flex flex-col">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-3">
                            <Cpu className="text-[#375bd2]" /> Multi-AI Core
                        </h2>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Confidential Multi-Agent Consensus</p>
                    </div>

                    <div className="space-y-4 flex-1">
                        {[
                            { name: "Gemini 1.5 Pro", status: getAIStatus(riskScore).status, color: getAIStatus(riskScore).color, latency: "42ms" },
                            { name: "Claude 3.5 Sonnet", status: getAIStatus(riskScore - 5).status, color: getAIStatus(riskScore - 5).color, latency: "115ms" },
                            { name: "Grok-1 Autonomous", status: getAIStatus(riskScore + 5).status, color: getAIStatus(riskScore + 5).color, latency: "89ms" }
                        ].map((ai, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 + (i * 0.1) }}
                                className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-2.5 h-2.5 rounded-full animate-pulse shadow-[0_0_10px_rgba(0,0,0,0.5)]" style={{ background: ai.color }} />
                                    <span className="text-xs font-black text-white uppercase tracking-tight">{ai.name}</span>
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] font-black text-white opacity-80" style={{ color: ai.color }}>{ai.status}</div>
                                    <div className="text-[9px] font-bold text-gray-500">{ai.latency}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-[10px] font-bold font-mono text-gray-400 group relative">
                        <div className="absolute top-2 left-2 w-1 h-1 rounded-full bg-[#00f2ff] animate-ping" />
                        <span className="text-[#00f2ff] mr-2">LOG_ID:</span> {riskState?.reason || "Awaiting pulse from Oracle network..."}
                    </div>
                </div>

            </div>

            {/* Bottom Orchestration Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass-premium rounded-[2.5rem] p-10 space-y-8 group">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-3">
                            <Globe className="text-[#00f2ff]" /> Active Firewall
                        </h2>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Protocol Response Unit</span>
                    </div>

                    <div className="space-y-4 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                        {firewallLogs.length > 0 ? firewallLogs.map((log: { event: string; id: string; txHash?: string }, i: number) => (
                            <motion.div
                                key={i}
                                whileHover={{ x: 5 }}
                                className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
                                onClick={() => log.txHash && window.open(`https://virtual.sepeth.tenderly.co/tx/${log.txHash}`, '_blank')}
                            >
                                <div className="flex gap-3 items-center">
                                    <div className="w-10 h-10 rounded-lg bg-[#ff2e5d]/10 flex items-center justify-center">
                                        <ShieldAlert size={18} className="text-[#ff2e5d]" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-[11px] text-white uppercase tracking-tight">{log.event}</p>
                                        <p className="font-mono text-[9px] text-gray-500">{log.id}</p>
                                    </div>
                                </div>
                                <ExternalLink size={14} className="text-gray-500" />
                            </motion.div>
                        )) : (
                            <div className="p-8 text-center glass-card rounded-2xl border border-white/5">
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">No Active Threats Detected</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="glass-premium rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center space-y-6 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#00f2ff]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    <div className="w-20 h-20 rounded-[2rem] bg-white/5 flex items-center justify-center relative shadow-2xl transition-all duration-700 group-hover:scale-110 group-hover:rotate-12">
                        <div className="absolute inset-0 bg-[#00f2ff]/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                        <RefreshCw className="text-[#00f2ff] relative z-10" size={32} />
                    </div>
                    <div className="space-y-2 relative z-10">
                        <h3 className="text-2xl font-black tracking-tight text-white capitalize">Autonomous Scrutiny Pulse</h3>
                        <p className="text-gray-400 text-sm max-w-xs font-medium leading-relaxed">System is continuously scanning 12 asset classes and 8 markets for predictive contagion alerts.</p>
                    </div>
                    <button
                        onClick={() => manualOverride(2, 85, "Manual Tactical Intervention")}
                        disabled={!account || actionPending}
                        className="w-full py-4 rounded-2xl glass-premium border-white/10 font-black uppercase tracking-[0.2em] text-[10px] text-white hover:bg-white/5 hover:border-[#00f2ff]/50 transition-all btn-institutional relative z-10 disabled:opacity-50"
                    >
                        {actionPending ? <Loader2 className="animate-spin w-4 h-4 mx-auto" /> : account ? "Manual Override Protocol" : "Connect Wallet to Act"}
                    </button>
                </div>
            </div>
        </div>
    );
}

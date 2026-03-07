"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Activity, ShieldAlert, Cpu, Globe, ExternalLink } from "lucide-react";
import { useAetherState, useAuditLogs } from "@/lib/hooks";

export default function NetworkPage() {
    const { riskState, isPaused } = useAetherState();
    const { logs } = useAuditLogs();
    const [latency, setLatency] = useState(42);

    useEffect(() => {
        const interval = setInterval(() => {
            setLatency(prev => Math.max(38, Math.min(48, prev + (Math.random() - 0.5) * 2)));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const currentRisk = riskState?.score ?? (isPaused ? 88 : 12);
    const latestLog = logs[0] || { id: "Log_SYNCING", event: "Monitoring Pulse" };

    return (
        <div className="max-w-7xl mx-auto space-y-16 py-12 px-8">
            {/* Header - Institutional Light Mode */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-gray-100 pb-12">
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#2563EB]">
                        <Globe size={14} /> Global Tactical Mesh
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter text-[#0F172A] uppercase">
                        Network <span className="text-[#2563EB]">Orchestrator</span>
                    </h1>
                    <p className="text-gray-500 font-medium max-w-xl">
                        Real-time correlation mapping & tactical asset spillover analysis. <br />
                        <span className="text-[#0F172A]/40 text-[10px] font-bold uppercase tracking-widest leading-none">Active Consensus: Locked</span>
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="px-6 py-3 rounded-xl border border-blue-100 bg-blue-50/30 flex items-center gap-3">
                        <Activity size={16} className="text-[#2563EB] animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#2563EB]">SENTINEL_SCAN_ACTIVE</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Tactical Specs Sidebar */}
                <div className="md:col-span-1 space-y-6">
                    <div className="card-minimal p-8 space-y-6">
                        <div className="w-10 h-10 rounded-lg bg-gray-950 flex items-center justify-center">
                            <Cpu className="text-white" size={20} />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-sm font-black text-[#0F172A] uppercase tracking-wider">Risk Engine</h3>
                            <p className="text-[10px] font-bold text-gray-400 leading-relaxed">
                                Real-time calculation of cross-asset correlation.
                            </p>
                        </div>
                        <div className="pt-6 border-t border-gray-50">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest mb-3">
                                <span className="text-gray-400">Node Latency</span>
                                <span className="text-[#2563EB]">{latency.toFixed(1)}ms</span>
                            </div>
                            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-[#2563EB]"
                                    initial={{ width: 0 }}
                                    animate={{ width: "94%" }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="card-minimal p-8 space-y-6 bg-gray-50/30">
                        <h3 className="text-sm font-black text-[#0F172A] uppercase tracking-widest">Node Taxonomy</h3>
                        <div className="space-y-4">
                            {[
                                { label: "Tokyo-A1", status: "STABLE", color: "#10B981" },
                                { label: "NYC-Gate", status: "DORMANT", color: "#94A3B8" },
                                { label: "SG-Relay", status: "NOMINAL", color: "#2563EB" },
                            ].map((item, i) => (
                                <div key={i} className="flex justify-between items-center px-1">
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">{item.label}</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: item.color }} />
                                        <span className="text-[9px] font-black" style={{ color: item.color }}>{item.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Orchestration Mesh View */}
                <div className="md:col-span-3 card-minimal min-h-[700px] relative overflow-hidden flex flex-col">
                    <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/10">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
                                <Globe size={20} className="text-[#2563EB]" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-black text-[#0F172A] uppercase tracking-[0.2em]">Global Propagation Mesh</span>
                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Protocol Visualization v4.0</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[9px] font-black text-emerald-600 uppercase">Live Intelligence Feed</span>
                        </div>
                    </div>

                    <div className="flex-1 flex items-center justify-center p-20 relative">
                        {/* Background Decoration */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center">
                            <Globe size={600} className="text-[#2563EB]" />
                        </div>

                        <div className="relative z-10 w-full max-w-2xl text-center space-y-12">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="relative inline-block"
                            >
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                                    className="w-40 h-40 rounded-full border border-gray-100 flex items-center justify-center mx-auto bg-white shadow-xl shadow-gray-200/20"
                                >
                                    <div className="w-32 h-32 rounded-full border-2 border-dashed border-gray-50 flex items-center justify-center">
                                        <Globe size={64} className="text-[#2563EB]/20" />
                                    </div>
                                </motion.div>
                                <div className="absolute top-0 right-0 w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-lg" />
                            </motion.div>

                            <div className="space-y-6">
                                <h2 className="text-5xl font-black text-[#0F172A] uppercase tracking-tighter leading-none">
                                    Institutional <span className="text-[#2563EB]">Connectivity Matrix</span>
                                </h2>
                                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-[0.3em] max-w-lg mx-auto leading-loose">
                                    Predictive contagion maps derived from real-time asset volatility and cross-chain sentiment analysis.
                                </p>
                            </div>

                            <div className="flex gap-10 justify-center pt-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#2563EB] shadow-sm shadow-blue-500/50" />
                                    <span className="text-[10px] font-black text-[#0F172A] uppercase tracking-widest">Validator Node</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-2.5 h-2.5 rounded-full bg-orange-400 shadow-sm shadow-orange-500/50" />
                                    <span className="text-[10px] font-black text-[#0F172A] uppercase tracking-widest">Active Threat</span>
                                </div>
                            </div>
                        </div>

                        {/* Alert Popover - Bottom Left for better space usage */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="absolute bottom-10 left-10 p-8 bg-white border border-gray-100 rounded-[2rem] shadow-2xl shadow-gray-200/50 max-w-[320px] space-y-4"
                        >
                            <div className="flex items-center gap-3 text-red-600 font-black text-[10px] tracking-[0.2em] uppercase">
                                <div className="p-1.5 rounded-lg bg-red-50 border border-red-100">
                                    <ShieldAlert size={14} className="animate-bounce" />
                                </div>
                                Tactical Alert
                            </div>
                            <div className="space-y-2">
                                <p className="text-[12px] text-[#0F172A] font-black uppercase tracking-tight leading-snug">
                                    {latestLog.event} Detected
                                </p>
                                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                                    Potential spillover to Institutional Vault: <span className="text-red-500">{currentRisk}%</span>.
                                </p>
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                                <span className="font-mono text-[9px] text-gray-400 font-bold">{latestLog.id}</span>
                                <ExternalLink size={14} className="text-[#2563EB] cursor-pointer hover:scale-110 transition-transform" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}

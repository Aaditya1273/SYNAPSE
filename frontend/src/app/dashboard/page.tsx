"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Activity, ShieldAlert, Cpu, Globe, ExternalLink, Loader2, Zap, Lock, Fingerprint } from "lucide-react";
import { useAetherState, useWallet, useAetherActions, useAuditLogs } from "@/lib/hooks";

export default function Dashboard() {
    const { isPaused, riskState, loading } = useAetherState();
    const { account } = useWallet();
    const { manualOverride, pending } = useAetherActions(null, account);
    const { logs: firewallLogs } = useAuditLogs();
    const [overrideNote, setOverrideNote] = useState("");

    const riskScore = riskState?.score ?? (isPaused ? 88 : 12);
    const lastUpdate = riskState ? new Date(riskState.lastUpdated * 1000).toLocaleTimeString() : "SYNCING...";

    const getAIStatus = (risk: number) => {
        if (risk > 70) return { status: "CRITICAL", color: "#EF4444" };
        if (risk > 40) return { status: "WARNING", color: "#F59E0B" };
        return { status: "STABLE", color: "#10B981" };
    };

    return (
        <div className="max-w-7xl mx-auto space-y-16 py-12 px-8">
            {/* Header - Minimalist */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-gray-100 pb-12">
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#2563EB]">
                        <Fingerprint size={14} /> Protocol Terminal
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter text-[#0F172A] uppercase">
                        Protocol <span className="text-[#2563EB]">Dashboard</span>
                    </h1>
                    <p className="text-gray-500 font-medium max-w-xl">
                        Real-time risk orchestration for Institutional Vault 01. <br />
                        <span className="text-[#0F172A]/40 text-[10px] font-bold uppercase tracking-widest">Oracle Sync: {lastUpdate}</span>
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className={`px-6 py-3 rounded-xl border flex items-center gap-3 transition-all ${isPaused ? 'border-red-100 bg-red-50 text-red-600' : 'border-emerald-100 bg-emerald-50 text-emerald-600'}`}>
                        {loading ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : isPaused ? (
                            <><ShieldAlert size={16} className="animate-pulse" /> <span className="text-[10px] font-black uppercase tracking-widest">Isolation Active</span></>
                        ) : (
                            <><Activity size={16} className="animate-pulse" /> <span className="text-[10px] font-black uppercase tracking-widest">Protocol Nominal</span></>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Risk Display */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Risk Pulse Card - Minimalist */}
                <div className="lg:col-span-2 card-minimal p-10 flex flex-col justify-between group">
                    <div className="flex justify-between items-start">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100 mb-6">
                            <Activity className="text-[#2563EB]" size={24} />
                        </div>
                        <span className="text-[10px] font-black text-[#2563EB] bg-blue-50 px-3 py-1.5 rounded-lg uppercase tracking-widest border border-blue-100">Live On-Chain Telemetry</span>
                    </div>

                    <div className="flex flex-col md:flex-row items-end gap-12">
                        <div className="space-y-4">
                            <div className="text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none">Global Threat Score</div>
                            <div className="text-8xl font-black text-[#0F172A] tracking-tighter hover:text-[#2563EB] transition-colors leading-[0.85]">
                                {riskScore}
                                <span className="text-2xl text-gray-300 font-medium ml-2">/100</span>
                            </div>
                        </div>

                        <div className="flex-1 space-y-6 w-full">
                            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100">
                                <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                                    <span>Containment Buffer</span>
                                    <span className="text-[#2563EB]">Efficient</span>
                                </div>
                                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${riskScore}%` }}
                                        className="h-full bg-[#2563EB]"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-10 pt-10 border-t border-gray-50">
                        {[
                            { label: "Predictive Drift", value: "+0.12%", color: "#2563EB" },
                            { label: "Contagion risk", value: riskScore > 50 ? "Unstable" : "Nominal", color: riskScore > 50 ? "#EF4444" : "#10B981" },
                            { label: "Consensus", value: "Locked", color: "#0F172A" }
                        ].map((stat, i) => (
                            <div key={i} className="space-y-1">
                                <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</div>
                                <div className="text-sm font-black text-[#0F172A]" style={{ color: stat.color }}>{stat.value}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* AI Agents Card */}
                <div className="card-minimal p-8 flex flex-col">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-lg bg-gray-950 flex items-center justify-center">
                            <Cpu className="text-white" size={20} />
                        </div>
                        <div className="space-y-0.5">
                            <h2 className="text-sm font-black text-[#0F172A] uppercase tracking-wider">Multi-Agent Core</h2>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em]">Confidential Consensus</p>
                        </div>
                    </div>

                    <div className="space-y-3 flex-1">
                        {[
                            { name: "Gemini 1.5 Pro", status: getAIStatus(riskScore).status, color: getAIStatus(riskScore).color },
                            { name: "Claude 3.5 Sonnet", status: getAIStatus(riskScore - 2).status, color: getAIStatus(riskScore - 2).color },
                            { name: "Grok-1 Tactical", status: getAIStatus(riskScore + 2).status, color: getAIStatus(riskScore + 2).color }
                        ].map((ai, i) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-gray-50 hover:bg-gray-50 transition-colors">
                                <span className="text-[11px] font-bold text-gray-600 uppercase tracking-tight">{ai.name}</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ background: ai.color }} />
                                    <span className="text-[10px] font-black" style={{ color: ai.color }}>{ai.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 p-4 rounded-xl bg-gray-950 text-[10px] font-mono text-gray-400">
                        <span className="text-[#2563EB] mr-2">ORACLE:</span> {riskState?.reason || "Nominal state detected..."}
                    </div>
                </div>
            </div>

            {/* Bottom Section - Firewall & Override */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10">
                {/* Firewall Logs - Clean Bordered List */}
                <div className="md:col-span-2 card-minimal flex flex-col">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <div className="flex items-center gap-3">
                            <Lock size={16} className="text-[#2563EB]" />
                            <span className="text-[11px] font-black text-[#0F172A] uppercase tracking-widest">Propagation Firewall Logs</span>
                        </div>
                        <div className="flex gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                        </div>
                    </div>
                    <div className="p-2 overflow-y-auto max-h-[300px]">
                        {firewallLogs.length > 0 ? firewallLogs.map((log: { event: string; id: string; txHash?: string }, i: number) => (
                            <div
                                key={i}
                                onClick={() => log.txHash && window.open(`https://virtual.sepeth.tenderly.co/tx/${log.txHash}`, '_blank')}
                                className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-all cursor-pointer group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:border-red-100">
                                        <ShieldAlert size={14} className="text-red-500" />
                                    </div>
                                    <div>
                                        <p className="font-extrabold text-[11px] text-[#0F172A] uppercase tracking-tight leading-tight">{log.event}</p>
                                        <p className="font-mono text-[9px] text-gray-400">{log.id}</p>
                                    </div>
                                </div>
                                <ExternalLink size={14} className="text-gray-300 group-hover:text-[#2563EB]" />
                            </div>
                        )) : (
                            <div className="p-12 text-center">
                                <Activity size={32} className="mx-auto text-gray-100 mb-4" />
                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">All Propagation Paths Secure</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Manual Override - Emergency Protocol */}
                <div className="card-minimal border-red-100 bg-red-50/20 p-8 flex flex-col justify-center space-y-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-red-600 text-[9px] font-black uppercase tracking-widest">
                            <Zap size={14} className="animate-pulse" /> Emergency Control
                        </div>
                        <h3 className="text-xl font-black text-[#0F172A] uppercase">Isolation Protocol</h3>
                        <p className="text-xs text-gray-500 font-medium leading-relaxed">
                            Requires cryptographically signed justification to bypass autonomous logic.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="State Reason..."
                            value={overrideNote}
                            onChange={(e) => setOverrideNote(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-[#0F172A] focus:ring-4 focus:ring-red-100 outline-none transition-all placeholder:text-gray-300"
                        />
                        <button
                            onClick={() => manualOverride(2, 85, overrideNote || "Manual Intervention")}
                            disabled={!account || pending || !overrideNote}
                            className="w-full py-4 rounded-xl bg-red-600 text-white font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-red-700 transition-all disabled:opacity-30 disabled:grayscale shadow-lg shadow-red-500/10"
                        >
                            {pending ? <Loader2 className="animate-spin" size={16} /> : "Trigger Isolation"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Activity, ShieldAlert, Cpu, Globe, ExternalLink, Loader2, Zap, Lock, Fingerprint } from "lucide-react";
import { useAetherState, useWallet, useAetherActions, useAuditLogs, useMarketData } from "@/lib/hooks";

export default function Dashboard() {
    const { isPaused, riskState, loading } = useAetherState();
    const { account } = useWallet();
    const { manualOverride, pending } = useAetherActions();
    const { logs: firewallLogs } = useAuditLogs();
    const btcData = useMarketData();
    const [overrideNote, setOverrideNote] = useState("");
    const [overrideError, setOverrideError] = useState<string | null>(null);

    const handleOverride = async () => {
        setOverrideError(null);
        try {
            await manualOverride(2, 85, overrideNote || "Manual Intervention");
        } catch (error: any) {
            setOverrideError(error.message || "Transaction failed");
        }
    };

    const riskScore = riskState?.score ?? (isPaused ? 88 : 12);
    const lastUpdate = riskState ? new Date(riskState.lastUpdated * 1000).toLocaleTimeString() : "SYNCING...";

    const getAIStatus = (risk: number) => {
        if (risk > 70) return { status: "CRITICAL", color: "#EF4444" };
        if (risk > 40) return { status: "WARNING", color: "#F59E0B" };
        return { status: "STABLE", color: "#10B981" };
    };

    return (
        <div className="max-w-7xl mx-auto space-y-16 py-32 px-8">
            {/* Header - Minimalist */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/5 pb-12">
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#2563EB]">
                        <Fingerprint size={14} /> Protocol Terminal
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter text-white uppercase">
                        Protocol <span className="text-[#2563EB]">Dashboard</span>
                    </h1>
                    <p className="text-gray-400 font-medium max-w-xl text-sm leading-relaxed">
                        Real-time risk orchestration for Institutional Vault 01. <br />
                        <span className="text-white/20 text-[10px] font-bold uppercase tracking-widest mt-2 block">Oracle Sync: {lastUpdate}</span>
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className={`px-6 py-3 rounded-xl border flex items-center gap-3 transition-all ${isPaused ? 'border-red-500/20 bg-red-500/5 text-red-500' : 'border-emerald-500/20 bg-emerald-500/5 text-emerald-500'}`}>
                        {loading ? (
                            <Loader2 size={16} className="animate-spin text-blue-500" />
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
                <div className="lg:col-span-2 card-minimal p-10 flex flex-col justify-between group overflow-hidden">
                    <div className="flex justify-between items-start">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 mb-6 shadow-2xl shadow-blue-500/10">
                            <Activity className="text-[#2563EB]" size={24} />
                        </div>
                        <span className="text-[10px] font-black text-[#2563EB] bg-blue-500/5 px-3 py-1.5 rounded-lg uppercase tracking-widest border border-blue-500/10">Live On-Chain Telemetry</span>
                    </div>

                    <div className="flex flex-col md:flex-row items-end gap-12">
                        <div className="space-y-4">
                            <div className="text-[11px] font-black text-gray-500 uppercase tracking-widest leading-none">Global Threat Score</div>
                            <div className="text-8xl font-black text-white group-hover:text-[#2563EB] transition-colors flex items-baseline gap-6">
                                {riskScore}
                                <span className="text-2xl text-white/20 font-medium">/100</span>
                            </div>
                        </div>

                        <div className="flex-1 space-y-6 w-full">
                            <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                                <div className="flex justify-between text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">
                                    <span>Containment Buffer</span>
                                    <span className="text-[#2563EB]">Efficient</span>
                                </div>
                                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${riskScore}%` }}
                                        className="h-full bg-[#2563EB] shadow-[0_0_15px_rgba(37,99,235,0.5)]"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-10 pt-10 border-t border-white/5">
                        {[
                            { label: "Predictive Drift", value: btcData ? (btcData.change24h > 0 ? "+" : "") + btcData.change24h.toFixed(2) + "%" : "SYNCING...", color: "#2563EB" },
                            { label: "Contagion risk", value: riskScore > 50 ? "Unstable" : "Nominal", color: riskScore > 50 ? "#EF4444" : "#10B981" },
                            { label: "Consensus", value: "Verified", color: "#60A5FA" }
                        ].map((stat, i) => (
                            <div key={i} className="space-y-1">
                                <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{stat.label}</div>
                                <div className="text-sm font-black" style={{ color: stat.color }}>{stat.value}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* AI Agents Card */}
                <div className="card-minimal p-8 flex flex-col">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Cpu className="text-white" size={20} />
                        </div>
                        <div className="space-y-0.5">
                            <h2 className="text-sm font-black text-white uppercase tracking-wider">Multi-Agent Core</h2>
                            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.2em]">Confidential Consensus</p>
                        </div>
                    </div>

                    <div className="space-y-3 flex-1">
                        {[
                            { name: "Gemini 1.5 Pro", status: getAIStatus(riskScore).status, color: getAIStatus(riskScore).color },
                            { name: "Claude 3.5 Sonnet", status: getAIStatus(riskScore + (btcData ? Math.floor(btcData.change24h) : 0)).status, color: getAIStatus(riskScore + (btcData ? Math.floor(btcData.change24h) : 0)).color },
                            { name: "Grok-1 Tactical", status: getAIStatus(riskScore - (btcData ? Math.floor(btcData.change24h) : 0)).status, color: getAIStatus(riskScore - (btcData ? Math.floor(btcData.change24h) : 0)).color }
                        ].map((ai, i) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-white/5 hover:bg-white/5 hover:border-blue-500/20 transition-all group">
                                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-tight group-hover:text-white transition-colors">{ai.name}</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]" style={{ background: ai.color, color: ai.color }} />
                                    <span className="text-[10px] font-black" style={{ color: ai.color }}>{ai.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 space-y-4">
                        <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex justify-between items-center border-b border-white/5 pb-2">
                            <span>Tactical Command Stream</span>
                            <div className="flex gap-1">
                                <span className="w-1 h-1 rounded-full bg-[#2563EB] animate-pulse shadow-[0_0_8px_#2563EB]" />
                                <span className="w-1 h-1 rounded-full bg-[#2563EB] animate-pulse delay-75 shadow-[0_0_8px_#2563EB]" />
                                <span className="w-1 h-1 rounded-full bg-[#2563EB] animate-pulse delay-150 shadow-[0_0_8px_#2563EB]" />
                            </div>
                        </div>
                        <div className="space-y-3">
                            {firewallLogs.slice(0, 3).map((log: any, i: number) => (
                                <motion.div
                                    key={log.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="p-3 rounded-xl bg-white/2 border border-white/5 flex justify-between items-center group cursor-pointer hover:bg-white/5 hover:border-blue-500/30 transition-all"
                                    onClick={() => log.txHash && window.open(`https://dashboard.tenderly.co/explorer/vnet/ddf4998e-00a6-47cd-b249-8c1018222361/tx/${log.txHash}`, '_blank')}
                                >
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-[8px] font-black text-[#2563EB] uppercase tracking-tighter">SIG_#{log.id.split('-')[1]}</span>
                                        <span className="text-[10px] font-bold text-white uppercase tracking-tight truncate max-w-[150px]">
                                            {log.event.replace("Manual Override: ", "")}
                                        </span>
                                    </div>
                                    <ExternalLink size={10} className="text-gray-600 group-hover:text-[#2563EB]" />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section - Firewall & Override */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10">
                {/* Firewall Logs - Clean Bordered List */}
                <div className="md:col-span-2 card-minimal flex flex-col">
                    <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/2">
                        <div className="flex items-center gap-3">
                            <Lock size={16} className="text-[#2563EB]" />
                            <span className="text-[11px] font-black text-white uppercase tracking-widest">Propagation Firewall Logs</span>
                        </div>
                        <div className="flex gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                            <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                        </div>
                    </div>
                    <div className="p-2 overflow-y-auto max-h-[300px]">
                        {firewallLogs.length > 0 ? firewallLogs.map((log: { event: string; id: string; txHash?: string }, i: number) => (
                            <div
                                key={i}
                                onClick={() => log.txHash && window.open(`https://dashboard.tenderly.co/explorer/vnet/ddf4998e-00a6-47cd-b249-8c1018222361/tx/${log.txHash}`, '_blank')}
                                className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all cursor-pointer group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-blue-500/30 transition-colors">
                                        {log.id.startsWith('CRE-') ? (
                                            <Cpu size={14} className="text-[#2563EB]" />
                                        ) : (
                                            <ShieldAlert size={14} className="text-red-500" />
                                        )}
                                    </div>
                                    <div>
                                        <p className={`font-extrabold text-[11px] uppercase tracking-tight leading-tight ${log.id.startsWith('CRE-') ? 'text-[#2563EB]' : 'text-white'}`}>
                                            {log.event.replace("CRE Consensus: ", "").replace("Manual Override: ", "")}
                                        </p>
                                        <p className="font-mono text-[9px] text-gray-400 flex items-center gap-1">
                                            <span className={`px-1 rounded-[2px] text-[7px] text-white ${log.id.startsWith('CRE-') ? 'bg-blue-600' : 'bg-red-600'}`}>
                                                {log.id.split('-')[0]}
                                            </span>
                                            {log.id}
                                        </p>
                                    </div>
                                </div>
                                <ExternalLink size={14} className="text-gray-300 group-hover:text-[#2563EB]" />
                            </div>
                        )) : (
                            <div className="p-12 text-center">
                                <Activity size={32} className="mx-auto text-white/5 mb-4" />
                                <p className="text-[10px] font-black text-white/10 uppercase tracking-widest">All Propagation Paths Secure</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Manual Override - Emergency Protocol */}
                <div className="card-minimal border-red-500/30 bg-red-500/5 p-8 flex flex-col justify-center space-y-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-red-500 text-[9px] font-black uppercase tracking-widest">
                            <Zap size={14} className="animate-pulse shadow-[0_0_8px_#EF4444]" /> Emergency Control
                        </div>
                        <h3 className="text-xl font-black text-white uppercase italic">Isolation Protocol</h3>
                        <p className="text-xs text-gray-400 font-medium leading-relaxed">
                            Requires cryptographically signed justification <br /> to bypass autonomous logic.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {overrideError && (
                            <div className="bg-red-900/50 border border-red-500/50 text-red-200 text-[10px] font-bold px-4 py-3 rounded-lg flex items-center gap-2">
                                <ShieldAlert size={14} /> {overrideError}
                            </div>
                        )}
                        <input
                            type="text"
                            placeholder="State Reason For Transaction..."
                            value={overrideNote}
                            onChange={(e) => setOverrideNote(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-white focus:ring-4 focus:ring-red-500/10 outline-none transition-all placeholder:text-gray-600 focus:border-red-500/50"
                        />
                        <button
                            onClick={handleOverride}
                            disabled={!account || pending || !overrideNote}
                            className="w-full py-4 rounded-xl bg-red-600 text-white font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-red-700 transition-all disabled:opacity-30 disabled:grayscale shadow-lg shadow-red-500/10"
                        >
                            {pending ? <Loader2 className="animate-spin" size={16} /> : "TRIGGER ISOLATION"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Overrride Error Modal Overlay */}
            {overrideError && overrideError.includes("ISOLATION_ACTIVE") && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-[#0f172a] border border-red-500/50 p-8 rounded-3xl max-w-md w-full shadow-2xl shadow-red-500/10 space-y-6"
                    >
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3 text-red-500">
                                <ShieldAlert size={24} className="animate-pulse" />
                                <h3 className="text-xl font-black uppercase tracking-widest">Transaction Rejected</h3>
                            </div>
                            <button
                                onClick={() => setOverrideError(null)}
                                className="text-gray-500 hover:text-white transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-4 text-sm font-medium text-gray-400">
                            <p className="text-white">
                                The Smart Contract has actively rejected this transaction manually overriding the state.
                            </p>
                            <p>
                                <strong className="text-red-400 uppercase text-xs tracking-wider">Reason:</strong><br />
                                Global Risk Score exceeds threshold. The OmniSentryCore Vault is currently in <span className="text-red-500 font-black">ISOLATION_ACTIVE</span> mode via cryptographic consensus.
                            </p>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest border-t border-white/10 pt-4">
                                Error Code: EnforcedPause()
                            </p>
                        </div>

                        <button
                            onClick={() => setOverrideError(null)}
                            className="w-full py-3 bg-white/5 hover:bg-white/10 text-white font-bold uppercase tracking-widest text-xs rounded-xl transition-colors border border-white/10"
                        >
                            Acknowledge
                        </button>
                    </motion.div>
                </div>
            )}
        </div>
    );
}

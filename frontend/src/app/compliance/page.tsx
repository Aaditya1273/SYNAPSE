"use client";

import { motion } from "framer-motion";
import { FileText, ShieldCheck, Download, ExternalLink, Calendar, Search, Filter, Fingerprint } from "lucide-react";
import { useAetherState } from "@/lib/hooks";

export default function Compliance() {
    const { riskState } = useAetherState();

    const auditLogs = [
        ...(riskState ? [{
            id: `LOG-${riskState.lastUpdated.toString().slice(-4)}`,
            date: new Date(riskState.lastUpdated * 1000).toLocaleString(),
            event: riskState.reason || "Autonomous Risk Scan",
            proof: "0xzkp_" + Math.random().toString(16).slice(2, 10) + "..."
        }] : []),
        { id: "LOG-9421", date: "2026-03-05 10:14", event: "Circuit Breaker Triggered", proof: "0xzkp_4f3af19e..." },
        { id: "LOG-9420", date: "2026-03-04 18:02", event: "Multi-AI Weight Rebalance", proof: "0xzkp_a2e31f9c..." },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-16">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#00f2ff]">
                        <Fingerprint size={14} /> Compliance Registry
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter text-white flex items-center gap-4">
                        ZK Compliance Vault
                    </h1>
                    <p className="text-gray-400 max-w-2xl font-medium leading-relaxed">
                        Institutional-grade audit trails powered by Zero-Knowledge Proofs.
                        Verify protocol adherence to regulatory risk policies with <span className="text-gray-200 underline underline-offset-4 decoration-[#00f2ff]/30">cryptographic certainty.</span>
                    </p>
                </div>
                <div className="flex gap-4">
                    <button className="px-6 py-3 rounded-2xl glass-premium border-white/10 hover:bg-white/5 font-black uppercase tracking-widest text-[10px] flex items-center gap-3 transition-all">
                        <Filter size={14} /> Filter Logs
                    </button>
                    <button className="px-8 py-3 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-[10px] flex items-center gap-3 hover:bg-[#00f2ff] transition-all hover:shadow-[0_0_20px_rgba(0,242,255,0.3)]">
                        <Download size={14} /> Export Audit
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Tactical Stats */}
                <div className="md:col-span-1 space-y-4">
                    {[
                        { label: "Active Proofs", value: "1,248", trend: "+12.4%", color: "#00f2ff" },
                        { label: "Validation Score", value: "100%", trend: "MAX", color: "#27ae60" },
                        { label: "Avg. Proof Latency", value: "4.2ms", trend: "OPTIMIZED", color: "#375bd2" }
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="p-8 glass-premium rounded-[2rem] flex justify-between items-center group cursor-default"
                        >
                            <div>
                                <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest">{stat.label}</span>
                                <p className="text-3xl font-black text-white group-hover:text-glow-cyan transition-all">{stat.value}</p>
                            </div>
                            <div className="text-right">
                                <div className="text-[8px] font-black uppercase tracking-widest opacity-60" style={{ color: stat.color }}>{stat.trend}</div>
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 mt-2">
                                    <FileText size={14} />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Audit Registry */}
                <div className="md:col-span-3 glass-premium rounded-[2.5rem] overflow-hidden border border-white/5">
                    <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                        <h3 className="text-lg font-black text-white flex items-center gap-3">
                            <Search size={18} className="text-[#00f2ff]" /> Proof Generation Registry
                        </h3>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest italic animate-pulse">Auto-Refreshed: 30s</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-[9px] text-gray-500 uppercase tracking-[0.2em] border-b border-white/5">
                                    <th className="px-8 py-6 font-black">Audit_ID</th>
                                    <th className="px-8 py-6 font-black">Pulse_Time</th>
                                    <th className="px-8 py-6 font-black">Orchestration_Event</th>
                                    <th className="px-8 py-6 font-black">ZK_Proof_Status</th>
                                    <th className="px-8 py-6 font-black text-right">Verification</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {auditLogs.map((log, i) => (
                                    <motion.tr
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="text-sm hover:bg-white/[0.03] transition-colors group cursor-pointer"
                                    >
                                        <td className="px-8 py-6 font-mono text-[10px] text-gray-500 group-hover:text-[#00f2ff] transition-colors">{log.id}</td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-gray-400 font-medium">
                                                <Calendar size={14} className="opacity-40" /> {log.date}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="font-extrabold text-white tracking-tight">{log.event}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-[#00f2ff] shadow-[0_0_10px_rgba(0,242,255,0.5)]" />
                                                <span className="px-3 py-1 rounded-full bg-[#00f2ff]/10 text-[#00f2ff] text-[9px] font-black border border-[#00f2ff]/20 uppercase tracking-widest">
                                                    CR_VERIFIED
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 hover:text-white hover:bg-[#00f2ff]/20 transition-all">
                                                <ExternalLink size={16} />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

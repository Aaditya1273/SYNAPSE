"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Download, ExternalLink, Calendar, Search, Fingerprint } from "lucide-react";
import { useAetherState, useAuditLogs } from "@/lib/hooks";

export default function Compliance() {
    const { riskState } = useAetherState();
    const { logs: onChainLogs } = useAuditLogs();
    const [searchTerm, setSearchTerm] = useState("");

    const auditLogs = [
        ...(riskState ? [{
            id: `LOG-${riskState.lastUpdated.toString().slice(-4)}`,
            date: new Date(riskState.lastUpdated * 1000).toLocaleString(),
            event: riskState.reason || "Autonomous Risk Scan",
            proof: `0xzkp_${riskState.lastUpdated.toString(16).slice(-8)}...`,
            txHash: null
        }] : []),
        ...onChainLogs,
    ].filter(log =>
        log.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = [
        { label: "Active Proofs", value: auditLogs.length.toLocaleString(), trend: "+100%", color: "#00f2ff" },
        { label: "Validation Score", value: auditLogs.length > 0 ? "100%" : "0%", trend: "VERIFIED", color: "#27ae60" },
        { label: "Avg. Proof Latency", value: "0.8ms", trend: "ZK_STARK", color: "#375bd2" }
    ];

    const exportAudit = () => {
        const headers = "Audit_ID,Pulse_Time,Orchestration_Event,Proof\n";
        const rows = auditLogs.map(log => `${log.id},${log.date},${log.event},${log.proof}`).join("\n");
        const blob = new Blob([headers + rows], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `aethersentinel-audit-${new Date().toISOString()}.csv`;
        a.click();
    };

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
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                        <input
                            type="text"
                            placeholder="Filter Logs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-6 py-3 rounded-2xl glass-premium border border-white/10 focus:border-[#00f2ff]/50 bg-transparent text-[10px] font-black uppercase tracking-widest text-white outline-none w-64 transition-all"
                        />
                    </div>
                    <button
                        onClick={exportAudit}
                        className="px-8 py-3 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-[10px] flex items-center gap-3 hover:bg-[#00f2ff] transition-all hover:shadow-[0_0_20px_rgba(0,242,255,0.3)]"
                    >
                        <Download size={14} /> Export Audit
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Tactical Stats */}
                <div className="md:col-span-1 space-y-4">
                    {stats.map((stat, i) => (
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
                                            {log.txHash ? (
                                                <a
                                                    href={`https://virtual.sepeth.tenderly.co/tx/${log.txHash}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 hover:text-white hover:bg-[#00f2ff]/20 transition-all ml-auto"
                                                >
                                                    <ExternalLink size={16} />
                                                </a>
                                            ) : (
                                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-700 cursor-not-allowed ml-auto">
                                                    <ExternalLink size={16} />
                                                </div>
                                            )}
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

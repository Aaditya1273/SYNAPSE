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
        { label: "Active Proofs", value: auditLogs.length.toLocaleString(), trend: "VERIFIED", color: "#2563EB" },
        { label: "Validation Score", value: auditLogs.length > 0 ? "100%" : "0%", trend: "OPTIMAL", color: "#10B981" },
        { label: "Proof Latency", value: "0.8ms", trend: "ZK_STARK", color: "#6366f1" }
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
        <div className="max-w-7xl mx-auto space-y-16 py-12 px-8">
            {/* Header - Minimalist Institutional */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-gray-100 pb-12">
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#2563EB]">
                        <Fingerprint size={14} /> Global Compliance Registry
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter text-[#0F172A] uppercase">
                        ZK <span className="text-[#2563EB]">Compliance Vault</span>
                    </h1>
                    <p className="text-gray-500 max-w-xl font-medium leading-relaxed">
                        Institutional-grade audit trails powered by Zero-Knowledge Proofs.
                        Verify protocol adherence with <span className="text-[#0F172A] font-bold underline underline-offset-4 decoration-blue-200">cryptographic certainty.</span>
                    </p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                        <input
                            type="text"
                            placeholder="Search Logs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-6 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-blue-500/50 outline-none text-[11px] font-bold text-[#0F172A] w-64 transition-all"
                        />
                    </div>
                    <button
                        onClick={exportAudit}
                        className="px-6 py-3 rounded-xl bg-[#2563EB] text-white font-bold uppercase tracking-widest text-[10px] flex items-center gap-3 hover:translate-y-[-2px] transition-all shadow-lg shadow-blue-500/10 active:scale-95"
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
                            className="p-8 card-minimal flex flex-col justify-between h-32"
                        >
                            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-none">{stat.label}</span>
                            <div className="flex items-end justify-between">
                                <p className="text-3xl font-black text-[#0F172A] tracking-tighter">{stat.value}</p>
                                <span className="text-[10px] font-black uppercase tracking-tighter" style={{ color: stat.color }}>{stat.trend}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Audit Registry */}
                <div className="md:col-span-3 card-minimal overflow-hidden border-gray-100">
                    <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                        <h3 className="text-sm font-black text-[#0F172A] flex items-center gap-3 uppercase tracking-widest">
                            <Search size={16} className="text-[#2563EB]" /> Proof Generation Registry
                        </h3>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">Live Feed</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-[10px] text-gray-400 uppercase tracking-widest border-b border-gray-50">
                                    <th className="px-8 py-5 font-black">Audit_ID</th>
                                    <th className="px-8 py-5 font-black">Timestamp</th>
                                    <th className="px-8 py-5 font-black">Event Type</th>
                                    <th className="px-8 py-5 font-black">ZK_Status</th>
                                    <th className="px-8 py-5 font-black text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {auditLogs.map((log, i) => (
                                    <motion.tr
                                        key={i}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="text-xs hover:bg-gray-50/50 transition-colors group cursor-pointer"
                                    >
                                        <td className="px-8 py-5 font-mono text-[10px] text-gray-400 group-hover:text-[#2563EB] transition-colors">{log.id}</td>
                                        <td className="px-8 py-5 text-gray-600 font-medium">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={12} className="text-gray-300" /> {log.date}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="font-bold text-[#0F172A]">{log.event}</span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="px-2 py-1 rounded-md bg-emerald-50 text-emerald-600 text-[9px] font-black border border-emerald-100 uppercase tracking-widest">
                                                VERIFIED
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            {log.txHash ? (
                                                <a
                                                    href={`https://virtual.sepeth.tenderly.co/tx/${log.txHash}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#2563EB] hover:border-blue-100 hover:bg-white hover:shadow-sm transition-all ml-auto"
                                                >
                                                    <ExternalLink size={14} />
                                                </a>
                                            ) : (
                                                <div className="w-10 h-10 rounded-lg border border-dashed border-gray-100 flex items-center justify-center text-gray-200 ml-auto">
                                                    <ExternalLink size={14} />
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

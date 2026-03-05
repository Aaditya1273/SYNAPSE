"use client";

import { motion } from "framer-motion";
import { FileText, ShieldCheck, Download, ExternalLink, Calendar } from "lucide-react";

export default function Compliance() {
    const auditLogs = [
        { id: "LOG-9421", date: "2026-03-05 10:14", event: "Circuit Breaker Triggered", proof: "0xzkp_4f3af19e..." },
        { id: "LOG-9420", date: "2026-03-04 18:02", event: "Multi-AI Weight Rebalance", proof: "0xzkp_a2e31f9c..." },
        { id: "LOG-9419", date: "2026-03-04 12:45", event: "Risk Threshold Update", proof: "0xzkp_887b2e11..." },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-12">
            <div className="flex justify-between items-start">
                <div className="space-y-4">
                    <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
                        <ShieldCheck size={40} className="text-[#00f2ff]" /> ZK Compliance Vault
                    </h1>
                    <p className="text-gray-400 max-w-xl leading-relaxed">
                        Institutional-grade audit trails powered by Zero-Knowledge Proofs.
                        Verify protocol adherence to regulatory risk policies without revealing sensitive positions.
                    </p>
                </div>
                <button className="px-6 py-3 rounded-xl glass border-white/10 hover:bg-white/5 font-bold flex items-center gap-2 transition-all">
                    <Download size={18} /> Export Full Audit (PDF)
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Stats Cards */}
                <div className="md:col-span-1 space-y-4">
                    {[
                        { label: "Active Proofs", value: "1,248", icon: <FileText size={16} /> },
                        { label: "Compliance Score", value: "100%", icon: <ShieldCheck size={16} /> },
                        { label: "Avg. Proof Time", value: "4.2ms", icon: <Activity size={16} /> }
                    ].map((stat, i) => (
                        <div key={i} className="p-6 glass rounded-2xl flex justify-between items-center group">
                            <div>
                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{stat.label}</span>
                                <p className="text-2xl font-black group-hover:text-[#00f2ff] transition-colors">{stat.value}</p>
                            </div>
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400">
                                {stat.icon}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Logs Table */}
                <div className="md:col-span-3 glass rounded-3xl overflow-hidden">
                    <div className="p-6 border-b border-white/5 flex justify-between items-center">
                        <h3 className="font-bold">Recent Proof Generation</h3>
                        <span className="text-xs text-gray-500">Auto-Refreshes every cycle</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[10px] text-gray-500 uppercase tracking-widest border-b border-white/5">
                                    <th className="px-6 py-4 font-bold">Audit ID</th>
                                    <th className="px-6 py-4 font-bold">Timestamp</th>
                                    <th className="px-6 py-4 font-bold">Event Log</th>
                                    <th className="px-6 py-4 font-bold">ZK Proof Status</th>
                                    <th className="px-6 py-4 font-bold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {auditLogs.map((log, i) => (
                                    <motion.tr
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="text-sm hover:bg-white/5 transition-colors group"
                                    >
                                        <td className="px-6 py-4 font-mono text-xs text-gray-500">{log.id}</td>
                                        <td className="px-6 py-4 flex items-center gap-2 text-gray-400">
                                            <Calendar size={14} /> {log.date}
                                        </td>
                                        <td className="px-6 py-4 font-semibold">{log.event}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 rounded-full bg-[#00f2ff]/10 text-[#00f2ff] text-[10px] font-bold border border-[#00f2ff]/20">
                                                VERIFIED
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-gray-500 hover:text-white transition-all"><ExternalLink size={16} /></button>
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

function Activity({ size }: { size: number }) {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
}

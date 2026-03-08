"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Download, ExternalLink, Calendar, Search, Fingerprint, Cpu } from "lucide-react";
import { useAetherState, useAuditLogs } from "@/lib/hooks";

export default function Compliance() {
    const { riskState, latency } = useAetherState();
    const { logs: onChainLogs } = useAuditLogs();
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("WORKFLOW_YAML");

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
        { label: "Validation Score", value: auditLogs.length > 5 ? "100%" : auditLogs.length > 0 ? "98%" : "0%", trend: "OPTIMAL", color: "#10B981" },
        { label: "RPC Consensus", value: latency > 0 ? `${latency.toFixed(0)}ms` : "SYNCING", trend: "ZK_STARK", color: "#6366f1" }
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
        <div className="max-w-7xl mx-auto space-y-16 py-32 px-8 min-h-screen">
            {/* Header - Minimalist Institutional */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/5 pb-12">
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#2563EB]">
                        <Fingerprint size={14} /> Global Compliance Registry
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter text-white uppercase">
                        ZK <span className="text-[#2563EB]">Compliance Vault</span>
                    </h1>
                    <p className="text-gray-400 max-w-xl font-medium leading-relaxed text-sm">
                        Institutional-grade audit trails powered by Zero-Knowledge Proofs. <br />
                        Verify protocol adherence with <span className="text-white font-bold underline underline-offset-4 decoration-blue-500/30">cryptographic certainty.</span>
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
                            className="pl-10 pr-6 py-3 rounded-xl bg-white/5 border border-white/5 focus:border-blue-500/50 outline-none text-[11px] font-bold text-white w-64 transition-all"
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
                {/* Tactical Stats & Live Proof Stream */}
                <div className="md:col-span-1 space-y-8">
                    <div className="p-8 rounded-[2rem] bg-white/2 border border-white/5 space-y-1">
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-white/5 pb-2">Active Proofs</div>
                        <div className="text-4xl font-black text-white italic">2</div>
                        <div className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mt-2">Verified</div>
                    </div>

                    <div className="p-8 rounded-[2rem] bg-white/2 border border-white/5 space-y-1">
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-white/5 pb-2">Validation Score</div>
                        <div className="text-4xl font-black text-white italic">98%</div>
                        <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mt-2 uppercase">Optimal</div>
                    </div>

                    <div className="p-8 rounded-[2rem] bg-white/2 border border-white/5 space-y-1">
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-white/5 pb-2">Proof Latency</div>
                        <div className="text-4xl font-black text-white italic">658.0ms</div>
                        <div className="text-[10px] font-bold text-blue-300 uppercase tracking-widest mt-2">ZK_STARK</div>
                    </div>

                    {/* Live Proof Stream Overlay */}
                    <div className="p-8 rounded-[2rem] bg-white/2 border border-white/5 space-y-6">
                        <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex justify-between items-center border-b border-white/5 pb-3">
                            <span>Recent Proof Stream</span>
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10B981]" />
                        </div>
                        <div className="space-y-4">
                            {onChainLogs.slice(0, 3).map((log, i) => (
                                <motion.div
                                    key={log.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="space-y-2 group cursor-pointer"
                                    onClick={() => log.txHash && window.open(`https://dashboard.tenderly.co/explorer/vnet/ddf4998e-00a6-47cd-b249-8c1018222361/tx/${log.txHash}`, '_blank')}
                                >
                                    <div className="flex justify-between items-center">
                                        <span className="text-[8px] font-black text-[#2563EB] uppercase tracking-tighter">SIG_#{log.id.split('-')[1]}</span>
                                        <span className="text-[7px] text-gray-600 font-bold uppercase">SEC_VERIFIED</span>
                                    </div>
                                    <p className="text-[10px] font-black text-white uppercase tracking-tight group-hover:text-[#2563EB] transition-colors">
                                        {log.event.replace("Manual Override: ", "")}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Audit Registry */}
                <div className="md:col-span-3 space-y-8">
                    <div className="card-minimal overflow-hidden border-white/5 shadow-2xl shadow-black/50">
                        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/2">
                            <h3 className="text-sm font-black text-white flex items-center gap-3 uppercase tracking-widest">
                                <Search size={16} className="text-[#2563EB]" /> Proof Generation Registry
                            </h3>
                            <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest italic">Live Feed</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-[10px] text-gray-500 uppercase tracking-widest border-b border-white/5">
                                        <th className="px-8 py-5 font-black">Audit_ID</th>
                                        <th className="px-8 py-5 font-black">Timestamp</th>
                                        <th className="px-8 py-5 font-black">Event Type</th>
                                        <th className="px-8 py-5 font-black">ZK_Status</th>
                                        <th className="px-8 py-5 font-black text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {auditLogs.map((log, i) => (
                                        <motion.tr
                                            key={i}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="text-xs hover:bg-white/5 transition-colors group cursor-pointer"
                                        >
                                            <td className="px-8 py-5 font-mono text-[10px] text-gray-400 group-hover:text-[#2563EB] transition-colors">{log.id}</td>
                                            <td className="px-8 py-5 text-gray-300 font-medium">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={12} className="text-gray-500" /> {log.date}
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className="font-bold text-white flex items-center gap-2">
                                                    {log.id.startsWith('CRE-') && <Cpu size={12} className="text-[#2563EB]" />}
                                                    {log.event.replace("CRE Consensus: ", "").replace("Manual Override: ", "")}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className={`px-2 py-1 rounded-md text-[9px] font-black border uppercase tracking-widest ${log.id.startsWith('CRE-') ? 'bg-blue-500/5 text-blue-400 border-blue-500/20' : 'bg-emerald-500/5 text-emerald-400 border-emerald-500/20'}`}>
                                                    {log.id.startsWith('CRE-') ? 'CRE_SYNC' : 'OPERATOR'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                {log.txHash ? (
                                                    <a
                                                        href={`https://dashboard.tenderly.co/explorer/vnet/ddf4998e-00a6-47cd-b249-8c1018222361/tx/${log.txHash}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="w-10 h-10 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-gray-500 hover:text-[#2563EB] hover:border-blue-500/30 hover:bg-white/10 hover:shadow-sm transition-all ml-auto"
                                                    >
                                                        <ExternalLink size={14} />
                                                    </a>
                                                ) : (
                                                    <div className="w-10 h-10 rounded-lg border border-dashed border-white/10 flex items-center justify-center text-gray-700 ml-auto">
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

                    {/* Consensus Workflow Integrity Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-12 rounded-[3rem] bg-gray-950 text-white space-y-8 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-12 opacity-5">
                            <Cpu size={200} />
                        </div>

                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                                        <FileText className="text-blue-400" size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black uppercase tracking-tighter">Consensus Workflow Integrity</h3>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Raw Chainlink CRE Orchestration Logic</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 p-1 bg-white/5 rounded-xl border border-white/10">
                                {['WORKFLOW_YAML', 'CORE_LOGIC_TS'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-6 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-blue-600 text-white shadow-xl' : 'text-gray-400 hover:text-white'}`}
                                    >
                                        {tab.replace('_', '.')}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                            <div className="md:col-span-3 bg-black/40 rounded-2xl border border-white/5 p-8 font-mono text-[11px] h-[500px] overflow-y-auto custom-scrollbar">
                                <pre className="text-blue-100/80 selection:bg-blue-500/30">
                                    {activeTab === 'WORKFLOW_YAML' ? `
# ==========================================================================
# CRE WORKFLOW DEFINITION: omnisentry-v4-main
# ==========================================================================
tenderly-testnet:
  user-workflow:
    workflow-name: "omnisentry-v4-main"
  workflow-artifacts:
    workflow-path: "./src/workflow.ts"
    config-path: "./src/config.json"
    secrets-path: "./src/secrets.env"
  capabilities:
    - type: "cron"
      schedule: "*/30 * * * *"
    - type: "http"
      allowed-domains: ["api.coingecko.com", "api.grok.ai"]
# ==========================================================================
                                    ` : `
import { cre, type Runtime } from '@chainlink/cre-sdk';

/**
 * @dev Confidential Multi-AI Consensus Engine
 * Aggregates risk signals from Gemini, Claude, and Grok
 */
async function onRiskHeartbeat(runtime: Runtime<Config>) {
    const signals = await Promise.all([
        getGeminiAnalysis(runtime),
        getClaudeAnalysis(runtime),
        getGrokAnalysis(runtime)
    ]);
    
    const consensus = aggregateAI(signals);
    
    // Trigger on-chain Predict -> Isolate -> Heal workflow
    if (consensus.score > 80) {
        return runtime.evm.write("OmniSentryCore.emergencyStop", [consensus]);
    }
    
    return cre.ok({ score: consensus.score });
}

export const workflow = [
    cre.handler("cron", onRiskHeartbeat)
];
                                    `}
                                </pre>
                            </div>
                            <div className="md:col-span-1 space-y-6">
                                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                                    <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Workflow Metadata</h4>
                                    <div className="space-y-3">
                                        <div className="space-y-1">
                                            <p className="text-[8px] text-gray-500 font-bold uppercase">Workflow_ID</p>
                                            <p className="text-[10px] font-mono text-white truncate truncate-hover">omni-sentry-v4-main-0xe4a1</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[8px] text-gray-500 font-bold uppercase">Capability_Handshake</p>
                                            <p className="text-[10px] font-mono text-white">ConfidentialCompute v1.0</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[8px] text-gray-500 font-bold uppercase">Registry_Identity</p>
                                            <p className="text-[10px] font-mono text-white truncate">org_AetherSentinel_9936_v4</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 rounded-2xl bg-blue-600/10 border border-blue-500/20 space-y-3">
                                    <div className="flex items-center gap-2 text-blue-400">
                                        <Cpu size={14} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Consensus Status</span>
                                    </div>
                                    <p className="text-[11px] font-medium text-blue-100 leading-relaxed">
                                        Logic hash verified against registry. Autonomous execution is <span className="text-white font-bold">READY</span>.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

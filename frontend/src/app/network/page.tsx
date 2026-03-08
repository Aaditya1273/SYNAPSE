"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Globe,
    ShieldAlert,
    Zap,
    Activity,
    ExternalLink,
    Terminal,
    Server,
    Database,
    Search,
    Info,
    Cpu,
    Satellite
} from "lucide-react";
import { useAetherState, useAuditLogs } from "@/lib/hooks";

export default function NetworkPage() {
    const { riskState, isPaused, latency } = useAetherState();
    const { logs } = useAuditLogs();

    const nodes = [
        { id: "NODE_TYO_01", x: 820, y: 180 },
        { id: "NODE_NYC_04", x: 250, y: 220 },
        { id: "NODE_LDN_02", x: 480, y: 150 },
        { id: "NODE_SNG_09", x: 750, y: 420 },
        { id: "NODE_SYD_07", x: 880, y: 480 },
        { id: "NODE_FRA_03", x: 520, y: 190 },
    ];

    const currentRisk = riskState?.score ?? (isPaused ? 88 : 12);
    const latestLog = logs[0] || null;

    return (
        <div className="max-w-[1600px] mx-auto space-y-12 py-32 px-12 min-h-screen">
            {/* 1. TOP ORCHESTRATION HEADER */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 border-b border-white/5 pb-16">
                <div className="space-y-4">
                    <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-[#2563EB]">
                        <Satellite size={16} /> Protocol Orchestration Layer
                    </div>
                    <h1 className="text-6xl font-black tracking-tighter text-white uppercase leading-[0.9]">
                        Global <span className="text-[#2563EB]">Networking</span>
                    </h1>
                    <p className="text-gray-400 font-medium max-w-2xl text-sm leading-relaxed">
                        Authorized interface for real-time mesh correlation and cross-chain sentiment mapping. <br />
                        <span className="block mt-2 text-white/20 text-[10px] font-bold uppercase tracking-[0.2em]">Consensus Protocol: Active</span>
                    </p>
                </div>

                <div className="flex items-center gap-6">
                    <div className="px-8 py-4 rounded-2xl border border-blue-500/20 bg-blue-500/5 flex items-center gap-4 shadow-sm">
                        <div className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse shadow-[0_0_8px_#2563EB]" />
                        <span className="text-[11px] font-black uppercase tracking-widest text-[#2563EB]">SENTINEL_MESH_ONLINE</span>
                    </div>
                </div>
            </header>

            {/* 2. COMMAND CENTER GRID */}
            <main className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                {/* SIDEBAR: CONTROL UNIT (3 Cols) */}
                <aside className="lg:col-span-3 space-y-8">
                    <div className="p-8 rounded-[2.5rem] bg-white/2 border border-white/5 space-y-10">
                        <div className="space-y-6">
                            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-xl shadow-blue-500/20">
                                <Cpu className="text-white" size={24} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-sm font-black text-white uppercase tracking-wider">Tactical Node Sync</h3>
                                <p className="text-[11px] font-bold text-gray-600 leading-relaxed uppercase tracking-widest">
                                    Consensus Layer: Operational
                                </p>
                            </div>
                        </div>

                        {/* Latency Widget */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Consensus Round-Trip</span>
                                <span className="text-lg font-black text-[#2563EB] tracking-tighter">{latency > 0 ? latency.toFixed(0) : "SYNC"}ms</span>
                            </div>
                            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-[#2563EB]"
                                    animate={{ width: `${Math.min(100, (latency / 1200) * 100)}%` }}
                                    transition={{ type: "spring", stiffness: 100 }}
                                />
                            </div>
                        </div>

                        {/* Node List */}
                        <div className="space-y-6 pt-6 border-t border-white/5">
                            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Active Edge Relays</h4>
                            <div className="space-y-3">
                                {[
                                    { label: "Tokyo-Primary", status: "NOMINAL", color: "#2563EB", hash: "0xTYO_10", offset: 12 },
                                    { label: "London-Bridge", status: "STABLE", color: "#10B981", hash: "0xLON_8B", offset: 5 },
                                    { label: "NYC-Gateway", status: "STABLE", color: "#10B981", hash: "0xNYC_4F", offset: 28 },
                                    { label: "SG-Consensus", status: "SYNCING", color: "#EF4444", hash: "0xSGP_00", offset: 0 },
                                ].map((node, i) => (
                                    <div key={i} className="flex flex-col space-y-2 group cursor-crosshair p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-tight group-hover:text-white transition-colors">{node.label}</span>
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor]" style={{ backgroundColor: node.color, color: node.color }} />
                                                <span className="text-[9px] font-black" style={{ color: node.color }}>{node.status}</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center text-[9px] font-mono text-gray-500 pt-2 border-t border-white/5">
                                            <div className="flex items-center gap-1 text-[#2563EB]">
                                                <Zap size={8} /> HASH: {node.hash}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Activity size={8} /> {node.status === "SYNCING" ? "SYNCING..." : (latency > 0 ? (latency + node.offset).toFixed(0) + "ms" : "SYNCING")}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="p-8 rounded-[2rem] bg-white/2 border border-white/5 space-y-4">
                        <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            <Zap size={12} className="text-yellow-500" /> System Integrity
                        </div>
                        <p className="text-[10px] font-bold text-gray-500 leading-relaxed uppercase tracking-wider">
                            Verification Proof: 0xzkP_Mesh_Verify_Active_v4
                        </p>
                    </div>
                </aside>

                {/* MAIN: MESH CONSOLE (9 Cols) */}
                <section className="lg:col-span-9 bg-[#0F172A]/40 backdrop-blur-2xl border border-white/5 rounded-[3rem] shadow-2xl shadow-black/50 overflow-hidden flex flex-col min-h-[850px] relative">

                    {/* Console Header */}
                    <div className="px-12 py-8 border-b border-white/5 flex justify-between items-center bg-white/2">
                        <div className="flex items-center gap-5">
                            <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center border border-blue-500/20 shadow-sm">
                                <Globe size={24} className="text-[#2563EB]" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-black text-white uppercase tracking-[0.25em]">Institutional
                                    Connectivity Matrix</span>
                                <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest leading-relaxed"> Cross-chain volatility signals and asset correlation mappings.</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 px-5 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 shadow-sm">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500/50" />
                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Live Flow</span>
                        </div>
                    </div>

                    {/* Central Mesh Area */}
                    <div className="flex-1 relative flex flex-col p-12 overflow-hidden">

                        {/* Title - Pushed to top-left for clear space */}
                        <div className="relative z-20 space-y-4 max-w-xl">
                            <h2 className="text-5xl font-black text-white uppercase tracking-tighter leading-[0.9]">
                                <br />Propagation<br /><span className="text-[#2563EB]">Matrix</span>
                            </h2>
                            <p className="text-[11px] text-gray-500 font-bold uppercase tracking-[0.35em] leading-relaxed">

                            </p>
                        </div>

                        {/* Tactical Mesh Area - Real Data Visualization */}
                        <div className="absolute inset-0 z-10 opacity-30 pointer-events-none">
                            <svg className="w-full h-full" viewBox="0 0 1000 600">
                                <defs>
                                    <radialGradient id="meshGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                                        <stop offset="0%" stopColor="#2563EB" stopOpacity="0.2" />
                                        <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
                                    </radialGradient>
                                </defs>

                                {/* Background Hex/Grid Pattern */}
                                <rect width="1000" height="600" fill="url(#meshGradient)" />

                                {/* Dynamic Connections */}
                                {nodes.map((node, i) => (
                                    nodes.slice(i + 1).map((target, j) => (
                                        <motion.line
                                            key={`${i}-${j}`}
                                            x1={node.x} y1={node.y}
                                            x2={target.x} y2={target.y}
                                            stroke="white"
                                            strokeWidth="1.5"
                                            initial={{ pathLength: 0, opacity: 0 }}
                                            animate={{ pathLength: 1, opacity: 0.3 }}
                                            transition={{ duration: 2, delay: i * 0.2 }}
                                        />
                                    ))
                                ))}

                                {/* High-Intensity Pulse for Recent Activity */}
                                {latestLog && (
                                    <motion.circle
                                        cx="500" cy="300"
                                        r="200"
                                        fill="none"
                                        stroke="#2563EB"
                                        strokeWidth="2"
                                        initial={{ scale: 0, opacity: 0.5 }}
                                        animate={{ scale: 2, opacity: 0 }}
                                        transition={{ duration: 3, repeat: Infinity }}
                                    />
                                )}
                            </svg>
                        </div>

                        {/* Node Data Points - Absolute Positioned */}
                        <div className="absolute inset-0 z-20 pointer-events-none">
                            {nodes.map((node, i) => {
                                // Define dynamic node properties simulating live network state
                                const isPrimary = i === 0;
                                const isSyncing = i === 4; // Arbitrary node as syncing
                                const nodeColor = isSyncing ? '#EF4444' : (isPrimary ? '#2563EB' : '#10B981'); // Red, Blue, Green
                                const nodeHash = `0x${node.id.split('_')[1]}_${riskState?.score || (isPrimary ? '10' : '00')}`;
                                const nodeLatency = isSyncing ? 'SYNCING...' : `${(latency > 0 ? latency + (i * 10) : 0).toFixed(0)}ms`;

                                return (
                                    <motion.div
                                        key={i}
                                        style={{ left: `${node.x / 10}%`, top: `${node.y / 6}%` }}
                                        className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-3 z-30"
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: i * 0.1, type: "spring", damping: 12 }}
                                    >
                                        <div className="relative group/point cursor-crosshair">
                                            {/* Diagnostic Ring */}
                                            <div
                                                className="absolute inset-0 -m-3 rounded-full border opacity-20 group-hover/point:opacity-100 group-hover/point:scale-x-150 group-hover/point:scale-y-150 transition-all duration-300"
                                                style={{ borderColor: nodeColor }}
                                            />

                                            {/* Core Point */}
                                            <div
                                                className="w-3 h-3 rounded-full transition-colors relative z-10"
                                                style={{
                                                    backgroundColor: nodeColor,
                                                    boxShadow: `0 0 20px ${nodeColor}80`
                                                }}
                                            />

                                            {/* Server Name Label */}
                                            <div className="absolute top-5 pointer-events-none whitespace-nowrap">
                                                <span className="text-[10px] font-black uppercase tracking-widest drop-shadow-md" style={{ color: nodeColor }}>
                                                    {node.id.split('_')[1]}
                                                </span>
                                            </div>

                                            {/* Real-Time Pulse for Active Consensus */}
                                            {latestLog && isPrimary && (
                                                <div className="absolute inset-0 rounded-full animate-ping opacity-75" style={{ backgroundColor: nodeColor }} />
                                            )}

                                            {/* Hover Tooltip */}
                                            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-4 opacity-0 pointer-events-none group-hover/point:opacity-100 group-hover/point:pointer-events-auto transition-all duration-300 flex flex-col items-center w-max z-50">
                                                <div className="px-3 py-2 bg-[#0F172A]/90 backdrop-blur-xl border rounded-lg shadow-2xl flex flex-col gap-1" style={{ borderColor: `${nodeColor}40` }}>
                                                    <div className="flex justify-between items-center gap-4 border-b pb-1 mb-1" style={{ borderColor: `${nodeColor}20` }}>
                                                        <span className="text-[9px] font-black text-white uppercase tracking-wider">{node.id}</span>
                                                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: nodeColor, boxShadow: `0 0 8px ${nodeColor}` }} />
                                                    </div>
                                                    <div className="flex items-center gap-2 font-mono text-[8px] font-bold text-gray-400">
                                                        <Activity size={10} style={{ color: nodeColor }} /> {nodeLatency}
                                                    </div>
                                                    <div className="flex items-center gap-2 font-mono text-[8px] font-bold text-gray-400">
                                                        <Zap size={10} style={{ color: nodeColor }} /> {nodeHash}
                                                    </div>
                                                </div>
                                                {/* Tooltip Arrow */}
                                                <div className="w-2 h-2 rotate-45 bg-[#0F172A]/90 border-r border-b -mt-1" style={{ borderColor: `${nodeColor}40` }} />
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </div>

                        {/* Dynamic Log Feed Overlay (Top Right of Mesh hidden behind Info Icon) */}
                        <div className="absolute top-12 right-12 z-30 group flex flex-col items-end">
                            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 group-hover:bg-[#2563EB] group-hover:border-[#2563EB] group-hover:text-white transition-all cursor-help shadow-lg backdrop-blur-xl">
                                <Info size={18} />
                            </div>

                            <div className="w-72 space-y-3 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 absolute top-full right-0 mt-4 origin-top-right">
                                <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2 border-b border-white/5 pb-2 text-right">Stream: On-Chain Correlation</div>
                                {logs.slice(0, 3).map((log, i) => (
                                    <motion.div
                                        key={log.id}
                                        initial={{ x: 20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        className="p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/5 shadow-sm space-y-2 group relative"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[9px] font-black text-[#2563EB] uppercase tracking-tighter">SIG_#{log.id.slice(-4)}</span>
                                                {log.id.startsWith('CRE-') && (
                                                    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 border border-blue-100/50">
                                                        <Cpu size={8} className="text-blue-500" />
                                                        <span className="text-[6px] font-black text-blue-600 uppercase">CRE</span>
                                                    </div>
                                                )}
                                            </div>
                                            <span className="text-[8px] text-gray-600 font-bold uppercase">{new Date().toLocaleTimeString()}</span>
                                        </div>
                                        <p className="text-[10px] font-black text-white truncate uppercase tracking-tight pr-8">
                                            {log.event.replace("Manual Override: ", "").replace("CRE Consensus: ", "")}
                                        </p>

                                        {log.id.startsWith('CRE-') && (
                                            <div className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="p-1 rounded bg-gray-900 text-[8px] text-white font-bold flex items-center gap-1 shadow-2xl">
                                                    <Info size={10} /> CRE Consensus Active
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="mt-auto relative z-20 flex gap-12 pb-16">
                            <div className="flex items-center gap-4">
                                <div className="w-3 h-3 rounded-full bg-[#2563EB] shadow-xl shadow-blue-500/30" />
                                <span className="text-[11px] font-black text-white uppercase tracking-widest">Active Relay</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-xl shadow-emerald-500/30 animate-pulse" />
                                <span className="text-[11px] font-black text-white uppercase tracking-widest">Consensus Locked</span>
                            </div>
                        </div>

                        {/* DEDICATED ALERT BAR - NO OVERLAP */}
                        <AnimatePresence>
                            {latestLog && (
                                <motion.div
                                    initial={{ y: 100, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    className="absolute bottom-0 left-0 right-0 bg-blue-600 text-white p-8 lg:p-10 flex flex-col md:flex-row items-center justify-between gap-8 z-30 shadow-[0_-20px_60px_-15px_rgba(220,38,38,0.2)]"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className="p-3 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-xl">
                                            {latestLog.id.startsWith('CRE-') ? <Cpu size={24} className="animate-pulse" /> : <ShieldAlert size={24} className="animate-pulse" />}
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-3">
                                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">
                                                    {latestLog.id.startsWith('CRE-') ? "Autonomous Consensus Active" : "Tactical Alert Level 01"}
                                                </span>
                                                <div className="px-2 py-0.5 rounded bg-white text-[8px] font-black text-blue-600 uppercase tracking-tighter">
                                                    {latestLog.id.startsWith('CRE-') ? "CRE_CORE" : "ON_CHAIN"}
                                                </div>
                                            </div>
                                            <h3 className="text-xl font-black uppercase tracking-tight leading-none">
                                                {latestLog.event.replace("Manual Override: ", "").replace("CRE Consensus: ", "")}
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-12">
                                        <div className="flex flex-col items-end">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-white/50">Spillover Risk</span>
                                            <span className="text-2xl font-black tracking-tighter">{currentRisk}%</span>
                                        </div>
                                        <div className="h-10 w-[1px] bg-white/10" />
                                        <button
                                            onClick={() => latestLog.txHash && window.open(`https://dashboard.tenderly.co/explorer/vnet/ddf4998e-00a6-47cd-b249-8c1018222361/tx/${latestLog.txHash}`, '_blank')}
                                            className="px-8 py-3 bg-white hover:bg-white/90 text-blue-600 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center gap-3 transition-all shadow-xl shadow-black/10 active:scale-95"
                                        >
                                            View Proof <ExternalLink size={14} />
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </section>
            </main>
        </div >
    );
}

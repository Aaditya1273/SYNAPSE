"use client";

import { motion } from "framer-motion";
import { Network, Activity, Info, ShieldAlert, Zap, Layers, Cpu } from "lucide-react";
import { useAetherState } from "@/lib/hooks";

const nodes = [
    { id: "RWA-Treasury", label: "Institutional Vault", x: 400, y: 300, color: "var(--primary)", type: "core" },
    { id: "HK-Prop", label: "HK Real Estate", x: 200, y: 150, color: "var(--accent)", type: "asset" },
    { id: "US-Bonds", label: "US Treasury", x: 600, y: 150, color: "#27ae60", type: "asset" },
    { id: "BTC-Index", label: "BTC Index", x: 200, y: 450, color: "#f39c12", type: "asset" },
    { id: "EU-Carbon", label: "Carbon Credits", x: 600, y: 450, color: "#375bd2", type: "asset" },
];

export default function NetworkPage() {
    const { riskState, isPaused } = useAetherState();
    const currentRisk = riskState?.score ?? (isPaused ? 88 : 12);

    const connections = [
        { from: "HK-Prop", to: "RWA-Treasury", risk: currentRisk },
        { from: "US-Bonds", to: "RWA-Treasury", risk: 30 },
        { from: "BTC-Index", to: "RWA-Treasury", risk: Math.min(65, currentRisk + 10) },
        { from: "EU-Carbon", to: "RWA-Treasury", risk: 45 },
        { from: "HK-Prop", to: "US-Bonds", risk: Math.min(55, currentRisk - 10) },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-2">
                    <h1 className="text-5xl font-black tracking-tighter text-white">Global Contagion Hub</h1>
                    <p className="text-gray-400 font-medium">Predictive Correlation Mapping & Tactical Asset Spillover Analysis</p>
                </div>
                <div className="glass-premium px-5 py-2.5 rounded-2xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-[#00f2ff] border border-[#00f2ff]/20">
                    <Activity size={14} className="animate-pulse" /> LIVE_SENTINEL_SCAN_ACTIVE
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Tactical Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="glass-premium p-8 rounded-[2rem] space-y-6">
                        <h3 className="text-lg font-black flex items-center gap-3 text-white">
                            <Cpu size={18} className="text-[#00f2ff]" /> Risk Engine
                        </h3>
                        <p className="text-xs font-medium text-gray-500 leading-relaxed capitalize">
                            AetherSentinel utilizes BFT-Consensus to calculate cross-asset correlation coefficients in real-time.
                        </p>
                        <div className="pt-4 border-t border-white/5 space-y-4">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-500">
                                <span>Engine Latency</span>
                                <span className="text-white">42ms</span>
                            </div>
                            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-[#00f2ff]"
                                    initial={{ width: 0 }}
                                    animate={{ width: "94%" }}
                                    transition={{ duration: 2 }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="glass-premium p-8 rounded-[2rem] space-y-6">
                        <h3 className="text-lg font-black text-white capitalize">Risk Taxonomy</h3>
                        <div className="space-y-4">
                            {[
                                { label: "Systemic Contagion", color: "var(--accent)", value: "High" },
                                { label: "Moderate Friction", color: "#f39c12", value: "Alert" },
                                { label: "Institutional Stable", color: "#27ae60", value: "Secure" },
                            ].map((item, i) => (
                                <div key={i} className="flex justify-between items-center group cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2.5 h-2.5 rounded-full shadow-lg" style={{ background: item.color }} />
                                        <span className="text-[11px] font-bold text-gray-400 group-hover:text-white transition-colors">{item.label}</span>
                                    </div>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-600">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Orchestration Canvas */}
                <div className="lg:col-span-3 h-[650px] glass-premium rounded-[3rem] relative overflow-hidden bg-black/40 border-white/5">
                    {/* SVG Filters */}
                    <svg className="absolute w-0 h-0">
                        <defs>
                            <filter id="glow">
                                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>
                    </svg>

                    <svg className="w-full h-full p-8">
                        {/* Dynamic Connections */}
                        {connections.map((conn, i) => {
                            const fromNode = nodes.find(n => n.id === conn.from)!;
                            const toNode = nodes.find(n => n.id === conn.to)!;
                            const isHighRisk = conn.risk > 60;

                            return (
                                <g key={i}>
                                    <motion.line
                                        x1={fromNode.x} y1={fromNode.y}
                                        x2={toNode.x} y2={toNode.y}
                                        stroke={isHighRisk ? "var(--accent)" : "rgba(255,255,255,0.05)"}
                                        strokeWidth={isHighRisk ? 3 : 1}
                                        filter={isHighRisk ? "url(#glow)" : "none"}
                                        initial={{ pathLength: 0, opacity: 0 }}
                                        animate={{ pathLength: 1, opacity: isHighRisk ? 0.8 : 0.3 }}
                                        transition={{ duration: 2, ease: "easeInOut", delay: i * 0.1 }}
                                    />
                                    {isHighRisk && (
                                        <motion.circle
                                            r="4"
                                            fill="var(--accent)"
                                            animate={{
                                                cx: [fromNode.x, toNode.x],
                                                cy: [fromNode.y, toNode.y],
                                            }}
                                            transition={{
                                                duration: 1.5,
                                                repeat: Infinity,
                                                ease: "linear",
                                            }}
                                        />
                                    )}
                                </g>
                            );
                        })}

                        {/* Nodes */}
                        {nodes.map((node, i) => (
                            <motion.g
                                key={i}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ type: "spring", stiffness: 100, delay: i * 0.1 }}
                                className="cursor-pointer group"
                            >
                                <circle
                                    cx={node.x} cy={node.y} r={node.type === 'core' ? 50 : 30}
                                    fill={node.color} className="opacity-10 group-hover:opacity-20 transition-opacity"
                                />
                                <circle
                                    cx={node.x} cy={node.y} r={node.type === 'core' ? 24 : 14}
                                    fill={node.color}
                                    className={`${node.type === 'core' ? 'animate-pulse' : ''} shadow-2xl`}
                                    filter="url(#glow)"
                                />
                                <text
                                    x={node.x} y={node.y + (node.type === 'core' ? 74 : 54)}
                                    textAnchor="middle"
                                    className="fill-white text-[11px] font-black tracking-[0.2em] uppercase"
                                >
                                    {node.label}
                                </text>
                                <text
                                    x={node.x} y={node.y + (node.type === 'core' ? 90 : 70)}
                                    textAnchor="middle"
                                    className="fill-gray-500 text-[8px] font-bold uppercase tracking-widest"
                                >
                                    {node.type === 'core' ? 'Primary Hub' : 'Asset Class'}
                                </text>
                            </motion.g>
                        ))}
                    </svg>

                    {/* Alert Toast Overlay */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1 }}
                        className="absolute top-10 right-10 p-6 glass-premium border-red-500/20 rounded-[2rem] max-w-[260px] space-y-3"
                    >
                        <div className="flex items-center gap-2 text-[#ff2e5d] font-black text-[10px] tracking-widest uppercase">
                            <ShieldAlert size={14} className="animate-bounce" /> Tactical Alert
                        </div>
                        <p className="text-[11px] text-gray-400 font-medium leading-relaxed">
                            Inter-asset correlation spike detected in HK Property. Potential contagion to Institutional Vault: <span className="text-white font-bold">{currentRisk}%</span>.
                        </p>
                        <div className="flex gap-2">
                            <span className="px-2 py-1 bg-red-500/10 text-red-500 text-[8px] font-black rounded uppercase">Isolated</span>
                            <span className="px-2 py-1 bg-white/5 text-gray-500 text-[8px] font-black rounded uppercase">Log_421</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

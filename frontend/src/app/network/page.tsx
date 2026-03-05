"use client";

import { motion } from "framer-motion";
import { Network, Activity, Info } from "lucide-react";

const nodes = [
    { id: "RWA-Treasury", label: "RWA Treasury", x: 400, y: 300, color: "#00f2ff", type: "core" },
    { id: "HK-Prop", label: "HK Property", x: 200, y: 150, color: "#ff2e5d", type: "asset" },
    { id: "US-Bonds", label: "US Bonds", x: 600, y: 150, color: "#27ae60", type: "asset" },
    { id: "BTC-Index", label: "BTC Index", x: 200, y: 450, color: "#f39c12", type: "asset" },
    { id: "EU-Carbon", label: "EU Carbon", x: 600, y: 450, color: "#375bd2", type: "asset" },
];

const connections = [
    { from: "HK-Prop", to: "RWA-Treasury", risk: 85 },
    { from: "US-Bonds", to: "RWA-Treasury", risk: 30 },
    { from: "BTC-Index", to: "RWA-Treasury", risk: 65 },
    { from: "EU-Carbon", to: "RWA-Treasury", risk: 45 },
    { from: "HK-Prop", to: "US-Bonds", risk: 55 },
];

export default function NetworkPage() {
    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black tracking-tight">Global Contagion Hub</h1>
                    <p className="text-gray-400">Predictive Correlation Mapping & Asset Spillover Analysis</p>
                </div>
                <div className="glass px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-bold text-gray-400">
                    <Activity size={14} className="text-[#00f2ff]" /> LIVE SCANNING ACTIVE
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Info */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="glass p-6 rounded-2xl space-y-4">
                        <h3 className="font-bold flex items-center gap-2"><Info size={16} className="text-[#00f2ff]" /> Logic Engine</h3>
                        <p className="text-xs text-gray-400 leading-relaxed">
                            AetherSentinel analyzes real-time correlation co-efficients. High correlation (Red lines) indicates a high probability of risk contagion across asset classes.
                        </p>
                    </div>

                    <div className="glass p-6 rounded-2xl space-y-4">
                        <h3 className="font-bold">Risk Weighting</h3>
                        <div className="space-y-3">
                            {[
                                { label: "High Correlation", color: "#ff2e5d" },
                                { label: "Moderate Risk", color: "#f39c12" },
                                { label: "Systemic Stable", color: "#27ae60" },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 text-xs">
                                    <div className="w-3 h-3 rounded-full" style={{ background: item.color }} />
                                    <span className="text-gray-400">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Graph Canvas */}
                <div className="lg:col-span-3 h-[600px] glass rounded-3xl relative overflow-hidden bg-black/20">
                    <svg className="w-full h-full">
                        {/* Connection Lines */}
                        {connections.map((conn, i) => {
                            const fromNode = nodes.find(n => n.id === conn.from)!;
                            const toNode = nodes.find(n => n.id === conn.to)!;
                            const isHighRisk = conn.risk > 60;

                            return (
                                <motion.line
                                    key={i}
                                    x1={fromNode.x} y1={fromNode.y}
                                    x2={toNode.x} y2={toNode.y}
                                    stroke={isHighRisk ? "#ff2e5d" : "#ffffff10"}
                                    strokeWidth={isHighRisk ? 3 : 1}
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: isHighRisk ? 0.6 : 0.2 }}
                                    transition={{ duration: 1.5, delay: i * 0.2 }}
                                />
                            );
                        })}

                        {/* Nodes */}
                        {nodes.map((node, i) => (
                            <motion.g
                                key={i}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ type: "spring", damping: 12, delay: i * 0.1 }}
                            >
                                <circle
                                    cx={node.x} cy={node.y} r={node.type === 'core' ? 40 : 25}
                                    fill={node.color} className="opacity-20"
                                />
                                <circle
                                    cx={node.x} cy={node.y} r={node.type === 'core' ? 20 : 12}
                                    fill={node.color}
                                    className={node.type === 'core' ? 'animate-pulse' : ''}
                                />
                                <text
                                    x={node.x} y={node.y + (node.type === 'core' ? 60 : 40)}
                                    textAnchor="middle"
                                    className="fill-gray-400 text-[10px] font-bold tracking-widest uppercase"
                                >
                                    {node.label}
                                </text>
                            </motion.g>
                        ))}
                    </svg>

                    {/* Alert Overlay */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="absolute top-6 right-6 p-4 glass border-[#ff2e5d]/30 rounded-2xl max-w-[200px]"
                    >
                        <div className="flex items-center gap-2 text-[#ff2e5d] mb-2 font-bold text-xs">
                            <ShieldAlert size={14} /> CONTAGION ALERT
                        </div>
                        <p className="text-[10px] text-gray-400">Volatility in HK Property detected. Spillover risk to RWA Treasury: 85%.</p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

function ShieldAlert({ size }: { size: number }) {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="M12 8v4" /><path d="M12 16h.01" /></svg>
}

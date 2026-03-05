"use client";

import { motion } from "framer-motion";
import { Shield, Zap, RefreshCcw, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto py-12">
      {/* Hero Section */}
      <section className="text-center space-y-8 py-20 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-white/10 text-xs font-semibold uppercase tracking-widest text-[#00f2ff]"
        >
          <span className="w-2 h-2 rounded-full bg-[#00f2ff] animate-pulse" />
          Protocol Version 2.4.0 Live
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-6xl md:text-8xl font-black tracking-tighter leading-tight"
        >
          Predict. Isolate. <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00f2ff] via-[#375bd2] to-[#ff2e5d]">
            Heal Systemic Risk.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
        >
          AetherSentinel is the first autonomous contagion firewall for tokenized RWAs.
          Bridge institutional risk data with Web3 liquidity protection in real-time.
        </motion.p>

        <div className="absolute inset-0 -z-10 opacity-20 pointer-events-none">
          <img src="/hero-bg.png" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#05060f]/50 to-[#05060f]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="flex justify-center gap-4 pt-4"
        >
          <a href="/dashboard" className="px-8 py-4 rounded-full bg-[#00f2ff] text-black font-bold flex items-center gap-2 hover:scale-105 transition-transform">
            Launch Protocol <ArrowRight size={20} />
          </a>
          <button className="px-8 py-4 rounded-full glass border-white/10 font-bold hover:bg-white/5 transition-colors">
            Read Whitepaper
          </button>
        </motion.div>
      </section>

      {/* Pillars Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 py-24">
        {[
          { icon: <Shield className="text-[#00f2ff]" />, title: "Predict", desc: "Cross-asset contagion mapping powered by BFT-Consensus aggregation." },
          { icon: <Zap className="text-[#375bd2]" />, title: "Isolate", desc: "Confidential Multi-AI consensus triggers circuit breakers in milliseconds." },
          { icon: <RefreshCcw className="text-[#ff2e5d]" />, title: "Heal", desc: "Self-healing rebalance via CCIP once market stability is verified." }
        ].map((pillar, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 glass glass-hover rounded-3xl space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
              {pillar.icon}
            </div>
            <h3 className="text-2xl font-bold">{pillar.title}</h3>
            <p className="text-gray-400 leading-relaxed">{pillar.desc}</p>
          </motion.div>
        ))}
      </section>
    </div>
  );
}

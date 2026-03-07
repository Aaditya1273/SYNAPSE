"use client";

import { motion } from "framer-motion";
import { Shield, Zap, RefreshCw, ArrowRight, Layers, Globe, Cpu } from "lucide-react";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto space-y-32">
      {/* Hero Section */}
      <section className="text-center space-y-12 py-32 relative">
        <div className="space-y-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-3 px-6 py-2.5 rounded-2xl glass-premium border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-[#00f2ff] shadow-2xl shadow-cyan-500/10"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f2ff] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00f2ff]"></span>
            </span>
            Core Engine v2.4.0 Deployment Active
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.9] text-white"
          >
            Tactical Risk <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00f2ff] via-[#375bd2] to-[#ff2e5d] animate-pulse-glow">
              Orchestration.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-medium"
          >
            The world's first autonomous, cross-chain contagion firewall designed for institutional Real World Assets (RWAs). Bridge deep risk intelligence with automated liquidity protection.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col sm:flex-row justify-center gap-6 pt-8 relative z-10"
        >
          <a href="/dashboard" className="group px-10 py-5 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-[#00f2ff] transition-all duration-500 hover:shadow-[0_0_40px_rgba(0,242,255,0.4)] hover:scale-105 active:scale-95">
            Initialize Protocol <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
          </a>
          <button className="px-10 py-5 rounded-2xl glass-premium border-white/10 font-black uppercase tracking-widest text-xs text-white hover:bg-white/5 transition-all btn-institutional">
            Technical Architecture
          </button>
        </motion.div>

        {/* Visual Engine Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] -z-10 overflow-hidden pointer-events-none opacity-40">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-hsl(var(--background))" />
          <div className="w-full h-full animate-spin-slow opacity-20 bg-[radial-gradient(circle_at_center,_hsla(var(--primary),0.3)_0,_transparent_70%)] blur-3xl" />
        </div>
      </section>

      {/* Institutional Pillars */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 py-20 relative">
        {[
          { icon: <Shield size={28} className="text-[#00f2ff]" />, title: "Predict", desc: "Institutional sentiment aggregation & cross-asset correlation mapping powered by Chainlink CRE.", category: "Vulnerability Intel" },
          { icon: <Cpu size={28} className="text-[#375bd2]" />, title: "Isolate", desc: "Confidential execution of Multi-AI consensus triggers circuit breakers on-chain within 500ms.", category: "System Isolation" },
          { icon: <RefreshCw size={28} className="text-[#ff2e5d]" />, title: "Heal", desc: "Self-healing rebalance orchestration via CCIP once systemic stability is verified by consensus.", category: "Recovery Pulse" }
        ].map((pillar, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="p-10 glass-card rounded-[2.5rem] space-y-6 group"
          >
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors duration-500 shadow-inner">
              {pillar.icon}
            </div>
            <div className="space-y-4">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 group-hover:text-[#00f2ff] transition-colors">{pillar.category}</div>
              <h3 className="text-3xl font-black tracking-tight group-hover:text-glow-cyan transition-all">{pillar.title}</h3>
              <p className="text-gray-400 leading-relaxed font-medium text-sm">{pillar.desc}</p>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Secondary Visual Section */}
      <section className="py-20 glass-premium rounded-[3rem] p-16 border-white/5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-20 opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity">
          <Globe size={400} className="text-[#00f2ff] animate-spin-slow" />
        </div>
        <div className="max-w-2xl space-y-8 relative z-10">
          <h2 className="text-5xl font-black tracking-tighter italic">Engineered for <br /><span className="text-[#375bd2]">Global RWA Dominance.</span></h2>
          <p className="text-gray-400 font-medium leading-relaxed">AetherSentinel is not just a protocol; it is the silent orchestrator behind the next generation of asset tokenization. We prevent the "Contagion Domino Effect" before the first tile falls.</p>
          <div className="grid grid-cols-2 gap-8 pt-4">
            <div>
              <div className="text-3xl font-black text-white">$1.2B+</div>
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Protected TVL Mocked</div>
            </div>
            <div>
              <div className="text-3xl font-black text-white">500ms</div>
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Isolation Latency</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

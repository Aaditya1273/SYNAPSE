"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, RefreshCw, ArrowRight, Globe, Cpu } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAetherState, useWallet } from "@/lib/hooks";
import { ConnectButton } from "thirdweb/react";
import { client, tenderlyChain } from "@/lib/thirdweb";

export default function Home() {
  const { isPaused, riskState } = useAetherState();
  const { account, connect, loading: walletLoading } = useWallet();
  const router = useRouter();

  useEffect(() => {
    if (account) {
      router.push('/dashboard');
    }
  }, [account, router]);

  return (
    <div className="max-w-7xl mx-auto space-y-32 py-12 px-8">
      {/* Hero Section - Clean & High Contrast */}
      <section className="text-center space-y-12 py-32 relative">
        <div className="space-y-8 relative z-10">
          {account && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-blue-50 border border-blue-100 text-[10px] font-black uppercase tracking-[0.2em] text-[#2563EB]"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
              </span>
              Institutional Node v2.4.0 Active
            </motion.div>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-7xl md:text-9xl font-black tracking-tighter text-[#0F172A] leading-[0.95] uppercase"
          >
            Institutional <br />
            <span className="text-[#2563EB]">Risk Control.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-medium"
          >
            AetherSentinel provides autonomous, cross-chain contagion protection for tokenized assets. Built for institutions that require <span className="text-[#0F172A] font-bold">absolute certainty.</span>
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row justify-center items-center gap-6 pt-12"
        >
          <div className="institutional-connect-hero">
            <ConnectButton
              client={client}
              theme="light"
              chain={tenderlyChain}
              connectButton={{
                className: "institutional-btn-hero",
                label: "Connect Tactical Wallet"
              }}
            />
          </div>
          <button className="px-10 py-5 rounded-xl border border-gray-100 bg-white text-[#0F172A] font-black uppercase tracking-[0.2em] text-[11px] hover:bg-gray-50 transition-all border-b-4 border-b-gray-200 active:border-b-0 active:translate-y-[2px]">
            System Documentation
          </button>
        </motion.div>
      </section>

      {/* Value Pillars - Minimalist Bordered approach */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {[
          { icon: <Shield size={28} className="text-[#2563EB]" />, title: "Predict", desc: "Real-time institutional sentiment and asset correlation mapping.", category: "Vulnerability Intelligence" },
          { icon: <Cpu size={28} className="text-[#2563EB]" />, title: "Isolate", desc: "Automated circuit breakers triggered via multi-AI consensus within 500ms.", category: "Operational Isolation" },
          { icon: <RefreshCw size={28} className="text-[#2563EB]" />, title: "Heal", desc: "Self-healing rebalance logic via CCIP to restore liquidity.", category: "Recovery Pulse" }
        ].map((pillar, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="p-12 card-minimal space-y-8"
          >
            <div className="w-14 h-14 rounded-2xl bg-blue-50/50 flex items-center justify-center border border-blue-100/50">
              {pillar.icon}
            </div>
            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2563EB]/40">{pillar.category}</span>
              <h3 className="text-3xl font-black text-[#0F172A] uppercase tracking-tighter">{pillar.title}</h3>
              <p className="text-gray-400 leading-relaxed text-sm font-bold uppercase">{pillar.desc}</p>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Network Status Grid - Only visible if wallet is connected */}
      {account && (
        <section className="py-32 px-16 border border-gray-100 rounded-[3rem] relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="max-w-2xl space-y-10 relative z-10">
            <h2 className="text-5xl font-black tracking-tight text-[#0F172A] uppercase leading-[0.9]">
              Engineered for <br /><span className="text-[#2563EB]">Protocol Sovereignty.</span>
            </h2>
            <p className="text-gray-400 font-bold leading-relaxed uppercase text-xs tracking-widest max-w-lg">
              AetherSentinel is the bridge between deep risk intelligence and automated protocol defense. We eliminate systemic domino effects before contagion spreads.
            </p>
            <div className="flex gap-12 pt-6">
              <div className="space-y-3">
                <div className="text-5xl font-black text-[#0F172A] tracking-tighter uppercase leading-none">{isPaused ? "Isolated" : "Active"}</div>
                <div className="text-[10px] font-black text-[#2563EB] uppercase tracking-[0.2em] opacity-40">System Status</div>
              </div>
              <div className="space-y-3">
                <div className="text-5xl font-black text-[#0F172A] tracking-tighter leading-none">{riskState?.score ?? "12"} / 100</div>
                <div className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em] opacity-40">Global Exposure</div>
              </div>
            </div>
          </div>
          <div className="relative w-64 h-64 md:w-96 md:h-96 flex items-center justify-center">
            <Globe size={400} className="text-[#2563EB] opacity-[0.03] absolute" />
            <div className="w-full h-full border border-gray-50 rounded-full animate-pulse flex items-center justify-center">
              <Shield size={64} className="text-[#2563EB]/10" />
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

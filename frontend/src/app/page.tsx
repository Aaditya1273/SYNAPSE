"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, RefreshCw, ArrowRight, Globe, Cpu, Activity, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAetherState, useWallet } from "@/lib/hooks";
import { ConnectButton } from "thirdweb/react";
import { client, tenderlyChain } from "@/lib/thirdweb";

import FloatingLines from "@/components/FloatingLines";
import BlurText from "@/components/BlurText";
import ShinyText from "@/components/ShinyText";
import MagicBento from "@/components/MagicBento";

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
    <div className="relative min-h-screen overflow-hidden">
      {/* Floating Lines Background */}
      <div className="absolute inset-0 z-0">
        <FloatingLines
          linesGradient={["#2563EB", "#3B82F6", "#60A5FA"]}
          animationSpeed={0.8}
          bendStrength={-0.5}
          bendRadius={5.0}
        />
      </div>

      <div className="max-w-7xl mx-auto space-y-32 py-12 px-8 relative z-10 pt-48">
        {/* Hero Section - Clean & High Contrast */}
        <section className="text-center space-y-12 py-12 relative">
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
                <ShinyText text="Institutional Node v2.4.0 Active" speed={3} color="#2563EB" shineColor="#3B82F6" />
              </motion.div>
            )}

            <div className="flex flex-col items-center">
              <BlurText
                text="Institutional"
                delay={150}
                animateBy="words"
                direction="top"
                className="text-7xl md:text-[9rem] font-black tracking-tighter text-white leading-[0.85] uppercase block"
              />
              <BlurText
                text="Risk Control."
                delay={200}
                animateBy="words"
                direction="top"
                className="text-7xl md:text-[9rem] font-black tracking-tighter uppercase block"
                spanClassName="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#93C5FD] drop-shadow-[0_0_30px_rgba(37,99,235,0.3)]"
              />
            </div>

            <div className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-medium">
              <BlurText
                text="AetherSentinel provides autonomous, cross-chain contagion protection for tokenized assets. Built for institutions that require absolute certainty"
                delay={50}
                animateBy="letters"
                direction="bottom"
              />
              <span className="text-sm text-[#2563EB] font-bold tracking-widest uppercase mt-4 inline-block">
                <ShinyText text="Powered by Chainlink CRE v1.3" speed={2} color="#2563EB" shineColor="#60A5FA" />
              </span>
            </div>
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

        {/* Trusted By Band */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="border-t border-b border-gray-100 py-8 flex flex-wrap justify-between items-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500"
        >
          {['Chainlink', 'Tenderly', 'CoinGecko', 'Thirdweb', 'OpenZeppelin'].map((brand, i) => (
            <div key={i} className="text-sm font-black uppercase tracking-[0.3em] text-gray-400">{brand}</div>
          ))}
        </motion.div>

        {/* Value Pillars - Premium Magic Bento approach */}
        <section className="space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase italic">Core Capabilities</h2>
            <p className="text-[#2563EB] font-black uppercase tracking-[0.4em] text-[10px]">Institutional Grade Protection Systems</p>
          </div>

          <MagicBento
            glowColor="37, 99, 235"
            spotlightRadius={500}
            particleCount={15}
            enableTilt={false}
            enableMagnetism={false}
            cards={[
              {
                label: "Vulnerability Intelligence",
                title: "Predictive Analysis",
                description: "Real-time institutional sentiment and asset correlation mapping powered by multi-agent consensus networks.",
                color: "rgba(15, 23, 42, 0.4)"
              },
              {
                label: "Operational Isolation",
                title: "Automated Breaker",
                description: "Circuit breakers triggered via multi-AI consensus within 500ms blocktimes.",
                color: "rgba(15, 23, 42, 0.4)"
              },
              {
                label: "Recovery Pulse",
                title: "Self-Healing Logic",
                description: "Autonomous rebalance execution via CCIP to restore liquidity across isolated chains post-threat.",
                color: "rgba(15, 23, 42, 0.4)"
              },
              {
                label: "System Health",
                title: "Real-time Telemetry",
                description: "Deep-packet inspection of cross-chain messages with automated anomaly rejection.",
                color: "rgba(15, 23, 42, 0.4)"
              },
              {
                label: "Compliance",
                title: "Immutable Audit",
                description: "Every defensive action is cryptographically proven and recorded for institutional reporting.",
                color: "rgba(15, 23, 42, 0.4)"
              },
              {
                label: "DApp Security",
                title: "WASM Hardening",
                description: "Workflows execute in isolated Javy runtimes for maximal deterministic security.",
                color: "rgba(15, 23, 42, 0.4)"
              }
            ]}
          />
        </section>

        {/* Orchestration Flow */}
        <section className="py-32 relative">
          <div className="text-center space-y-4 mb-24">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase">The CRE Orchestration Layer</h2>
            <p className="text-[#2563EB] font-black uppercase tracking-[0.4em] text-[10px]">Deterministic Execution from Off-Chain Intelligence</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connection Line (Desktop) */}
            <div className="hidden md:block absolute top-[40%] left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent z-0" />

            {[
              { step: "01", title: "Listen", desc: "Aggregating market telemetry & AI threat models via HTTPClient.", icon: <Activity size={32} /> },
              { step: "02", title: "Consensus", desc: "DON validation & aggregated scoring via ConsensusAggregationByFields.", icon: <Shield size={32} /> },
              { step: "03", title: "Execute", desc: "Deterministic on-chain state updates via EVMClient.", icon: <Zap size={32} /> }
            ].map((phase, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="bg-[#020617]/40 backdrop-blur-2xl p-10 rounded-[2.5rem] border border-white/5 shadow-2xl relative z-10 flex flex-col items-center text-center group hover:border-blue-500/30 transition-all duration-500"
              >
                <div className="w-20 h-20 rounded-3xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(37,99,235,0.4)]">
                  {phase.icon}
                </div>
                <span className="text-[#2563EB] font-black text-xs uppercase tracking-widest mb-4 opacity-50">{phase.step}</span>
                <h4 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">{phase.title}</h4>
                <p className="text-sm text-gray-500 font-bold leading-relaxed">{phase.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Network Status Grid - Only visible if wallet is connected */}
        {account && (
          <section className="py-32 px-16 border border-gray-100 rounded-[3rem] relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-12 bg-white/80 backdrop-blur-md">
            <div className="max-w-2xl space-y-10 relative z-10">
              <h2 className="text-5xl font-black tracking-tight text-[#0F172A] uppercase leading-[0.9]">
                Engineered for <br /><span className="text-[#2563EB]">Protocol Sovereignty.</span>
              </h2>
              <p className="text-gray-500 font-bold leading-relaxed uppercase text-xs tracking-widest max-w-lg">
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
              <div className="w-full h-full border border-gray-50 rounded-full animate-pulse flex items-center justify-center bg-white shadow-2xl">
                <Shield size={64} className="text-[#2563EB]/10" />
              </div>
            </div>
          </section>
        )}

        {/* Final CTA Full Width Footer Box */}
        {!account && (
          <section className="mt-20 rounded-[4rem] bg-[#020617] overflow-hidden relative border border-white/5 shadow-2xl">
            <div className="absolute inset-0 bg-blue-600/5 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent" />
            <div className="py-40 px-8 text-center relative z-10 space-y-12 flex flex-col items-center">
              <div className="w-20 h-20 rounded-3xl bg-blue-600/10 flex items-center justify-center border border-blue-500/20 mb-4 animate-bounce">
                <Shield size={40} className="text-blue-400" />
              </div>
              <h2 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter max-w-5xl mx-auto leading-[0.85]">
                Secure your protocol. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">Deploy the Aegis.</span>
              </h2>
              <div className="institutional-connect-hero pt-8 scale-125">
                <ConnectButton
                  client={client}
                  theme="dark"
                  chain={tenderlyChain}
                  connectButton={{
                    className: "institutional-btn-hero !bg-white !text-[#020617] !border-none hover:!bg-blue-50 !px-12 !py-6 !text-sm shadow-2xl shadow-blue-500/20",
                    label: "Initialize Node Connection"
                  }}
                />
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

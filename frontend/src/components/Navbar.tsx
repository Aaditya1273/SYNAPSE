"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useWallet } from "@/lib/hooks";
import { Loader2, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "thirdweb/react";
import { client, tenderlyChain } from "@/lib/thirdweb";

import GooeyNav from "./GooeyNav";

export function Navbar() {
    const { account, connect, disconnect, loading: walletLoading, terminalConnected, connectTerminal } = useWallet();
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const isHome = pathname === "/";
    const navTheme = isHome && !isScrolled ? "dark" : "light";
    const navItems = [
        { label: 'Network', href: '/network' },
        { label: 'Protocol', href: '/dashboard' },
        { label: 'Vault', href: '/vault' },
    ];

    const activeIndex = navItems.findIndex(item => item.href === pathname);

    return (
        <nav className={`fixed top-8 left-1/2 -translate-x-1/2 w-[90%] max-w-7xl z-50 transition-all duration-700 px-8 py-4 rounded-2xl border ${isScrolled || !isHome ? "bg-[#020617]/20 backdrop-blur-3xl border-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.6)]" : "bg-transparent border-transparent"
            }`}>
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link href="/" className="flex items-center gap-3 group cursor-pointer">
                    <div className="w-10 h-10 rounded-xl bg-[#2563EB] flex items-center justify-center font-bold shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-all duration-500">
                        <span className="text-white text-lg">A</span>
                    </div>
                    <div className="flex flex-col">
                        <span className={`text-xl font-black tracking-tighter leading-none uppercase transition-colors duration-500 ${navTheme === "dark" ? "text-white" : "text-white"}`}>Aether<span className="text-[#2563EB]">Sentinel</span></span>
                        <span className="text-[9px] font-black text-gray-400 tracking-[0.3em] uppercase opacity-60">Tactical Node v2.4</span>
                    </div>
                </Link>

                <div className="hidden md:block">
                    {account && (
                        <GooeyNav
                            items={navItems}
                            initialActiveIndex={activeIndex >= 0 ? activeIndex : 0}
                        />
                    )}
                </div>

                <div className="flex items-center gap-3">
                    {/* Connect Terminal Button - Only visible if wallet is connected */}
                    {account && (
                        <button
                            onClick={connectTerminal}
                            disabled={walletLoading || terminalConnected}
                            className={`px-5 py-2.5 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 ${terminalConnected
                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                : 'bg-white/5 border-white/10 text-white hover:bg-blue-600 hover:border-blue-500 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:-translate-y-0.5 active:scale-95'
                                }`}
                        >
                            {terminalConnected ? (
                                <>
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10B981]" />
                                    Command Copied!
                                </>
                            ) : "Connect Terminal"}
                        </button>
                    )}

                    {/* wallet Connect - Integrated with ThirdWeb context */}
                    <div className="institutional-connect">
                        <ConnectButton
                            client={client}
                            theme="dark"
                            chain={tenderlyChain}
                            connectButton={{
                                className: `institutional-btn-connect !rounded-xl !px-6 !py-2.5 !text-[11px] !font-black !uppercase !tracking-widest transition-all hover:-translate-y-0.5 active:scale-95 ${navTheme === "dark" ? "!bg-white/5 !text-white !border !border-white/10 hover:!bg-white/10" : "!bg-blue-600 !text-white hover:!bg-blue-700"}`,
                                label: "Access Node"
                            }}
                            detailsButton={{
                                className: "institutional-btn-details"
                            }}
                        />
                    </div>
                </div>
            </div>
        </nav>
    );
}

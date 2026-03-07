"use client";

import { useWallet } from "@/lib/hooks";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
    const { account, connect, disconnect, loading: walletLoading } = useWallet();
    const pathname = usePathname();

    const navItems = [
        { name: 'Network', href: '/network' },
        { name: 'Protocol', href: '/dashboard' },
        { name: 'Vault', href: '/vault' },
    ];

    return (
        <nav className="fixed top-0 w-full z-50 glass-premium border-b border-white/5 backdrop-blur-3xl px-8 py-5">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link href="/" className="flex items-center gap-3 group cursor-pointer">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00f2ff] via-[#375bd2] to-[#ff2e5d] flex items-center justify-center font-bold shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform duration-500">
                        <span className="text-white text-lg">A</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-extrabold tracking-tighter text-white leading-none">AETHER<span className="text-[#00f2ff]">SENTINEL</span></span>
                        <span className="text-[9px] font-bold text-[#ff2e5d] tracking-widest uppercase opacity-80">Institutional v2.4</span>
                    </div>
                </Link>

                <div className="hidden md:flex gap-10 text-[11px] font-bold uppercase tracking-widest">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`transition-all duration-300 relative group ${isActive ? 'text-[#00f2ff]' : 'text-gray-400 hover:text-white'}`}
                            >
                                {item.name}
                                <span className={`absolute -bottom-1 left-0 h-[2px] bg-[#00f2ff] transition-all duration-300 ${isActive ? 'w-full shadow-[0_0_10px_rgba(0,242,255,0.5)]' : 'w-0 group-hover:w-full'}`}></span>
                            </Link>
                        );
                    })}
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={account ? disconnect : connect}
                        disabled={walletLoading}
                        className="hidden sm:block px-6 py-2.5 rounded-xl glass-premium border-white/10 text-[10px] font-bold uppercase tracking-widest hover:border-[#00f2ff]/50 hover:bg-white/5 transition-all btn-institutional"
                    >
                        {walletLoading ? <Loader2 className="animate-spin w-4 h-4" /> : account ? `${account.slice(0, 6)}...${account.slice(-4)}` : "Connect Terminal"}
                    </button>
                </div>
            </div>
        </nav>
    );
}

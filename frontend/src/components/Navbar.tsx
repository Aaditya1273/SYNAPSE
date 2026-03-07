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
        <nav className="fixed top-0 w-full z-50 bg-white border-b border-gray-100 shadow-sm px-8 py-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link href="/" className="flex items-center gap-3 group cursor-pointer">
                    <div className="w-9 h-9 rounded-lg bg-[#2563EB] flex items-center justify-center font-bold shadow-md shadow-blue-500/10 group-hover:scale-105 transition-all duration-300">
                        <span className="text-white text-base">A</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-black tracking-tighter text-[#0F172A] leading-none uppercase">Aether<span className="text-[#2563EB]">Sentinel</span></span>
                        <span className="text-[8px] font-black text-gray-400 tracking-[0.2em] uppercase">Tactical Node v2.4</span>
                    </div>
                </Link>

                <div className="hidden md:flex gap-8 text-[11px] font-bold uppercase tracking-widest">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`transition-all duration-200 relative py-2 ${isActive ? 'text-[#2563EB]' : 'text-gray-500 hover:text-[#0F172A]'}`}
                            >
                                {item.name}
                                {isActive && (
                                    <motion.span
                                        layoutId="nav-underline"
                                        className="absolute -bottom-4 left-0 w-full h-[3px] bg-[#2563EB]"
                                    />
                                )}
                            </Link>
                        );
                    })}
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={account ? disconnect : connect}
                        disabled={walletLoading}
                        className="px-5 py-2.5 rounded-lg border border-gray-200 text-[10px] font-bold uppercase tracking-widest text-[#0F172A] hover:bg-gray-50 hover:border-gray-300 transition-all"
                    >
                        {walletLoading ? <Loader2 className="animate-spin w-4 h-4" /> : account ? `${account.slice(0, 6)}...${account.slice(-4)}` : "Connect Terminal"}
                    </button>
                </div>
            </div>
        </nav>
    );
}

"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { NavBar } from "@/components/ui/tubelight-navbar";

export default function Header() {
    const navItems = [
        { name: 'Home', url: '/' },
        { name: 'Dashboard', url: '/dashboard' },
        { name: 'Loans', url: '/lending' },
        { name: 'Orchestration', url: '/orchestration' },
        { name: 'Bridge', url: '/bridge' }
    ];

    return (
        <>
            <NavBar items={navItems} />
            <div className="fixed top-0 right-0 z-50 pt-6 pr-6">
                <div className="bg-black/40 border border-primary/30 backdrop-blur-xl rounded-full px-4 py-2 shadow-lg shadow-primary/10">
                    <ConnectButton
                        accountStatus="address"
                        showBalance={false}
                        chainStatus="icon"
                    />
                </div>
            </div>
        </>
    );
}

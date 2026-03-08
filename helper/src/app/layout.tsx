import type { Metadata } from "next";
import { spaceGrotesk } from "@/lib/fonts";
import "./globals.css";
import Header from "@/components/layout/Header";

export const metadata: Metadata = {
    title: "PrivaCRE — Privacy-First CRE Lending",
    description:
        "Undercollateralized DeFi loans powered by Zero-Knowledge proofs, World ID identity, and Chainlink oracles. Your data stays private.",
    keywords: ["DeFi", "ZK proofs", "lending", "privacy", "World ID", "crypto", "CRE"],
};

import { Web3Provider } from "@/components/providers/Web3Provider";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark">
            <body
                className={`${spaceGrotesk.variable} font-display antialiased min-h-screen bg-background-dark text-slate-100 overflow-x-hidden`}
            >
                <Web3Provider>
                    <Header />
                    {children}
                </Web3Provider>
            </body>
        </html>
    );
}

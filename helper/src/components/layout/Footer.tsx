import Link from "next/link";
import { Shield, Github, Twitter, ExternalLink } from "lucide-react";

export default function Footer() {
    return (
        <footer className="border-t border-white/5 bg-[#080810]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2.5 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-violet-500 flex items-center justify-center">
                                <Shield className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-outfit font-bold text-lg text-gradient">PrivaCRE</span>
                        </div>
                        <p className="text-white/40 text-sm leading-relaxed max-w-sm">
                            Privacy-preserving undercollateralized DeFi lending powered by
                            Zero-Knowledge proofs, World ID, and Chainlink oracles.
                            Your data never leaves your device unencrypted.
                        </p>
                        <div className="flex items-center gap-3 mt-5">
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg glass text-white/40 hover:text-white hover:bg-white/5 transition-all"
                            >
                                <Github className="w-4 h-4" />
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg glass text-white/40 hover:text-white hover:bg-white/5 transition-all"
                            >
                                <Twitter className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Protocol */}
                    <div>
                        <h4 className="font-outfit font-semibold text-white/80 mb-4 text-sm uppercase tracking-wider">
                            Protocol
                        </h4>
                        <ul className="space-y-2.5">
                            {[
                                { href: "/dashboard", label: "Dashboard" },
                                { href: "/lending", label: "Borrow" },
                                { href: "/bridge", label: "Data Bridge" },
                                { href: "/orchestration", label: "Orchestration" },
                            ].map((l) => (
                                <li key={l.href}>
                                    <Link
                                        href={l.href}
                                        className="text-white/40 hover:text-white/80 text-sm transition-colors"
                                    >
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="font-outfit font-semibold text-white/80 mb-4 text-sm uppercase tracking-wider">
                            Legal
                        </h4>
                        <ul className="space-y-2.5">
                            {[
                                { href: "#", label: "Privacy Policy" },
                                { href: "#", label: "Terms of Service" },
                                { href: "#", label: "Documentation" },
                                { href: "#", label: "Audit Reports" },
                            ].map((l) => (
                                <li key={l.label}>
                                    <a
                                        href={l.href}
                                        className="text-white/40 hover:text-white/80 text-sm transition-colors flex items-center gap-1 group"
                                    >
                                        {l.label}
                                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity" />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/5 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-white/25 text-xs">
                        © 2024 Crest Protocol. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4 text-xs text-white/25">
                        <span className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                            All systems operational
                        </span>
                        <span>Powered by Zero-Knowledge Cryptography</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

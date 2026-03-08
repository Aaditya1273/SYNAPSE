"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Shield, Menu, X, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/lending", label: "Borrow" },
    { href: "/bridge", label: "Data Bridge" },
    { href: "/orchestration", label: "Orchestration" },
];

export default function Navbar() {
    const pathname = usePathname();
    const navRef = useRef<HTMLElement>(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                navRef.current,
                { y: -80, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.2 }
            );
        });
        return () => ctx.revert();
    }, []);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            ref={navRef}
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
                scrolled
                    ? "glass border-b border-white/5 shadow-2xl shadow-black/40"
                    : "bg-transparent"
            )}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-violet-500 flex items-center justify-center glow-brand group-hover:scale-110 transition-transform duration-300">
                            <Shield className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-outfit font-bold text-lg tracking-tight text-gradient">
                            PrivaCRE
                        </span>
                    </Link>

                    {/* Desktop links */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                                    pathname === link.href
                                        ? "bg-brand-500/20 text-brand-400 border border-brand-500/30"
                                        : "text-white/60 hover:text-white hover:bg-white/5"
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="hidden md:flex items-center gap-3">
                        <Link
                            href="/auth"
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-brand-500 to-violet-500 text-white text-sm font-semibold hover:opacity-90 hover:scale-105 transition-all duration-200 glow-brand"
                        >
                            <Zap className="w-3.5 h-3.5" />
                            Connect Wallet
                        </Link>
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        className="md:hidden p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                        onClick={() => setMobileOpen(!mobileOpen)}
                    >
                        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="md:hidden glass border-b border-white/5">
                    <div className="px-4 py-3 space-y-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className={cn(
                                    "block px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
                                    pathname === link.href
                                        ? "bg-brand-500/20 text-brand-400"
                                        : "text-white/60 hover:text-white hover:bg-white/5"
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <Link
                            href="/auth"
                            onClick={() => setMobileOpen(false)}
                            className="block mt-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-brand-500 to-violet-500 text-white text-sm font-semibold text-center"
                        >
                            Connect Wallet
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}

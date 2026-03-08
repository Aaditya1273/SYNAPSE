import Link from "next/link";
import MetaballBackground from '@/components/ui/MetaballBackground';
import AnimatedButton from '@/components/ui/AnimatedButton';
import AnimatedCard from '@/components/ui/AnimatedCard';
import CounterAnimation from '@/components/ui/CounterAnimation';
import PageTransition from '@/components/animations/PageTransition';

export default function HomePage() {
    return (
        <div className="relative flex min-h-screen w-full flex-col pt-24">
            <MetaballBackground />
            <PageTransition>
                <div className="layout-container flex h-full grow flex-col">
                    <div className="w-full flex flex-1 justify-center">
                        <div className="layout-content-container flex flex-col max-w-[1200px] flex-1">
                            {/* Hero Section */}
                            <div className="px-4 md:px-10 py-20 md:py-32">
                                <div className="flex min-h-[70vh] flex-col gap-8 items-center justify-center text-center relative z-10">
                                    <h1 className="text-white text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter max-w-5xl" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                        Your Privacy is <br />
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-400 to-primary animate-gradient">
                                            Your Credit
                                        </span>
                                    </h1>
                                    <p className="text-text-secondary text-xl md:text-2xl font-light leading-relaxed max-w-3xl backdrop-blur-sm bg-black/20 p-6 rounded-2xl border border-primary/10">
                                        Unlock undercollateralized DeFi loans using <span className="text-primary font-semibold">encrypted bank data</span> and <span className="text-primary font-semibold">World ID verification</span>. No traditional credit score needed.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-6 mt-8">
                                        <AnimatedButton href="/auth" variant="primary" className="min-w-[200px] text-lg h-14">
                                            Launch PrivaCRE App
                                        </AnimatedButton>
                                        <AnimatedButton variant="secondary" className="min-w-[200px] text-lg h-14">
                                            Read Documentation
                                        </AnimatedButton>
                                    </div>

                                    <div className="grid grid-cols-3 gap-8 mt-16 w-full max-w-3xl">
                                        <div className="backdrop-blur-md bg-black/30 p-6 rounded-xl border border-primary/20">
                                            <div className="text-4xl font-bold text-primary">
                                                <CounterAnimation end={100} suffix="%" />
                                            </div>
                                            <div className="text-sm text-text-secondary mt-2">Privacy Preserved</div>
                                        </div>
                                        <div className="backdrop-blur-md bg-black/30 p-6 rounded-xl border border-primary/20">
                                            <div className="text-4xl font-bold text-primary">
                                                <CounterAnimation end={50} suffix="%" />
                                            </div>
                                            <div className="text-sm text-text-secondary mt-2">Lower Collateral</div>
                                        </div>
                                        <div className="backdrop-blur-md bg-black/30 p-6 rounded-xl border border-primary/20">
                                            <div className="text-4xl font-bold text-primary">
                                                <CounterAnimation end={0} suffix="s" />
                                            </div>
                                            <div className="text-sm text-text-secondary mt-2">Instant Approval</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* How it Works */}
                            <div id="how-it-works" className="animate-section flex flex-col gap-10 px-4 md:px-10 py-16 backdrop-blur-sm bg-black/40 rounded-3xl mx-4">
                                <div className="flex flex-col gap-4 text-center items-center">
                                    <h2 className="text-white text-4xl md:text-5xl font-bold">
                                        How PrivaCRE Works
                                    </h2>
                                    <p className="text-text-secondary text-xl font-light max-w-3xl">
                                        A revolutionary three-phase system combining <span className="text-primary">Chainlink CRE</span>, <span className="text-primary">World ID</span>, and <span className="text-primary">Zero-Knowledge Proofs</span>.
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <AnimatedCard delay={0.1} className="animate-card">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 flex items-center justify-center text-primary">
                                            <span className="material-symbols-outlined !text-4xl">encrypted</span>
                                        </div>
                                        <div className="flex flex-col gap-3 mt-6">
                                            <h3 className="text-white text-2xl font-bold">Phase 1: Data Bridge</h3>
                                            <p className="text-text-secondary leading-relaxed">
                                                Connect via <span className="text-primary">Plaid</span>. Data encrypted client-side with <span className="text-primary">AES-256</span> and processed in Chainlink DON.
                                            </p>
                                        </div>
                                    </AnimatedCard>

                                    <AnimatedCard delay={0.2} className="animate-card">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 flex items-center justify-center text-primary">
                                            <span className="material-symbols-outlined !text-4xl">psychology</span>
                                        </div>
                                        <div className="flex flex-col gap-3 mt-6">
                                            <h3 className="text-white text-2xl font-bold">Phase 2: AI Analysis</h3>
                                            <p className="text-text-secondary leading-relaxed">
                                                <span className="text-primary">Groq Llama 3.3</span> analyzes patterns to generate your <span className="text-primary">Crest Score (0-100)</span>.
                                            </p>
                                        </div>
                                    </AnimatedCard>

                                    <AnimatedCard delay={0.3} className="animate-card">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 flex items-center justify-center text-primary">
                                            <span className="material-symbols-outlined !text-4xl">account_balance</span>
                                        </div>
                                        <div className="flex flex-col gap-3 mt-6">
                                            <h3 className="text-white text-2xl font-bold">Phase 3: Private Vault</h3>
                                            <p className="text-text-secondary leading-relaxed">
                                                Borrow with <span className="text-primary">50% collateral</span>. Verified by <span className="text-primary">World ID</span>.
                                            </p>
                                        </div>
                                    </AnimatedCard>
                                </div>
                            </div>

                            {/* Trust Banner */}
                            <div id="security" className="px-4 md:px-10 py-16">
                                <div className="backdrop-blur-md bg-black/40 rounded-3xl p-10 border border-primary/20">
                                    <h2 className="text-white text-4xl font-bold text-center mb-12">
                                        Trusted Infrastructure
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="flex flex-col gap-4 p-6 rounded-xl hover:bg-black/30 transition-colors">
                                            <div className="w-full h-32 bg-surface-dark border border-border-dark rounded-lg flex items-center justify-center">
                                                <span className="text-primary text-4xl font-bold">Chainlink</span>
                                            </div>
                                            <h4 className="text-white text-lg font-bold">Decentralized Oracle Network</h4>
                                            <p className="text-text-secondary text-sm">Secure off-chain computation with consensus verification.</p>
                                        </div>

                                        <div className="flex flex-col gap-4 p-6 rounded-xl hover:bg-black/30 transition-colors">
                                            <div className="w-full h-32 bg-surface-dark border border-border-dark rounded-lg flex items-center justify-center">
                                                <span className="text-primary text-4xl font-bold">World ID</span>
                                            </div>
                                            <h4 className="text-white text-lg font-bold">Sybil Resistance</h4>
                                            <p className="text-text-secondary text-sm">One loan per human, verified anonymously.</p>
                                        </div>

                                        <div className="flex flex-col gap-4 p-6 rounded-xl hover:bg-black/30 transition-colors">
                                            <div className="w-full h-32 bg-surface-dark border border-border-dark rounded-lg flex items-center justify-center">
                                                <span className="text-primary text-4xl font-bold">Tenderly</span>
                                            </div>
                                            <h4 className="text-white text-lg font-bold">Smart Contract Security</h4>
                                            <p className="text-text-secondary text-sm">Real-time monitoring and simulation.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* CTA */}
                            <div className="px-4 md:px-10 py-20">
                                <div className="backdrop-blur-md bg-black/40 rounded-3xl p-16 text-center border border-primary/20">
                                    <h2 className="text-white text-5xl font-black mb-6">
                                        Ready to leverage your reputation?
                                    </h2>
                                    <p className="text-text-secondary text-xl max-w-2xl mx-auto mb-10">
                                        Join the future of private decentralized finance.
                                    </p>
                                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                                        <AnimatedButton href="/auth" variant="primary" className="min-w-[200px] text-lg h-14">
                                            Launch PrivaCRE App
                                        </AnimatedButton>
                                        <AnimatedButton variant="secondary" className="min-w-[200px] text-lg h-14">
                                            Join Discord
                                        </AnimatedButton>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <footer className="border-t border-border-dark bg-background-dark/50 backdrop-blur-sm px-4 md:px-10 py-12">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2 text-white">
                                            <span className="material-symbols-outlined text-primary">security</span>
                                            <span className="text-lg font-bold">PrivaCRE</span>
                                        </div>
                                        <p className="text-text-secondary text-sm">
                                            © 2024 PrivaCRE Protocol. All rights reserved.
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap gap-8">
                                        <Link href="#" className="text-text-secondary hover:text-white transition-colors text-sm">
                                            Terms of Service
                                        </Link>
                                        <Link href="#" className="text-text-secondary hover:text-white transition-colors text-sm">
                                            Privacy Policy
                                        </Link>
                                        <Link href="#" className="text-text-secondary hover:text-white transition-colors text-sm">
                                            Documentation
                                        </Link>
                                        <Link href="#" className="text-text-secondary hover:text-white transition-colors text-sm">
                                            GitHub
                                        </Link>
                                    </div>
                                </div>
                            </footer>
                        </div>
                    </div>
                </div>
            </PageTransition>
        </div>
    );
}

import type { Metadata } from "next";
import { Outfit, Fira_Code } from "next/font/google";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const firaCode = Fira_Code({ subsets: ["latin"], variable: "--font-fira-code" });

export const metadata: Metadata = {
  title: "AetherSentinel | Tactical Risk Orchestration",
  description: "Autonomous predictive contagion firewall for tokenized institutional RWAs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${firaCode.variable}`}>
      <body className="antialiased min-h-screen">
        <div className="bg-mesh-premium" />
        <div className="bg-grid-institutional" />

        <nav className="fixed top-0 w-full z-50 glass-premium border-b border-white/5 backdrop-blur-3xl px-8 py-5">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00f2ff] via-[#375bd2] to-[#ff2e5d] flex items-center justify-center font-bold shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform duration-500">
                <span className="text-white text-lg">A</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tighter text-white leading-none">AETHER<span className="text-[#00f2ff]">SENTINEL</span></span>
                <span className="text-[9px] font-bold text-[#ff2e5d] tracking-widest uppercase opacity-80">Institutional v2.4</span>
              </div>
            </div>

            <div className="hidden md:flex gap-10 text-[11px] font-bold uppercase tracking-widest text-gray-400">
              {['Network', 'Protocol', 'Vault'].map((item) => (
                <a
                  key={item}
                  href={`/${item.toLowerCase() === 'protocol' ? 'dashboard' : item.toLowerCase()}`}
                  className="hover:text-[#00f2ff] transition-all duration-300 relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#00f2ff] group-hover:w-full transition-all duration-300"></span>
                </a>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <button className="hidden sm:block px-6 py-2.5 rounded-xl glass-premium border-white/10 text-[10px] font-bold uppercase tracking-widest hover:border-[#00f2ff]/50 hover:bg-white/5 transition-all btn-institutional">
                Connect Terminal
              </button>
            </div>
          </div>
        </nav>

        <main className="relative pt-32 px-8 pb-16">
          {children}
        </main>
      </body>
    </html>
  );
}

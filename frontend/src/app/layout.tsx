import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AetherSentinel | Predictive Risk Orchestration",
  description: "Advanced institutional contagion firewall for tokenized RWAs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-mesh min-h-screen`}>
        <nav className="fixed top-0 w-full z-50 glass border-b border-white/10 px-6 py-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00f2ff] to-[#375bd2] flex items-center justify-center font-bold">A</div>
              <span className="text-xl font-bold tracking-tight text-white">Aether<span className="text-[#00f2ff]">Sentinel</span></span>
            </div>
            <div className="flex gap-8 text-sm font-medium text-gray-400">
              <a href="/network" className="hover:text-white transition-colors">Network</a>
              <a href="/dashboard" className="hover:text-white transition-colors">Protocol</a>
              <a href="/compliance" className="hover:text-white transition-colors">Vault</a>
            </div>
            <button className="px-5 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-semibold hover:bg-white/10 transition-all">
              Connect Terminal
            </button>
          </div>
        </nav>
        <main className="pt-24 px-6 pb-12">
          {children}
        </main>
      </body>
    </html>
  );
}

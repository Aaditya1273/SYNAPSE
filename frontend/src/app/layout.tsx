import type { Metadata } from "next";
import { Outfit, Fira_Code } from "next/font/google";
import { AuthGuard } from "@/components/AuthGuard";
import { ThirdwebProvider } from "thirdweb/react";

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
      <body className="antialiased min-h-screen bg-white">
        <ThirdwebProvider>
          <AuthGuard>
            <Navbar />

            <main className="relative pt-32 pb-20">
              {children}
            </main>
          </AuthGuard>
        </ThirdwebProvider>
      </body>
    </html>
  );
}

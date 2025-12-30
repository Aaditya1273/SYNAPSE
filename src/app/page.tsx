"use client";

import { useState } from "react";
import Steps from "@/components/Steps";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import WalletInfoContainer from "@/components/WalletInfoContainer";
import PermissionInfo from "@/components/PermissionInfo";
import ThreatMonitor from "@/components/ThreatMonitor";
import OmniShieldDashboard from "@/components/OmniShieldDashboard";
import SecurityDashboard from "@/components/SecurityDashboard";
import ApprovalManager from "@/components/ApprovalManager";
import Settings from "@/components/Settings";
import Navigation from "@/components/Navigation";
import { useAccount } from "wagmi";

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { isConnected } = useAccount();

  const renderContent = () => {
    if (!isConnected) {
      return (
        <>
          <Hero />
          <WalletInfoContainer />
          <Steps />
        </>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            <OmniShieldDashboard />
            <PermissionInfo />
          </>
        );
      case 'monitor':
        return <ThreatMonitor />;
      case 'approvals':
        return <ApprovalManager />;
      case 'security':
        return <SecurityDashboard />;
      case 'settings':
        return <Settings />;
      default:
        return <OmniShieldDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex flex-col">
      {isConnected && <Navigation activeTab={activeTab} onTabChange={setActiveTab} />}
      
      <main className="container mx-auto px-4 py-8 max-w-6xl flex-1">
        {renderContent()}
      </main>
      
      <Footer />
    </div>
  );
}

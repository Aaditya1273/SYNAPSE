"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { threatDetectionService } from "@/services/threatDetection";
import { ThreatAlert } from "@/types/omniShield";
import { useAccount, usePublicClient } from "wagmi";
import { usePermissions } from "./PermissionProvider";
import { useSessionAccount } from "./SessionAccountProvider";

interface OmniShieldContextType {
  isShieldActive: boolean;
  threats: ThreatAlert[];
  activateShield: () => void;
  deactivateShield: () => void;
  clearThreats: () => void;
  simulateThreat: () => void;
  autoRevokeEnabled: boolean;
  setAutoRevokeEnabled: (enabled: boolean) => void;
}

const OmniShieldContext = createContext<OmniShieldContextType>({
  isShieldActive: false,
  threats: [],
  activateShield: () => {},
  deactivateShield: () => {},
  clearThreats: () => {},
  simulateThreat: () => {},
  autoRevokeEnabled: true,
  setAutoRevokeEnabled: () => {},
});

export const OmniShieldProvider = ({ children }: { children: ReactNode }) => {
  const [isShieldActive, setIsShieldActive] = useState(false);
  const [threats, setThreats] = useState<ThreatAlert[]>([]);
  const [autoRevokeEnabled, setAutoRevokeEnabled] = useState(true);
  
  const { address } = useAccount();
  const { permission } = usePermissions();
  const { sessionAccount } = useSessionAccount();
  const publicClient = usePublicClient();

  // Handle threat detection
  const handleThreatDetected = async (threat: ThreatAlert) => {
    console.log("🚨 THREAT DETECTED:", threat);
    setThreats((prev: ThreatAlert[]) => [threat, ...prev].slice(0, 10)); // Keep last 10 threats

    // Auto-revoke if enabled and we have permissions
    if (autoRevokeEnabled && permission && sessionAccount && publicClient) {
      console.log("🛡️ Auto-revoke would be triggered for threat:", threat.type);
      
      // TODO: Implement actual auto-revoke once smart account integration is complete
      console.log("📝 Mock auto-revoke for contracts:", threat.contracts);
      
      // For now, just log the action that would be taken
      for (const contractAddress of threat.contracts) {
        console.log(`🔒 Would revoke approval for contract: ${contractAddress}`);
      }
      
      console.log("✅ Mock auto-revoke process completed");
    }
  };

  const activateShield = () => {
    if (!address) {
      console.error("No wallet connected");
      return;
    }

    setIsShieldActive(true);
    threatDetectionService.startMonitoring(address, handleThreatDetected);
  };

  const deactivateShield = () => {
    setIsShieldActive(false);
    threatDetectionService.stopMonitoring();
  };

  const clearThreats = () => {
    setThreats([]);
  };

  const simulateThreat = () => {
    threatDetectionService.simulateThreat(handleThreatDetected);
  };

  // Auto-deactivate shield when wallet disconnects
  useEffect(() => {
    if (!address && isShieldActive) {
      deactivateShield();
    }
  }, [address, isShieldActive]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isShieldActive) {
        threatDetectionService.stopMonitoring();
      }
    };
  }, []);

  return (
    <OmniShieldContext.Provider
      value={{
        isShieldActive,
        threats,
        activateShield,
        deactivateShield,
        clearThreats,
        simulateThreat,
        autoRevokeEnabled,
        setAutoRevokeEnabled,
      }}
    >
      {children}
    </OmniShieldContext.Provider>
  );
};

export const useOmniShield = () => {
  return useContext(OmniShieldContext);
};
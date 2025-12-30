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
      console.log("🛡️ Auto-revoking permissions due to threat...");
      
      try {
        // Import the revocation logic
        const { bundlerClient } = await import("@/services/bundlerClient");
        const { pimlicoClient } = await import("@/services/pimlicoClient");
        
        if (!permission.context || !permission.signerMeta?.delegationManager) {
          console.error("Missing permission context or delegation manager");
          return;
        }

        // Get gas prices
        const chainId = 11155111; // Sepolia
        const { fast: fee } = await pimlicoClient(chainId).getUserOperationGasPrice();

        // Execute auto-revoke for each threatened contract
        for (const contractAddress of threat.contracts) {
          try {
            console.log(`🔒 Revoking approval for contract: ${contractAddress}`);
            
            // Validate contract address format
            if (!contractAddress.startsWith('0x') || contractAddress.length !== 42) {
              console.error(`Invalid contract address format: ${contractAddress}`);
              continue;
            }
            
            // Create approval revocation call data (approve with 0 amount)
            const revokeCallData = `0x095ea7b3${contractAddress.slice(2).padStart(64, '0')}${'0'.repeat(64)}` as `0x${string}`;
            
            const hash = await bundlerClient(chainId).sendUserOperationWithDelegation({
              publicClient,
              account: sessionAccount,
              calls: [
                {
                  to: contractAddress as `0x${string}`,
                  data: revokeCallData,
                  value: 0n,
                  permissionsContext: permission.context,
                  delegationManager: permission.signerMeta.delegationManager,
                },
              ],
              ...fee,
            });

            console.log(`✅ Revocation transaction sent: ${hash}`);
          } catch (error) {
            console.error(`❌ Failed to revoke approval for ${contractAddress}:`, error);
          }
        }
        
        console.log("✅ Auto-revoke process completed");
      } catch (error) {
        console.error("❌ Auto-revoke failed:", error);
      }
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
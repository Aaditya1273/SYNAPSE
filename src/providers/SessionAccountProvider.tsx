"use client";

import { createContext, useState, useContext } from "react";
import { usePublicClient } from "wagmi";

// Simplified interface for now to avoid @metamask/smart-accounts-kit issues
interface SessionAccountContext {
  sessionAccount: any | null,
  createSessionAccount: () => Promise<void>,
  isLoading: boolean,
  error: string | null,
}

export const SessionAccountContext = createContext<SessionAccountContext>({
  sessionAccount: null,
  createSessionAccount: async () => { },
  isLoading: false,
  error: null,
});

export const SessionAccountProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [sessionAccount, setSessionAccount] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const publicClient = usePublicClient();

  const createSessionAccount = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!publicClient) {
        throw new Error("Public client not found");
      }

      // Simplified mock implementation for now
      // TODO: Implement proper @metamask/smart-accounts-kit integration once webpack issues are resolved
      console.log("🔧 Creating mock session account for development...");
      
      const mockSessionAccount = {
        address: "0x1234567890123456789012345678901234567890",
        type: "mock",
        isDeployed: false
      };

      setSessionAccount(mockSessionAccount);
      console.log("✅ Mock session account created:", mockSessionAccount);
    } catch (err) {
      console.error("Error creating a session account:", err);
      setError(err instanceof Error ? err.message : "Failed to create a session account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SessionAccountContext.Provider
      value={{
        sessionAccount,
        createSessionAccount,
        isLoading,
        error,
      }}
    >
      {children}
    </SessionAccountContext.Provider>
  );
};

export const useSessionAccount = () => {
  return useContext(SessionAccountContext);
};

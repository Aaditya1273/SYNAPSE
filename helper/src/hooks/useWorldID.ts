import { useState, useCallback } from 'react';

interface RPContext {
  rp_id: string;
  nonce: string;
  created_at: number;
  expires_at: number;
  signature: string;
}

interface WorldIDConfig {
  action: string;
  signal?: string;
  onSuccess?: (result: any) => void;
  onError?: (error: Error) => void;
}

export function useWorldID() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetch RP signature from backend
   */
  const fetchRPSignature = async (action: string): Promise<RPContext> => {
    const response = await fetch('/api/worldid/sign-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch RP signature');
    }

    const { data } = await response.json();
    
    return {
      rp_id: process.env.NEXT_PUBLIC_WORLD_RP_ID!,
      nonce: data.nonce,
      created_at: data.created_at,
      expires_at: data.expires_at,
      signature: data.sig,
    };
  };

  /**
   * Verify World ID proof with backend
   */
  const verifyProof = async (proof: any): Promise<any> => {
    const response = await fetch('/api/worldid/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(proof),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || 'Verification failed');
    }

    return response.json();
  };

  /**
   * Get World ID configuration for IDKit
   */
  const getIDKitConfig = useCallback(async (config: WorldIDConfig) => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch RP signature from backend
      const rpContext = await fetchRPSignature(config.action);

      return {
        app_id: process.env.NEXT_PUBLIC_WORLD_ID_APP_ID as `app_${string}`,
        action: config.action,
        signal: config.signal,
        rp_context: rpContext,
        allow_legacy_proofs: true,
        handleVerify: async (proof: any) => {
          try {
            const result = await verifyProof(proof);
            
            if (result.success) {
              config.onSuccess?.(result);
              return result;
            } else {
              throw new Error(result.error || 'Verification failed');
            }
          } catch (err: any) {
            const error = new Error(err.message || 'Verification failed');
            setError(error);
            config.onError?.(error);
            throw error;
          }
        },
      };
    } catch (err: any) {
      const error = new Error(err.message || 'Failed to initialize World ID');
      setError(error);
      config.onError?.(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    getIDKitConfig,
    isLoading,
    error,
  };
}

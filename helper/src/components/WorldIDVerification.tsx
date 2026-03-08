import { useState, useEffect } from 'react';
import { IDKitWidget, ISuccessResult } from "@worldcoin/idkit";
import { useWorldID } from '@/hooks/useWorldID';

export interface WorldIDVerificationProps {
  action: string;
  signal?: string;
  onSuccess: (result: any) => void;
  className?: string;
}

export default function WorldIDVerification({
  action,
  signal,
  onSuccess,
  className = ''
}: WorldIDVerificationProps) {
  const [mounted, setMounted] = useState(false);
  const { getIDKitConfig } = useWorldID();

  // Avoid hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        disabled
        className={`flex items-center gap-2 px-5 py-2.5 bg-gray-900/20 border border-gray-500/30 text-gray-400 rounded-lg cursor-not-allowed ${className}`}
      >
        <span className="text-sm font-bold">Loading...</span>
      </button>
    );
  }

  const baseAppId = (process.env.NEXT_PUBLIC_WORLD_ID_APP_ID as `app_${string}`) || 'app_staging_7141eab28d3662245856d528b69d89e4';

  // Staging (Simulator) requires 'app_staging_...', Production requires 'app_...'
  const appId = baseAppId.startsWith('app_staging_')
    ? baseAppId
    : baseAppId.replace('app_', 'app_staging_') as `app_${string}`;

  const handleVerify = async (proof: ISuccessResult) => {
    try {
      const config = await getIDKitConfig({ action, signal });
      await config.handleVerify(proof);
    } catch (error) {
      console.error("Verification failed:", error);
      throw error;
    }
  };

  return (
    <IDKitWidget
      app_id={appId}
      action={action}
      signal={signal}
      // @ts-ignore - The types for v1.5.0 are missing environment but it works at runtime
      environment="staging"
      handleVerify={handleVerify}
      onSuccess={onSuccess}
    >
      {({ open }: { open: () => void }) => (
        <button
          onClick={open}
          className={`group flex items-center gap-2 px-5 py-2.5 bg-primary border border-primary text-background-dark rounded-lg hover:bg-primary/90 transition-all shadow-[0_0_15px_rgba(13,242,108,0.3)] hover:shadow-[0_0_20px_rgba(13,242,108,0.5)] ${className}`}
        >
          <div className="w-5 h-5 relative flex items-center justify-center">
            <div className="w-full h-full rounded-full border-2 border-background-dark group-hover:bg-background-dark transition-colors relative flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-background-dark group-hover:bg-primary transition-colors"></div>
            </div>
          </div>
          <span className="font-bold">Verify with World ID</span>
        </button>
      )}
    </IDKitWidget>
  );
}

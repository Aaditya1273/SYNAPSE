"use client";

import { useState, useEffect, useCallback } from 'react';
import { usePlaidLink as useOfficialPlaidLink } from 'react-plaid-link';

interface PlaidLinkOptions {
  onSuccess: (publicToken: string, metadata: any) => void;
  onExit?: (error: any, metadata: any) => void;
}

interface PlaidLinkHook {
  open: () => void;
  ready: boolean;
  error: Error | null;
}

export function usePlaidLink({ onSuccess, onExit }: PlaidLinkOptions): PlaidLinkHook {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // Fetch link token from backend
  useEffect(() => {
    async function fetchLinkToken() {
      try {
        console.log('[Plaid] Fetching link token...');
        const response = await fetch('/api/plaid/create-link-token', {
          method: 'POST',
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create link token');
        }
        
        const data = await response.json();
        console.log('[Plaid] Link token received:', data.link_token?.substring(0, 20) + '...');
        setLinkToken(data.link_token);
      } catch (err) {
        console.error('[Plaid] Error fetching link token:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      }
    }

    fetchLinkToken();
  }, []);

  // Use official Plaid Link hook
  const config = {
    token: linkToken,
    onSuccess: (public_token: string, metadata: any) => {
      console.log('[Plaid] Success! Public token received');
      onSuccess(public_token, metadata);
    },
    onExit: (err: any, metadata: any) => {
      console.log('[Plaid] Exit', err ? 'with error' : 'by user');
      if (onExit) {
        onExit(err, metadata);
      }
    },
  };

  const { open, ready } = useOfficialPlaidLink(config);

  useEffect(() => {
    if (ready) {
      console.log('[Plaid] Link is ready to open');
    }
  }, [ready]);

  const openWithLogging = useCallback(() => {
    console.log('[Plaid] Opening Link... Ready:', ready, 'Token:', !!linkToken);
    if (!ready) {
      console.error('[Plaid] Cannot open - not ready yet');
      setError(new Error('Plaid Link is not ready. Please wait...'));
      return;
    }
    open();
  }, [open, ready, linkToken]);

  return { 
    open: openWithLogging, 
    ready: ready && !!linkToken, 
    error 
  };
}

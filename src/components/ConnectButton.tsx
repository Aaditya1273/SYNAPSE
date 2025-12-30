"use client";

import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { useEffect, useState } from "react";
import Button from "@/components/Button";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function ConnectButton() {
    const { chainId: connectedChainId, isConnected } = useAccount();
    const { switchChain } = useSwitchChain();
    const currentChainId = useChainId();
    const [isConnecting, setIsConnecting] = useState(false);

    const connectWallet = async () => {
        if (!window.ethereum) {
            alert("Please install MetaMask!");
            return;
        }

        try {
            setIsConnecting(true);
            // Request account access
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            
            // Switch to Sepolia if needed
            const sepoliaChainId = '0xaa36a7'; // 11155111 in hex
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: sepoliaChainId }],
                });
            } catch (switchError: any) {
                // This error code indicates that the chain has not been added to MetaMask
                if (switchError.code === 4902) {
                    try {
                        await window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [{
                                chainId: sepoliaChainId,
                                chainName: 'Sepolia Test Network',
                                nativeCurrency: {
                                    name: 'ETH',
                                    symbol: 'ETH',
                                    decimals: 18,
                                },
                                rpcUrls: ['https://sepolia.infura.io/v3/'],
                                blockExplorerUrls: ['https://sepolia.etherscan.io/'],
                            }],
                        });
                    } catch (addError) {
                        console.error('Failed to add Sepolia network:', addError);
                    }
                }
            }
        } catch (error) {
            console.error('Failed to connect wallet:', error);
        } finally {
            setIsConnecting(false);
        }
    };

    if (isConnected && connectedChainId !== currentChainId) {
        return (
            <Button className="w-full space-x-2" onClick={() => switchChain({ chainId: currentChainId })}>
                <span>Switch to Sepolia</span>
            </Button>
        );
    }

    if (isConnected) {
        return (
            <Button className="w-full space-x-2 bg-green-600 hover:bg-green-700">
                <span>✅ Wallet Connected</span>
            </Button>
        );
    }

    return (
        <Button 
            className="w-full space-x-2" 
            onClick={connectWallet}
            disabled={isConnecting}
        >
            <span>{isConnecting ? "Connecting..." : "Connect with MetaMask"}</span>
        </Button>
    );
}
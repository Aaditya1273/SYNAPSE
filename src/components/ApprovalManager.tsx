"use client";

import { useState, useEffect } from "react";
import { useAccount, usePublicClient } from "wagmi";
import { parseAbi, formatUnits } from "viem";
import { Trash2, AlertTriangle, CheckCircle, RefreshCw, ExternalLink, Search } from "lucide-react";
import Button from "./Button";

interface TokenApproval {
  token: {
    address: string;
    name: string;
    symbol: string;
    decimals: number;
  };
  spender: {
    address: string;
    name: string;
  };
  allowance: bigint;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  lastUpdated: number;
}

const ERC20_ABI = parseAbi([
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)'
]);

const KNOWN_SPENDERS = {
  '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D': 'Uniswap V2 Router',
  '0xE592427A0AEce92De3Edee1F18E0157C05861564': 'Uniswap V3 Router',
  '0x1111111254EEB25477B68fb85Ed929f73A960582': '1inch V5 Router',
  '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45': 'Uniswap V3 Router 2',
  '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD': 'Uniswap Universal Router'
};

export default function ApprovalManager() {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  
  const [approvals, setApprovals] = useState<TokenApproval[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRisk, setFilterRisk] = useState<string>("ALL");
  const [revoking, setRevoking] = useState<Set<string>>(new Set());

  // Mock data for demonstration
  useEffect(() => {
    if (isConnected) {
      loadMockApprovals();
    }
  }, [isConnected]);

  const loadMockApprovals = () => {
    const mockApprovals: TokenApproval[] = [
      {
        token: {
          address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          name: 'USD Coin',
          symbol: 'USDC',
          decimals: 6
        },
        spender: {
          address: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
          name: 'Uniswap V2 Router'
        },
        allowance: BigInt('115792089237316195423570985008687907853269984665640564039457584007913129639935'),
        riskLevel: 'MEDIUM',
        lastUpdated: Date.now() - 86400000
      },
      {
        token: {
          address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          name: 'Wrapped Ether',
          symbol: 'WETH',
          decimals: 18
        },
        spender: {
          address: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
          name: 'Uniswap V3 Router'
        },
        allowance: BigInt('5000000000000000000'),
        riskLevel: 'LOW',
        lastUpdated: Date.now() - 172800000
      },
      {
        token: {
          address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
          name: 'Dai Stablecoin',
          symbol: 'DAI',
          decimals: 18
        },
        spender: {
          address: '0x1234567890123456789012345678901234567890',
          name: 'Unknown Contract'
        },
        allowance: BigInt('115792089237316195423570985008687907853269984665640564039457584007913129639935'),
        riskLevel: 'CRITICAL',
        lastUpdated: Date.now() - 3600000
      }
    ];
    
    setApprovals(mockApprovals);
  };

  const scanForApprovals = async () => {
    if (!address || !publicClient) return;
    
    setLoading(true);
    try {
      // In a real implementation, this would:
      // 1. Query events for Approval transactions from the user
      // 2. Check current allowances for each token-spender pair
      // 3. Fetch token metadata
      // 4. Assess risk levels based on spender reputation
      
      console.log("Scanning for approvals...");
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      // For now, just refresh the mock data
      loadMockApprovals();
    } catch (error) {
      console.error("Error scanning approvals:", error);
    } finally {
      setLoading(false);
    }
  };

  const revokeApproval = async (tokenAddress: string, spenderAddress: string) => {
    const key = `${tokenAddress}-${spenderAddress}`;
    setRevoking(prev => new Set(prev).add(key));
    
    try {
      // In a real implementation, this would call the contract
      console.log(`Revoking approval for ${tokenAddress} to ${spenderAddress}`);
      
      // Simulate transaction
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Remove from approvals list
      setApprovals(prev => prev.filter(
        approval => !(approval.token.address === tokenAddress && approval.spender.address === spenderAddress)
      ));
      
      console.log("Approval revoked successfully");
    } catch (error) {
      console.error("Error revoking approval:", error);
    } finally {
      setRevoking(prev => {
        const newSet = new Set(prev);
        newSet.delete(key);
        return newSet;
      });
    }
  };

  const revokeAllHighRisk = async () => {
    const highRiskApprovals = approvals.filter(
      approval => approval.riskLevel === 'HIGH' || approval.riskLevel === 'CRITICAL'
    );
    
    for (const approval of highRiskApprovals) {
      await revokeApproval(approval.token.address, approval.spender.address);
    }
  };

  const formatAllowance = (allowance: bigint, decimals: number) => {
    const maxUint256 = BigInt('115792089237316195423570985008687907853269984665640564039457584007913129639935');
    
    if (allowance >= maxUint256 / BigInt(2)) {
      return "∞ (Unlimited)";
    }
    
    const formatted = formatUnits(allowance, decimals);
    const num = parseFloat(formatted);
    
    if (num > 1000000) {
      return `${(num / 1000000).toFixed(2)}M`;
    } else if (num > 1000) {
      return `${(num / 1000).toFixed(2)}K`;
    } else {
      return num.toFixed(4);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'CRITICAL': return 'text-red-600 bg-red-50 border-red-200';
      case 'HIGH': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'LOW': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const filteredApprovals = approvals.filter(approval => {
    const matchesSearch = searchTerm === "" || 
      approval.token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      approval.token.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      approval.spender.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRisk = filterRisk === "ALL" || approval.riskLevel === filterRisk;
    
    return matchesSearch && matchesRisk;
  });

  if (!isConnected) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-8 text-center">
          <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
            Connect Wallet to Manage Approvals
          </h2>
          <p className="text-gray-500">
            Connect your wallet to view and revoke token approvals.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Approval Manager
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor and revoke token approvals to protect your assets
          </p>
        </div>
        
        <div className="flex space-x-3">
          <Button
            onClick={scanForApprovals}
            disabled={loading}
            variant="outline"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? "Scanning..." : "Scan Approvals"}
          </Button>
          
          <Button
            onClick={revokeAllHighRisk}
            className="bg-red-600 hover:bg-red-700"
            disabled={approvals.filter(a => a.riskLevel === 'HIGH' || a.riskLevel === 'CRITICAL').length === 0}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Revoke High Risk
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tokens or spenders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex space-x-2">
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ALL">All Risk Levels</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Approvals List */}
      <div className="space-y-4">
        {filteredApprovals.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center border border-gray-200 dark:border-gray-700">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Approvals Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm || filterRisk !== "ALL" 
                ? "No approvals match your current filters."
                : "Your wallet has no active token approvals."}
            </p>
          </div>
        ) : (
          filteredApprovals.map((approval, index) => {
            const key = `${approval.token.address}-${approval.spender.address}`;
            const isRevoking = revoking.has(key);
            
            return (
              <div
                key={index}
                className={`bg-white dark:bg-gray-800 rounded-lg p-6 border-2 ${getRiskColor(approval.riskLevel)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-4 h-4 rounded-full ${
                      approval.riskLevel === 'CRITICAL' ? 'bg-red-500' :
                      approval.riskLevel === 'HIGH' ? 'bg-orange-500' :
                      approval.riskLevel === 'MEDIUM' ? 'bg-yellow-500' : 'bg-green-500'
                    }`} />
                    
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {approval.token.symbol}
                        </h3>
                        <span className="text-sm text-gray-500">→</span>
                        <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
                          {approval.spender.name}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4 mt-1">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium">Token:</span> {approval.token.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium">Allowance:</span> {formatAllowance(approval.allowance, approval.token.decimals)} {approval.token.symbol}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium">Risk:</span> 
                          <span className={`ml-1 font-semibold ${
                            approval.riskLevel === 'CRITICAL' ? 'text-red-600' :
                            approval.riskLevel === 'HIGH' ? 'text-orange-600' :
                            approval.riskLevel === 'MEDIUM' ? 'text-yellow-600' : 'text-green-600'
                          }`}>
                            {approval.riskLevel}
                          </span>
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>Last updated: {new Date(approval.lastUpdated).toLocaleDateString()}</span>
                        <span>Spender: {approval.spender.address.slice(0, 10)}...{approval.spender.address.slice(-8)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      className="text-sm"
                      onClick={() => window.open(`https://etherscan.io/address/${approval.spender.address}`, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      onClick={() => revokeApproval(approval.token.address, approval.spender.address)}
                      disabled={isRevoking}
                      className="bg-red-600 hover:bg-red-700 text-sm"
                    >
                      {isRevoking ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Revoking...
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Revoke
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Summary Stats */}
      {approvals.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
            Approval Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {approvals.length}
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300">Total Approvals</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {approvals.filter(a => a.riskLevel === 'CRITICAL').length}
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300">Critical Risk</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {approvals.filter(a => a.riskLevel === 'HIGH').length}
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300">High Risk</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {approvals.filter(a => a.allowance < BigInt('115792089237316195423570985008687907853269984665640564039457584007913129639935') / BigInt(2)).length}
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300">Limited Amount</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
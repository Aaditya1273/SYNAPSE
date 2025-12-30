"use client";

import { useState, useEffect } from "react";
import { useAccount, useBalance } from "wagmi";
import { useOmniShield } from "@/providers/OmniShieldProvider";
import { Shield, AlertTriangle, CheckCircle, TrendingUp, Activity, Lock, Unlock, Eye, EyeOff } from "lucide-react";
import Button from "./Button";

interface SecurityScore {
  overall: number;
  factors: {
    activeApprovals: number;
    riskLevel: number;
    shieldStatus: number;
    recentActivity: number;
  };
}

interface ApprovalRisk {
  token: string;
  spender: string;
  amount: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  lastActivity: number;
}

export default function SecurityDashboard() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
  const { isShieldActive, threats, autoRevokeEnabled } = useOmniShield();
  
  const [securityScore, setSecurityScore] = useState<SecurityScore>({
    overall: 85,
    factors: {
      activeApprovals: 70,
      riskLevel: 90,
      shieldStatus: 100,
      recentActivity: 80
    }
  });

  const [approvalRisks, setApprovalRisks] = useState<ApprovalRisk[]>([
    {
      token: "USDC",
      spender: "Uniswap V3",
      amount: "∞",
      riskLevel: 'MEDIUM',
      lastActivity: Date.now() - 86400000
    },
    {
      token: "WETH",
      spender: "1inch",
      amount: "5.0",
      riskLevel: 'LOW',
      lastActivity: Date.now() - 172800000
    },
    {
      token: "DAI",
      spender: "Unknown Contract",
      amount: "∞",
      riskLevel: 'CRITICAL',
      lastActivity: Date.now() - 3600000
    }
  ]);

  const [showDetails, setShowDetails] = useState(false);

  // Calculate security score based on current state
  useEffect(() => {
    const calculateScore = () => {
      let shieldStatus = isShieldActive ? 100 : 0;
      let riskLevel = 100 - (threats.length * 10);
      let activeApprovals = Math.max(0, 100 - (approvalRisks.length * 15));
      let recentActivity = autoRevokeEnabled ? 100 : 50;

      const overall = Math.round(
        (shieldStatus * 0.3 + riskLevel * 0.3 + activeApprovals * 0.25 + recentActivity * 0.15)
      );

      setSecurityScore({
        overall,
        factors: {
          activeApprovals,
          riskLevel,
          shieldStatus,
          recentActivity
        }
      });
    };

    calculateScore();
  }, [isShieldActive, threats.length, approvalRisks.length, autoRevokeEnabled]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    if (score >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return "bg-green-100 border-green-200";
    if (score >= 60) return "bg-yellow-100 border-yellow-200";
    if (score >= 40) return "bg-orange-100 border-orange-200";
    return "bg-red-100 border-red-200";
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

  if (!isConnected) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-8 text-center">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
            Connect Wallet to View Security Dashboard
          </h2>
          <p className="text-gray-500">
            Connect your wallet to monitor your security status and manage approvals.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Security Score Header */}
      <div className={`rounded-lg p-6 border-2 ${getScoreBackground(securityScore.overall)}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Shield className={`w-12 h-12 ${getScoreColor(securityScore.overall)}`} />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center border-2 border-current">
                <span className="text-xs font-bold">{securityScore.overall}</span>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Security Score: {securityScore.overall}/100
              </h1>
              <p className={`text-lg font-medium ${getScoreColor(securityScore.overall)}`}>
                {securityScore.overall >= 80 ? "Excellent Security" :
                 securityScore.overall >= 60 ? "Good Security" :
                 securityScore.overall >= 40 ? "Moderate Risk" : "High Risk"}
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-gray-600 dark:text-gray-400">Wallet Balance</p>
            <p className="text-xl font-bold">
              {balance ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}` : "0.0000 ETH"}
            </p>
          </div>
        </div>
      </div>

      {/* Security Factors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <Shield className="w-5 h-5 text-blue-500" />
            <span className={`text-sm font-medium ${getScoreColor(securityScore.factors.shieldStatus)}`}>
              {securityScore.factors.shieldStatus}/100
            </span>
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white">Shield Status</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {isShieldActive ? "Active Protection" : "Inactive"}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <span className={`text-sm font-medium ${getScoreColor(securityScore.factors.riskLevel)}`}>
              {securityScore.factors.riskLevel}/100
            </span>
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white">Risk Level</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {threats.length} active threats
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <Unlock className="w-5 h-5 text-yellow-500" />
            <span className={`text-sm font-medium ${getScoreColor(securityScore.factors.activeApprovals)}`}>
              {securityScore.factors.activeApprovals}/100
            </span>
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white">Approvals</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {approvalRisks.length} active approvals
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-5 h-5 text-green-500" />
            <span className={`text-sm font-medium ${getScoreColor(securityScore.factors.recentActivity)}`}>
              {securityScore.factors.recentActivity}/100
            </span>
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white">Auto-Response</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {autoRevokeEnabled ? "Enabled" : "Disabled"}
          </p>
        </div>
      </div>

      {/* Active Approvals */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
            <Unlock className="w-5 h-5" />
            <span>Active Token Approvals</span>
          </h2>
          <div className="flex space-x-2">
            <Button
              onClick={() => setShowDetails(!showDetails)}
              variant="outline"
              className="text-sm"
            >
              {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showDetails ? "Hide Details" : "Show Details"}
            </Button>
            <Button className="text-sm bg-red-600 hover:bg-red-700">
              Revoke All High Risk
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {approvalRisks.map((approval, index) => (
            <div key={index} className={`p-4 rounded-lg border ${getRiskColor(approval.riskLevel)}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    approval.riskLevel === 'CRITICAL' ? 'bg-red-500' :
                    approval.riskLevel === 'HIGH' ? 'bg-orange-500' :
                    approval.riskLevel === 'MEDIUM' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <div>
                    <p className="font-medium">
                      {approval.token} → {approval.spender}
                    </p>
                    <p className="text-sm opacity-75">
                      Amount: {approval.amount} • Last activity: {new Date(approval.lastActivity).toLocaleDateString()}
                    </p>
                    {showDetails && (
                      <div className="mt-2 text-xs space-y-1">
                        <p>Risk Level: <span className="font-medium">{approval.riskLevel}</span></p>
                        <p>Contract: 0x1234...5678</p>
                        <p>Transaction: 0xabcd...efgh</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" className="text-xs px-3 py-1">
                    View
                  </Button>
                  <Button className="text-xs px-3 py-1 bg-red-600 hover:bg-red-700">
                    Revoke
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {approvalRisks.length === 0 && (
          <div className="text-center py-8">
            <Lock className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No active approvals detected</p>
            <p className="text-sm text-gray-500">Your wallet is secure from approval-based attacks</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
          Quick Security Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <CheckCircle className="w-4 h-4 mr-2" />
            Run Security Scan
          </Button>
          <Button variant="outline" className="border-blue-300 text-blue-700">
            <TrendingUp className="w-4 h-4 mr-2" />
            View Analytics
          </Button>
          <Button variant="outline" className="border-blue-300 text-blue-700">
            <Shield className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>
    </div>
  );
}
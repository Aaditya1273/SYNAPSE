"use client";

import { useState, useEffect } from "react";
import { useOmniShield } from "@/providers/OmniShieldProvider";
import { useAccount } from "wagmi";
import { Shield, Activity, AlertTriangle, CheckCircle, Clock, TrendingUp } from "lucide-react";

interface SecurityMetrics {
  threatsDetected: number;
  actionsExecuted: number;
  uptime: number;
  lastThreatTime?: number;
}

export default function OmniShieldDashboard() {
  const { isShieldActive, threats, autoRevokeEnabled } = useOmniShield();
  const { address, isConnected } = useAccount();
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    threatsDetected: 0,
    actionsExecuted: 0,
    uptime: 0,
  });

  // Update metrics when threats change
  useEffect(() => {
    setMetrics(prev => ({
      ...prev,
      threatsDetected: threats.length,
      lastThreatTime: threats.length > 0 ? threats[0].timestamp : undefined,
    }));
  }, [threats]);

  // Update uptime
  useEffect(() => {
    if (!isShieldActive) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        uptime: Math.floor((Date.now() - startTime) / 1000),
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [isShieldActive]);

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = () => {
    if (!isConnected) return "text-gray-500";
    if (!isShieldActive) return "text-yellow-500";
    return threats.length > 0 ? "text-red-500" : "text-green-500";
  };

  const getStatusText = () => {
    if (!isConnected) return "Wallet Disconnected";
    if (!isShieldActive) return "Shield Inactive";
    return threats.length > 0 ? "Threats Detected" : "Protected";
  };

  const criticalThreats = threats.filter(t => t.severity === 'CRITICAL').length;
  const highThreats = threats.filter(t => t.severity === 'HIGH').length;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Shield className={`w-8 h-8 ${getStatusColor()}`} />
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Omni-Shield Dashboard
            </h1>
            <p className={`text-lg ${getStatusColor()}`}>
              {getStatusText()}
            </p>
          </div>
        </div>
        
        {address && (
          <div className="text-right">
            <p className="text-sm text-gray-600 dark:text-gray-400">Protected Wallet</p>
            <p className="font-mono text-sm">
              {address.slice(0, 6)}...{address.slice(-4)}
            </p>
          </div>
        )}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Shield Status */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Shield Status</p>
              <p className={`text-2xl font-bold ${getStatusColor()}`}>
                {isShieldActive ? "ACTIVE" : "INACTIVE"}
              </p>
            </div>
            {isShieldActive ? (
              <CheckCircle className="w-8 h-8 text-green-500" />
            ) : (
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
            )}
          </div>
        </div>

        {/* Threats Detected */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Threats Detected</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {metrics.threatsDetected}
              </p>
              <p className="text-xs text-gray-500">
                {criticalThreats} critical, {highThreats} high
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>

        {/* Auto-Revoke Status */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Auto-Revoke</p>
              <p className={`text-2xl font-bold ${autoRevokeEnabled ? 'text-green-600' : 'text-gray-500'}`}>
                {autoRevokeEnabled ? "ENABLED" : "DISABLED"}
              </p>
            </div>
            <Activity className={`w-8 h-8 ${autoRevokeEnabled ? 'text-green-500' : 'text-gray-400'}`} />
          </div>
        </div>

        {/* Uptime */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Uptime</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatUptime(metrics.uptime)}
              </p>
            </div>
            <Clock className="w-8 h-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Activity</h2>
          <TrendingUp className="w-5 h-5 text-gray-500" />
        </div>
        
        {threats.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No threats detected</p>
            <p className="text-sm text-gray-500">Your wallet is secure</p>
          </div>
        ) : (
          <div className="space-y-3">
            {threats.slice(0, 5).map((threat, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className={`w-4 h-4 ${
                    threat.severity === 'CRITICAL' ? 'text-red-500' : 
                    threat.severity === 'HIGH' ? 'text-orange-500' : 
                    threat.severity === 'MEDIUM' ? 'text-yellow-500' : 'text-blue-500'
                  }`} />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {threat.message}
                    </p>
                    <p className="text-sm text-gray-500">
                      {threat.contracts.length} contract(s) affected
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {threat.severity}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(threat.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Protection Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
        <div className="flex items-center space-x-3 mb-4">
          <Shield className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
            Protection Summary
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-blue-700 dark:text-blue-300">Real-time Monitoring</p>
            <p className="font-semibold text-blue-900 dark:text-blue-100">
              {isShieldActive ? "✅ Active" : "❌ Inactive"}
            </p>
          </div>
          <div>
            <p className="text-sm text-blue-700 dark:text-blue-300">Automatic Response</p>
            <p className="font-semibold text-blue-900 dark:text-blue-100">
              {autoRevokeEnabled ? "✅ Enabled" : "❌ Disabled"}
            </p>
          </div>
          <div>
            <p className="text-sm text-blue-700 dark:text-blue-300">Gasless Protection</p>
            <p className="font-semibold text-blue-900 dark:text-blue-100">
              ✅ Pimlico Sponsored
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
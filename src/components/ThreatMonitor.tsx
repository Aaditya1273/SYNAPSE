"use client";

import { useState } from "react";
import { useOmniShield } from "@/providers/OmniShieldProvider";
import { Shield, ShieldAlert, ShieldCheck, AlertTriangle, Clock, ExternalLink } from "lucide-react";
import Button from "./Button";

export default function ThreatMonitor() {
  const { 
    isShieldActive, 
    threats, 
    activateShield, 
    deactivateShield, 
    clearThreats, 
    simulateThreat,
    autoRevokeEnabled,
    setAutoRevokeEnabled 
  } = useOmniShield();

  const [showAllThreats, setShowAllThreats] = useState(false);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'text-red-600 bg-red-50 border-red-200';
      case 'HIGH': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'LOW': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return <ShieldAlert className="w-4 h-4" />;
      case 'HIGH': return <AlertTriangle className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const displayedThreats = showAllThreats ? threats : threats.slice(0, 3);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Shield Status Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {isShieldActive ? (
              <ShieldCheck className="w-8 h-8 text-green-500" />
            ) : (
              <Shield className="w-8 h-8 text-gray-400" />
            )}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Omni-Shield Status
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {isShieldActive ? "🛡️ Active Protection" : "⚠️ Shield Inactive"}
              </p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Button
              onClick={simulateThreat}
              variant="outline"
              className="text-sm"
              disabled={!isShieldActive}
            >
              Simulate Threat
            </Button>
            
            {isShieldActive ? (
              <Button
                onClick={deactivateShield}
                variant="outline"
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                Deactivate Shield
              </Button>
            ) : (
              <Button
                onClick={activateShield}
                className="bg-green-600 hover:bg-green-700"
              >
                Activate Shield
              </Button>
            )}
          </div>
        </div>

        {/* Auto-Revoke Toggle */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Automatic Threat Response
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Automatically revoke approvals when threats are detected
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={autoRevokeEnabled}
              onChange={(e) => setAutoRevokeEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      {/* Threat Alerts */}
      {threats.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <span>Threat Alerts ({threats.length})</span>
            </h3>
            
            <div className="flex space-x-2">
              {threats.length > 3 && (
                <Button
                  onClick={() => setShowAllThreats(!showAllThreats)}
                  variant="outline"
                  className="text-sm"
                >
                  {showAllThreats ? "Show Less" : "Show All"}
                </Button>
              )}
              <Button
                onClick={clearThreats}
                variant="outline"
                className="text-sm text-gray-600"
              >
                Clear All
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {displayedThreats.map((threat, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${getSeverityColor(threat.severity)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {getSeverityIcon(threat.severity)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold text-sm uppercase">
                          {threat.severity}
                        </span>
                        <span className="text-xs text-gray-500">
                          {threat.type.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-sm font-medium mb-2">
                        {threat.message}
                      </p>
                      
                      {threat.contracts.length > 0 && (
                        <div className="mb-2">
                          <p className="text-xs text-gray-600 mb-1">
                            Affected Contracts:
                          </p>
                          {threat.contracts.map((contract, idx) => (
                            <div key={idx} className="flex items-center space-x-1 text-xs">
                              <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">
                                {contract.slice(0, 10)}...{contract.slice(-8)}
                              </code>
                              <ExternalLink className="w-3 h-3 text-gray-400" />
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatTimestamp(threat.timestamp)}</span>
                        </div>
                        <span>Block #{threat.blockNumber}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Shield Inactive Message */}
      {!isShieldActive && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <Shield className="w-6 h-6 text-yellow-600" />
            <div>
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">
                Shield Protection Disabled
              </h3>
              <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-1">
                Your wallet is not being monitored for threats. Activate Omni-Shield to enable real-time protection.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* No Threats Message */}
      {isShieldActive && threats.length === 0 && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <ShieldCheck className="w-6 h-6 text-green-600" />
            <div>
              <h3 className="font-semibold text-green-800 dark:text-green-200">
                All Clear
              </h3>
              <p className="text-green-700 dark:text-green-300 text-sm mt-1">
                No threats detected. Your wallet is being actively monitored and protected.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
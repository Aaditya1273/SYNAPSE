"use client";

import { useState } from "react";
import { useOmniShield } from "@/providers/OmniShieldProvider";
import { Settings as SettingsIcon, Shield, Bell, Download, Upload, Trash2, Save } from "lucide-react";
import Button from "./Button";

interface SettingsConfig {
  autoRevokeEnabled: boolean;
  threatThreshold: number;
  monitoringInterval: number;
  notificationsEnabled: boolean;
  emergencyVaultAddress: string;
  maxDailyTransferLimit: string;
  blacklistedContracts: string[];
}

export default function Settings() {
  const { autoRevokeEnabled, setAutoRevokeEnabled } = useOmniShield();
  
  const [config, setConfig] = useState<SettingsConfig>({
    autoRevokeEnabled,
    threatThreshold: 70,
    monitoringInterval: 15,
    notificationsEnabled: true,
    emergencyVaultAddress: "",
    maxDailyTransferLimit: "1.0",
    blacklistedContracts: [
      "0x1234567890123456789012345678901234567890",
      "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd"
    ]
  });

  const [newBlacklistAddress, setNewBlacklistAddress] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Update auto-revoke setting
      setAutoRevokeEnabled(config.autoRevokeEnabled);
      
      // Save other settings to localStorage or backend
      localStorage.setItem('omni-shield-config', JSON.stringify(config));
      
      console.log("Settings saved successfully");
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleExportConfig = () => {
    const exportData = {
      ...config,
      exportDate: new Date().toISOString(),
      version: "1.0"
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `omni-shield-config-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedConfig = JSON.parse(e.target?.result as string);
        setConfig(prev => ({ ...prev, ...importedConfig }));
        console.log("Configuration imported successfully");
      } catch (error) {
        console.error("Error importing configuration:", error);
        alert("Invalid configuration file");
      }
    };
    reader.readAsText(file);
  };

  const addBlacklistAddress = () => {
    if (newBlacklistAddress && !config.blacklistedContracts.includes(newBlacklistAddress)) {
      setConfig(prev => ({
        ...prev,
        blacklistedContracts: [...prev.blacklistedContracts, newBlacklistAddress]
      }));
      setNewBlacklistAddress("");
    }
  };

  const removeBlacklistAddress = (address: string) => {
    setConfig(prev => ({
      ...prev,
      blacklistedContracts: prev.blacklistedContracts.filter(addr => addr !== address)
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <SettingsIcon className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Omni-Shield Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Configure your security preferences and protection settings
            </p>
          </div>
        </div>
        
        <Button onClick={handleSave} disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </div>

      {/* Security Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Shield className="w-5 h-5 mr-2 text-blue-600" />
          Security Settings
        </h2>
        
        <div className="space-y-6">
          {/* Auto-Revoke Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                Automatic Threat Response
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Automatically revoke approvals when threats are detected
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.autoRevokeEnabled}
                onChange={(e) => setConfig(prev => ({ ...prev, autoRevokeEnabled: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Threat Threshold */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Threat Detection Threshold: {config.threatThreshold}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={config.threatThreshold}
              onChange={(e) => setConfig(prev => ({ ...prev, threatThreshold: parseInt(e.target.value) }))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Low Sensitivity</span>
              <span>High Sensitivity</span>
            </div>
          </div>

          {/* Monitoring Interval */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Monitoring Interval (seconds)
            </label>
            <select
              value={config.monitoringInterval}
              onChange={(e) => setConfig(prev => ({ ...prev, monitoringInterval: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600"
            >
              <option value={5}>5 seconds (High frequency)</option>
              <option value={15}>15 seconds (Recommended)</option>
              <option value={30}>30 seconds (Balanced)</option>
              <option value={60}>60 seconds (Low frequency)</option>
            </select>
          </div>

          {/* Emergency Vault Address */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Emergency Vault Address
            </label>
            <input
              type="text"
              value={config.emergencyVaultAddress}
              onChange={(e) => setConfig(prev => ({ ...prev, emergencyVaultAddress: e.target.value }))}
              placeholder="0x..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600"
            />
            <p className="text-xs text-gray-500 mt-1">
              Address where funds will be moved during emergency situations
            </p>
          </div>

          {/* Max Daily Transfer Limit */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Maximum Daily Transfer Limit (ETH)
            </label>
            <input
              type="number"
              step="0.1"
              value={config.maxDailyTransferLimit}
              onChange={(e) => setConfig(prev => ({ ...prev, maxDailyTransferLimit: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Bell className="w-5 h-5 mr-2 text-blue-600" />
          Notification Settings
        </h2>
        
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">
              Browser Notifications
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Receive notifications when threats are detected
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.notificationsEnabled}
              onChange={(e) => setConfig(prev => ({ ...prev, notificationsEnabled: e.target.checked }))}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      {/* Blacklisted Contracts */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Blacklisted Contracts
        </h2>
        
        <div className="space-y-4">
          {/* Add new address */}
          <div className="flex space-x-2">
            <input
              type="text"
              value={newBlacklistAddress}
              onChange={(e) => setNewBlacklistAddress(e.target.value)}
              placeholder="Enter contract address to blacklist..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600"
            />
            <Button onClick={addBlacklistAddress} disabled={!newBlacklistAddress}>
              Add
            </Button>
          </div>

          {/* Blacklisted addresses list */}
          <div className="space-y-2">
            {config.blacklistedContracts.map((address, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <code className="text-sm font-mono">{address}</code>
                <Button
                  onClick={() => removeBlacklistAddress(address)}
                  variant="outline"
                  className="text-red-600 border-red-300 hover:bg-red-50 text-sm px-3 py-1"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          {config.blacklistedContracts.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              No blacklisted contracts. Add addresses above to block them.
            </p>
          )}
        </div>
      </div>

      {/* Import/Export */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Configuration Management
        </h2>
        
        <div className="flex space-x-4">
          <Button onClick={handleExportConfig} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Config
          </Button>
          
          <label className="cursor-pointer">
            <Button variant="outline" className="pointer-events-none">
              <Upload className="w-4 h-4 mr-2" />
              Import Config
            </Button>
            <input
              type="file"
              accept=".json"
              onChange={handleImportConfig}
              className="hidden"
            />
          </label>
        </div>
        
        <p className="text-sm text-gray-500 mt-2">
          Export your settings to backup or share with other devices. Import to restore previous configurations.
        </p>
      </div>
    </div>
  );
}
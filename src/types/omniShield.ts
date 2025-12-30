/**
 * Omni-Shield Type Definitions
 */

export interface ThreatAlert {
  type: 'SUSPICIOUS_APPROVALS' | 'DRAIN_PATTERN' | 'MALICIOUS_CONTRACT' | 'HIGH_VALUE_TRANSFER';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  message: string;
  contracts: string[];
  timestamp: number;
  blockNumber: number;
  txHash?: string;
  gasUsed?: bigint;
  value?: bigint;
}

export interface ProtectionAction {
  type: 'REVOKE_APPROVAL' | 'MOVE_FUNDS' | 'PAUSE_ACCOUNT' | 'NOTIFY_USER';
  target: string;
  reason: string;
  timestamp: number;
  txHash?: string;
  success: boolean;
}

export interface SecurityMetrics {
  threatsDetected: number;
  actionsExecuted: number;
  fundsProtected: bigint;
  uptime: number;
  lastThreatTime?: number;
}

export interface ApprovalInfo {
  token: string;
  spender: string;
  amount: bigint;
  timestamp: number;
  blockNumber: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface ContractRisk {
  address: string;
  riskScore: number;
  reasons: string[];
  isBlacklisted: boolean;
  lastActivity: number;
}

export interface OmniShieldConfig {
  autoRevokeEnabled: boolean;
  emergencyVaultAddress?: string;
  maxDailyTransferLimit: bigint;
  threatThreshold: number;
  monitoringInterval: number;
}

export interface HyperSyncEvent {
  address: string;
  topics: string[];
  data: string;
  blockNumber: number;
  transactionHash: string;
  logIndex: number;
  timestamp: number;
}

export interface ThreatPattern {
  name: string;
  description: string;
  severity: ThreatAlert['severity'];
  conditions: {
    eventType: string;
    threshold?: number;
    timeWindow?: number;
    contractPatterns?: string[];
  };
}
import { ThreatAlert } from "@/types/omniShield";

/**
 * Threat Detection Service using Envio HyperSync
 * Monitors blockchain for suspicious activities and exploit patterns
 */
export class ThreatDetectionService {
  private client: any = null;
  private isMonitoring = false;
  private monitoringInterval: ReturnType<typeof setInterval> | null = null;

  constructor() {
    // Initialize client only in browser environment
    if (typeof window !== 'undefined') {
      this.initializeClient();
    }
  }

  private async initializeClient() {
    try {
      // Dynamic import to avoid SSR issues
      const { HypersyncClient } = await import("@envio-dev/hypersync-client");
      
      const config = {
        url: "https://sepolia.hypersync.xyz",
        // Add API token when available
        bearerToken: process.env.NEXT_PUBLIC_ENVIO_API_KEY
      };
      
      this.client = HypersyncClient.new(config);
      console.log("🔗 HyperSync client initialized");
    } catch (error) {
      console.warn("⚠️ HyperSync client failed to initialize, using mock mode:", error);
      this.client = null;
    }
  }

  /**
   * Start monitoring for threats in real-time
   * @param userAddress - The user's wallet address to monitor
   * @param onThreatDetected - Callback when threat is detected
   */
  async startMonitoring(
    userAddress: string, 
    onThreatDetected: (threat: ThreatAlert) => void
  ): Promise<void> {
    if (this.isMonitoring) {
      console.log("Already monitoring for threats");
      return;
    }

    this.isMonitoring = true;
    console.log(`🛡️ Omni-Shield: Starting threat monitoring for ${userAddress}`);

    // Ensure client is initialized
    if (!this.client && typeof window !== 'undefined') {
      await this.initializeClient();
    }

    // Monitor every 15 seconds for real-time detection
    this.monitoringInterval = setInterval(async () => {
      try {
        await this.checkForThreats(userAddress, onThreatDetected);
      } catch (error) {
        console.error("Error during threat monitoring:", error);
      }
    }, 15000);
  }

  /**
   * Stop threat monitoring
   */
  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    this.isMonitoring = false;
    console.log("🛡️ Omni-Shield: Threat monitoring stopped");
  }

  /**
   * Check for threats using HyperSync or fallback to mock data
   */
  private async checkForThreats(
    userAddress: string, 
    onThreatDetected: (threat: ThreatAlert) => void
  ): Promise<void> {
    try {
      if (this.client) {
        // Real HyperSync implementation
        await this.realThreatDetection(userAddress, onThreatDetected);
      } else {
        // Mock implementation for testing
        await this.mockThreatDetection(userAddress, onThreatDetected);
      }
    } catch (error) {
      console.error("Error checking for threats:", error);
      // Fallback to mock on error
      await this.mockThreatDetection(userAddress, onThreatDetected);
    }
  }

  /**
   * Real threat detection using HyperSync
   */
  private async realThreatDetection(
    userAddress: string,
    onThreatDetected: (threat: ThreatAlert) => void
  ): Promise<void> {
    try {
      // Get current block height
      const currentHeight = await this.getCurrentBlockHeight();
      const fromBlock = Math.max(0, currentHeight - 100); // Check last 100 blocks

      console.log(`🔍 Scanning blocks ${fromBlock} to ${currentHeight} for threats...`);

      // Query for suspicious approval events
      const suspiciousApprovals = await this.detectSuspiciousApprovals(fromBlock, currentHeight);
      
      // Query for drain patterns specific to user
      const drainPatterns = await this.detectDrainPatterns(fromBlock, currentHeight, userAddress);

      // Process threats
      if (suspiciousApprovals.length > 0) {
        onThreatDetected({
          type: 'SUSPICIOUS_APPROVALS',
          severity: 'HIGH',
          message: `Detected ${suspiciousApprovals.length} suspicious approval events in recent blocks`,
          contracts: suspiciousApprovals,
          timestamp: Date.now(),
          blockNumber: currentHeight
        });
      }

      if (drainPatterns.length > 0) {
        onThreatDetected({
          type: 'DRAIN_PATTERN',
          severity: 'CRITICAL',
          message: `Detected potential drain pattern affecting your wallet`,
          contracts: drainPatterns,
          timestamp: Date.now(),
          blockNumber: currentHeight
        });
      }

      // Check for high-value transfers from user
      const highValueTransfers = await this.detectHighValueTransfers(fromBlock, currentHeight, userAddress);
      if (highValueTransfers.length > 0) {
        onThreatDetected({
          type: 'HIGH_VALUE_TRANSFER',
          severity: 'MEDIUM',
          message: `Detected ${highValueTransfers.length} high-value transfers from your wallet`,
          contracts: highValueTransfers,
          timestamp: Date.now(),
          blockNumber: currentHeight
        });
      }

    } catch (error) {
      console.error("Error in real threat detection:", error);
      throw error;
    }
  }

  /**
   * Mock threat detection for testing and fallback
   */
  private async mockThreatDetection(
    userAddress: string,
    onThreatDetected: (threat: ThreatAlert) => void
  ): Promise<void> {
    // Simulate random threat detection for demo
    const shouldDetectThreat = Math.random() < 0.1; // 10% chance every 15 seconds
    
    if (shouldDetectThreat) {
      const threatTypes = ['SUSPICIOUS_APPROVALS', 'DRAIN_PATTERN', 'HIGH_VALUE_TRANSFER'] as const;
      const severities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const;
      
      const randomThreat = threatTypes[Math.floor(Math.random() * threatTypes.length)];
      const randomSeverity = severities[Math.floor(Math.random() * severities.length)];
      
      const mockContracts = [
        '0x1234567890123456789012345678901234567890',
        '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
        '0x9876543210987654321098765432109876543210'
      ];

      onThreatDetected({
        type: randomThreat,
        severity: randomSeverity,
        message: `DEMO: Simulated ${randomThreat.toLowerCase().replace('_', ' ')} detected`,
        contracts: [mockContracts[Math.floor(Math.random() * mockContracts.length)]],
        timestamp: Date.now(),
        blockNumber: 7000000 + Math.floor(Math.random() * 1000)
      });
    }
  }

  /**
   * Detect suspicious approval events
   */
  private async detectSuspiciousApprovals(fromBlock: number, toBlock: number): Promise<string[]> {
    if (!this.client) return [];

    const query = {
      fromBlock,
      toBlock,
      logs: [
        {
          // ERC-20 Approval events
          topics: [
            ["0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925"] // Approval event signature
          ]
        }
      ],
      fieldSelection: {
        log: ["address", "topic0", "topic1", "topic2", "data"],
        block: ["number", "timestamp"],
        transaction: ["hash", "from", "to"]
      }
    };

    try {
      const result = await this.client.get(query);
      
      // Analyze approval patterns
      const suspiciousContracts: string[] = [];
      const approvalCounts = new Map<string, number>();

      result.data.logs?.forEach((log: any) => {
        if (log.address) {
          const count = approvalCounts.get(log.address) || 0;
          approvalCounts.set(log.address, count + 1);
        }
      });

      // Flag contracts with unusually high approval activity (>5 approvals in 100 blocks)
      approvalCounts.forEach((count, address) => {
        if (count > 5) {
          suspiciousContracts.push(address);
        }
      });

      return suspiciousContracts;
    } catch (error) {
      console.error("Error detecting suspicious approvals:", error);
      return [];
    }
  }

  /**
   * Detect drain patterns specific to user address
   */
  private async detectDrainPatterns(fromBlock: number, toBlock: number, userAddress: string): Promise<string[]> {
    if (!this.client) return [];

    const query = {
      fromBlock,
      toBlock,
      logs: [
        {
          // ERC-20 Transfer events FROM user address
          topics: [
            ["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"], // Transfer event signature
            [`0x000000000000000000000000${userAddress.slice(2).toLowerCase()}`] // From user
          ]
        }
      ],
      fieldSelection: {
        log: ["address", "topic0", "topic1", "topic2", "data"],
        block: ["number", "timestamp"],
        transaction: ["hash", "from", "to"]
      }
    };

    try {
      const result = await this.client.get(query);
      
      // Analyze transfer patterns
      const drainContracts: string[] = [];
      const transferCounts = new Map<string, number>();

      result.data.logs?.forEach((log: any) => {
        if (log.address) {
          const count = transferCounts.get(log.address) || 0;
          transferCounts.set(log.address, count + 1);
        }
      });

      // Flag contracts with rapid transfers from user (>2 transfers in 100 blocks)
      transferCounts.forEach((count, address) => {
        if (count > 2) {
          drainContracts.push(address);
        }
      });

      return drainContracts;
    } catch (error) {
      console.error("Error detecting drain patterns:", error);
      return [];
    }
  }

  /**
   * Detect high-value transfers from user
   */
  private async detectHighValueTransfers(fromBlock: number, toBlock: number, userAddress: string): Promise<string[]> {
    if (!this.client) return [];

    const query = {
      fromBlock,
      toBlock,
      transactions: [
        {
          from: [userAddress]
        }
      ],
      fieldSelection: {
        transaction: ["hash", "from", "to", "value"],
        block: ["number", "timestamp"]
      }
    };

    try {
      const result = await this.client.get(query);
      
      const highValueContracts: string[] = [];
      const ethThreshold = BigInt("100000000000000000"); // 0.1 ETH

      result.data.transactions?.forEach((tx: any) => {
        if (tx.value && BigInt(tx.value) > ethThreshold && tx.to) {
          highValueContracts.push(tx.to);
        }
      });

      return [...new Set(highValueContracts)]; // Remove duplicates
    } catch (error) {
      console.error("Error detecting high-value transfers:", error);
      return [];
    }
  }

  /**
   * Get current block height from HyperSync
   */
  private async getCurrentBlockHeight(): Promise<number> {
    if (!this.client) return 7000000; // Fallback block number

    try {
      // Query for the latest block
      const query = {
        fromBlock: 0,
        fieldSelection: {
          block: ["number"]
        }
      };
      
      const result = await this.client.get(query);
      return result.archiveHeight || 7000000;
    } catch (error) {
      console.error("Error getting block height:", error);
      return 7000000; // Fallback to approximate recent Sepolia block
    }
  }

  /**
   * Simulate a threat for demo purposes
   */
  simulateThreat(onThreatDetected: (threat: ThreatAlert) => void): void {
    console.log("🚨 Simulating threat detection...");
    
    setTimeout(() => {
      onThreatDetected({
        type: 'DRAIN_PATTERN',
        severity: 'CRITICAL',
        message: 'DEMO: Detected suspicious drain pattern on mock contract - immediate action required!',
        contracts: ['0x1234567890123456789012345678901234567890'],
        timestamp: Date.now(),
        blockNumber: 7000000
      });
    }, 2000);

    // Simulate a second threat after 5 seconds
    setTimeout(() => {
      onThreatDetected({
        type: 'SUSPICIOUS_APPROVALS',
        severity: 'HIGH',
        message: 'DEMO: Multiple suspicious approvals detected in recent blocks',
        contracts: ['0xabcdefabcdefabcdefabcdefabcdefabcdefabcd', '0x9876543210987654321098765432109876543210'],
        timestamp: Date.now(),
        blockNumber: 7000001
      });
    }, 5000);
  }
}

/**
 * Threat alert interface
 */
export type { ThreatAlert } from "@/types/omniShield";

// Singleton instance
export const threatDetectionService = new ThreatDetectionService();
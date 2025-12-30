import { ThreatAlert, ApprovalInfo, ContractRisk } from "@/types/omniShield";

/**
 * Security Service for Omni-Shield
 * Handles security analysis, risk assessment, and threat intelligence
 */
export class SecurityService {
  private blacklistedContracts: Set<string> = new Set();
  private contractRisks: Map<string, ContractRisk> = new Map();
  private threatPatterns: Map<string, any> = new Map();

  constructor() {
    this.initializeBlacklists();
    this.initializeThreatPatterns();
  }

  /**
   * Initialize known malicious contracts and blacklists
   */
  private initializeBlacklists() {
    // Known malicious contracts (examples)
    const knownMalicious = [
      '0x1234567890123456789012345678901234567890', // Example drainer
      '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd', // Example phishing
      '0x9876543210987654321098765432109876543210'  // Example rug pull
    ];

    knownMalicious.forEach(address => {
      this.blacklistedContracts.add(address.toLowerCase());
      this.contractRisks.set(address.toLowerCase(), {
        address,
        riskScore: 100,
        reasons: ['Known malicious contract', 'Blacklisted'],
        isBlacklisted: true,
        lastActivity: Date.now()
      });
    });
  }

  /**
   * Initialize threat detection patterns
   */
  private initializeThreatPatterns() {
    this.threatPatterns.set('RAPID_APPROVALS', {
      name: 'Rapid Approval Pattern',
      description: 'Multiple approvals in short time frame',
      threshold: 5,
      timeWindow: 300000, // 5 minutes
      severity: 'HIGH' as const
    });

    this.threatPatterns.set('UNLIMITED_APPROVALS', {
      name: 'Unlimited Approval Pattern',
      description: 'Unlimited token approvals to unknown contracts',
      severity: 'CRITICAL' as const
    });

    this.threatPatterns.set('DRAIN_SEQUENCE', {
      name: 'Token Drain Sequence',
      description: 'Sequential token transfers suggesting drain attack',
      threshold: 3,
      timeWindow: 600000, // 10 minutes
      severity: 'CRITICAL' as const
    });
  }

  /**
   * Analyze contract risk based on various factors
   */
  async analyzeContractRisk(contractAddress: string): Promise<ContractRisk> {
    const address = contractAddress.toLowerCase();
    
    // Check if already analyzed
    if (this.contractRisks.has(address)) {
      return this.contractRisks.get(address)!;
    }

    let riskScore = 0;
    const reasons: string[] = [];
    
    // Check blacklist
    if (this.blacklistedContracts.has(address)) {
      riskScore = 100;
      reasons.push('Blacklisted contract');
    } else {
      // Analyze various risk factors
      riskScore += await this.analyzeContractAge(address);
      riskScore += await this.analyzeContractActivity(address);
      riskScore += await this.analyzeContractCode(address);
      riskScore += await this.analyzeContractReputation(address);
    }

    const risk: ContractRisk = {
      address: contractAddress,
      riskScore: Math.min(riskScore, 100),
      reasons,
      isBlacklisted: this.blacklistedContracts.has(address),
      lastActivity: Date.now()
    };

    this.contractRisks.set(address, risk);
    return risk;
  }

  /**
   * Analyze contract age (newer contracts are riskier)
   */
  private async analyzeContractAge(address: string): Promise<number> {
    try {
      // In a real implementation, query contract creation time
      // For demo, simulate based on address pattern
      const isNewContract = address.includes('1234') || address.includes('abcd');
      return isNewContract ? 30 : 10;
    } catch {
      return 20; // Unknown age = moderate risk
    }
  }

  /**
   * Analyze contract activity patterns
   */
  private async analyzeContractActivity(address: string): Promise<number> {
    try {
      // In a real implementation, analyze transaction patterns
      // High frequency of interactions with different addresses = higher risk
      const hasHighActivity = Math.random() > 0.7;
      return hasHighActivity ? 25 : 5;
    } catch {
      return 10;
    }
  }

  /**
   * Analyze contract code for suspicious patterns
   */
  private async analyzeContractCode(address: string): Promise<number> {
    try {
      // In a real implementation, analyze bytecode for:
      // - Self-destruct functions
      // - Proxy patterns
      // - Hidden functions
      // - Unusual access controls
      
      const hasSuspiciousCode = address.includes('9876');
      return hasSuspiciousCode ? 40 : 0;
    } catch {
      return 15; // Unable to analyze = moderate risk
    }
  }

  /**
   * Analyze contract reputation from external sources
   */
  private async analyzeContractReputation(address: string): Promise<number> {
    try {
      // In a real implementation, check:
      // - DeFiSafety scores
      // - Community reports
      // - Audit results
      // - Social media sentiment
      
      const hasGoodReputation = !address.includes('bad');
      return hasGoodReputation ? 0 : 30;
    } catch {
      return 10;
    }
  }

  /**
   * Assess approval risk
   */
  assessApprovalRisk(approval: ApprovalInfo): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    const contractRisk = this.contractRisks.get(approval.spender.toLowerCase());
    
    if (contractRisk?.isBlacklisted) {
      return 'CRITICAL';
    }

    let riskScore = 0;

    // Check if unlimited approval
    const maxUint256 = BigInt('115792089237316195423570985008687907853269984665640564039457584007913129639935');
    if (approval.amount >= maxUint256 / BigInt(2)) {
      riskScore += 40;
    }

    // Check contract risk score
    if (contractRisk) {
      riskScore += contractRisk.riskScore * 0.4;
    } else {
      riskScore += 20; // Unknown contract
    }

    // Check approval age
    const ageInDays = (Date.now() - approval.timestamp) / (1000 * 60 * 60 * 24);
    if (ageInDays > 90) {
      riskScore += 15; // Old approvals are riskier
    }

    // Determine risk level
    if (riskScore >= 80) return 'CRITICAL';
    if (riskScore >= 60) return 'HIGH';
    if (riskScore >= 30) return 'MEDIUM';
    return 'LOW';
  }

  /**
   * Detect threat patterns in transaction data
   */
  detectThreatPatterns(events: any[]): ThreatAlert[] {
    const threats: ThreatAlert[] = [];
    
    // Group events by time windows
    const timeWindows = this.groupEventsByTimeWindows(events);
    
    for (const [windowStart, windowEvents] of timeWindows) {
      // Check for rapid approval pattern
      const approvalEvents = windowEvents.filter(e => e.type === 'approval');
      if (approvalEvents.length >= 5) {
        threats.push({
          type: 'SUSPICIOUS_APPROVALS',
          severity: 'HIGH',
          message: `Detected ${approvalEvents.length} approvals in 5-minute window`,
          contracts: [...new Set(approvalEvents.map(e => e.contract))],
          timestamp: windowStart,
          blockNumber: Math.max(...windowEvents.map(e => e.blockNumber))
        });
      }

      // Check for drain sequence pattern
      const transferEvents = windowEvents.filter(e => e.type === 'transfer');
      if (transferEvents.length >= 3) {
        const uniqueTokens = new Set(transferEvents.map(e => e.token));
        if (uniqueTokens.size >= 2) {
          threats.push({
            type: 'DRAIN_PATTERN',
            severity: 'CRITICAL',
            message: `Detected drain sequence: ${uniqueTokens.size} tokens transferred`,
            contracts: [...new Set(transferEvents.map(e => e.contract))],
            timestamp: windowStart,
            blockNumber: Math.max(...windowEvents.map(e => e.blockNumber))
          });
        }
      }
    }

    return threats;
  }

  /**
   * Group events by time windows for pattern analysis
   */
  private groupEventsByTimeWindows(events: any[]): Map<number, any[]> {
    const windows = new Map<number, any[]>();
    const windowSize = 300000; // 5 minutes

    for (const event of events) {
      const windowStart = Math.floor(event.timestamp / windowSize) * windowSize;
      
      if (!windows.has(windowStart)) {
        windows.set(windowStart, []);
      }
      
      windows.get(windowStart)!.push(event);
    }

    return windows;
  }

  /**
   * Generate security recommendations
   */
  generateSecurityRecommendations(approvals: ApprovalInfo[]): string[] {
    const recommendations: string[] = [];
    
    const criticalApprovals = approvals.filter(a => a.riskLevel === 'CRITICAL');
    const highRiskApprovals = approvals.filter(a => a.riskLevel === 'HIGH');
    const unlimitedApprovals = approvals.filter(a => 
      a.amount >= BigInt('115792089237316195423570985008687907853269984665640564039457584007913129639935') / BigInt(2)
    );

    if (criticalApprovals.length > 0) {
      recommendations.push(`🚨 URGENT: Revoke ${criticalApprovals.length} critical risk approvals immediately`);
    }

    if (highRiskApprovals.length > 0) {
      recommendations.push(`⚠️ Consider revoking ${highRiskApprovals.length} high-risk approvals`);
    }

    if (unlimitedApprovals.length > 5) {
      recommendations.push(`💡 You have ${unlimitedApprovals.length} unlimited approvals - consider setting limits`);
    }

    const oldApprovals = approvals.filter(a => 
      (Date.now() - a.timestamp) > (90 * 24 * 60 * 60 * 1000)
    );
    if (oldApprovals.length > 0) {
      recommendations.push(`🧹 Review ${oldApprovals.length} approvals older than 90 days`);
    }

    if (recommendations.length === 0) {
      recommendations.push(`✅ Your approval security looks good! Keep monitoring regularly.`);
    }

    return recommendations;
  }

  /**
   * Calculate overall security score
   */
  calculateSecurityScore(approvals: ApprovalInfo[], threats: ThreatAlert[]): number {
    let score = 100;

    // Deduct for active threats
    score -= threats.length * 15;

    // Deduct for risky approvals
    const criticalCount = approvals.filter(a => a.riskLevel === 'CRITICAL').length;
    const highCount = approvals.filter(a => a.riskLevel === 'HIGH').length;
    const mediumCount = approvals.filter(a => a.riskLevel === 'MEDIUM').length;

    score -= criticalCount * 20;
    score -= highCount * 10;
    score -= mediumCount * 5;

    // Deduct for too many approvals
    if (approvals.length > 20) {
      score -= (approvals.length - 20) * 2;
    }

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Add contract to blacklist
   */
  addToBlacklist(contractAddress: string, reason: string) {
    const address = contractAddress.toLowerCase();
    this.blacklistedContracts.add(address);
    
    this.contractRisks.set(address, {
      address: contractAddress,
      riskScore: 100,
      reasons: [reason, 'User blacklisted'],
      isBlacklisted: true,
      lastActivity: Date.now()
    });
  }

  /**
   * Remove contract from blacklist
   */
  removeFromBlacklist(contractAddress: string) {
    const address = contractAddress.toLowerCase();
    this.blacklistedContracts.delete(address);
    this.contractRisks.delete(address);
  }

  /**
   * Get contract risk information
   */
  getContractRisk(contractAddress: string): ContractRisk | null {
    return this.contractRisks.get(contractAddress.toLowerCase()) || null;
  }

  /**
   * Check if contract is blacklisted
   */
  isBlacklisted(contractAddress: string): boolean {
    return this.blacklistedContracts.has(contractAddress.toLowerCase());
  }

  /**
   * Export security report
   */
  exportSecurityReport(approvals: ApprovalInfo[], threats: ThreatAlert[]) {
    const report = {
      timestamp: new Date().toISOString(),
      securityScore: this.calculateSecurityScore(approvals, threats),
      totalApprovals: approvals.length,
      riskBreakdown: {
        critical: approvals.filter(a => a.riskLevel === 'CRITICAL').length,
        high: approvals.filter(a => a.riskLevel === 'HIGH').length,
        medium: approvals.filter(a => a.riskLevel === 'MEDIUM').length,
        low: approvals.filter(a => a.riskLevel === 'LOW').length
      },
      activeThreats: threats.length,
      recommendations: this.generateSecurityRecommendations(approvals),
      approvals: approvals.map(a => ({
        token: a.token,
        spender: a.spender,
        amount: a.amount.toString(),
        riskLevel: a.riskLevel,
        timestamp: new Date(a.timestamp).toISOString()
      })),
      threats: threats.map(t => ({
        type: t.type,
        severity: t.severity,
        message: t.message,
        contracts: t.contracts,
        timestamp: new Date(t.timestamp).toISOString()
      }))
    };

    // Create downloadable JSON file
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `omni-shield-security-report-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

// Singleton instance
export const securityService = new SecurityService();
# Omni-Shield Architecture Documentation

## Overview

Omni-Shield is an AI-powered autonomous security agent that protects Ethereum wallets from real-time exploits using cutting-edge Web3 technologies. This document outlines the technical architecture, design decisions, and implementation details.

## Core Technologies

### 1. ERC-7715 (Advanced Permissions)
- **Purpose**: Enables users to grant scoped permissions to the Omni-Shield agent
- **Implementation**: MetaMask Smart Accounts Kit
- **Permissions Granted**: 
  - Token approval revocationx
  - Emergency fund transfers
  - Contract interaction limits

### 2. EIP-7702 (Account Abstraction)
- **Purpose**: Upgrades EOA to Smart Account for enhanced functionality
- **Benefits**: 
  - Gas sponsorship via Pimlico
  - Batch transactions
  - Session key management
  - Programmable security rules

### 3. Envio HyperSync
- **Purpose**: Real-time blockchain data indexing and threat detection
- **Capabilities**:
  - Stream approval events
  - Monitor transfer patterns
  - Detect exploit signatures
  - Real-time threat alerts

### 4. Pimlico Infrastructure
- **Bundler**: Submits UserOperations for gasless execution
- **Paymaster**: Sponsors gas fees to prevent fund drainage
- **Gas Estimation**: Optimizes transaction costs

## System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Wallet   │    │  Omni-Shield    │    │  Threat Engine  │
│   (MetaMask)    │    │    Agent        │    │  (HyperSync)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │ 1. Grant Permissions  │                       │
         ├──────────────────────►│                       │
         │                       │ 2. Monitor Threats    │
         │                       ├──────────────────────►│
         │                       │                       │
         │                       │ 3. Threat Detected    │
         │                       │◄──────────────────────┤
         │                       │                       │
         │ 4. Auto-Revoke        │                       │
         │◄──────────────────────┤                       │
         │   (Gasless)           │                       │
```

## Component Architecture

### Frontend Components

#### 1. **ThreatMonitor.tsx**
- Real-time threat display
- Shield activation controls
- Auto-revoke settings
- Threat history management

#### 2. **Steps.tsx** 
- Multi-step onboarding flow
- Wallet connection
- Session account creation
- Permission granting

#### 3. **Hero.tsx**
- Omni-Shield branding
- Feature highlights
- Value proposition

### Provider Architecture

#### 1. **OmniShieldProvider.tsx**
```typescript
interface OmniShieldContextType {
  isShieldActive: boolean;
  threats: ThreatAlert[];
  activateShield: () => void;
  deactivateShield: () => void;
  autoRevokeEnabled: boolean;
}
```

#### 2. **SessionAccountProvider.tsx**
- Manages session account creation
- Stores MetaMaskSmartAccount instance
- Handles account lifecycle

#### 3. **PermissionProvider.tsx**
- ERC-7715 permission management
- Permission storage and retrieval
- Context and delegation handling

### Service Layer

#### 1. **ThreatDetectionService**
```typescript
class ThreatDetectionService {
  startMonitoring(address: string, callback: Function): void
  detectSuspiciousApprovals(fromBlock: number, toBlock: number): Promise<string[]>
  detectDrainPatterns(fromBlock: number, toBlock: number, userAddress: string): Promise<string[]>
}
```

#### 2. **BundlerClient**
- Pimlico bundler integration
- UserOperation submission
- ERC-7710 action extensions

#### 3. **PimlicoClient**
- Gas price estimation
- Paymaster integration
- Transaction optimization

## Data Flow

### 1. Setup Phase
```
User → Connect Wallet → Create Session Account → Grant Permissions → Activate Shield
```

### 2. Monitoring Phase
```
HyperSync → Stream Events → Analyze Patterns → Detect Threats → Alert System
```

### 3. Protection Phase
```
Threat Detected → Evaluate Severity → Execute Protection → Revoke Approvals → Notify User
```

## Security Model

### Permission Scoping
- **Time-Limited**: 30-day expiration
- **Function-Specific**: Only approval revocation and emergency transfers
- **Amount-Limited**: Maximum daily transfer limits
- **Adjustable**: User can modify terms before granting

### Threat Detection Algorithms

#### 1. **Suspicious Approval Detection**
```typescript
// Flags contracts with >10 approvals in 100 blocks
if (approvalCount > SUSPICIOUS_THRESHOLD) {
  flagAsSuspicious(contractAddress);
}
```

#### 2. **Drain Pattern Detection**
```typescript
// Detects rapid transfers from user address
if (transferCount > DRAIN_THRESHOLD && timeWindow < MAX_TIME) {
  flagAsDrainPattern(contractAddress);
}
```

#### 3. **Blacklist Monitoring**
- Known malicious contracts
- Recently exploited protocols
- Community-reported threats

### Gas Attack Prevention
- All protection actions are gasless via Pimlico
- Prevents attackers from draining funds through gas fees
- Emergency actions prioritized in mempool

## Performance Optimizations

### 1. **Efficient Querying**
- HyperSync batch queries for multiple event types
- Block range optimization (last 100 blocks)
- Selective field retrieval to minimize bandwidth

### 2. **State Management**
- React Context for global state
- Local storage for session persistence
- Optimistic updates for better UX

### 3. **Real-Time Updates**
- 10-second monitoring intervals
- WebSocket connections for instant alerts
- Background processing for threat analysis

## Deployment Architecture

### Development Environment
```
Next.js 15 → React 19 → TypeScript → Tailwind CSS
```

### Production Infrastructure
```
Vercel → CDN → Pimlico → Sepolia Testnet → HyperSync API
```

### Environment Variables
```env
NEXT_PUBLIC_PIMLICO_API_KEY=     # Bundler/Paymaster access
NEXT_PUBLIC_RPC_URL=             # Sepolia RPC endpoint
NEXT_PUBLIC_ENVIO_API_KEY=       # HyperSync API access
NEXT_PUBLIC_HYPERSYNC_URL=       # Custom HyperSync endpoint
```

## Future Enhancements

### 1. **Multi-Chain Support**
- Extend to Ethereum mainnet
- Support for L2s (Arbitrum, Optimism, Polygon)
- Cross-chain threat correlation

### 2. **Advanced AI Features**
- Machine learning threat detection
- Behavioral analysis patterns
- Predictive exploit prevention

### 3. **Emergency Vault System**
- Secure fund storage during threats
- Multi-sig recovery mechanisms
- Insurance integration

### 4. **Community Features**
- Threat intelligence sharing
- Crowdsourced blacklists
- Reputation scoring system

## Testing Strategy

### 1. **Unit Tests**
- Component rendering
- Provider state management
- Service layer functions

### 2. **Integration Tests**
- End-to-end user flows
- HyperSync integration
- Pimlico transaction submission

### 3. **Security Tests**
- Permission boundary testing
- Threat detection accuracy
- Gas attack simulations

## Monitoring & Analytics

### 1. **Threat Metrics**
- Detection accuracy rates
- False positive analysis
- Response time measurements

### 2. **User Metrics**
- Shield activation rates
- Permission grant success
- User retention analysis

### 3. **System Metrics**
- HyperSync query performance
- Pimlico transaction success
- Error rate monitoring

## Compliance & Legal

### 1. **Privacy**
- No personal data collection
- On-chain data only
- User-controlled permissions

### 2. **Regulatory**
- Non-custodial architecture
- User maintains full control
- Transparent operation logs

### 3. **Security Audits**
- Smart contract audits (future)
- Penetration testing
- Code review processes
# Omni-Shield: AI-Powered Ethereum Security Agent

**Omni-Shield** is an autonomous security agent that protects Ethereum wallets from real-time exploits by automatically revoking dangerous token approvals and moving funds to safety - all without requiring user intervention.

## 🛡️ What is Omni-Shield?

Omni-Shield combines cutting-edge Web3 technologies to create the first truly autonomous wallet security system:

- **ERC-7715 (Advanced Permissions)**: Grants scoped permissions to the security agent
- **EIP-7702**: Enables EOA-to-Smart Account upgrades for enhanced functionality  
- **Envio HyperSync**: Real-time blockchain data indexing for threat detection
- **Pimlico**: Gasless transaction execution to prevent fund drainage

## 🚨 The Problem We Solve

Users accumulate hundreds of token approvals over time, creating massive security vulnerabilities. Manual revocation is:
- ❌ Tedious and time-consuming
- ❌ Expensive (gas costs)
- ❌ Reactive (damage already done)
- ❌ Requires constant monitoring

## ✅ Our Solution

Omni-Shield operates as your personal security agent:
- 🤖 **Autonomous Protection**: Monitors approvals 24/7 without user intervention
- ⚡ **Real-Time Detection**: Uses Envio HyperSync for instant threat identification
- 🔒 **Automatic Revocation**: Revokes dangerous approvals before exploits occur
- 💰 **Gasless Operations**: Pimlico paymaster prevents attackers from draining funds
- 🏦 **Emergency Vault**: Moves funds to safety during detected exploits

## Prerequisites

1. **Pimlico API Key**: In this template, we use Pimlico's Bundler and Paymaster services to submit user operations and sponsor transactions, respectively. You can retrieve the required API key from [Pimlico's Dashboard](https://dashboard.pimlico.io/apikeys).

2. **RPC URL** In this template, you’ll need an RPC URL for the Sepolia chain. You can use any preferred RPC provider or a public RPC. However, we recommend using a paid RPC to ensure better reliability and avoid potential rate-limiting issues.

## 🏗️ Architecture

```bash
omni-shield/
├── src/
│ ├── app/ # Next.js app router
│ ├── components/ # UI Components
│ │ ├── CreateSessionAccount.tsx # Session account creation
│ │ ├── GrantPermissionsButton.tsx # ERC-7715 permission granting
│ │ ├── Hero.tsx # Landing section
│ │ ├── PermissionInfo.tsx # Permission display
│ │ ├── RedeemPermissionButton.tsx # Permission redemption
│ │ ├── Steps.tsx # Multi-step workflow
│ │ ├── ThreatMonitor.tsx # Real-time threat display
│ │ └── WalletInfoContainer.tsx # Wallet information
│ ├── providers/ # React Context Providers
│ │ ├── OmniShieldProvider.tsx # Main security agent provider
│ │ ├── PermissionProvider.tsx # Permission state management
│ │ └── SessionAccountProvider.tsx # Session account state
│ ├── services/ # Core Services
│ │ ├── bundlerClient.ts # Pimlico bundler integration
│ │ ├── pimlicoClient.ts # Gas estimation
│ │ └── threatDetection.ts # Envio HyperSync threat monitoring
│ └── types/ # TypeScript definitions
├── contracts/ # Smart contracts (Safe vault, etc.)
├── docs/ # Technical documentation
└── .env # Environment configuration
```

## 🚀 Quick Start

### Prerequisites

1. **MetaMask Flask**: Install [MetaMask Flask](https://metamask.io/flask/) for ERC-7715 support
2. **Pimlico API Key**: Get your API key from [Pimlico Dashboard](https://dashboard.pimlico.io/apikeys)
3. **Sepolia ETH**: Get testnet ETH from [Sepolia Faucet](https://sepoliafaucet.com/)
4. **Smart Account**: Upgrade your EOA to a MetaMask Smart Account

### Environment Setup

Create a `.env.local` file:

```env
NEXT_PUBLIC_PIMLICO_API_KEY=your_pimlico_api_key_here
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/your_infura_key
NEXT_PUBLIC_ENVIO_API_KEY=your_envio_api_key_here
```

### Installation & Development

```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Open http://localhost:3000
```

## 🔄 How It Works

### 1. **Setup Phase**
- Connect MetaMask wallet (must be Smart Account)
- Create session account for autonomous operations
- Grant ERC-7715 permissions to Omni-Shield agent

### 2. **Monitoring Phase**
- Envio HyperSync streams real-time blockchain data
- AI analyzes approval patterns and transaction flows
- Threat detection algorithms identify suspicious activity

### 3. **Protection Phase**
- Automatic approval revocation for detected threats
- Emergency fund movement to secure vault contracts
- Gasless execution prevents attacker fund drainage
- Real-time notifications and protection reports

## 🛠️ Technical Implementation

### ERC-7715 Advanced Permissions
```typescript
// Grant permission for approval management
const permissions = await client.requestExecutionPermissions([{
  chainId: sepolia.id,
  expiry: currentTime + (30 * 24 * 60 * 60), // 30 days
  signer: { type: "account", data: { address: sessionAccount.address } },
  permissions: [{
    type: "erc20-approval-revocation",
    data: { tokens: ["*"] } // All ERC-20 tokens
  }]
}]);
```

### Real-Time Threat Detection
```typescript
// Monitor approval events via Envio HyperSync
const threatMonitor = new ThreatDetectionService({
  userAddress: account.address,
  onThreatDetected: async (threat) => {
    await omniShield.executeProtection(threat);
  }
});
```

## 🏆 Competitive Advantages

| Feature | Traditional Dashboards | Omni-Shield |
|---------|----------------------|-------------|
| **Detection Speed** | Manual checking | Real-time monitoring |
| **Response Time** | User intervention required | Autonomous protection |
| **Gas Costs** | User pays | Gasless via Pimlico |
| **Coverage** | Single-chain | Multi-chain support |
| **Intelligence** | Static rules | AI-powered analysis |

## 🔗 Learn More

- [ERC-7715 Advanced Permissions](https://docs.metamask.io/smart-accounts-kit/guides/advanced-permissions/)
- [EIP-7702 Account Abstraction](https://eips.ethereum.org/EIPS/eip-7702)
- [Envio HyperSync Documentation](https://docs.envio.dev/docs/hypersync)
- [MetaMask Smart Accounts Kit](https://docs.metamask.io/smart-accounts-kit/)
- [Pimlico Account Abstraction](https://docs.pimlico.io/)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

**Built with ❤️ for the MetaMask x Envio Hackathon**

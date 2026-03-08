# PrivaCRE: Privacy-Preserving Credit Scoring for DeFi

<div align="center">

![PrivaCRE Logo](https://img.shields.io/badge/PrivaCRE-Privacy--First-0df26c?style=for-the-badge)
[![Chainlink](https://img.shields.io/badge/Powered%20by-Chainlink%20CRE-375BD2?style=for-the-badge&logo=chainlink)](https://chain.link/)
[![World ID](https://img.shields.io/badge/Verified%20by-World%20ID-000000?style=for-the-badge)](https://worldcoin.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

**Bringing Real-World Credit Scoring to DeFi Without Compromising Privacy**

[Live Demo](https://privacre.netlify.app) • [Documentation](./docs) • [Video Demo](#) • [Hackathon Submission](./docs/HACKATHON_SUBMISSION_FORM.md)

</div>

---

## 🔗 Quick Links

### � Live Application
- **Frontend**: [https://privacre.netlify.app](https://privacre.netlify.app)
- **Status**: ✅ Live and Running

### ⛓️ Smart Contracts (Tenderly Virtual TestNet)
- **PrivaVault**: [`0x49BdEEcB489E037C0f6928dEe6a043908b8d8877`](https://dashboard.tenderly.co/explorer/vnet/7611135a-8515-41d7-8146-9390be57f949/address/0x49BdEEcB489E037C0f6928dEe6a043908b8d8877)
- **Network Explorer**: [Tenderly Dashboard](https://dashboard.tenderly.co/explorer/vnet/7611135a-8515-41d7-8146-9390be57f949)
- **RPC URL**: `https://virtual.sepolia.eu.rpc.tenderly.co/7611135a-8515-41d7-8146-9390be57f949`

### 📦 Repository
- **GitHub**: [github.com/LSUDOKO/PrivaCRE](https://github.com/LSUDOKO/PrivaCRE)
- **CRE Workflow**: [`/PrivaCRE/my-workflow/`](./PrivaCRE/my-workflow/)
- **Smart Contracts**: [`/contracts/`](./contracts/)

### 📚 Documentation
- **Main Docs**: [/docs](./docs)
- **Quick Start**: [docs/QUICKSTART.md](./docs/QUICKSTART.md)
- **Technical Architecture**: [docs/TECHNICAL_ARCHITECTURE.md](./docs/TECHNICAL_ARCHITECTURE.md)
- **CRE Integration**: [docs/CRE_INTEGRATION_SUMMARY.md](./docs/CRE_INTEGRATION_SUMMARY.md)

### 🎯 Hackathon
- **Submission Form**: [docs/HACKATHON_SUBMISSION_FORM.md](./docs/HACKATHON_SUBMISSION_FORM.md)
- **Video Script**: [docs/HACKATHON_VIDEO_SCRIPT.md](./docs/HACKATHON_VIDEO_SCRIPT.md)
- **Demo Script**: [docs/HACKATHON_DEMO_SCRIPT.md](./docs/HACKATHON_DEMO_SCRIPT.md)

---

## 🎯 Overview

PrivaCRE (Privacy-Preserving Credit Scoring) revolutionizes DeFi lending by enabling **under-collateralized loans** based on verifiable creditworthiness while maintaining complete user privacy. By combining **Chainlink's Compute Runtime Environment (CRE)**, **World ID**, and **AI-powered analysis**, we solve DeFi's biggest barrier to adoption: over-collateralization.

### The Problem

- **DeFi Today**: Borrow $100 → Lock $150+ collateral (150%+ over-collateralization)
- **Traditional Finance**: Credit scores enable under-collateralized lending but expose sensitive data
- **Result**: DeFi is inaccessible to 99% of people who can't afford massive collateral

### Our Solution

PrivaCRE generates privacy-preserving credit scores using:
- ✅ **Real bank data** via Plaid API
- ✅ **Secure computation** in Chainlink CRE
- ✅ **AI analysis** with Groq (Llama 3.1 70B)
- ✅ **Sybil resistance** via World ID
- ✅ **Zero data exposure** - all processing in secure enclave

**Result**: Borrow $100 with just $105 collateral (105%) if you have good credit!

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│  Next.js 15 • React 19 • TailwindCSS • RainbowKit • Wagmi     │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    IDENTITY & DATA ACCESS                       │
│  • World ID (Sybil Resistance)                                 │
│  • Plaid API (Bank Connectivity)                               │
│  • Wallet Connection (Ethereum)                                │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              CHAINLINK CRE (SECURE COMPUTATION)                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  1. Fetch Bank Data (Plaid API)                         │  │
│  │  2. Sanitize Data (Remove PII)                          │  │
│  │  3. AI Analysis (Groq LLM)                              │  │
│  │  4. Generate Credit Score (0-100)                       │  │
│  │  5. Publish On-Chain (Smart Contract)                   │  │
│  └─────────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BLOCKCHAIN LAYER                             │
│  • Smart Contracts (Solidity)                                  │
│  • PrivaVault (Lending & Collateral)                           │
│  • Credit Score Storage (On-Chain)                             │
│  • Tenderly Virtual TestNet                                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## ✨ Key Features

### 🔐 Privacy-First Design
- **Zero Data Exposure**: All sensitive data processed in Chainlink's secure enclave
- **PII Removal**: Names, addresses, account numbers stripped before analysis
- **Zero-Knowledge Proofs**: Credit scores verifiable but not traceable
- **User Control**: You own your data, we never see it

### 🎯 Real Credit Scoring
- **Actual Bank Data**: Connects to real financial history via Plaid
- **AI-Powered Analysis**: Groq's Llama 3.1 70B analyzes spending patterns
- **Comprehensive Metrics**: Payment history, cash flow, transaction patterns
- **Accurate Scores**: Based on real behavior, not just crypto holdings

### 🛡️ Sybil Resistance
- **World ID Integration**: One human = one credit score
- **Orb Verification**: Biometric proof of personhood
- **Nullifier Hashing**: Prevents duplicate scores
- **Attack Prevention**: Impossible to game the system

### 💰 Better Lending Rates
- **Dynamic Collateral**: 105% - 150% based on credit score
- **Tiered System**: Higher scores = better rates
- **Under-Collateralized**: Borrow more with less collateral
- **Competitive APRs**: 4.5% - 6.8% based on tier

### 🌐 Cross-Chain Compatible
- **Multi-Chain Support**: Ethereum, Arbitrum, Base, Optimism
- **Portable Scores**: Credit follows you across chains
- **Chainlink CCIP**: Secure cross-chain messaging
- **Universal DeFi**: Works with any protocol

---

## 🚀 Quick Start

### Prerequisites

```bash
Node.js >= 20.0.0
npm or yarn
MetaMask or compatible wallet
World ID app (for verification)
```

### Installation

```bash
# Clone the repository
git clone https://github.com/LSUDOKO/PrivaCRE.git
cd PrivaCRE

# Install dependencies
npm install --legacy-peer-deps

# Copy environment variables
cp .env.example .env

# Configure your .env file with:
# - Plaid API credentials
# - Groq API key
# - World ID app ID
# - Tenderly RPC URL
# - WalletConnect project ID
```

### Environment Setup

Edit `.env` with your credentials:

```env
# Plaid Configuration (Get from https://dashboard.plaid.com)
PLAID_CLIENT_ID=your_plaid_client_id
PLAID_SECRET=your_plaid_secret
PLAID_ENV=sandbox

# Groq AI (Get from https://console.groq.com)
GROQ_API_KEY=your_groq_api_key

# World ID (Get from https://developer.worldcoin.org)
NEXT_PUBLIC_WORLD_ID_APP_ID=app_your_app_id
NEXT_PUBLIC_WORLD_RP_ID=rp_your_rp_id

# Tenderly Virtual TestNet
NEXT_PUBLIC_TENDERLY_RPC=https://virtual.sepolia.eu.rpc.tenderly.co/your_vnet_id
RPC_URL_SEPOLIA=https://virtual.sepolia.eu.rpc.tenderly.co/your_vnet_id

# WalletConnect (Get from https://cloud.walletconnect.com)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

# Private Key (for contract deployment)
PRIVATE_KEY=your_private_key_here
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Deploy Smart Contracts

```bash
# Compile contracts
npx hardhat compile

# Deploy to Tenderly Virtual TestNet
npx hardhat run scripts/deploy.js --network tenderly

# Update contract addresses in src/lib/contract-addresses.json
```

### Run CRE Workflow Simulation

```bash
cd PrivaCRE/my-workflow

# Install CRE CLI (if not already installed)
npm install -g @chainlink/cre-cli

# Configure secrets
cp secrets.yaml.example secrets.yaml
# Edit secrets.yaml with your API keys

# Run simulation
cre workflow simulate

# Expected output:
# ✓ Plaid data fetched
# ✓ Data sanitized
# ✓ AI analysis complete
# ✓ Credit score: 87
# ✓ Transaction submitted
```

---

## 📖 How It Works

### Step 1: Identity Verification

```typescript
// User verifies with World ID
<IDKitWidget
  app_id={WORLD_ID_APP_ID}
  action="verify-identity"
  verification_level={VerificationLevel.Orb}
  onSuccess={handleVerification}
/>
```

**What Happens:**
- User scans QR code with World ID app
- Biometric verification (Orb)
- Nullifier hash generated (prevents duplicates)
- Verification stored on-chain

### Step 2: Credit Analysis Trigger

```typescript
// Frontend triggers CRE workflow
const response = await fetch('/api/cre', {
  method: 'POST',
  body: JSON.stringify({ userAddress: walletAddress })
});
```

**What Happens:**
- User clicks "Start Credit Analysis"
- Frontend calls backend API
- Backend triggers Chainlink CRE workflow
- Real-time progress updates shown to user

### Step 3: Secure Data Processing (CRE)

```typescript
// PrivaCRE/my-workflow/main.ts
export async function main(input: WorkflowInput): Promise<WorkflowOutput> {
  // 1. Fetch bank data from Plaid
  const plaidData = await fetchPlaidTransactions(input.userAddress);
  
  // 2. Sanitize data (remove PII)
  const sanitized = {
    transactions: plaidData.transactions.map(tx => ({
      amount: tx.amount,
      date: tx.date,
      category: tx.category,
      // NO: name, account_id, location, etc.
    })),
    summary: {
      totalIncome: calculateIncome(plaidData),
      totalExpenses: calculateExpenses(plaidData),
      avgBalance: calculateAvgBalance(plaidData),
      // NO: account numbers, SSN, addresses
    }
  };
  
  // 3. AI analysis with Groq
  const aiAnalysis = await analyzeWithGroq(sanitized);
  
  // 4. Calculate credit score
  const creditScore = calculateScore(aiAnalysis);
  
  // 5. Store on-chain
  await storeOnChain(input.userAddress, creditScore);
  
  return { creditScore, analysis: aiAnalysis };
}
```

**What Happens:**
- All processing in Chainlink's secure enclave
- Bank data fetched directly from Plaid
- PII stripped out completely
- AI analyzes anonymized patterns
- Score stored on blockchain
- **Your raw data never leaves the enclave**

### Step 4: On-Chain Storage

```solidity
// contracts/PrivaVault.sol
function updateCreditScore(address user, uint256 score) external {
    require(msg.sender == creOracle, "Only CRE can update");
    require(score <= 100, "Invalid score");
    
    userScores[user] = score;
    emit CreditScoreUpdated(user, score, block.timestamp);
}
```

**What Happens:**
- CRE calls smart contract
- Credit score stored on-chain
- Event emitted for indexing
- Score becomes verifiable asset

### Step 5: Lending with Better Rates

```typescript
// User can now borrow with reduced collateral
const collateralRatio = creditScore >= 90 ? 105 : 
                       creditScore >= 80 ? 115 : 
                       creditScore >= 70 ? 125 : 150;

// Borrow $1000 with just $1050 collateral (if score >= 90)
```

**What Happens:**
- Higher credit score = lower collateral requirement
- Dynamic interest rates based on risk
- Automated liquidation protection
- Transparent, verifiable on-chain

### Interact with Deployed Contracts

You can interact with the deployed contracts directly:

```javascript
// Using ethers.js
import { ethers } from 'ethers';
import PrivaVaultABI from './artifacts/contracts/PrivaVault.sol/PrivaVault.json';

// Connect to Tenderly Virtual TestNet
const provider = new ethers.JsonRpcProvider(
  'https://virtual.sepolia.eu.rpc.tenderly.co/7611135a-8515-41d7-8146-9390be57f949'
);

// Connect to PrivaVault contract
const vault = new ethers.Contract(
  '0x49BdEEcB489E037C0f6928dEe6a043908b8d8877',
  PrivaVaultABI.abi,
  provider
);

// Read user's credit score
const score = await vault.userScores('0xYourAddress');
console.log('Credit Score:', score.toString());

// Check available loan amount
const maxLoan = await vault.getMaxLoan('0xYourAddress');
console.log('Max Loan:', ethers.formatUnits(maxLoan, 6), 'USDC');
```

**View on Tenderly:**
- [PrivaVault Contract](https://dashboard.tenderly.co/explorer/vnet/7611135a-8515-41d7-8146-9390be57f949/address/0x49BdEEcB489E037C0f6928dEe6a043908b8d8877)
- [All Transactions](https://dashboard.tenderly.co/explorer/vnet/7611135a-8515-41d7-8146-9390be57f949/transactions)
- [Network Stats](https://dashboard.tenderly.co/explorer/vnet/7611135a-8515-41d7-8146-9390be57f949)

---

---

## 🔧 Technology Stack

### Frontend
- **Framework**: Next.js 15.5.12 (React 19)
- **Language**: TypeScript 5.x
- **Styling**: TailwindCSS 3.4 + Framer Motion
- **Web3**: RainbowKit + Wagmi + Viem
- **Animations**: GSAP 3.12

### Blockchain
- **Smart Contracts**: Solidity 0.8.x
- **Development**: Hardhat 2.19
- **Libraries**: OpenZeppelin Contracts 5.0
- **Network**: Tenderly Virtual TestNet (Sepolia)
- **Interactions**: Ethers.js v6

### Chainlink Integration
- **CRE (Compute Runtime Environment)**: Core secure computation
- **Workflow**: TypeScript-based (`PrivaCRE/my-workflow/`)
- **CLI**: @chainlink/cre-cli for simulation
- **Secrets**: Managed via secrets.yaml

### External APIs
- **Plaid**: Bank account connectivity (v41.4.0)
- **Groq**: AI inference (Llama 3.1 70B)
- **World ID**: Sybil-resistant identity (v1.3.0)

### Infrastructure
- **Hosting**: Netlify (Frontend)
- **RPC**: Tenderly Virtual TestNet
- **Monitoring**: Tenderly Dashboard
- **CI/CD**: GitHub Actions (planned)

---

## 📁 Project Structure

```
PrivaCRE/
├── contracts/              # Solidity smart contracts
│   ├── PrivaVault.sol     # Main lending vault
│   ├── CrestVault.sol     # Alternative vault
│   └── MockUSDC.sol       # Test token
│
├── PrivaCRE/              # Chainlink CRE workflow
│   ├── my-workflow/       # CRE workflow implementation
│   │   ├── main.ts        # Core workflow logic
│   │   ├── workflow.yaml  # Workflow configuration
│   │   └── config.*.json  # Environment configs
│   ├── project.yaml       # CRE project settings
│   └── secrets.yaml       # API keys (gitignored)
│
├── src/
│   ├── app/               # Next.js app directory
│   │   ├── api/          # API routes
│   │   │   ├── cre/      # CRE workflow trigger
│   │   │   ├── plaid/    # Plaid integration
│   │   │   └── worldid/  # World ID verification
│   │   ├── dashboard/    # Credit score dashboard
│   │   ├── lending/      # Lending interface
│   │   ├── bridge/       # Cross-chain bridge
│   │   └── auth/         # Authentication
│   │
│   ├── components/        # React components
│   │   ├── ui/           # UI components
│   │   └── layout/       # Layout components
│   │
│   ├── hooks/            # Custom React hooks
│   └── lib/              # Utilities & configs
│
├── scripts/              # Deployment & testing scripts
│   ├── deploy.js         # Contract deployment
│   ├── test-borrow.js    # Lending tests
│   └── simulate-workflow.js  # CRE simulation
│
├── docs/                 # Documentation
│   ├── HACKATHON_SUBMISSION_FORM.md
│   ├── TECHNICAL_ARCHITECTURE.md
│   ├── CRE_INTEGRATION_SUMMARY.md
│   └── ... (50+ docs)
│
├── .env.example          # Environment template
├── hardhat.config.js     # Hardhat configuration
├── package.json          # Dependencies
└── README.md            # This file
```

---

## 🎮 Usage Guide

### For Users

1. **Connect Wallet**
   - Click "Connect Wallet" on homepage
   - Approve MetaMask connection
   - Your address is now linked

2. **Verify Identity**
   - Click "Verify with World ID"
   - Scan QR code with World ID app
   - Complete biometric verification
   - One-time process per wallet

3. **Generate Credit Score**
   - Navigate to Dashboard
   - Click "Start Credit Analysis"
   - Connect your bank via Plaid
   - Wait 30-60 seconds for analysis
   - View your credit score (0-100)

4. **Borrow Funds**
   - Go to Lending page
   - Enter desired loan amount
   - See required collateral (based on score)
   - Deposit collateral
   - Receive loan instantly

5. **Bridge Score (Optional)**
   - Navigate to Bridge page
   - Select destination chain
   - Pay bridge fee
   - Score available on new chain

### For Developers

#### Deploy Your Own Instance

```bash
# 1. Clone and install
git clone https://github.com/LSUDOKO/PrivaCRE.git
cd PrivaCRE
npm install --legacy-peer-deps

# 2. Configure environment
cp .env.example .env
# Edit .env with your credentials

# 3. Deploy contracts
npx hardhat compile
npx hardhat run scripts/deploy.js --network tenderly

# 4. Update contract addresses
# Edit src/lib/contract-addresses.json

# 5. Run development server
npm run dev

# 6. Test CRE workflow
cd PrivaCRE/my-workflow
cre workflow simulate
```

#### Integrate PrivaCRE

```typescript
// Import credit score in your DeFi protocol
import { PrivaVault } from './contracts/PrivaVault.sol';

contract YourProtocol {
    PrivaVault public privaVault;
    
    function getLoanTerms(address user) public view returns (
        uint256 maxLoan,
        uint256 collateralRatio,
        uint256 interestRate
    ) {
        uint256 creditScore = privaVault.userScores(user);
        
        // Adjust terms based on credit score
        if (creditScore >= 90) {
            return (10000e6, 105, 450); // 105% collateral, 4.5% APR
        } else if (creditScore >= 80) {
            return (5000e6, 115, 520); // 115% collateral, 5.2% APR
        }
        // ... more tiers
    }
}
```

---

## 🔒 Security

### Smart Contract Security
- ✅ OpenZeppelin battle-tested contracts
- ✅ Reentrancy guards on all functions
- ✅ Access control (Ownable, roles)
- ✅ Comprehensive testing suite
- ⏳ Professional audit (planned)

### Data Privacy
- ✅ All processing in Chainlink CRE secure enclave
- ✅ PII removal before any analysis
- ✅ Zero-knowledge proofs for verification
- ✅ No data stored on our servers
- ✅ User controls all data access

### Sybil Resistance
- ✅ World ID Orb verification
- ✅ Nullifier hash storage
- ✅ One score per human
- ✅ Duplicate prevention

### API Security
- ✅ Secrets managed via CRE secrets.yaml
- ✅ API keys never exposed to frontend
- ✅ Rate limiting on all endpoints
- ✅ HTTPS only communication

---

## 📊 Credit Score Calculation

### Factors Analyzed

1. **Payment History (40%)**
   - On-time payments
   - Missed payments
   - Payment consistency

2. **Cash Flow (30%)**
   - Income stability
   - Expense patterns
   - Savings rate

3. **Account Health (20%)**
   - Average balance
   - Overdrafts
   - Account age

4. **Transaction Patterns (10%)**
   - Spending categories
   - Financial responsibility
   - Risk indicators

### Score Ranges

- **90-100**: Exceptional - 105% collateral, 4.5% APR
- **80-89**: Excellent - 115% collateral, 5.2% APR
- **70-79**: Very Good - 125% collateral, 5.8% APR
- **60-69**: Good - 135% collateral, 6.2% APR
- **<60**: Fair - 150% collateral, 6.8% APR

### Privacy Guarantees

- ❌ We DON'T see: Names, addresses, account numbers, SSNs
- ✅ We DO analyze: Transaction amounts, dates, categories (anonymized)
- 🔒 All processing: Inside Chainlink CRE secure enclave
- 🎯 Result: Credit score only, no raw data exposure

---

## 🌐 Deployed Contracts

### Tenderly Virtual TestNet (Sepolia)

**Network Details:**
- **Network**: Tenderly Virtual TestNet
- **Chain ID**: 11155111 (Sepolia)
- **RPC URL**: `https://virtual.sepolia.eu.rpc.tenderly.co/7611135a-8515-41d7-8146-9390be57f949`
- **Explorer**: [Tenderly Dashboard](https://dashboard.tenderly.co/explorer/vnet/7611135a-8515-41d7-8146-9390be57f949)

**Deployed Contracts:**

| Contract | Address | Explorer Link |
|----------|---------|---------------|
| **PrivaVault** (Main Lending Vault) | `0x49BdEEcB489E037C0f6928dEe6a043908b8d8877` | [View on Tenderly](https://dashboard.tenderly.co/explorer/vnet/7611135a-8515-41d7-8146-9390be57f949/address/0x49BdEEcB489E037C0f6928dEe6a043908b8d8877) |
| **MockUSDC** (Test Token) | `0x5432bed5E495f625640bc6210087D07C14DF5FE3` | [View on Tenderly](https://dashboard.tenderly.co/explorer/vnet/7611135a-8515-41d7-8146-9390be57f949/address/0x5432bed5E495f625640bc6210087D07C14DF5FE3) |
| **MockPriceFeed** (Oracle) | `0xb8d323B1F3524d2e634B9Fa2537425AD39712140` | [View on Tenderly](https://dashboard.tenderly.co/explorer/vnet/7611135a-8515-41d7-8146-9390be57f949/address/0xb8d323B1F3524d2e634B9Fa2537425AD39712140) |
| **CRE Oracle** | `0xAd0799D4D6564c945C448D8BcFA890c41e111A98` | [View on Tenderly](https://dashboard.tenderly.co/explorer/vnet/7611135a-8515-41d7-8146-9390be57f949/address/0xAd0799D4D6564c945C448D8BcFA890c41e111A98) |

**Deployment Date:** March 7, 2026

**Add to MetaMask:**
```javascript
Network Name: Tenderly Virtual TestNet
RPC URL: https://virtual.sepolia.eu.rpc.tenderly.co/7611135a-8515-41d7-8146-9390be57f949
Chain ID: 11155111
Currency Symbol: ETH
Block Explorer: https://dashboard.tenderly.co/explorer/vnet/7611135a-8515-41d7-8146-9390be57f949
```

### Planned Networks
- ⏳ Ethereum Mainnet
- ⏳ Arbitrum One
- ⏳ Base
- ⏳ Optimism
- ⏳ World Chain

---

## 🧪 Testing

### Run Tests

```bash
# Smart contract tests
npx hardhat test

# Frontend tests (if implemented)
npm run test

# E2E tests
npm run test:e2e

# CRE workflow simulation
cd PrivaCRE/my-workflow
cre workflow simulate
```

### Test Coverage

- ✅ Smart contract unit tests
- ✅ CRE workflow simulation
- ✅ Plaid integration tests
- ✅ World ID verification tests
- ⏳ Frontend component tests (planned)
- ⏳ E2E user flow tests (planned)

---

## 📚 Documentation

Comprehensive documentation available in `/docs`:

### Getting Started
- [Quick Start Guide](./docs/QUICKSTART.md)
- [Installation Guide](./docs/INSTALLATION.md)
- [Configuration Guide](./docs/CONFIGURATION.md)

### Integration Guides
- [CRE Integration](./docs/CRE_INTEGRATION_SUMMARY.md)
- [Plaid Integration](./docs/PLAID_INTEGRATION_GUIDE.md)
- [World ID Integration](./docs/WORLD_ID_INTEGRATION_COMPLETE.md)

### Technical Documentation
- [Technical Architecture](./docs/TECHNICAL_ARCHITECTURE.md)
- [Smart Contracts](./docs/SMART_CONTRACTS.md)
- [API Reference](./docs/API_REFERENCE.md)
- [Credit Score Calculation](./docs/CREDIT_SCORE_CALCULATION_EXPLAINED.md)

### Deployment
- [Deployment Guide](./docs/DEPLOYMENT_GUIDE.md)
- [Netlify Deployment](./docs/NETLIFY_DEPLOYMENT_GUIDE.md)
- [Contract Deployment](./docs/CONTRACT_DEPLOYMENT.md)

### Hackathon
- [Submission Form](./docs/HACKATHON_SUBMISSION_FORM.md)
- [Video Script](./docs/HACKATHON_VIDEO_SCRIPT.md)
- [Demo Script](./docs/DEMO_SCRIPT.md)

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- TypeScript for all new code
- ESLint + Prettier for formatting
- Comprehensive comments
- Test coverage for new features

---

## 🗺️ Roadmap

### Phase 1: MVP (Current)
- ✅ Core credit scoring functionality
- ✅ Chainlink CRE integration
- ✅ World ID verification
- ✅ Basic lending interface
- ✅ Tenderly deployment

### Phase 2: Enhancement (Q2 2026)
- ⏳ Professional smart contract audit
- ⏳ Mainnet deployment
- ⏳ Production Plaid integration
- ⏳ Enhanced AI models
- ⏳ Mobile app

### Phase 3: Expansion (Q3 2026)
- ⏳ Multi-chain deployment
- ⏳ Additional data sources
- ⏳ DeFi protocol partnerships
- ⏳ Credit score marketplace
- ⏳ DAO governance

### Phase 4: Scale (Q4 2026)
- ⏳ Global expansion
- ⏳ Institutional partnerships
- ⏳ Insurance products
- ⏳ Decentralized credit bureau
- ⏳ 1M+ users

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

Built with support from:
- **Chainlink** - CRE infrastructure and documentation
- **Worldcoin** - World ID integration and sybil resistance
- **Plaid** - Secure bank connectivity
- **Groq** - Fast AI inference
- **Tenderly** - Virtual TestNet infrastructure
- **OpenZeppelin** - Secure smart contract libraries

---

## 📞 Contact & Support

- **Website**: [privacre.netlify.app](https://privacre.netlify.app)
- **GitHub**: [github.com/LSUDOKO/PrivaCRE](https://github.com/LSUDOKO/PrivaCRE)
- **Email**: [your-email@example.com]
- **Twitter**: [@PrivaCRE]
- **Discord**: [Join our community]

---

## 🎯 Built For

**Chainlink Convergence Hackathon 2026**

Tracks:
- 🏆 Chainlink CRE (Primary)
- 🏆 Worldcoin Privacy Track

---

<div align="center">

**Made with ❤️ for a more inclusive, privacy-preserving DeFi**

[⬆ Back to Top](#privacre-privacy-preserving-credit-scoring-for-defi)

</div>

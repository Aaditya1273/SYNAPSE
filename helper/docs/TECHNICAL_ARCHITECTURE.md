# PrivaCRE Technical Architecture

## 🏗️ System Overview

PrivaCRE is a privacy-preserving credit scoring system for DeFi lending, built on Chainlink Runtime Environment (CRE).

### Core Components
1. **Frontend**: Next.js 15 + React 19 + TypeScript
2. **CRE Workflow**: Chainlink DON execution environment
3. **Smart Contracts**: Solidity 0.8.20 on Tenderly Sepolia
4. **External APIs**: Plaid (bank data) + Groq (AI) + World ID (identity)

---

## 📊 Architecture Layers

### Layer 1: User Interface
```
┌─────────────────────────────────────────┐
│  Next.js Frontend (Port 3000)          │
│  - React 19 components                 │
│  - TypeScript strict mode              │
│  - Tailwind CSS + Framer Motion        │
│  - RainbowKit wallet connection        │
│  - World ID verification widget        │
│  - Plaid Link integration              │
└─────────────────────────────────────────┘
```

**Key Files**:
- `src/app/auth/page.tsx` - Authentication
- `src/app/bridge/page.tsx` - Bank connection
- `src/app/orchestration/page.tsx` - CRE pipeline
- `src/app/dashboard/page.tsx` - Credit score
- `src/app/lending/page.tsx` - Loan interface

### Layer 2: API Routes (Backend)
```
┌─────────────────────────────────────────┐
│  Next.js API Routes                     │
│  - /api/plaid/create-link-token        │
│  - /api/plaid/exchange                 │
│  - /api/worldid/verify                 │
│  - /api/cre (workflow trigger)         │
└─────────────────────────────────────────┘
```

**Security**:
- API keys in environment variables
- Server-side only execution
- CORS protection
- Rate limiting

### Layer 3: CRE Workflow (Privacy Layer)
```
┌─────────────────────────────────────────┐
│  Chainlink DON (Decentralized Oracle)  │
│                                         │
│  Phase 1: Confidential HTTP            │
│  ├─ runtime.getSecret()                │
│  ├─ Fetch Plaid data                   │
│  └─ Encrypted in transit               │
│                                         │
│  Phase 2: PII Sanitization             │
│  ├─ WASM sandbox execution             │
│  ├─ Remove personal data               │
│  └─ Extract financial features         │
│                                         │
│  Phase 3: AI Risk Analysis             │
│  ├─ Confidential HTTP to Groq          │
│  ├─ Llama 3.3 70B inference            │
│  └─ Calculate credit score             │
│                                         │
│  Phase 4: On-Chain Settlement          │
│  ├─ ABI encode score data              │
│  ├─ Multi-sig consensus                │
│  └─ Submit to smart contract           │
└─────────────────────────────────────────┘
```

**Key Files**:
- `PrivaCRE/my-workflow/main.ts` - Standard workflow
- `PrivaCRE/my-workflow/main-confidential.ts` - Privacy-enhanced
- `PrivaCRE/my-workflow/workflow.yaml` - CRE config
- `PrivaCRE/project.yaml` - DON settings

### Layer 4: Smart Contracts
```
┌─────────────────────────────────────────┐
│  Tenderly Virtual Sepolia               │
│                                         │
│  CrestVault (0x49Bd...8877)            │
│  ├─ Credit-gated lending               │
│  ├─ Dynamic collateral ratios          │
│  ├─ Chainlink Price Feed               │
│  └─ Loan management                    │
│                                         │
│  PrivateVault                          │
│  ├─ Commitment-based storage           │
│  ├─ Encrypted scores                   │
│  └─ Zero-knowledge proofs              │
│                                         │
│  MockUSDC (0x5432...5FE3)              │
│  └─ Test stablecoin                    │
└─────────────────────────────────────────┘
```

**Key Files**:
- `contracts/CrestVault.sol` - Main vault
- `contracts/PrivateVault.sol` - Privacy features
- `contracts/MockUSDC.sol` - Stablecoin
- `contracts/MockPriceFeed.sol` - Price oracle

---

## 🔄 Data Flow Architecture

### Complete Request Flow
```
1. USER ACTION
   └─> Click "Get Credit Score"

2. FRONTEND
   └─> POST /api/cre
       Body: { userAddress: "0x..." }

3. API ROUTE
   └─> Trigger CRE workflow
       └─> Call simulateWorkflow()

4. CRE WORKFLOW
   ├─> Phase 1: Fetch Bank Data
   │   ├─ getSecret('PLAID_SECRET')
   │   ├─ HTTP POST to Plaid API
   │   └─ Return: 24 transactions
   │
   ├─> Phase 2: Sanitize PII
   │   ├─ extractFeatures()
   │   └─ Return: { avgBalance, income, ... }
   │
   ├─> Phase 3: AI Analysis
   │   ├─ getSecret('AI_API_KEY')
   │   ├─ HTTP POST to Groq API
   │   └─ Return: { score: 76, ... }
   │
   └─> Phase 4: On-Chain Write
       ├─ encodeFunctionData()
       ├─ runtime.report() (sign)
       └─ evmClient.writeReport()

5. SMART CONTRACT
   └─> CrestVault.receiveScore()
       ├─ Decode parameters
       ├─ Store: creditScores[user] = 76
       └─ Emit: ScoreUpdated(user, 76)

6. RESPONSE
   └─> Return to frontend
       └─> Display score + TX hash
```

---


## 🔐 Security Architecture

### Secret Management
```
┌─────────────────────────────────────────┐
│  Development (.env)                     │
│  - PLAID_CLIENT_ID                     │
│  - PLAID_SECRET                        │
│  - GROQ_API_KEY                        │
│  - PRIVATE_KEY                         │
│  - RPC_URL_SEPOLIA                     │
└─────────────────────────────────────────┘
         ↓ (never committed)
┌─────────────────────────────────────────┐
│  CRE Secrets Manager (Production)      │
│  - Encrypted at rest                   │
│  - Retrieved via runtime.getSecret()   │
│  - Never logged or exposed             │
│  - Isolated per DON node               │
└─────────────────────────────────────────┘
```

### Privacy Guarantees

**What's Private**:
- ❌ Bank account numbers
- ❌ Transaction details
- ❌ Merchant names
- ❌ Personal information (names, addresses, SSNs)
- ❌ API keys
- ❌ Raw credit scores (in confidential mode)

**What's Public**:
- ✅ Score commitment (hash)
- ✅ Loan tier (Prime/Standard)
- ✅ Collateral ratio
- ✅ World ID nullifier hash
- ✅ Timestamp
- ✅ Transaction hashes

### Encryption Layers

**Layer 1: Transport (TLS 1.3)**
```
Frontend ←→ API Routes ←→ External APIs
   ↓           ↓              ↓
 HTTPS       HTTPS          HTTPS
```

**Layer 2: Storage (AES-256-GCM)**
```typescript
const encryptData = (data: string, key: Buffer) => {
  const iv = randomBytes(16);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const tag = cipher.getAuthTag();
  return { encrypted, iv, tag };
};
```

**Layer 3: Commitments (Keccak256)**
```typescript
const createCommitment = (data: string, salt: string) => {
  return keccak256(toBytes(data + salt));
};
```

---

## 🧩 Component Architecture

### Frontend Components

**Authentication Flow**:
```
AuthPage
├─ WalletConnect (RainbowKit)
│  └─ ConnectButton
└─ WorldIDVerification
   ├─ IDKitWidget
   └─ VerificationStatus
```

**Bank Connection Flow**:
```
BridgePage
├─ PlaidLinkButton
│  └─ usePlaidLink hook
├─ ConnectionStatus
└─ AccountList
```

**CRE Orchestration Flow**:
```
OrchestrationPage
├─ WorkflowTrigger
├─ PipelineVisualization
│  ├─ Phase1Status (Fetch)
│  ├─ Phase2Status (Sanitize)
│  ├─ Phase3Status (AI)
│  └─ Phase4Status (On-Chain)
└─ ResultsDisplay
```

**Dashboard Flow**:
```
DashboardPage
├─ CreditScoreGauge
├─ TierBadge
├─ AvailableCredit
└─ LoanHistory
```

**Lending Flow**:
```
LendingPage
├─ LoanRequestForm
├─ CollateralCalculator
├─ ActiveLoans
└─ RepaymentInterface
```

### Backend Components

**API Routes**:
```
/api/plaid/create-link-token
├─ Validate request
├─ Call Plaid API
└─ Return link_token

/api/plaid/exchange
├─ Exchange public_token
├─ Store access_token
└─ Trigger CRE workflow

/api/worldid/verify
├─ Verify proof
├─ Check nullifier
└─ Store verification

/api/cre
├─ Load user data
├─ Execute simulateWorkflow()
├─ Submit to contract
└─ Return results
```

### CRE Workflow Components

**Main Workflow**:
```typescript
main.ts
├─ initWorkflow()
│  └─ CronCapability
├─ onCronTrigger()
│  └─ processCreditScore()
│     ├─ fetchPlaidTransactions()
│     ├─ extractFeatures()
│     ├─ analyzeCreditRisk()
│     └─ writeScoreOnChain()
└─ Runner.run()
```

**Confidential Workflow**:
```typescript
main-confidential.ts
├─ All from main.ts
├─ encryptData()
├─ createCommitment()
├─ generateZKProof()
└─ writePrivateScoreOnChain()
```

---

## 📦 Data Models

### User Model
```typescript
interface User {
  address: string;              // Ethereum address
  worldIdNullifier: string;     // World ID hash
  plaidAccessToken?: string;    // Encrypted
  creditScore?: number;         // 1-100
  creditTier?: 'prime' | 'standard' | 'insufficient';
  lastUpdated?: number;         // Timestamp
}
```

### Credit Score Model
```typescript
interface CreditScore {
  user: string;                 // User address
  score: number;                // 1-100
  timestamp: number;            // Unix timestamp
  worldIdHash: string;          // Nullifier hash
  justification: string;        // AI explanation
  commitment?: string;          // For privacy mode
  encryptedData?: string;       // For privacy mode
}
```

### Loan Model
```typescript
interface Loan {
  loanId: number;
  borrower: string;
  principal: bigint;            // USDC amount
  collateral: bigint;           // ETH amount
  interestRate: number;         // APR (basis points)
  startTime: number;
  duration: number;             // Seconds
  repaid: boolean;
}
```

### Transaction Model (Plaid)
```typescript
interface PlaidTransaction {
  transaction_id: string;
  account_id: string;
  amount: number;
  date: string;
  category: string[];
  merchant_name?: string;
  // PII fields removed before AI
}
```

### Sanitized Features Model
```typescript
interface SanitizedFeatures {
  averageBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  debtToIncome: number;
  transactionCount: number;
  spendingVolatility: number;
  accountAge: number;
  // NO PII included
}
```

### AI Analysis Model
```typescript
interface CreditAnalysis {
  score: number;                // 1-100
  debtToIncomeRatio: number;    // Percentage
  paymentConsistency: number;   // 0-100
  balanceStability: number;     // 0-100
  spendingVolatility: number;   // 0-100
  recommendation: string;       // Text explanation
}
```

---

## 🔌 External Integrations

### Plaid API
```
Endpoint: https://sandbox.plaid.com
Authentication: Basic (client_id + secret)

Used Endpoints:
- POST /link/token/create
  → Create link token for frontend

- POST /item/public_token/exchange
  → Exchange public token for access token

- POST /transactions/sync
  → Fetch transaction history
```

**Data Flow**:
```
User → Plaid Link Widget → Public Token
     → Backend API → Exchange → Access Token
     → CRE Workflow → Fetch Transactions
```

### Groq API
```
Endpoint: https://api.groq.com/openai/v1/chat/completions
Authentication: Bearer token
Model: llama-3.3-70b-versatile

Request Format:
{
  "model": "llama-3.3-70b-versatile",
  "messages": [
    { "role": "system", "content": "You are a credit analyst..." },
    { "role": "user", "content": "Analyze: ..." }
  ],
  "temperature": 0.3,
  "response_format": { "type": "json_object" }
}
```

**Data Flow**:
```
CRE Workflow → Sanitized Features
            → Groq API → AI Analysis
            → Credit Score
```

### World ID
```
SDK: @worldcoin/idkit
Verification Level: Orb (highest security)
App ID: app_7141eab28d3662245856d528b69d89e4

Integration:
- Frontend: IDKitWidget component
- Backend: Verify proof + nullifier
- Contract: Store nullifier hash
```

**Data Flow**:
```
User → World ID App → Scan QR/Orb
     → Generate Proof → Frontend
     → Backend Verify → Store Nullifier
```

### Chainlink Price Feed
```
Contract: AggregatorV3Interface
Address: 0xb8d323B1F3524d2e634B9Fa2537425AD39712140
Pair: ETH/USD
Network: Tenderly Sepolia

Usage:
function getLatestPrice() public view returns (uint256) {
  (, int256 price, , uint256 updatedAt, ) = priceFeed.latestRoundData();
  require(price > 0, "Invalid price");
  require(updatedAt > block.timestamp - 365 days, "Stale price");
  return uint256(price);
}
```

---

## 🧪 Testing Architecture

### Unit Tests
```
contracts/test/
├─ CrestVault.test.js
│  ├─ Score updates
│  ├─ Loan requests
│  ├─ Collateral calculations
│  └─ Repayments
│
└─ PrivateVault.test.js
   ├─ Commitment storage
   ├─ Encrypted scores
   └─ ZK proof verification
```

### Integration Tests
```
scripts/
├─ test-plaid-setup.js
│  └─ Test Plaid API connection
│
├─ test-worldid-setup.js
│  └─ Test World ID verification
│
└─ test-borrow.js
   └─ Test complete loan flow
```

### End-to-End Tests
```
test-e2e.sh
├─ Deploy contracts
├─ Fund vault
├─ Run CRE simulation
├─ Update score
├─ Request loan
├─ Verify collateral
├─ Issue loan
└─ Repay loan
```

### CRE Simulation
```
npm run simulate
├─ Load environment
├─ Mock Plaid data
├─ Call Groq AI (real)
├─ Calculate score
└─ Save results
```

---

## 📊 Performance Optimization

### Frontend Optimization
- Code splitting with Next.js dynamic imports
- Image optimization with next/image
- CSS-in-JS with Tailwind (JIT compilation)
- React 19 concurrent features
- Framer Motion GPU acceleration

### Backend Optimization
- API route caching
- Database connection pooling (if added)
- Lazy loading of heavy dependencies
- Streaming responses for large data

### Smart Contract Optimization
- Gas-optimized storage patterns
- Batch operations where possible
- Event emissions instead of storage reads
- Minimal on-chain computation

### CRE Workflow Optimization
- Parallel HTTP requests where possible
- Efficient data serialization
- Minimal consensus rounds
- Optimized ABI encoding

---

## 🔄 Deployment Architecture

### Development
```
Local Machine
├─ Frontend: localhost:3000
├─ Hardhat: localhost:8545
└─ CRE: Local simulation
```

### Staging
```
Tenderly Virtual Testnet
├─ Frontend: Vercel preview
├─ Contracts: Tenderly Sepolia
└─ CRE: Staging DON
```

### Production
```
Mainnet (Future)
├─ Frontend: Vercel production
├─ Contracts: Ethereum/Arbitrum
└─ CRE: Production DON
```

---

## 📈 Scalability Considerations

### Current Limits
- CRE execution: ~5-8 seconds per user
- Plaid API: 100 requests/minute
- Groq API: 30 requests/minute
- Smart contract: ~80k gas per score update

### Scaling Strategies
1. **Batch Processing**: Update multiple scores in one transaction
2. **Caching**: Cache scores for 24 hours
3. **Rate Limiting**: Queue requests during high load
4. **Sharding**: Multiple CRE workflows for different user segments
5. **L2 Deployment**: Use Arbitrum/Optimism for lower gas costs

---

## 🔮 Future Enhancements

### Phase 2 (Post-Hackathon)
- Real Chainlink DON deployment
- Production Plaid environment
- Multi-chain support (Arbitrum, Base, Polygon)
- Credit score history tracking
- Loan refinancing

### Phase 3 (Production)
- Decentralized governance
- Liquidity pools for lenders
- Credit default swaps
- Insurance integration
- Mobile app

---

**Architecture Version**: 1.0.0  
**Last Updated**: March 7, 2026  
**Hackathon**: Chainlink Convergence 2025 - Privacy Track

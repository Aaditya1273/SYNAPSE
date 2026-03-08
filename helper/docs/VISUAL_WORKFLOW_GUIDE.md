# PrivaCRE Visual Workflow Guide for Excalidraw

## 🎨 How to Create This in Excalidraw

Visit [excalidraw.com](https://excalidraw.com) and follow these step-by-step instructions.

---

## 📊 DIAGRAM 1: Complete System Architecture

### Elements to Draw:

**1. USER LAYER (Top)**
- Rectangle: "User Browser"
- Inside: "Next.js Frontend"
- Components: RainbowKit, World ID, Plaid Link

**2. API LAYER (Middle-Top)**
- Rectangle: "Backend API Routes"
- Endpoints: /api/plaid, /api/worldid, /api/cre

**3. CRE WORKFLOW (Middle)**
- Large rounded rectangle: "Chainlink CRE DON"
- 4 boxes inside:
  - Phase 1: Confidential HTTP
  - Phase 2: PII Sanitization
  - Phase 3: AI Analysis
  - Phase 4: On-Chain Write

**4. EXTERNAL SERVICES (Sides)**
- Left: Plaid API (bank icon)
- Right: Groq AI (brain icon)
- Top-Right: World ID (globe icon)

**5. BLOCKCHAIN LAYER (Bottom)**
- Rectangle: "Tenderly Sepolia"
- Contracts: CrestVault, PrivateVault, MockUSDC

### Arrows to Draw:
- User → API (HTTP)
- API → CRE (Trigger)
- CRE → Plaid (Confidential HTTP)
- CRE → Groq (Confidential HTTP)
- CRE → Blockchain (Signed Transaction)

---


## 📊 DIAGRAM 2: User Journey Flow (Step-by-Step)

### Step 1: Authentication
```
[User] → [Connect Wallet Button]
         ↓
    [RainbowKit Modal]
         ↓
    [Wallet Connected ✓]
```

### Step 2: Identity Verification
```
[User] → [Verify with World ID Button]
         ↓
    [World ID Widget]
         ↓
    [Scan QR Code / Orb Verification]
         ↓
    [Nullifier Hash Generated ✓]
```

### Step 3: Bank Connection
```
[User] → [Connect Bank Button]
         ↓
    [Plaid Link Widget Opens]
         ↓
    [Select Bank (e.g., Chase)]
         ↓
    [Enter Credentials]
         ↓
    [Select Accounts]
         ↓
    [Access Token Stored ✓]
```

### Step 4: Credit Score Generation
```
[User] → [Get Credit Score Button]
         ↓
    [Trigger CRE Workflow]
         ↓
    [Show Real-Time Pipeline]
         ↓
    [Display Score: 76/100 ✓]
```

### Step 5: Loan Request
```
[User] → [Request Loan]
         ↓
    [Enter Amount: $5,000]
         ↓
    [Check Credit Score]
         ↓
    [Calculate Collateral: 110%]
         ↓
    [Deposit ETH Collateral]
         ↓
    [Receive USDC Loan ✓]
```

---

## 📊 DIAGRAM 3: CRE Workflow Deep Dive

### Phase 1: Confidential HTTP (Fetch Bank Data)
```
┌─────────────────────────────────────────┐
│  CRE DON Node (Secure Enclave)         │
│                                         │
│  1. runtime.getSecret('PLAID_SECRET')  │
│     ↓                                   │
│  2. HTTP POST to Plaid API             │
│     URL: /transactions/sync            │
│     Headers: { Authorization: ... }    │
│     ↓                                   │
│  3. Receive Response                   │
│     - 24 transactions                  │
│     - Account balances                 │
│     - Transaction categories           │
│     ↓                                   │
│  4. Store in Memory (Never Logged)    │
└─────────────────────────────────────────┘
```

**Key Privacy Features:**
- ✅ API keys never leave DON
- ✅ Data encrypted in transit
- ✅ No logs of sensitive data

---

## 📊 DIAGRAM 4: Data Sanitization Process

### Before Sanitization (Raw Plaid Data)
```
{
  "account_id": "BxBXxLj1m4HMXBm9WZZmCWVbPjX16EHwv99vp",
  "account_owner_name": "John Doe",
  "account_number": "****1234",
  "routing_number": "011401533",
  "transactions": [
    {
      "transaction_id": "yhnRE4KGN5t9...",
      "merchant_name": "Starbucks",
      "amount": 5.47,
      "date": "2026-03-01",
      "category": ["Food and Drink", "Restaurants"]
    }
  ]
}
```

### After Sanitization (Features Only)
```
{
  "averageBalance": 2847.32,
  "monthlyIncome": 4200.00,
  "monthlyExpenses": 2850.00,
  "debtToIncome": 0.68,
  "transactionCount": 24,
  "spendingVolatility": 127.45,
  "accountAge": 12
}
```

**What's Removed:**
- ❌ Names
- ❌ Account numbers
- ❌ Addresses
- ❌ SSNs
- ❌ Merchant names
- ❌ Transaction IDs

**What's Kept:**
- ✅ Amounts (aggregated)
- ✅ Dates
- ✅ Categories
- ✅ Calculated metrics

---


## 📊 DIAGRAM 5: AI Risk Analysis Flow

### Input to Groq AI
```
┌─────────────────────────────────────────┐
│  Sanitized Financial Features          │
├─────────────────────────────────────────┤
│  Average Balance:      $2,847.32       │
│  Monthly Income:       $4,200.00       │
│  Monthly Expenses:     $2,850.00       │
│  Debt-to-Income:       68%             │
│  Transaction Count:    24              │
│  Spending Volatility:  $127.45         │
│  Account Age:          12 months       │
└─────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────┐
│  Groq AI (Llama 3.3 70B)               │
│                                         │
│  Prompt: "Analyze creditworthiness"    │
│  Model: llama-3.3-70b-versatile        │
│  Temperature: 0.3 (deterministic)      │
└─────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────┐
│  AI Analysis Output                     │
├─────────────────────────────────────────┤
│  credit_score: 76                      │
│  debtToIncomeRatio: 68%                │
│  paymentConsistency: 82                │
│  balanceStability: 71                  │
│  spendingVolatility: 65                │
│  recommendation: "Moderate risk..."    │
└─────────────────────────────────────────┘
```

### Scoring Weights
```
┌──────────────────────────────┐
│  Debt-to-Income Ratio: 40%  │
│  Payment Consistency:  30%  │
│  Balance Stability:    20%  │
│  Spending Volatility:  10%  │
└──────────────────────────────┘
```

---

## 📊 DIAGRAM 6: On-Chain Settlement

### Standard Mode (CrestVault)
```
┌─────────────────────────────────────────┐
│  CRE DON Consensus                      │
│                                         │
│  1. Encode Score Data                  │
│     - User Address                     │
│     - Credit Score: 76                 │
│     - Timestamp                        │
│     - World ID Hash                    │
│     - Justification                    │
│     ↓                                   │
│  2. Sign with DON Private Key          │
│     (Multi-signature consensus)        │
│     ↓                                   │
│  3. Submit Transaction                 │
│     To: CrestVault                     │
│     Function: receiveScore()           │
│     Gas: 80,000                        │
└─────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────┐
│  CrestVault Smart Contract              │
│                                         │
│  function receiveScore(bytes data) {   │
│    (address user,                      │
│     uint256 score,                     │
│     uint256 timestamp,                 │
│     bytes32 worldIdHash,               │
│     string justification) = decode()   │
│                                         │
│    creditScores[user] = score;         │
│    emit ScoreUpdated(user, score);     │
│  }                                      │
└─────────────────────────────────────────┘
```

### Confidential Mode (PrivateVault)
```
┌─────────────────────────────────────────┐
│  CRE DON (Privacy Enhanced)             │
│                                         │
│  1. Create Commitment                  │
│     hash(score + salt)                 │
│     ↓                                   │
│  2. Encrypt Score                      │
│     AES-256-GCM encryption             │
│     ↓                                   │
│  3. Generate ZK Proof                  │
│     Prove score > threshold            │
│     ↓                                   │
│  4. Submit to PrivateVault             │
│     - Commitment (public)              │
│     - Encrypted score (private)        │
│     - ZK proof (verifiable)            │
└─────────────────────────────────────────┘
```

---


## 📊 DIAGRAM 7: Lending Flow

### Loan Request Process
```
[User Requests Loan]
         ↓
┌─────────────────────────────────────────┐
│  Step 1: Check Credit Score            │
│  creditScores[user] = 76               │
└─────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────┐
│  Step 2: Determine Tier                │
│  Score 76 → Standard Tier              │
│  Collateral Required: 150%             │
└─────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────┐
│  Step 3: Calculate Collateral          │
│  Loan Amount: $5,000 USDC              │
│  ETH Price: $2,500 (Chainlink)         │
│  Required ETH: 3.0 ETH                 │
└─────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────┐
│  Step 4: User Deposits Collateral      │
│  User sends 3.0 ETH to CrestVault      │
└─────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────┐
│  Step 5: Issue Loan                    │
│  Transfer 5,000 USDC to user           │
│  Record loan in contract               │
│  Start interest accrual (6.8% APR)     │
└─────────────────────────────────────────┘
```

### Loan Tiers
```
┌──────────────────────────────────────────────┐
│  PRIME TIER (Score 80-100)                  │
│  - Collateral: 110%                         │
│  - APR: 4.5%                                │
│  - Max Loan: $15,000                        │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│  STANDARD TIER (Score 50-79)                │
│  - Collateral: 150%                         │
│  - APR: 6.8%                                │
│  - Max Loan: $10,000                        │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│  INSUFFICIENT (Score < 50)                  │
│  - Not Eligible                             │
└──────────────────────────────────────────────┘
```

---

## 📊 DIAGRAM 8: Real-Time Orchestration UI

### Pipeline Visualization
```
┌─────────────────────────────────────────────────────┐
│  CRE Workflow Orchestration                         │
├─────────────────────────────────────────────────────┤
│                                                     │
│  [●●●●●●●●●●] Phase 1: Fetch Bank Data             │
│  Status: ✓ Complete                                │
│  Duration: 1.2s                                     │
│  Data: 24 transactions fetched                     │
│                                                     │
│  [●●●●●●●●●●] Phase 2: Sanitize PII                │
│  Status: ✓ Complete                                │
│  Duration: 0.3s                                     │
│  Removed: Names, accounts, addresses               │
│                                                     │
│  [●●●●●●●●●●] Phase 3: AI Risk Analysis            │
│  Status: ✓ Complete                                │
│  Duration: 2.8s                                     │
│  Model: Llama 3.3 70B                              │
│  Score: 76/100                                      │
│                                                     │
│  [●●●●●●○○○○] Phase 4: On-Chain Settlement         │
│  Status: ⏳ In Progress                            │
│  TX: 0xb44f1b2...                                  │
│                                                     │
└─────────────────────────────────────────────────────┘

Total Latency: 4.3s
Consensus Nodes: 3
Privacy: ✓ Guaranteed
```

---


## 📊 DIAGRAM 9: Privacy Guarantees

### Data Privacy Layers
```
┌─────────────────────────────────────────────────────┐
│  Layer 1: Confidential HTTP                         │
│  ✓ API keys stored in CRE Secrets Manager          │
│  ✓ Never exposed to frontend                       │
│  ✓ Encrypted in transit (TLS 1.3)                  │
└─────────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────┐
│  Layer 2: PII Sanitization                          │
│  ✓ Executed in WASM sandbox                        │
│  ✓ Names, addresses, SSNs removed                  │
│  ✓ Only aggregated metrics retained                │
└─────────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────┐
│  Layer 3: Encrypted Storage                         │
│  ✓ Scores encrypted with AES-256-GCM               │
│  ✓ Commitment-based on-chain storage               │
│  ✓ Zero-knowledge proofs for verification          │
└─────────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────┐
│  Layer 4: Sybil Resistance                          │
│  ✓ World ID Orb verification                       │
│  ✓ One human = one score                           │
│  ✓ Nullifier prevents double-spending              │
└─────────────────────────────────────────────────────┘
```

### What's Private vs Public
```
┌──────────────────────────────────────┐
│  PRIVATE (Never On-Chain)            │
├──────────────────────────────────────┤
│  ❌ Bank account numbers             │
│  ❌ Transaction details              │
│  ❌ Merchant names                   │
│  ❌ Personal information             │
│  ❌ API keys                         │
│  ❌ Raw credit score (confidential)  │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│  PUBLIC (On-Chain)                   │
├──────────────────────────────────────┤
│  ✅ Score commitment (hash)          │
│  ✅ Loan tier (Prime/Standard)       │
│  ✅ Collateral ratio                 │
│  ✅ World ID nullifier hash          │
│  ✅ Timestamp                        │
└──────────────────────────────────────┘
```

---

## 📊 DIAGRAM 10: File Structure & Responsibilities

### Frontend Files
```
src/
├── app/
│   ├── auth/page.tsx
│   │   → Wallet connection + World ID
│   │
│   ├── bridge/page.tsx
│   │   → Plaid Link integration
│   │
│   ├── orchestration/page.tsx
│   │   → Real-time CRE pipeline visualization
│   │
│   ├── dashboard/page.tsx
│   │   → Credit score display
│   │
│   ├── lending/page.tsx
│   │   → Loan request/repayment
│   │
│   └── api/
│       ├── plaid/
│       │   ├── create-link-token/route.ts
│       │   └── exchange/route.ts
│       │
│       ├── worldid/verify/route.ts
│       │
│       └── cre/route.ts
│           → Triggers CRE workflow
│
├── hooks/
│   ├── usePlaidLink.ts
│   ├── useWorldID.ts
│   └── useOrchestration.ts
│
└── components/
    ├── WorldIDVerification.tsx
    └── ui/
```

### Backend Files
```
PrivaCRE/my-workflow/
├── main.ts
│   → Standard CRE workflow
│   → Phases 1-4 implementation
│
├── main-confidential.ts
│   → Privacy-enhanced workflow
│   → Encryption + ZK proofs
│
├── workflow.yaml
│   → CRE configuration
│
├── config.staging.json
│   → Plaid sandbox + Groq API
│
└── config.production.json
    → Production settings
```

### Smart Contracts
```
contracts/
├── CrestVault.sol
│   → Main lending vault
│   → Credit-gated loans
│   → Chainlink Price Feed
│
├── PrivateVault.sol
│   → Privacy features
│   → Commitment storage
│   → Encrypted scores
│
├── MockUSDC.sol
│   → Test stablecoin
│
└── MockPriceFeed.sol
    → Chainlink mock
```

---


## 📊 DIAGRAM 11: CRE Workflow Execution Timeline

### Timeline View (5-8 seconds total)
```
0s ─────────────────────────────────────────────────────────────→ 8s

│
├─ 0.0s: User clicks "Get Credit Score"
│         Frontend calls /api/cre
│
├─ 0.2s: CRE Workflow Triggered
│         runtime.getSecret() calls
│
├─ 0.5s: Secrets Retrieved
│         PLAID_SECRET, AI_API_KEY loaded
│
├─ 1.0s: Plaid API Call Started
│         POST /transactions/sync
│
├─ 2.2s: Plaid Data Received ✓
│         24 transactions fetched
│
├─ 2.5s: PII Sanitization Complete ✓
│         Features extracted
│
├─ 3.0s: Groq AI Call Started
│         Llama 3.3 70B analysis
│
├─ 5.8s: AI Analysis Complete ✓
│         Score: 76/100
│
├─ 6.0s: Transaction Encoding
│         ABI encode for receiveScore()
│
├─ 6.5s: DON Consensus Signing
│         Multi-sig approval
│
├─ 7.0s: Transaction Submitted
│         To CrestVault contract
│
└─ 8.0s: Transaction Confirmed ✓
          Score stored on-chain
```

---

## 📊 DIAGRAM 12: Testing & Simulation

### Local Simulation Flow
```
┌─────────────────────────────────────────┐
│  Developer Machine                      │
│                                         │
│  $ npm run simulate                    │
│         ↓                               │
│  scripts/simulate-workflow.js          │
│         ↓                               │
│  1. Load secrets from .env             │
│  2. Mock Plaid API call                │
│  3. Call Groq AI (real)                │
│  4. Calculate credit score             │
│  5. Save to simulation-results.json    │
│         ↓                               │
│  ✓ Score: 76/100                       │
└─────────────────────────────────────────┘
```

### CRE CLI Simulation
```
┌─────────────────────────────────────────┐
│  CRE CLI (Official Chainlink Tool)     │
│                                         │
│  $ cd PrivaCRE/my-workflow             │
│  $ cre workflow simulate \             │
│      --target staging-settings \       │
│      --project-root .. .               │
│         ↓                               │
│  CRE Runtime Environment               │
│  - Loads workflow.yaml                 │
│  - Executes main.ts                    │
│  - Simulates DON consensus             │
│  - Outputs logs                        │
│         ↓                               │
│  ✓ Workflow executed successfully      │
└─────────────────────────────────────────┘
```

### End-to-End Test
```
┌─────────────────────────────────────────┐
│  $ ./test-e2e.sh                       │
│                                         │
│  1. ✓ Deploy contracts                 │
│  2. ✓ Fund vault with USDC             │
│  3. ✓ Run CRE simulation               │
│  4. ✓ Update score on-chain            │
│  5. ✓ Request loan                     │
│  6. ✓ Verify collateral                │
│  7. ✓ Issue loan                       │
│  8. ✓ Repay loan                       │
│                                         │
│  All tests passed! ✓                   │
└─────────────────────────────────────────┘
```

---

## 🎯 Quick Commands Reference

### Setup Commands
```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your API keys

# Install CRE workflow dependencies
cd PrivaCRE/my-workflow && npm install
```

### Development Commands
```bash
# Run frontend
npm run dev

# Compile contracts
npm run compile

# Deploy contracts
npm run deploy:tenderly

# Run CRE simulation
npm run simulate
```

### Testing Commands
```bash
# Test CRE workflow
./scripts/run-cre-workflow.sh

# Test Plaid integration
node test-plaid-setup.js

# Test World ID
node test-worldid-setup.js

# End-to-end test
./test-e2e.sh
```

---

## 🔑 Key Concepts Summary

### 1. Chainlink CRE (Runtime Environment)
- **What**: Secure execution environment for off-chain computation
- **Why**: Enables confidential HTTP and private data processing
- **How**: WASM sandbox + DON consensus + encrypted secrets

### 2. Confidential HTTP
- **What**: HTTP requests with encrypted credentials
- **Why**: Fetch private data without exposing API keys
- **How**: `runtime.getSecret()` + `sendRequest()`

### 3. PII Sanitization
- **What**: Removing personal identifiable information
- **Why**: Privacy compliance + minimize data exposure
- **How**: Extract only aggregated financial metrics

### 4. AI Risk Analysis
- **What**: Machine learning credit assessment
- **Why**: Objective, data-driven scoring
- **How**: Groq Llama 3.3 70B with financial prompt

### 5. Zero-Knowledge Proofs
- **What**: Prove eligibility without revealing data
- **Why**: Maximum privacy on public blockchain
- **How**: Commitments + encrypted storage + ZK proofs

### 6. World ID Integration
- **What**: Biometric identity verification
- **Why**: Sybil resistance (one human = one score)
- **How**: Orb scan → nullifier hash → on-chain mapping

---

## 📈 Performance Metrics

```
┌──────────────────────────────────────────┐
│  Metric              Value               │
├──────────────────────────────────────────┤
│  CRE Execution       5-8 seconds         │
│  Plaid API Call      1.2 seconds         │
│  AI Analysis         2.8 seconds         │
│  On-Chain Write      1.5 seconds         │
│  Total User Flow     10-15 seconds       │
│                                          │
│  Gas Cost (Score)    ~80,000 gas        │
│  Gas Cost (Loan)     ~120,000 gas       │
│  Data Transfer       ~2.4 KB            │
│  API Calls           2 (Plaid + Groq)   │
└──────────────────────────────────────────┘
```

---

## 🎨 Excalidraw Drawing Tips

### Colors to Use:
- **Blue (#375BD2)**: Chainlink components
- **Green (#00D09C)**: Plaid/bank data
- **Purple (#7C3AED)**: Privacy features
- **Orange (#F55036)**: AI/Groq
- **Black (#000000)**: World ID
- **Gray (#6B7280)**: Smart contracts

### Shapes to Use:
- **Rectangles**: Components, services
- **Rounded Rectangles**: Processes, workflows
- **Circles**: Start/end points
- **Diamonds**: Decision points
- **Arrows**: Data flow
- **Dashed Lines**: Optional/conditional flows

### Layout Tips:
- Top-to-bottom for sequential flows
- Left-to-right for parallel processes
- Group related components with containers
- Use consistent spacing (50px between elements)
- Add icons for visual clarity

---

## 📚 Additional Resources

- **CRE Documentation**: https://docs.chain.link/chainlink-runtime-environment
- **Plaid API Docs**: https://plaid.com/docs/
- **World ID Docs**: https://docs.worldcoin.org/
- **Groq API Docs**: https://console.groq.com/docs
- **Project README**: See README.md in root directory

---

**Created for PrivaCRE - Chainlink Convergence Hackathon 2025**

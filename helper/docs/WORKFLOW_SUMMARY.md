# PrivaCRE Workflow Summary - Quick Reference

## 🚀 Complete User Flow (5 Steps)

### Step 1: Connect Wallet
- User clicks "Connect Wallet"
- RainbowKit modal opens
- User selects wallet (MetaMask, Coinbase, etc.)
- Wallet connected ✓

### Step 2: Verify Identity (World ID)
- User clicks "Verify with World ID"
- Scans QR code or uses Orb verification
- Nullifier hash generated
- Identity verified ✓

### Step 3: Link Bank Account (Plaid)
- User clicks "Connect Bank"
- Plaid Link widget opens
- User selects bank and logs in
- Access token stored securely ✓

### Step 4: Get Credit Score (CRE Workflow)
- User clicks "Get Credit Score"
- **Phase 1**: Fetch bank data via Confidential HTTP (1.2s)
- **Phase 2**: Sanitize PII - remove names, addresses (0.3s)
- **Phase 3**: AI analyzes with Groq Llama 3.3 (2.8s)
- **Phase 4**: Write score on-chain (1.5s)
- Score displayed: 76/100 ✓

### Step 5: Request Loan
- User enters loan amount ($5,000)
- System checks credit score (76)
- Calculates collateral: 150% = 3.0 ETH
- User deposits ETH
- Receives USDC loan ✓

---

## 🔐 How CRE Works in This Project

### What is CRE?
Chainlink Runtime Environment - a secure execution environment for off-chain computation with on-chain verification.

### Why We Use CRE?
1. **Confidential HTTP**: Fetch private bank data without exposing API keys
2. **Secure Computation**: Process sensitive data in isolated environment
3. **Consensus**: Multiple DON nodes verify results
4. **Privacy**: Keep PII off-chain, only store aggregated scores

### CRE Workflow Phases

**Phase 1: Confidential HTTP (Fetch Data)**
```typescript
// Secrets never exposed
const plaidSecret = await runtime.getSecret({ id: 'PLAID_SECRET' }).result();

// Make confidential HTTP request
const bankData = httpClient.sendRequest(runtime, 
  (sendRequester) => fetchPlaidTransactions(sendRequester, plaidSecret)
).result();
```

**Phase 2: PII Sanitization**
```typescript
// Remove all personal information
const features = extractFeatures(accounts, transactions);
// Returns: { averageBalance, monthlyIncome, debtToIncome, ... }
// Excludes: names, addresses, account numbers
```

**Phase 3: AI Risk Analysis**
```typescript
// Send sanitized data to Groq AI
const aiKey = await runtime.getSecret({ id: 'AI_API_KEY' }).result();
const creditAnalysis = httpClient.sendRequest(runtime,
  (sendRequester) => analyzeCreditRisk(sendRequester, aiKey, features)
).result();
// Returns: { score: 76, recommendation: "..." }
```

**Phase 4: On-Chain Settlement**
```typescript
// Encode and sign with DON consensus
const callData = encodeFunctionData({
  abi: CrestVaultABI,
  functionName: 'receiveScore',
  args: [userAddress, score, timestamp, worldIdHash, justification]
});

// Submit to blockchain
const tx = evmClient.writeReport(runtime, {
  receiver: contractAddress,
  report: signedReport,
  gasConfig: { gasLimit: '80000' }
}).result();
```

---

## 📊 Data Flow Diagram (Text)

```
USER
  ↓ (connects wallet)
RAINBOWKIT
  ↓ (verifies identity)
WORLD ID
  ↓ (links bank)
PLAID LINK
  ↓ (triggers workflow)
FRONTEND API (/api/cre)
  ↓ (executes)
CRE WORKFLOW
  ├─→ PLAID API (fetch transactions)
  ├─→ SANITIZE (remove PII)
  ├─→ GROQ AI (analyze risk)
  └─→ BLOCKCHAIN (store score)
       ↓
SMART CONTRACTS
  ├─ CrestVault (lending)
  ├─ PrivateVault (privacy)
  └─ MockUSDC (stablecoin)
       ↓
USER RECEIVES LOAN
```

---

## 🔑 Key Files & Their Roles

### Frontend
- `src/app/auth/page.tsx` - Wallet + World ID
- `src/app/bridge/page.tsx` - Plaid integration
- `src/app/orchestration/page.tsx` - Real-time CRE pipeline
- `src/app/dashboard/page.tsx` - Credit score display
- `src/app/lending/page.tsx` - Loan interface
- `src/app/api/cre/route.ts` - CRE workflow trigger

### CRE Workflow
- `PrivaCRE/my-workflow/main.ts` - Main workflow logic
- `PrivaCRE/my-workflow/main-confidential.ts` - Privacy-enhanced
- `PrivaCRE/my-workflow/workflow.yaml` - CRE configuration
- `PrivaCRE/my-workflow/config.staging.json` - API endpoints

### Smart Contracts
- `contracts/CrestVault.sol` - Main lending vault
- `contracts/PrivateVault.sol` - Privacy features
- `contracts/MockUSDC.sol` - Test stablecoin

### Scripts
- `scripts/simulate-workflow.js` - Local CRE simulation
- `scripts/deploy.js` - Contract deployment
- `scripts/run-cre-workflow.sh` - CRE CLI wrapper

---

## 🧪 How to Test

### 1. Run CRE Simulation
```bash
npm run simulate
```
**Output**: Credit score calculated locally using real Plaid + Groq APIs

### 2. Test Full Flow
```bash
./test-e2e.sh
```
**Output**: Complete flow from deployment to loan repayment

### 3. Test Individual Components
```bash
node test-plaid-setup.js    # Test Plaid
node test-worldid-setup.js  # Test World ID
npm run test:contracts      # Test smart contracts
```

---

## 🎯 Privacy Features Explained

### 1. Confidential HTTP
- API keys stored in CRE Secrets Manager
- Never exposed to frontend or logs
- Encrypted in transit

### 2. PII Sanitization
- Names, addresses, SSNs removed
- Only aggregated metrics kept
- Happens in WASM sandbox

### 3. Encrypted Storage
- Scores encrypted with AES-256-GCM
- Commitment-based on-chain storage
- Only oracle can decrypt

### 4. Zero-Knowledge Proofs
- Prove eligibility without revealing score
- Cryptographic commitments
- Verifiable on-chain

### 5. Sybil Resistance
- World ID Orb verification
- One human = one score
- Nullifier prevents duplicates

---

## 📈 Performance

- **Total Time**: 5-8 seconds
- **Plaid Fetch**: 1.2s
- **AI Analysis**: 2.8s
- **On-Chain Write**: 1.5s
- **Gas Cost**: ~80,000 gas
- **Data Transfer**: ~2.4 KB

---

## 🚀 Quick Start

```bash
# 1. Install
npm install
cd PrivaCRE/my-workflow && npm install && cd ../..

# 2. Configure
cp .env.example .env
# Add your API keys

# 3. Deploy contracts
npm run deploy:tenderly

# 4. Run simulation
npm run simulate

# 5. Start frontend
npm run dev
```

Visit http://localhost:3000

---

## 📚 Learn More

- Full documentation: `README.md`
- Visual guide: `VISUAL_WORKFLOW_GUIDE.md`
- Credit scoring: `CREDIT_SCORE_CALCULATION_EXPLAINED.md`
- Privacy features: `PRIVACY_TRACK_IMPLEMENTATION.md`
- CRE integration: `CRE_FINAL_STATUS.md`

---

**Built for Chainlink Convergence Hackathon 2025 - Privacy Track**

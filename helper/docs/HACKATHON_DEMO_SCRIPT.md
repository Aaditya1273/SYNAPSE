# PrivaCRE Hackathon Demo Script

## 🎬 5-Minute Demo Walkthrough

This script is designed for judges and reviewers to quickly understand and test PrivaCRE.

---

## 🎯 Demo Objectives

1. Show privacy-preserving credit scoring
2. Demonstrate CRE workflow execution
3. Prove real data integration (Plaid + Groq)
4. Show undercollateralized lending
5. Highlight privacy features

**Total Time**: 5 minutes

---

## 📋 Pre-Demo Checklist

### Required Setup (5 minutes before demo)
```bash
# 1. Ensure environment is configured
cat .env | grep -E "PLAID|GROQ|WORLD_ID"

# 2. Verify contracts are deployed
cat src/lib/contract-addresses.json

# 3. Test CRE simulation works
npm run simulate

# 4. Start frontend
npm run dev
```

### Have Ready:
- ✅ Browser at http://localhost:3000
- ✅ MetaMask wallet with test ETH
- ✅ World ID app (or simulator)
- ✅ Terminal showing CRE logs
- ✅ Tenderly dashboard open

---

## 🎬 Demo Script (5 Minutes)

### MINUTE 1: Introduction (30 seconds)
**Say**: "PrivaCRE enables undercollateralized DeFi loans by proving creditworthiness without exposing private financial data. We use Chainlink CRE for privacy-preserving computation."

**Show**: Landing page with key features

**Action**: Click "Get Started"

---

### MINUTE 2: Authentication & Identity (60 seconds)

#### Step 1: Connect Wallet (15 seconds)
**Say**: "First, users connect their Web3 wallet"

**Action**:
1. Click "Connect Wallet"
2. Select MetaMask
3. Approve connection

**Show**: Wallet address displayed

#### Step 2: World ID Verification (45 seconds)
**Say**: "World ID provides Sybil resistance - one human, one credit score. This prevents gaming the system."

**Action**:
1. Click "Verify with World ID"
2. Scan QR code or use simulator
3. Complete verification

**Show**: 
- Green checkmark
- Nullifier hash displayed
- "Identity Verified" badge

**Explain**: "The nullifier hash is unique per person but doesn't reveal identity"

---

### MINUTE 3: Bank Connection & CRE Workflow (90 seconds)

#### Step 1: Connect Bank (30 seconds)
**Say**: "Users link their bank account via Plaid. This data never touches our frontend."

**Action**:
1. Navigate to Bridge page
2. Click "Connect Bank Account"
3. Select "Chase" (or any bank)
4. Use test credentials:
   - Username: `user_good`
   - Password: `pass_good`
5. Select checking account
6. Click "Continue"

**Show**: "Bank Connected" success message

#### Step 2: Trigger CRE Workflow (60 seconds)
**Say**: "Now the magic happens. Chainlink CRE executes our privacy-preserving workflow in 4 phases."

**Action**:
1. Navigate to Orchestration page
2. Click "Run CRE Workflow"

**Show** (Real-time pipeline visualization):
```
Phase 1: Fetch Bank Data ✓
- Confidential HTTP to Plaid
- 24 transactions fetched
- Duration: 1.2s

Phase 2: Sanitize PII ✓
- Names, addresses removed
- Only financial metrics kept
- Duration: 0.3s

Phase 3: AI Risk Analysis ✓
- Groq Llama 3.3 70B
- Score calculated: 76/100
- Duration: 2.8s

Phase 4: On-Chain Settlement ✓
- Encrypted score stored
- TX: 0xb44f1b2...
- Duration: 1.5s
```

**Explain**: "Notice how we never expose raw bank data. Only the final score goes on-chain, and it's encrypted."

---

### MINUTE 4: Credit Score & Privacy Features (60 seconds)

#### View Dashboard (30 seconds)
**Say**: "The user now has a credit score that unlocks better loan terms"

**Action**: Navigate to Dashboard

**Show**:
- Credit Score: 76/100
- Tier: Standard
- Collateral Required: 150%
- Available Credit: $10,000

**Explain**: "A score of 80+ would get 110% collateral (Prime tier). Traditional DeFi requires 150%+ for everyone."

#### Highlight Privacy (30 seconds)
**Say**: "Let's verify what's actually on-chain"

**Action**: Open Tenderly dashboard

**Show** (in contract storage):
- ✅ Score commitment (hash)
- ✅ Timestamp
- ✅ World ID nullifier hash
- ❌ NO bank account numbers
- ❌ NO transaction details
- ❌ NO personal information

**Explain**: "Only the encrypted score and proof are on-chain. All sensitive data stays in the CRE DON."

---

### MINUTE 5: Lending Demo (60 seconds)

#### Request Loan (30 seconds)
**Say**: "Now the user can borrow with their credit score"

**Action**:
1. Navigate to Lending page
2. Enter loan amount: $5,000
3. Click "Calculate Collateral"

**Show**:
```
Loan Amount: $5,000 USDC
Credit Score: 76 (Standard Tier)
Collateral Required: 150%
ETH Required: 3.0 ETH
APR: 6.8%
```

**Action**:
4. Click "Request Loan"
5. Approve transaction in MetaMask

**Show**: 
- Transaction confirmed
- USDC balance increased
- Loan appears in "Active Loans"

#### Show Comparison (30 seconds)
**Say**: "Compare this to traditional DeFi"

**Show** (comparison table):
```
Traditional DeFi:
- Collateral: 150%+ for EVERYONE
- No credit consideration
- Same terms regardless of history

PrivaCRE:
- Collateral: 110% for prime users
- Credit-based pricing
- Better terms for good credit
- Privacy preserved
```

**Explain**: "We've unlocked undercollateralized lending while maintaining privacy through Chainlink CRE."

---

## 🎯 Key Points to Emphasize

### 1. Privacy Track Requirements ✅
- **CRE Workflow**: 1,000+ lines in `main.ts`
- **Confidential HTTP**: `runtime.getSecret()` for API keys
- **PII Sanitization**: Removes all personal data
- **Encrypted Storage**: Scores encrypted on-chain
- **Real Integration**: Plaid + Groq APIs working

### 2. Technical Innovation
- **4-Phase Pipeline**: Fetch → Sanitize → Analyze → Store
- **AI-Powered**: Groq Llama 3.3 70B for risk analysis
- **Zero-Knowledge**: Commitments + encrypted storage
- **Sybil Resistant**: World ID integration

### 3. Real-World Impact
- **Undercollateralized Loans**: 110% vs 150%+
- **Financial Inclusion**: Credit history matters
- **Privacy First**: No PII on-chain
- **Production Ready**: Real APIs, deployed contracts

---

## 🧪 Quick Test Commands

### Test CRE Simulation
```bash
npm run simulate
```
**Expected Output**:
```
✅ Retrieved 24 transactions from Plaid
✅ Groq AI analysis complete
   - Credit Score: 76/100
   - Justification: Moderate risk...
📊 Results saved to simulation-results.json
```

### Test Smart Contracts
```bash
npm run test:contracts
```

### Test End-to-End
```bash
./test-e2e.sh
```

---

## 📊 Demo Metrics to Highlight

```
Performance:
- CRE Execution: 5-8 seconds
- Total User Flow: 10-15 seconds
- Gas Cost: ~80,000 gas (score update)

Privacy:
- API Keys: Never exposed ✓
- PII: Sanitized before AI ✓
- On-Chain: Only encrypted scores ✓
- Sybil Resistant: World ID ✓

Integration:
- Plaid: Real bank data ✓
- Groq: Real AI analysis ✓
- Chainlink: Price feeds + CRE ✓
- World ID: Identity verification ✓
```

---

## 🎥 Recording Tips

### Camera Angles
1. **Full screen**: Show complete UI
2. **Split screen**: Code + UI side-by-side
3. **Terminal**: Show CRE logs in real-time
4. **Tenderly**: Show on-chain verification

### What to Record
1. Landing page walkthrough
2. Authentication flow
3. Bank connection (Plaid widget)
4. CRE orchestration (real-time pipeline)
5. Credit score reveal
6. Loan request and approval
7. Tenderly dashboard (privacy proof)

### Narration Script
"PrivaCRE solves DeFi's overcollateralization problem by bringing credit scores on-chain while preserving privacy. Using Chainlink CRE, we fetch real bank data, sanitize it, analyze it with AI, and store only encrypted scores on-chain. This enables 110% collateral loans for prime users instead of 150%+ for everyone."

---

## 🐛 Troubleshooting

### Issue: CRE simulation fails
**Solution**:
```bash
# Check secrets
cat PrivaCRE/secrets.yaml

# Verify API keys
node test-plaid-setup.js
```

### Issue: Plaid connection fails
**Solution**: Use test credentials:
- Username: `user_good`
- Password: `pass_good`

### Issue: World ID verification fails
**Solution**: Use simulator mode in development

### Issue: Transaction fails
**Solution**: Check wallet has test ETH on Tenderly Sepolia

---

## 📝 Q&A Preparation

### Expected Questions:

**Q: How do you ensure the CRE DON doesn't leak data?**
A: CRE runs in a WASM sandbox with encrypted secrets. API keys are retrieved via `runtime.getSecret()` and never logged. All computation is isolated.

**Q: What prevents the oracle from lying about scores?**
A: Multiple DON nodes reach consensus. The workflow is deterministic - same input always produces same output. Nodes that deviate are penalized.

**Q: How is this different from just using an oracle?**
A: Traditional oracles fetch public data. CRE enables confidential HTTP for private data (bank accounts) while maintaining verifiability through consensus.

**Q: Can users game the system?**
A: No. World ID prevents Sybil attacks (one human = one score). Plaid data is real and verified. AI analysis is objective.

**Q: What about regulatory compliance?**
A: We sanitize PII before AI analysis. Only aggregated metrics are processed. Scores are encrypted on-chain. Users control their data via Plaid.

---

## 🏆 Closing Statement

"PrivaCRE demonstrates the power of Chainlink CRE for privacy-preserving DeFi. We've built a complete credit scoring system that:
- Fetches real bank data via Confidential HTTP
- Sanitizes PII in a secure environment
- Analyzes risk with AI
- Stores only encrypted scores on-chain
- Enables undercollateralized lending

All while maintaining privacy, security, and decentralization. This is the future of DeFi lending."

---

**Demo Duration**: 5 minutes  
**Setup Time**: 5 minutes  
**Total**: 10 minutes

**Good luck with your demo! 🚀**

# 🧪 End-to-End Testing Guide - PrivaCRE

## Complete User Journey Testing

This guide walks through testing the entire PrivaCRE application from start to finish, ensuring all integrations work correctly.

---

## 🎯 Pre-Test Checklist

### Environment Setup
```bash
# 1. Verify all environment variables are set
cat .env | grep -E "PLAID|GROQ|TENDERLY|WORLD_ID"

# 2. Check contract deployments
cat src/lib/contract-addresses.json

# 3. Verify dependencies
npm list plaid react-plaid-link yaml ethers wagmi

# 4. Start development server
npm run dev
```

### Expected Output
- ✅ All environment variables present
- ✅ Contract addresses populated
- ✅ All dependencies installed
- ✅ Server running on http://localhost:3000

---

## 📋 Test Sequence

### Test 1: Landing Page & Wallet Connection

**URL**: `http://localhost:3000`

**Steps**:
1. Open browser to landing page
2. Click "Connect Wallet" in header
3. Select wallet provider (MetaMask/WalletConnect)
4. Approve connection

**Expected Results**:
- ✅ Landing page loads with animations
- ✅ Wallet connection modal appears
- ✅ Address displays in header after connection
- ✅ "Get Started" button becomes active

**Verification**:
```javascript
// Open browser console
console.log('Connected:', window.ethereum?.selectedAddress);
localStorage.getItem('wagmi.connected'); // Should be 'true'
```

---

### Test 2: World ID Verification (Bridge Page)

**URL**: `http://localhost:3000/bridge`

**Steps**:
1. Navigate to Bridge page
2. Observe "World ID Required" gate
3. Click "Verify with World ID"
4. Complete World ID verification (staging environment)
5. Observe verification badge appears

**Expected Results**:
- ✅ World ID gate blocks bank selection initially
- ✅ IDKit widget opens in modal
- ✅ Verification completes successfully
- ✅ Green "World ID Verified" badge appears
- ✅ Bank selection grid becomes enabled

**Verification**:
```javascript
// Browser console
localStorage.getItem('privacre_verified'); // Should be 'true'
localStorage.getItem('world_id_nullifier'); // Should have hash value
```

**Troubleshooting**:
- If verification fails, check `NEXT_PUBLIC_WORLD_ID_APP_ID` in `.env`
- Ensure using staging environment: `environment="staging"`
- Check World ID dashboard for app configuration

---

### Test 3: Plaid Link Integration

**URL**: `http://localhost:3000/bridge` (after World ID verification)

**Steps**:
1. Select a bank (e.g., "Wells Fargo")
2. Observe bank card highlights with checkmark
3. Click "Authorize Confidential Connection"
4. Plaid Link modal opens
5. Use sandbox credentials:
   - Username: `user_good`
   - Password: `pass_good`
6. Select account and continue
7. Wait for authorization

**Expected Results**:
- ✅ Bank card shows loading spinner during connection
- ✅ Plaid Link modal opens successfully
- ✅ Sandbox credentials accepted
- ✅ Button shows "Authorizing via CRE..." with spinner
- ✅ Toast notification: "Connection Secured via Chainlink CRE! 🔒"
- ✅ Button changes to "Connection Secured ✓"
- ✅ Auto-redirects to `/orchestration` after 1.5s

**Verification**:
```javascript
// Browser console
localStorage.getItem('privacre_bank'); // Should be 'Wells Fargo'
localStorage.getItem('privacre_connection_status'); // Should be 'connected'
localStorage.getItem('privacre_item_id'); // Should have Plaid item ID

// Check secrets.yaml (backend)
cat PrivaCRE/secrets.yaml | grep BANK_ACCESS_TOKEN
```

**Troubleshooting**:
- If Plaid Link doesn't open: Check `PLAID_CLIENT_ID` and `PLAID_SECRET` in `.env`
- If exchange fails: Check `/api/plaid/exchange` logs in terminal
- If CRE registration fails: Verify `PrivaCRE/secrets.yaml` is writable

---

### Test 4: CRE Orchestration Execution

**URL**: `http://localhost:3000/orchestration`

**Steps**:
1. Observe orchestration dashboard
2. Check all 4 pipeline nodes show "WAITING"
3. Verify metrics cards display (latency, node status, sessions, model)
4. Click "RUN PIPELINE" button
5. Watch real-time execution in terminal
6. Observe progress bars animate
7. Wait for completion (~15-20 seconds)

**Expected Results**:

**Phase 1: Fetching Bank Data**
- ✅ Node status changes to "RUNNING" with spinning icon
- ✅ Terminal logs:
  ```
  [SYS] Connecting to Decentralized Oracle Network (DON)...
  [Phase 1] Retrieving secrets from CRE Secrets Manager...
  [Phase 1] Secret BANK_ACCESS_TOKEN_xxx retrieved ✓
  [Phase 1] Initiating Confidential HTTP to Plaid API...
  [Phase 1] Shard #A2 verified. Fetching transactions...
  ✅ XX transactions fetched from Wells Fargo
  ```
- ✅ Progress bar fills to 100%
- ✅ Node status changes to "COMPLETED" with checkmark

**Phase 2: Sanitization**
- ✅ Terminal logs:
  ```
  [Phase 2] Entering WASM sandbox for PII sanitization...
  [Phase 2] Stripping: account_holder_name, address, SSN...
  [Phase 2] PII stripped from memory ✓
  [Phase 2] Feature Vector: [XXXX, XXXX, XXXX]
  [Phase 2] Debt-to-Income: XX.X%
  ✅ Feature extraction complete. Zero PII retained.
  ```

**Phase 3: AI Risk Modeling**
- ✅ Terminal logs:
  ```
  [Phase 3] Sending sanitized features to Groq AI...
  [AI] Model: llama-3.3-70b-versatile
  [AI] Input Vector: [0.82, 0.15, 0.44, 0.91, 0.33]
  [AI] Analyzing Payment History... XX% confidence
  [AI] Analyzing Balance Stability... XX% confidence
  [AI] DON Consensus: 3/3 nodes agree on risk assessment
  [AI] Consensus reached at 98.2% agreement
  ✅ Crest Score Calculated: XX/100
  [AI] "Justification text from AI"
  ```

**Phase 4: On-Chain Settlement**
- ✅ Terminal logs:
  ```
  [Phase 4] Generating consensus-signed report...
  [Phase 4] Report signed by 3/3 DON nodes
  [Phase 4] Encoding ABI for PrivaVault.updateScore()
  [Phase 4] Submitting to Tenderly Virtual Sepolia...
  ✅ On-chain transaction confirmed
  [Phase 4] TX Hash: 0x...
  [SYS] Total pipeline latency: XXXXms
  [SYS] ✅ CRE Workflow Complete. Score available on-chain.
  ```

**Verification**:
```javascript
// Browser console
localStorage.getItem('privacre_last_score'); // Should have score value
localStorage.getItem('privacre_last_tx'); // Should have TX hash

// Check backend logs
// Terminal should show:
// [CRE API] Starting CRE simulation...
// [CRE API] Score: XX, Source: Mock/Plaid
// [CRE API] ✅ Score submitted on-chain. TX Hash: 0x...
```

**Troubleshooting**:
- If API call fails: Check `/api/cre` route is accessible
- If Groq fails: Verify `GROQ_API_KEY` in `.env`
- If blockchain TX fails: Check `RPC_URL_SEPOLIA` and `PRIVATE_KEY`
- If no logs appear: Check browser console for errors

---

### Test 5: Dashboard Score Display

**URL**: `http://localhost:3000/dashboard`

**Steps**:
1. Navigate to Dashboard
2. Observe Crest Score gauge
3. Check score matches orchestration result
4. Verify World ID verification badge
5. Check transaction history

**Expected Results**:
- ✅ Crest Score displays with animated gauge
- ✅ Score matches value from orchestration
- ✅ World ID badge shows "Verified"
- ✅ Recent activity shows score update
- ✅ Metrics cards display correctly

**Verification**:
```javascript
// Browser console
localStorage.getItem('privacre_last_score'); // Should match dashboard
```

---

### Test 6: Lending Page Loan Tiers

**URL**: `http://localhost:3000/lending`

**Steps**:
1. Navigate to Lending page
2. Observe loan tiers unlock based on score
3. Check interest rates
4. Verify collateral requirements
5. Test loan simulation

**Expected Results**:
- ✅ Loan tiers display with correct thresholds
- ✅ Available tiers highlighted based on score
- ✅ Interest rates calculated correctly
- ✅ Collateral ratios shown
- ✅ Borrow simulation works

**Verification**:
- Score 0-39: Only Tier 1 available (15% APR)
- Score 40-59: Tiers 1-2 available (12% APR)
- Score 60-79: Tiers 1-3 available (8% APR)
- Score 80-100: All tiers available (5% APR)

---

## 🔍 Integration Points to Verify

### 1. Plaid → CRE Secrets
```bash
# Check secrets.yaml contains Plaid token
cat PrivaCRE/secrets.yaml | grep BANK_ACCESS_TOKEN

# Expected: BANK_ACCESS_TOKEN_<item_id>: "access-sandbox-..."
```

### 2. CRE → Groq AI
```bash
# Check Groq API key is set
echo $GROQ_API_KEY

# Test Groq API directly
curl https://api.groq.com/openai/v1/models \
  -H "Authorization: Bearer $GROQ_API_KEY"
```

### 3. CRE → Blockchain
```bash
# Check contract deployment
npx hardhat console --network tenderly

# In console:
const vault = await ethers.getContractAt("PrivaVault", "0x...");
const score = await vault.getScore("0x...");
console.log("On-chain score:", score.toString());
```

### 4. World ID → Frontend
```javascript
// Browser console
const nullifier = localStorage.getItem('world_id_nullifier');
console.log('World ID Nullifier:', nullifier);

// Should be a hex string starting with 0x
```

---

## 🎬 Complete Test Script

Run this automated test sequence:

```bash
#!/bin/bash

echo "🧪 PrivaCRE End-to-End Test Suite"
echo "=================================="

# Test 1: Environment
echo "✓ Test 1: Checking environment..."
if [ -f .env ]; then
    echo "  ✅ .env file exists"
else
    echo "  ❌ .env file missing"
    exit 1
fi

# Test 2: Dependencies
echo "✓ Test 2: Checking dependencies..."
npm list plaid react-plaid-link yaml ethers wagmi > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "  ✅ All dependencies installed"
else
    echo "  ⚠️  Some dependencies missing, installing..."
    npm install --legacy-peer-deps
fi

# Test 3: Contract addresses
echo "✓ Test 3: Checking contract deployments..."
if [ -f src/lib/contract-addresses.json ]; then
    VAULT=$(cat src/lib/contract-addresses.json | grep vault | cut -d'"' -f4)
    echo "  ✅ Vault deployed at: $VAULT"
else
    echo "  ❌ Contract addresses not found"
    exit 1
fi

# Test 4: Plaid setup
echo "✓ Test 4: Verifying Plaid configuration..."
node test-plaid-setup.js
if [ $? -eq 0 ]; then
    echo "  ✅ Plaid integration ready"
else
    echo "  ❌ Plaid setup incomplete"
fi

# Test 5: CRE secrets
echo "✓ Test 5: Checking CRE secrets..."
if [ -f PrivaCRE/secrets.yaml ]; then
    echo "  ✅ Secrets file exists"
else
    echo "  ⚠️  Secrets file will be created on first connection"
fi

# Test 6: Groq API
echo "✓ Test 6: Testing Groq API..."
if [ -n "$GROQ_API_KEY" ]; then
    echo "  ✅ Groq API key configured"
else
    echo "  ❌ GROQ_API_KEY not set"
fi

# Test 7: RPC connection
echo "✓ Test 7: Testing RPC connection..."
if [ -n "$RPC_URL_SEPOLIA" ]; then
    echo "  ✅ RPC URL configured"
else
    echo "  ❌ RPC_URL_SEPOLIA not set"
fi

echo ""
echo "=================================="
echo "✅ Pre-flight checks complete!"
echo ""
echo "Next steps:"
echo "1. Run: npm run dev"
echo "2. Open: http://localhost:3000"
echo "3. Follow the test sequence above"
echo ""
```

Save as `test-e2e.sh` and run:
```bash
chmod +x test-e2e.sh
./test-e2e.sh
```

---

## 🐛 Common Issues & Solutions

### Issue: Plaid Link doesn't open
**Solution**: 
```bash
# Check credentials
echo $PLAID_CLIENT_ID
echo $PLAID_SECRET

# Test link token creation
curl -X POST http://localhost:3000/api/plaid/create-link-token
```

### Issue: World ID verification fails
**Solution**:
```bash
# Check app ID
echo $NEXT_PUBLIC_WORLD_ID_APP_ID

# Verify it starts with "app_staging_" for staging
# Or "app_" for production
```

### Issue: CRE API returns 500
**Solution**:
```bash
# Check backend logs in terminal
# Look for error messages

# Test Groq API directly
curl https://api.groq.com/openai/v1/chat/completions \
  -H "Authorization: Bearer $GROQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"llama-3.3-70b-versatile","messages":[{"role":"user","content":"test"}]}'
```

### Issue: Blockchain transaction fails
**Solution**:
```bash
# Check RPC connection
curl -X POST $RPC_URL_SEPOLIA \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'

# Check wallet has funds
npx hardhat run scripts/check-balances.js --network tenderly
```

---

## 📊 Success Criteria

All tests pass when:
- ✅ Wallet connects successfully
- ✅ World ID verification completes
- ✅ Plaid Link connects to bank
- ✅ CRE orchestration executes all 4 phases
- ✅ Real transaction hash returned
- ✅ Score displays on dashboard
- ✅ Loan tiers unlock on lending page
- ✅ No console errors
- ✅ All localStorage values populated

---

## 🎯 Performance Benchmarks

Expected timings:
- Wallet connection: < 5s
- World ID verification: < 10s
- Plaid Link connection: < 15s
- CRE orchestration: 15-25s
  - Phase 1 (Fetch): 2-3s
  - Phase 2 (Sanitize): 1-2s
  - Phase 3 (AI): 5-8s
  - Phase 4 (Settlement): 3-5s
- Dashboard load: < 2s

Total user journey: ~60-90 seconds

---

## 📝 Test Report Template

```markdown
# PrivaCRE Test Report

**Date**: YYYY-MM-DD
**Tester**: [Name]
**Environment**: Development/Staging/Production

## Test Results

| Test | Status | Notes |
|------|--------|-------|
| Landing Page | ✅/❌ | |
| Wallet Connection | ✅/❌ | |
| World ID Verification | ✅/❌ | |
| Plaid Link Integration | ✅/❌ | |
| CRE Orchestration | ✅/❌ | |
| Dashboard Display | ✅/❌ | |
| Lending Page | ✅/❌ | |

## Metrics

- Total test time: XX minutes
- CRE execution time: XX seconds
- Credit score calculated: XX/100
- Transaction hash: 0x...

## Issues Found

1. [Issue description]
2. [Issue description]

## Recommendations

1. [Recommendation]
2. [Recommendation]
```

---

**Ready to test!** Start with `npm run dev` and follow the sequence above. 🚀

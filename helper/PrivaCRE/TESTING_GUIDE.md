# PrivaCRE Testing Guide

## Overview

This guide covers testing strategies for the PrivaCRE credit scoring workflow, from local simulation to production validation.

## Testing Levels

### 1. Local Simulation (Development)
### 2. Testnet Deployment (Staging)
### 3. Production Deployment (Mainnet)

---

## 1. Local Simulation Testing

### Setup

```bash
cd PrivaCRE

# Ensure .env is configured
cp .env.example .env
nano .env

# Install dependencies
cd my-workflow
bun install
cd ..
```

### Run Basic Simulation

```bash
./simulate.sh
```

### Expected Output

```
================================================
  PrivaCRE Credit Score Workflow Simulation
================================================

✅ CRE CLI found
✅ .env file found
✅ Workflow directory found
✅ Dependencies installed

🚀 Starting workflow simulation...

Target: staging-settings
Config: config.staging.json
Secrets: ../secrets.yaml

================================================

[Workflow execution logs...]

Running CronTrigger
Starting credit score workflow for user: 0x1234...
Retrieving secrets...
Fetching bank data...
Bank data retrieved: {...}
Data sanitized for AI analysis
Performing AI risk analysis...
Credit analysis complete: {...}
Writing credit score to blockchain...
Credit score update transaction succeeded: 0xabc...
Workflow complete. Transaction: 0xabc...

================================================
  Simulation Complete!
================================================
```

### Test Cases

#### Test 1: Valid User Data

Create a mock response file `test-data/valid-user.json`:

```json
{
  "userId": "0x1234567890123456789012345678901234567890",
  "accountBalance": 5000,
  "monthlyIncome": 4000,
  "monthlyDebt": 1000,
  "transactionHistory": [
    { "date": "2024-01-01", "amount": -50, "category": "groceries" },
    { "date": "2024-01-02", "amount": -100, "category": "utilities" }
  ],
  "accountAge": 24
}
```

Expected result:
- Credit score: 70-85
- Debt-to-income ratio: 25%
- Status: SUCCESS

#### Test 2: High Risk User

```json
{
  "userId": "0x2234567890123456789012345678901234567890",
  "accountBalance": 100,
  "monthlyIncome": 2000,
  "monthlyDebt": 1800,
  "transactionHistory": [
    { "date": "2024-01-01", "amount": -500, "category": "gambling" },
    { "date": "2024-01-02", "amount": -300, "category": "gambling" }
  ],
  "accountAge": 3
}
```

Expected result:
- Credit score: 50-60
- Debt-to-income ratio: 90%
- Status: SUCCESS

#### Test 3: Prime User

```json
{
  "userId": "0x3234567890123456789012345678901234567890",
  "accountBalance": 50000,
  "monthlyIncome": 10000,
  "monthlyDebt": 500,
  "transactionHistory": [
    { "date": "2024-01-01", "amount": -100, "category": "groceries" },
    { "date": "2024-01-02", "amount": -50, "category": "utilities" }
  ],
  "accountAge": 60
}
```

Expected result:
- Credit score: 85-95
- Debt-to-income ratio: 5%
- Status: SUCCESS

### Debugging Local Simulation

#### Enable Verbose Logging

```bash
cd my-workflow
cre workflow simulate CreditScoreWorkflow --target staging-settings --verbose
```

#### Check TypeScript Compilation

```bash
cd my-workflow
bun run main.ts
```

#### Validate Configuration

```bash
# Check config syntax
cat config.staging.json | jq

# Validate secrets
cat ../secrets.yaml

# Verify .env
cat ../.env
```

---

## 2. Testnet Deployment Testing

### Prerequisites

```bash
# Ensure you have testnet ETH
# Get from: https://sepoliafaucet.com/

# Deploy smart contract first
cd ..
npx hardhat run scripts/deploy.js --network sepolia

# Update config with contract address
nano PrivaCRE/my-workflow/config.staging.json
```

### Deploy to Testnet

```bash
cd PrivaCRE

# Upload secrets
cre secrets create secrets.yaml --target staging-settings

# Deploy workflow
cre workflow deploy CreditScoreWorkflow --target staging-settings

# Activate workflow
cre workflow activate CreditScoreWorkflow --target staging-settings
```

### Monitoring

#### Check Workflow Status

```bash
cre workflow status CreditScoreWorkflow --target staging-settings
```

Expected output:
```
Workflow: CreditScoreWorkflow-staging
Status: Active
Next execution: 2024-01-15 10:00:00 UTC
Last execution: 2024-01-15 09:50:00 UTC
Success rate: 100%
```

#### View Logs

```bash
# View recent logs
cre workflow logs CreditScoreWorkflow --target staging-settings --tail 100

# Follow logs in real-time
cre workflow logs CreditScoreWorkflow --target staging-settings --follow
```

#### Check On-Chain Events

```bash
# Using Etherscan Sepolia
# Navigate to: https://sepolia.etherscan.io/address/YOUR_CONTRACT_ADDRESS
# Click "Events" tab
# Look for "CreditScoreUpdated" events
```

### Test Scenarios

#### Scenario 1: First Execution

1. Activate workflow
2. Wait for first cron trigger (up to 10 minutes)
3. Check logs for successful execution
4. Verify on-chain event was emitted
5. Confirm credit score was written

#### Scenario 2: Multiple Executions

1. Let workflow run for 1 hour (6 executions)
2. Check success rate
3. Verify all executions completed
4. Check for any errors or warnings

#### Scenario 3: API Failure Handling

1. Temporarily disable bank API
2. Wait for next execution
3. Verify workflow handles error gracefully
4. Check logs for error message
5. Re-enable API and verify recovery

#### Scenario 4: Consensus Validation

1. Check that multiple DON nodes executed
2. Verify consensus was reached
3. Confirm aggregated result was used
4. Check for any consensus failures

### Performance Metrics

Track these metrics:

| Metric | Target | Actual |
|--------|--------|--------|
| Execution time | < 30s | ___ |
| Success rate | > 99% | ___ |
| Gas cost | < 500k | ___ |
| API latency | < 5s | ___ |
| Consensus time | < 10s | ___ |

---

## 3. Production Deployment Testing

### Pre-Production Checklist

- [ ] All testnet tests passed
- [ ] Smart contract audited
- [ ] Secrets rotated for production
- [ ] Monitoring configured
- [ ] Alerting set up
- [ ] Backup plan documented
- [ ] Team trained on operations

### Deploy to Production

```bash
cd PrivaCRE

# Upload production secrets
cre secrets create secrets.yaml --target production-settings

# Deploy workflow
cre workflow deploy CreditScoreWorkflow --target production-settings

# Activate workflow
cre workflow activate CreditScoreWorkflow --target production-settings
```

### Production Monitoring

#### Set Up Alerts

```bash
# Configure alerts for:
# - Workflow failures
# - High gas costs
# - API errors
# - Consensus failures
# - Unusual credit scores
```

#### Monitor First 24 Hours

```bash
# Check status every hour
watch -n 3600 'cre workflow status CreditScoreWorkflow --target production-settings'

# Follow logs continuously
cre workflow logs CreditScoreWorkflow --target production-settings --follow
```

#### Weekly Health Check

```bash
# Check success rate
cre workflow executions CreditScoreWorkflow --target production-settings --limit 1000

# Review error logs
cre workflow logs CreditScoreWorkflow --target production-settings --level error --tail 100

# Verify on-chain events
# Check Etherscan for CreditScoreUpdated events
```

### Load Testing

#### Simulate High Volume

```bash
# Increase execution frequency temporarily
# Edit config.production.json
{
  "schedule": "0 * * * * *"  // Every minute
}

# Redeploy
cre workflow deploy CreditScoreWorkflow --target production-settings

# Monitor for 1 hour
# Check for:
# - Rate limiting issues
# - Gas cost spikes
# - API throttling
# - Consensus delays

# Revert to normal schedule
{
  "schedule": "0 */10 * * * *"  // Every 10 minutes
}
```

---

## Integration Testing

### Frontend Integration

```typescript
// Test credit score retrieval
import { ethers } from 'ethers'

const contract = new ethers.Contract(
  contractAddress,
  CrestVaultABI,
  provider
)

// Test 1: Read credit score
const score = await contract.getCreditScore(userAddress)
console.log('Credit score:', score.toString())

// Test 2: Listen for updates
contract.on('CreditScoreUpdated', (user, score, timestamp) => {
  console.log(`Score updated: ${score} at ${timestamp}`)
})

// Test 3: Check eligibility
const eligible = await contract.isEligibleForLoan(userAddress, loanAmount)
console.log('Eligible:', eligible)
```

### Smart Contract Integration

```solidity
// Test contract interaction
function testCreditScoreUpdate() public {
    // Simulate oracle update
    vm.prank(oracleAddress);
    crestVault.updateCreditScore(testUser, 85);
    
    // Verify score was updated
    uint256 score = crestVault.getCreditScore(testUser);
    assertEq(score, 85);
    
    // Verify event was emitted
    // Check event logs
}
```

---

## Troubleshooting

### Common Issues

#### Issue: Simulation Fails

```bash
# Check dependencies
cd my-workflow
rm -rf node_modules
bun install

# Verify .env
cat ../.env

# Check config syntax
cat config.staging.json | jq

# Run with verbose logging
cre workflow simulate CreditScoreWorkflow --target staging-settings --verbose
```

#### Issue: Secrets Upload Fails

```bash
# Verify secrets.yaml syntax
cat secrets.yaml

# Check authentication
cre auth status

# Try with verbose logging
cre secrets create secrets.yaml --target staging-settings --verbose
```

#### Issue: Workflow Execution Fails

```bash
# Check logs
cre workflow logs CreditScoreWorkflow --target staging-settings --tail 100

# Verify contract address
cat my-workflow/config.staging.json | jq .contractAddress

# Check network connectivity
ping ethereum-sepolia-rpc.publicnode.com
```

#### Issue: Consensus Failures

```bash
# Check for non-deterministic logic
# Review main.ts for:
# - Math.random() usage
# - Date.now() usage
# - External API timeouts

# Verify aggregation functions
# Check ConsensusAggregationByFields configuration
```

---

## Test Automation

### Create Test Script

```bash
#!/bin/bash
# test-workflow.sh

set -e

echo "Running PrivaCRE test suite..."

# Test 1: Simulation
echo "Test 1: Local simulation"
cd PrivaCRE
./simulate.sh
echo "✅ Simulation passed"

# Test 2: Config validation
echo "Test 2: Config validation"
cat my-workflow/config.staging.json | jq . > /dev/null
echo "✅ Config valid"

# Test 3: Secrets validation
echo "Test 3: Secrets validation"
cat secrets.yaml | grep -q "BANK_API_KEY"
echo "✅ Secrets valid"

# Test 4: TypeScript compilation
echo "Test 4: TypeScript compilation"
cd my-workflow
bun run main.ts
echo "✅ TypeScript compiles"

echo "All tests passed! ✅"
```

### Run Tests

```bash
chmod +x test-workflow.sh
./test-workflow.sh
```

---

## Performance Benchmarks

### Baseline Metrics

| Operation | Time | Gas | Cost |
|-----------|------|-----|------|
| Bank API call | 2-5s | 0 | $0 |
| AI analysis | 3-8s | 0 | $0.01 |
| On-chain write | 5-15s | 300k | $5-20 |
| Total execution | 10-30s | 300k | $5-20 |

### Optimization Tips

1. **Reduce API latency**: Use faster endpoints
2. **Batch operations**: Process multiple users per execution
3. **Cache results**: Store recent scores off-chain
4. **Optimize gas**: Use efficient contract functions
5. **Parallel processing**: Use CRE's parallel capabilities

---

## Security Testing

### Checklist

- [ ] Secrets never logged
- [ ] PII properly sanitized
- [ ] API keys encrypted in transit
- [ ] Smart contract access control working
- [ ] Rate limiting configured
- [ ] Error messages don't leak sensitive data
- [ ] Consensus prevents single-node attacks

### Penetration Testing

1. **Test secret exposure**: Check logs for leaked keys
2. **Test PII leakage**: Verify sanitization works
3. **Test consensus bypass**: Try to manipulate single node
4. **Test rate limiting**: Attempt API abuse
5. **Test access control**: Try unauthorized contract calls

---

## Continuous Integration

### GitHub Actions Example

```yaml
name: PrivaCRE Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: oven-sh/setup-bun@v1
      - name: Install CRE CLI
        run: npm install -g @chainlink/cre-cli
      - name: Install dependencies
        run: cd PrivaCRE/my-workflow && bun install
      - name: Run simulation
        run: cd PrivaCRE && ./simulate.sh
```

---

## Resources

- [CRE Testing Guide](https://docs.chain.link/chainlink-runtime-environment/testing)
- [Hardhat Testing](https://hardhat.org/tutorial/testing-contracts)
- [Tenderly Debugging](https://docs.tenderly.co/)

## Support

For testing issues:
1. Check logs with `--verbose` flag
2. Review [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
3. Contact Chainlink support

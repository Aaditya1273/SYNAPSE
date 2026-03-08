# PrivaCRE - Privacy-Preserving Credit Scoring Workflow

## Overview

PrivaCRE is a Chainlink Runtime Environment (CRE) workflow that enables privacy-preserving credit scoring for DeFi lending. It securely fetches private bank data, analyzes it using AI, and writes credit scores on-chain without exposing sensitive information.

## Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐     ┌──────────────┐
│   Cron      │────▶│  CRE DON     │────▶│  AI Model   │────▶│  Blockchain  │
│  Trigger    │     │  (Consensus) │     │  (GPT-4o)   │     │  (On-chain)  │
└─────────────┘     └──────────────┘     └─────────────┘     └──────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  Bank API    │
                    │  (Private)   │
                    └──────────────┘
```

## Key Features

1. **Confidential HTTP**: API keys never exposed in logs or on-chain
2. **Consensus-Ready**: Multiple DON nodes execute and aggregate results
3. **PII Sanitization**: Personal data stripped before AI analysis
4. **Deterministic**: Ensures consensus across all DON nodes
5. **WASM Sandboxing**: Secure execution environment

## Project Structure

```
PrivaCRE/
├── project.yaml              # Global CRE settings (RPC URLs, targets)
├── secrets.yaml              # Secret declarations (API keys)
├── .env                      # Local secret values (simulation only)
└── my-workflow/
    ├── workflow.yaml         # Workflow metadata
    ├── main.ts               # Workflow logic entry point
    ├── config.staging.json   # Staging configuration
    ├── config.production.json # Production configuration
    └── package.json          # Dependencies
```

## Configuration Files

### project.yaml (Global Settings)

Defines RPC endpoints and target environments:

```yaml
name: PrivaCRE

staging-settings:
  evm:
    11155111:  # Sepolia Chain ID
      rpc-url: ${RPC_URL_SEPOLIA}
  rpcs:
    - chain-name: ethereum-testnet-sepolia
      url: https://ethereum-sepolia-rpc.publicnode.com
```

### secrets.yaml (Secret Declarations)

Declares which secrets the workflow needs:

```yaml
secretsNames:
  BANK_API_KEY:
    - BANK_API_KEY_LOCAL
  AI_API_KEY:
    - AI_API_KEY_LOCAL
```

### .env (Local Simulation Values)

Contains actual secret values for local testing:

```bash
BANK_API_KEY_LOCAL=your_api_key_here
AI_API_KEY_LOCAL=your_openai_key_here
```

⚠️ **Never commit this file to version control!**

### workflow.yaml (Workflow Metadata)

Defines workflow name and artifact paths:

```yaml
workflow-name: CreditScoreWorkflow

staging-settings:
  user-workflow:
    workflow-name: "CreditScoreWorkflow-staging"
  workflow-artifacts:
    workflow-path: "./main.ts"
    config-path: "./config.staging.json"
    secrets-path: "../secrets.yaml"
```

### config.staging.json (Runtime Configuration)

Runtime parameters for the workflow:

```json
{
  "schedule": "0 */10 * * * *",
  "bankApiUrl": "https://api.mockbank.com/v1/user-data",
  "aiApiUrl": "https://api.openai.com/v1/chat/completions",
  "aiModel": "gpt-4o",
  "contractAddress": "0xYourCrestVaultContractAddress",
  "chainSelectorName": "ethereum-testnet-sepolia",
  "gasLimit": "500000",
  "minCreditScore": 50,
  "maxCreditScore": 100
}
```

## Workflow Logic (main.ts)

The workflow follows these steps:

### 1. Retrieve Secrets Privately

```typescript
const bankKey = await runtime.getSecret({ id: 'BANK_API_KEY' }).result()
const aiKey = await runtime.getSecret({ id: 'AI_API_KEY' }).result()
```

### 2. Fetch Bank Data (Confidential HTTP)

```typescript
const httpClient = new cre.capabilities.HTTPClient()
const bankData = httpClient.sendRequest(runtime, fetchBankData, ConsensusAggregation)
```

### 3. Sanitize PII

```typescript
const sanitizedData = sanitizeBankData(bankData)
// Removes userId, account numbers, transaction details
```

### 4. AI Risk Analysis

```typescript
const creditAnalysis = httpClient.sendRequest(runtime, analyzeCreditRisk, ConsensusAggregation)
```

AI analyzes:
- Debt-to-Income Ratio (40% weight)
- Payment Consistency (30% weight)
- Balance Stability (20% weight)
- Spending Volatility (10% weight)

### 5. Write Score On-Chain

```typescript
const evmClient = new cre.capabilities.EVMClient(chainSelector)
const txHash = evmClient.writeReport(runtime, { receiver, report, gasConfig })
```

## Commands

### Local Simulation

Test the workflow locally using .env secrets:

```bash
cd PrivaCRE/my-workflow
cre workflow simulate CreditScoreWorkflow --target staging-settings
```

### Deploy Secrets to DON

Upload encrypted secrets to the Decentralized Oracle Network:

```bash
cd PrivaCRE
cre secrets create secrets.yaml --target staging-settings
```

### Deploy Workflow

Deploy the workflow to the Registry:

```bash
cd PrivaCRE
cre workflow deploy CreditScoreWorkflow --target staging-settings
```

### Activate Workflow

Start the workflow triggers (Cron):

```bash
cd PrivaCRE
cre workflow activate CreditScoreWorkflow --target staging-settings
```

### Check Workflow Status

```bash
cre workflow status CreditScoreWorkflow --target staging-settings
```

### Deactivate Workflow

Stop the workflow:

```bash
cre workflow deactivate CreditScoreWorkflow --target staging-settings
```

## Credit Scoring Logic

### Input Data

```typescript
interface BankData {
  userId: string
  accountBalance: number
  monthlyIncome: number
  monthlyDebt: number
  transactionHistory: Transaction[]
  accountAge: number
}
```

### Output Analysis

```typescript
interface CreditAnalysis {
  score: number                // 50-100
  debtToIncomeRatio: number    // Percentage
  paymentConsistency: number   // 0-100
  balanceStability: number     // 0-100
  spendingVolatility: number   // 0-100
  recommendation: string       // Brief text
}
```

### Loan Tiers

| Tier | Score | Collateral Ratio | APR |
|------|-------|------------------|-----|
| Prime | 80+ | 105% | 4.5% |
| Standard | 50-79 | 150% | 6.8% |
| Entry | <50 | Not eligible | N/A |

## Security Best Practices

### 1. Secret Management

- ✅ Use CRE secrets for production
- ✅ Never hardcode API keys
- ✅ Keep .env file gitignored
- ✅ Use 1Password references for extra security

### 2. Data Privacy

- ✅ Sanitize PII before AI analysis
- ✅ Use Confidential HTTP for all external calls
- ✅ Never log sensitive data
- ✅ Minimize data retention

### 3. Consensus Safety

- ✅ Use deterministic logic only
- ✅ Avoid Math.random() (use CRE randomness capability)
- ✅ Aggregate results with median/mode
- ✅ Handle consensus failures gracefully

### 4. Smart Contract Integration

- ✅ Validate all inputs
- ✅ Use access control
- ✅ Emit events for transparency
- ✅ Test thoroughly before deployment

## Troubleshooting

### Simulation Fails

```bash
# Check if dependencies are installed
cd my-workflow
bun install

# Verify .env file exists and has correct values
cat ../.env

# Check config file syntax
cat config.staging.json | jq
```

### Secrets Upload Fails

```bash
# Verify secrets.yaml syntax
cat secrets.yaml

# Check if you have the correct target
cre secrets create secrets.yaml --target staging-settings --verbose
```

### Workflow Deploy Fails

```bash
# Verify workflow.yaml syntax
cat my-workflow/workflow.yaml

# Check if main.ts compiles
cd my-workflow
bun run main.ts
```

### Consensus Failures

- Ensure all HTTP responses are deterministic
- Check that all nodes can reach external APIs
- Verify aggregation functions are correct
- Review logs for node-specific errors

## Development Tips

### 1. Use TypeScript Strictly

```typescript
// Good: Type-safe configuration
const configSchema = z.object({
  schedule: z.string(),
  bankApiUrl: z.string(),
})

// Bad: Any types
const config: any = { ... }
```

### 2. Log Strategically

```typescript
// Good: Structured logging
runtime.log(`Bank data retrieved: ${safeJsonStringify(bankData)}`)

// Bad: Logging sensitive data
runtime.log(`API Key: ${apiKey}`) // Never do this!
```

### 3. Handle Errors Gracefully

```typescript
if (response.statusCode !== 200) {
  throw new Error(`API request failed with status: ${response.statusCode}`)
}
```

### 4. Test Locally First

Always simulate before deploying:

```bash
cre workflow simulate CreditScoreWorkflow --target staging-settings
```

## Integration with Smart Contracts

### CrestVault.sol

```solidity
function updateCreditScore(address user, uint256 score) external onlyOracle {
    require(score >= 50 && score <= 100, "Invalid score");
    creditScores[user] = score;
    emit CreditScoreUpdated(user, score, block.timestamp);
}
```

### Frontend Integration

```typescript
// Listen for credit score updates
const filter = contract.filters.CreditScoreUpdated(userAddress)
contract.on(filter, (user, score, timestamp) => {
  console.log(`Credit score updated: ${score}`)
})
```

## Resources

- [CRE Documentation](https://docs.chain.link/chainlink-runtime-environment)
- [CRE SDK Reference](https://github.com/smartcontractkit/cre-sdk)
- [Chainlink DON](https://docs.chain.link/architecture-overview/architecture-decentralized-model)
- [WASM Security](https://webassembly.org/docs/security/)

## Support

For issues or questions:
1. Check the [CRE Documentation](https://docs.chain.link/chainlink-runtime-environment)
2. Review simulation logs
3. Test with verbose logging: `--verbose`
4. Contact Chainlink support

## License

MIT License - see LICENSE file for details

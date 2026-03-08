# PrivaCRE Deployment Guide

## Prerequisites

### 1. Install Required Tools

```bash
# Install Node.js (v18+)
# Download from https://nodejs.org/

# Install Bun (for faster package management)
curl -fsSL https://bun.sh/install | bash

# Install CRE CLI
npm install -g @chainlink/cre-cli

# Verify installation
cre --version
```

### 2. Setup Environment

```bash
# Clone the repository
git clone <your-repo-url>
cd PrivaCRE

# Copy environment template
cp .env.example .env

# Edit .env with your values
nano .env
```

### 3. Required API Keys

You'll need:
- **Ethereum Private Key**: For signing transactions
- **Bank API Key**: Plaid or similar banking API
- **OpenAI API Key**: For GPT-4o credit analysis
- **RPC URLs**: Ethereum Sepolia and Mainnet

## Configuration Steps

### Step 1: Update project.yaml

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

### Step 2: Update secrets.yaml

```yaml
secretsNames:
  BANK_API_KEY:
    - BANK_API_KEY_LOCAL
  AI_API_KEY:
    - AI_API_KEY_LOCAL
  PLAID_CLIENT_ID:
    - PLAID_CLIENT_ID_LOCAL
  PLAID_SECRET:
    - PLAID_SECRET_LOCAL
```

### Step 3: Update .env (Local Simulation Only)

```bash
# Ethereum Configuration
CRE_ETH_PRIVATE_KEY=0x1234...  # Your private key
CRE_TARGET=staging-settings

# RPC URLs
RPC_URL_SEPOLIA=https://ethereum-sepolia-rpc.publicnode.com
RPC_URL_MAINNET=https://ethereum-rpc.publicnode.com

# API Keys (Local Simulation)
BANK_API_KEY_LOCAL=your_bank_api_key
AI_API_KEY_LOCAL=sk-proj-...
PLAID_CLIENT_ID_LOCAL=your_plaid_client_id
PLAID_SECRET_LOCAL=your_plaid_secret
```

⚠️ **Security Warning**: Never commit .env to version control!

### Step 4: Update Workflow Configuration

Edit `my-workflow/config.staging.json`:

```json
{
  "schedule": "0 */10 * * * *",
  "bankApiUrl": "https://api.mockbank.com/v1/user-data",
  "aiApiUrl": "https://api.openai.com/v1/chat/completions",
  "aiModel": "gpt-4o",
  "contractAddress": "0xYourDeployedCrestVaultAddress",
  "chainSelectorName": "ethereum-testnet-sepolia",
  "gasLimit": "500000",
  "minCreditScore": 50,
  "maxCreditScore": 100
}
```

### Step 5: Deploy Smart Contract

First, deploy the CrestVault contract:

```bash
# Navigate to root directory
cd ..

# Deploy to Sepolia
npx hardhat run scripts/deploy.js --network sepolia

# Copy the deployed contract address
# Update config.staging.json with the address
```

## Deployment Process

### Phase 1: Local Simulation

Test everything locally before deploying to DON:

```bash
cd PrivaCRE

# Install dependencies
cd my-workflow
bun install
cd ..

# Run simulation
./simulate.sh
```

Expected output:
```
✅ CRE CLI found
✅ .env file found
✅ Workflow directory found
✅ Dependencies installed
🚀 Starting workflow simulation...

[Workflow logs will appear here]

✅ Simulation Complete!
```

### Phase 2: Deploy Secrets to DON

Once simulation succeeds, upload secrets to the Decentralized Oracle Network:

```bash
cd PrivaCRE

# Create secrets on DON
cre secrets create secrets.yaml --target staging-settings

# Verify secrets were created
cre secrets list --target staging-settings
```

Expected output:
```
✅ Secrets uploaded successfully
Secret IDs:
  - BANK_API_KEY: secret_abc123...
  - AI_API_KEY: secret_def456...
```

### Phase 3: Deploy Workflow

Deploy the workflow to the Registry:

```bash
cd PrivaCRE

# Deploy workflow
cre workflow deploy CreditScoreWorkflow --target staging-settings

# Verify deployment
cre workflow list --target staging-settings
```

Expected output:
```
✅ Workflow deployed successfully
Workflow ID: workflow_xyz789...
Status: Inactive
```

### Phase 4: Activate Workflow

Start the workflow triggers:

```bash
cd PrivaCRE

# Activate workflow
cre workflow activate CreditScoreWorkflow --target staging-settings

# Check status
cre workflow status CreditScoreWorkflow --target staging-settings
```

Expected output:
```
✅ Workflow activated successfully
Status: Active
Next execution: 2024-01-15 10:00:00 UTC
```

## Monitoring

### Check Workflow Logs

```bash
# View recent logs
cre workflow logs CreditScoreWorkflow --target staging-settings --tail 100

# Follow logs in real-time
cre workflow logs CreditScoreWorkflow --target staging-settings --follow
```

### Check Execution History

```bash
# List recent executions
cre workflow executions CreditScoreWorkflow --target staging-settings --limit 10
```

### Monitor On-Chain Events

```bash
# Using Etherscan
# Navigate to your CrestVault contract
# Check the "Events" tab for CreditScoreUpdated events
```

## Production Deployment

### Step 1: Update Production Config

Edit `my-workflow/config.production.json`:

```json
{
  "schedule": "0 */10 * * * *",
  "bankApiUrl": "https://api.plaid.com/transactions/get",
  "aiApiUrl": "https://api.openai.com/v1/chat/completions",
  "aiModel": "gpt-4o",
  "contractAddress": "0xYourMainnetContractAddress",
  "chainSelectorName": "ethereum-mainnet",
  "gasLimit": "500000",
  "minCreditScore": 50,
  "maxCreditScore": 100
}
```

### Step 2: Deploy to Mainnet

```bash
# Deploy secrets
cre secrets create secrets.yaml --target production-settings

# Deploy workflow
cre workflow deploy CreditScoreWorkflow --target production-settings

# Activate workflow
cre workflow activate CreditScoreWorkflow --target production-settings
```

### Step 3: Verify Production

```bash
# Check status
cre workflow status CreditScoreWorkflow --target production-settings

# Monitor first execution
cre workflow logs CreditScoreWorkflow --target production-settings --follow
```

## Troubleshooting

### Issue: Simulation Fails

```bash
# Check dependencies
cd my-workflow
bun install

# Verify .env file
cat ../.env

# Check config syntax
cat config.staging.json | jq

# Run with verbose logging
cre workflow simulate CreditScoreWorkflow --target staging-settings --verbose
```

### Issue: Secrets Upload Fails

```bash
# Verify secrets.yaml syntax
cat secrets.yaml

# Check if you have correct permissions
cre auth status

# Try with verbose logging
cre secrets create secrets.yaml --target staging-settings --verbose
```

### Issue: Workflow Deploy Fails

```bash
# Verify workflow.yaml syntax
cat my-workflow/workflow.yaml

# Check if main.ts compiles
cd my-workflow
bun run main.ts

# Verify network connectivity
ping ethereum-sepolia-rpc.publicnode.com
```

### Issue: Consensus Failures

Common causes:
1. Non-deterministic logic (e.g., Math.random())
2. External API timeouts
3. Incorrect aggregation functions
4. Network connectivity issues

Solutions:
```bash
# Check logs for specific errors
cre workflow logs CreditScoreWorkflow --target staging-settings --tail 100

# Verify all nodes can reach APIs
# Check API rate limits
# Review aggregation logic in main.ts
```

### Issue: Gas Estimation Fails

```bash
# Increase gas limit in config
# Edit config.staging.json
{
  "gasLimit": "1000000"  // Increase from 500000
}

# Redeploy workflow
cre workflow deploy CreditScoreWorkflow --target staging-settings
```

## Maintenance

### Update Workflow

```bash
# Make changes to main.ts
nano my-workflow/main.ts

# Simulate changes
./simulate.sh

# Redeploy
cre workflow deploy CreditScoreWorkflow --target staging-settings
```

### Rotate Secrets

```bash
# Update secrets.yaml with new values
nano secrets.yaml

# Upload new secrets
cre secrets create secrets.yaml --target staging-settings --force

# Restart workflow
cre workflow deactivate CreditScoreWorkflow --target staging-settings
cre workflow activate CreditScoreWorkflow --target staging-settings
```

### Scale Workflow

```bash
# Adjust cron schedule in config
# Edit config.staging.json
{
  "schedule": "0 */5 * * * *"  // Run every 5 minutes instead of 10
}

# Redeploy
cre workflow deploy CreditScoreWorkflow --target staging-settings
```

## Security Checklist

Before production deployment:

- [ ] All secrets stored in CRE (not .env)
- [ ] .env file is gitignored
- [ ] PII sanitization is working
- [ ] Smart contract is audited
- [ ] Access control is configured
- [ ] Rate limits are set on APIs
- [ ] Monitoring is configured
- [ ] Backup plan is documented
- [ ] Team has access to logs
- [ ] Emergency shutdown procedure is ready

## Cost Estimation

### Testnet (Sepolia)

- Gas costs: Free (testnet ETH)
- DON execution: Free (testnet)
- API costs: ~$0.01 per execution (OpenAI)

### Mainnet

- Gas costs: ~$5-20 per execution (varies with gas price)
- DON execution: ~$1-5 per execution
- API costs: ~$0.01 per execution (OpenAI)

Estimated monthly cost (10-minute intervals):
- Executions per month: ~4,320
- Total cost: ~$25,000-100,000/month

Optimization tips:
- Increase cron interval (e.g., hourly instead of 10 minutes)
- Batch multiple users per execution
- Use cheaper AI models for initial screening
- Implement caching for frequent users

## Support

For issues:
1. Check [CRE Documentation](https://docs.chain.link/chainlink-runtime-environment)
2. Review simulation logs
3. Test with `--verbose` flag
4. Contact Chainlink support

## Next Steps

After successful deployment:
1. Monitor first 24 hours closely
2. Set up alerting for failures
3. Document any issues encountered
4. Optimize based on usage patterns
5. Plan for scaling

## Resources

- [CRE CLI Reference](https://docs.chain.link/chainlink-runtime-environment/cre-cli)
- [CRE SDK Documentation](https://github.com/smartcontractkit/cre-sdk)
- [Chainlink DON Architecture](https://docs.chain.link/architecture-overview/architecture-decentralized-model)
- [WASM Security Best Practices](https://webassembly.org/docs/security/)

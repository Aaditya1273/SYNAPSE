# PrivaCRE Quick Start Guide

Get your privacy-preserving credit scoring workflow running in 5 minutes!

## Prerequisites

```bash
# Install CRE CLI
npm install -g @chainlink/cre-cli

# Install Bun (optional, but faster)
curl -fsSL https://bun.sh/install | bash
```

## 5-Minute Setup

### 1. Configure Environment (1 min)

```bash
cd PrivaCRE

# Copy environment template
cp .env.example .env

# Edit with your keys
nano .env
```

Add these values:
```bash
CRE_ETH_PRIVATE_KEY=0x1234...
AI_API_KEY_LOCAL=sk-proj-...
BANK_API_KEY_LOCAL=your_key
```

### 2. Install Dependencies (1 min)

```bash
cd my-workflow
bun install  # or npm install
cd ..
```

### 3. Update Contract Address (30 sec)

Edit `my-workflow/config.staging.json`:
```json
{
  "contractAddress": "0xYourDeployedContractAddress"
}
```

### 4. Run Simulation (2 min)

```bash
./simulate.sh
```

You should see:
```
✅ CRE CLI found
✅ .env file found
✅ Workflow directory found
🚀 Starting workflow simulation...
[Workflow executes...]
✅ Simulation Complete!
```

### 5. Deploy (30 sec)

```bash
# Upload secrets
cre secrets create secrets.yaml --target staging-settings

# Deploy workflow
cre workflow deploy CreditScoreWorkflow --target staging-settings

# Activate
cre workflow activate CreditScoreWorkflow --target staging-settings
```

## Verify It's Working

```bash
# Check status
cre workflow status CreditScoreWorkflow --target staging-settings

# View logs
cre workflow logs CreditScoreWorkflow --target staging-settings --tail 50
```

## What's Happening?

1. **Every 10 minutes**, the workflow triggers
2. **Fetches bank data** using your API key (confidentially)
3. **Analyzes with AI** (GPT-4o) to calculate credit score
4. **Writes score on-chain** to your CrestVault contract

## Next Steps

- Read [README.md](./README.md) for detailed documentation
- Check [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for production deployment
- Customize `main.ts` for your specific use case
- Integrate with your frontend

## Common Issues

### "CRE CLI not found"
```bash
npm install -g @chainlink/cre-cli
```

### "Simulation fails"
```bash
# Check .env file exists and has correct values
cat .env

# Verify dependencies
cd my-workflow && bun install
```

### "Secrets upload fails"
```bash
# Verify secrets.yaml syntax
cat secrets.yaml

# Check authentication
cre auth status
```

## Need Help?

- 📖 [Full Documentation](./README.md)
- 🚀 [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- 🔗 [CRE Docs](https://docs.chain.link/chainlink-runtime-environment)

## Architecture Overview

```
┌─────────────┐
│   Cron      │  Every 10 minutes
│  Trigger    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  CRE DON    │  Fetch bank data (private)
│  Consensus  │  ────────────────────────▶ Bank API
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Sanitize   │  Remove PII
│    Data     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  AI Model   │  Analyze credit risk
│  (GPT-4o)   │  ────────────────────────▶ OpenAI API
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Blockchain  │  Write credit score
│  (On-chain) │
└─────────────┘
```

## Key Features

✅ **Privacy-Preserving**: API keys never exposed  
✅ **Consensus-Ready**: Multiple nodes verify results  
✅ **PII Sanitization**: Personal data stripped before AI  
✅ **Deterministic**: Ensures consensus across DON  
✅ **Secure**: WASM sandboxing for safe execution  

## Configuration Files

| File | Purpose |
|------|---------|
| `project.yaml` | Global RPC settings |
| `secrets.yaml` | Secret declarations |
| `.env` | Local secret values (simulation) |
| `my-workflow/workflow.yaml` | Workflow metadata |
| `my-workflow/main.ts` | Workflow logic |
| `my-workflow/config.staging.json` | Runtime config |

## Commands Cheat Sheet

```bash
# Simulate locally
./simulate.sh

# Deploy secrets
cre secrets create secrets.yaml --target staging-settings

# Deploy workflow
cre workflow deploy CreditScoreWorkflow --target staging-settings

# Activate workflow
cre workflow activate CreditScoreWorkflow --target staging-settings

# Check status
cre workflow status CreditScoreWorkflow --target staging-settings

# View logs
cre workflow logs CreditScoreWorkflow --target staging-settings --tail 100

# Deactivate workflow
cre workflow deactivate CreditScoreWorkflow --target staging-settings
```

## Customization

### Change Execution Frequency

Edit `my-workflow/config.staging.json`:
```json
{
  "schedule": "0 */5 * * * *"  // Every 5 minutes
}
```

### Change AI Model

```json
{
  "aiModel": "gpt-4o-mini"  // Cheaper, faster
}
```

### Change Credit Score Range

```json
{
  "minCreditScore": 300,
  "maxCreditScore": 850  // FICO-style scoring
}
```

### Add More Secrets

Edit `secrets.yaml`:
```yaml
secretsNames:
  BANK_API_KEY:
    - BANK_API_KEY_LOCAL
  AI_API_KEY:
    - AI_API_KEY_LOCAL
  NEW_SECRET:
    - NEW_SECRET_LOCAL
```

Then update `.env`:
```bash
NEW_SECRET_LOCAL=your_value
```

## Production Checklist

Before going to mainnet:

- [ ] Test thoroughly on testnet
- [ ] Deploy smart contract to mainnet
- [ ] Update `config.production.json` with mainnet contract
- [ ] Upload production secrets
- [ ] Deploy workflow to production target
- [ ] Monitor first 24 hours closely
- [ ] Set up alerting

## Cost Estimate

### Testnet (Free)
- Gas: Free (testnet ETH)
- DON: Free (testnet)
- APIs: ~$0.01/execution

### Mainnet
- Gas: ~$5-20/execution
- DON: ~$1-5/execution
- APIs: ~$0.01/execution

**Total**: ~$6-25 per execution

With 10-minute intervals: ~$25,000-100,000/month

💡 **Tip**: Increase interval to hourly to reduce costs by 6x

## Support

Questions? Check:
1. [README.md](./README.md) - Full documentation
2. [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Detailed deployment steps
3. [CRE Docs](https://docs.chain.link/chainlink-runtime-environment) - Official documentation

Happy building! 🚀

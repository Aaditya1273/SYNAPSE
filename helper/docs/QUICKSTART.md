# CrestAI - Quick Start Guide

## 🚀 Get Running in 5 Minutes

### Step 1: Install Dependencies (1 min)

```bash
# Install Node packages
npm install

# Install Chainlink CRE CLI globally
npm install -g @chainlink/cre-cli
```

### Step 2: Configure Secrets (1 min)

```bash
# Copy example secrets
cp cre-workflow/secrets.example.json cre-workflow/secrets.json

# Edit with your API keys (optional for simulation)
nano cre-workflow/secrets.json
```

For simulation, you can use mock values:
```json
{
  "BANK_API_KEY": "mock_key",
  "AI_API_KEY": "mock_key",
  "PLAID_CLIENT_ID": "mock_id",
  "PLAID_SECRET": "mock_secret"
}
```

### Step 3: Run Simulation (1 min)

```bash
# Run the complete workflow simulation
./simulate.sh
```

You should see:
```
🚀 CrestAI - Chainlink Runtime Environment Simulation
==================================================

📋 Workflow Arguments:
{
  "userAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "worldIdNullifier": "0x1234...",
  "accessToken": "mock_access_token"
}

🏦 Fetching private bank data...
✅ Bank data retrieved (PII redacted)

🧹 Sanitizing data...
✅ Data sanitized

🤖 Analyzing with AI...
✅ AI analysis complete
   - Credit Score: 85/100

📦 Encoding result for on-chain verification...
✅ Data encoded

⛓️  Simulating on-chain submission...
✅ Transaction would be submitted to CrestVault.receiveScore()

✨ Simulation complete!
```

### Step 4: Start Frontend (1 min)

```bash
# Run Next.js development server
npm run dev
```

Visit: http://localhost:3000

### Step 5: Test the Flow (1 min)

1. Click "Connect Wallet" (use MetaMask)
2. Click "Verify with World ID" (simulation mode)
3. Click "Start Credit Analysis"
4. Watch the animated workflow
5. See your credit score appear!

## 🎯 What Just Happened?

### The Simulation Flow

```
User Input → CRE Workflow → AI Analysis → Smart Contract → DeFi Loan
```

1. **User Input**: Wallet address + World ID verification
2. **CRE Workflow**: 
   - Fetches bank data (simulated)
   - Removes PII
   - Sends to AI
3. **AI Analysis**: 
   - Analyzes transactions
   - Generates credit score (85/100)
4. **Smart Contract**: 
   - Receives encoded score
   - Enables undercollateralized loans
5. **DeFi Loan**: 
   - User can borrow with 105% collateral
   - 4.5% APR

## 📊 Understanding the Output

### Simulation Results

The simulation creates `simulation-results.json`:

```json
{
  "workflowArgs": {
    "userAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "worldIdNullifier": "0x1234...",
    "accessToken": "mock_access_token"
  },
  "bankDataSummary": {
    "transactionCount": 6,
    "totalIncome": 7000.00,
    "totalExpenses": 2577.80,
    "netCashFlow": 4422.20,
    "averageBalance": 5420.50
  },
  "aiResult": {
    "credit_score": 85,
    "justification": "Consistent income with stable payment history",
    "risk_factors": [
      "Low debt-to-income ratio",
      "Regular income deposits",
      "Minimal overdrafts"
    ]
  },
  "encodedData": "0x000000...",
  "timestamp": 1709481664
}
```

## 🔧 Troubleshooting

### Issue: CRE CLI not found

```bash
# Install globally
npm install -g @chainlink/cre-cli

# Verify installation
cre --version
```

### Issue: Secrets file missing

```bash
# Copy example
cp cre-workflow/secrets.example.json cre-workflow/secrets.json
```

### Issue: Port 3000 already in use

```bash
# Use different port
PORT=3001 npm run dev
```

### Issue: Wallet connection fails

- Make sure MetaMask is installed
- Switch to a testnet (Arbitrum Sepolia)
- Refresh the page

## 🎨 Frontend Features

### Animations

The dashboard includes professional GSAP animations:

1. **Score Counter**: Counts from 0 to 85
2. **Gauge Arc**: Rotates with elastic bounce
3. **Card Stagger**: Cards fade in sequentially
4. **Particle Celebration**: Confetti on score reveal

### Real-time Status

Watch the workflow progress:
- "Fetching private bank data..."
- "Sanitizing data and removing PII..."
- "AI analyzing financial patterns..."
- "Generating credit score..."

## 📈 Next Steps

### Deploy to Testnet

```bash
# Setup environment
cp .env.example .env
# Add your PRIVATE_KEY and RPC_URL

# Deploy contracts
npm run deploy:testnet
```

### Connect Real Bank Data

1. Sign up for Plaid API: https://plaid.com
2. Get API credentials
3. Update `cre-workflow/secrets.json`
4. Run workflow with real data

### Configure World ID

1. Create app: https://developer.worldcoin.org
2. Get APP_ID
3. Update `.env`:
   ```
   NEXT_PUBLIC_WORLD_ID_APP_ID=app_your_id
   ```

### Deploy to Production

```bash
# Build frontend
npm run build

# Deploy to Vercel
vercel deploy

# Deploy contracts to mainnet
npm run deploy:mainnet
```

## 🏆 Hackathon Demo

### For Judges

1. **Run Simulation**: `./simulate.sh`
2. **Show Results**: Open `simulation-results.json`
3. **Demo Frontend**: Visit http://localhost:3000
4. **Explain Flow**: Use the data flow diagram
5. **Show Code**: Highlight key files:
   - `cre-workflow/index.ts` (CRE logic)
   - `contracts/CrestVault.sol` (Smart contract)
   - `src/app/dashboard/page.tsx` (Frontend)

### Key Points to Emphasize

✅ **Privacy**: PII never leaves user's device unencrypted
✅ **Security**: Chainlink CRE + World ID + ZK proofs
✅ **Innovation**: AI-powered undercollateralized lending
✅ **UX**: Professional animations and real-time updates
✅ **Production-Ready**: Comprehensive testing and documentation

## 📚 Additional Resources

- [Full Documentation](./README.md)
- [Hackathon Submission](./HACKATHON_SUBMISSION.md)
- [Technical Architecture](./docs/TECHNICAL.md)
- [API Reference](./docs/API.md)

## 🤝 Need Help?

- GitHub Issues: https://github.com/yourusername/crestai/issues
- Discord: https://discord.gg/crestai
- Email: support@crestai.io

---

**Built for Chainlink Convergence Hackathon 2024** 🏆

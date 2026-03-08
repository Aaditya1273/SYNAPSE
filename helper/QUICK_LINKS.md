# PrivaCRE - Quick Links Reference Card

## 🌐 Live Application
**Frontend**: https://privacre.netlify.app

## ⛓️ Smart Contracts (Tenderly Virtual TestNet)

### Main Contracts
| Contract | Address | Link |
|----------|---------|------|
| **PrivaVault** | `0x49BdEEcB489E037C0f6928dEe6a043908b8d8877` | [View](https://dashboard.tenderly.co/explorer/vnet/7611135a-8515-41d7-8146-9390be57f949/address/0x49BdEEcB489E037C0f6928dEe6a043908b8d8877) |
| **MockUSDC** | `0x5432bed5E495f625640bc6210087D07C14DF5FE3` | [View](https://dashboard.tenderly.co/explorer/vnet/7611135a-8515-41d7-8146-9390be57f949/address/0x5432bed5E495f625640bc6210087D07C14DF5FE3) |
| **MockPriceFeed** | `0xb8d323B1F3524d2e634B9Fa2537425AD39712140` | [View](https://dashboard.tenderly.co/explorer/vnet/7611135a-8515-41d7-8146-9390be57f949/address/0xb8d323B1F3524d2e634B9Fa2537425AD39712140) |
| **CRE Oracle** | `0xAd0799D4D6564c945C448D8BcFA890c41e111A98` | [View](https://dashboard.tenderly.co/explorer/vnet/7611135a-8515-41d7-8146-9390be57f949/address/0xAd0799D4D6564c945C448D8BcFA890c41e111A98) |

### Network Information
- **Network**: Tenderly Virtual TestNet (Sepolia)
- **Chain ID**: 11155111
- **RPC URL**: `https://virtual.sepolia.eu.rpc.tenderly.co/7611135a-8515-41d7-8146-9390be57f949`
- **Explorer**: https://dashboard.tenderly.co/explorer/vnet/7611135a-8515-41d7-8146-9390be57f949

## 📦 Repository
- **GitHub**: https://github.com/LSUDOKO/PrivaCRE
- **CRE Workflow**: [/PrivaCRE/my-workflow/](./PrivaCRE/my-workflow/)
- **Smart Contracts**: [/contracts/](./contracts/)
- **Frontend**: [/src/](./src/)

## 📚 Documentation
- **Main Docs**: [/docs](./docs)
- **Quick Start**: [docs/QUICKSTART.md](./docs/QUICKSTART.md)
- **Technical Architecture**: [docs/TECHNICAL_ARCHITECTURE.md](./docs/TECHNICAL_ARCHITECTURE.md)
- **CRE Integration**: [docs/CRE_INTEGRATION_SUMMARY.md](./docs/CRE_INTEGRATION_SUMMARY.md)
- **Plaid Integration**: [docs/PLAID_INTEGRATION_GUIDE.md](./docs/PLAID_INTEGRATION_GUIDE.md)
- **World ID Integration**: [docs/WORLD_ID_INTEGRATION_COMPLETE.md](./docs/WORLD_ID_INTEGRATION_COMPLETE.md)

## 🎯 Hackathon Submission
- **Submission Form**: [docs/HACKATHON_SUBMISSION_FORM.md](./docs/HACKATHON_SUBMISSION_FORM.md)
- **Video Script**: [docs/HACKATHON_VIDEO_SCRIPT.md](./docs/HACKATHON_VIDEO_SCRIPT.md)
- **Demo Script**: [docs/HACKATHON_DEMO_SCRIPT.md](./docs/HACKATHON_DEMO_SCRIPT.md)
- **Judge Reference**: [docs/JUDGE_QUICK_REFERENCE.md](./docs/JUDGE_QUICK_REFERENCE.md)

## 🔑 Key Features Demo Flow

1. **Connect Wallet** → https://privacre.netlify.app
2. **Verify World ID** → `/auth` page
3. **Generate Credit Score** → `/dashboard` page
4. **Borrow Funds** → `/lending` page
5. **Bridge Score** → `/bridge` page

## 🧪 Test Credentials

### Plaid Sandbox
- Username: `user_good`
- Password: `pass_good`

### World ID
- Use World ID Simulator for testing
- Or scan QR code with World App

## 📊 Contract Interactions

### Read Credit Score
```javascript
const score = await vault.userScores('0xYourAddress');
```

### Check Max Loan
```javascript
const maxLoan = await vault.getMaxLoan('0xYourAddress');
```

### View on Tenderly
https://dashboard.tenderly.co/explorer/vnet/7611135a-8515-41d7-8146-9390be57f949

## 🚀 Quick Commands

```bash
# Install dependencies
npm install --legacy-peer-deps

# Run development server
npm run dev

# Deploy contracts
npx hardhat run scripts/deploy.js --network tenderly

# Run CRE simulation
cd PrivaCRE/my-workflow && cre workflow simulate

# Run tests
npx hardhat test
```

## 📞 Contact
- **GitHub**: https://github.com/LSUDOKO/PrivaCRE
- **Issues**: https://github.com/LSUDOKO/PrivaCRE/issues

---

**Last Updated**: March 8, 2026
**Deployment Date**: March 7, 2026
**Hackathon**: Chainlink Convergence 2026

# ⚡ Quick Commands Reference

## 🚀 Launch Demo
```bash
./quick-demo.sh
```
Runs pre-flight checks and starts dev server.

---

## 🧪 Testing

### Run All Tests
```bash
./test-e2e.sh
```

### Test Plaid Setup
```bash
node test-plaid-setup.js
```

### Test CRE Workflow
```bash
npm run simulate
```

### Test Smart Contracts
```bash
npm run test:contracts
```

---

## 🔧 Development

### Start Dev Server
```bash
npm run dev
```
Opens at `http://localhost:3000`

### Build for Production
```bash
npm run build
npm start
```

### Lint Code
```bash
npm run lint
```

---

## 📦 Deployment

### Deploy Contracts to Tenderly
```bash
npm run deploy:tenderly
```

### Deploy to Arbitrum Sepolia
```bash
npm run deploy:testnet
```

### Check Contract Balances
```bash
npx hardhat run scripts/check-balances.js --network tenderly
```

---

## 🔐 Secrets Management

### View CRE Secrets
```bash
cat PrivaCRE/secrets.yaml
```

### Add New Secret
```bash
echo "NEW_SECRET: value" >> PrivaCRE/secrets.yaml
```

### Verify Environment
```bash
cat .env | grep -E "PLAID|GROQ|WORLD_ID|RPC"
```

---

## 🐛 Debugging

### Check Logs
```bash
# Frontend logs (browser console)
# Backend logs (terminal running npm run dev)

# Check specific API
curl -X POST http://localhost:3000/api/cre
```

### Reset Demo State
```bash
# Clear localStorage (in browser console)
localStorage.clear()

# Or reset specific keys
localStorage.removeItem('privacre_verified')
localStorage.removeItem('privacre_bank')
localStorage.removeItem('privacre_connection_status')
```

### Check Contract State
```bash
npx hardhat console --network tenderly

# In console:
const vault = await ethers.getContractAt("PrivaVault", "0x...");
const score = await vault.getScore("0x...");
console.log(score.toString());
```

---

## 📊 Monitoring

### Watch Logs in Real-Time
```bash
# Terminal 1: Dev server
npm run dev

# Terminal 2: Watch file changes
watch -n 1 'ls -lh src/app/api/cre/route.ts'
```

### Check Network Activity
```bash
# In browser DevTools:
# Network tab → Filter by "cre" or "plaid"
```

---

## 🎬 Demo Preparation

### Quick Demo Setup
```bash
# 1. Run tests
./test-e2e.sh

# 2. Start server
npm run dev

# 3. Open browser
open http://localhost:3000

# 4. Follow DEMO_SCRIPT.md
```

### Reset for Fresh Demo
```bash
# Clear browser data
# In browser console:
localStorage.clear()
sessionStorage.clear()

# Restart server
# Ctrl+C then npm run dev
```

---

## 📝 Documentation

### View All Docs
```bash
ls -1 *.md
```

### Key Docs
- `README.md` - Main project overview
- `DEMO_SCRIPT.md` - 5-minute demo flow
- `END_TO_END_TEST_GUIDE.md` - Complete testing guide
- `FINAL_CHECKLIST.md` - Pre-submission checklist
- `IMPLEMENTATION_SUMMARY.md` - What we built

### Search Docs
```bash
grep -r "Plaid" *.md
grep -r "CRE" *.md
grep -r "World ID" *.md
```

---

## 🔄 Git Commands

### Commit Changes
```bash
git add .
git commit -m "feat: implement feature"
git push origin main
```

### Check Status
```bash
git status
git log --oneline -10
```

### Create Branch
```bash
git checkout -b feature/new-feature
```

---

## 🎯 One-Liners

### Full Setup from Scratch
```bash
npm install --legacy-peer-deps && npm run compile && npm run deploy:tenderly && npm run dev
```

### Quick Test Everything
```bash
./test-e2e.sh && npm run simulate && npm run test:contracts
```

### Demo Ready Check
```bash
./test-e2e.sh && node test-plaid-setup.js && echo "✅ Ready to demo!"
```

### Clean Install
```bash
rm -rf node_modules package-lock.json && npm install --legacy-peer-deps
```

---

## 🆘 Emergency Fixes

### Server Won't Start
```bash
# Kill existing process
lsof -ti:3000 | xargs kill -9

# Restart
npm run dev
```

### Plaid Not Working
```bash
# Check credentials
echo $PLAID_CLIENT_ID
echo $PLAID_SECRET

# Test API
curl -X POST http://localhost:3000/api/plaid/create-link-token
```

### Contracts Not Deployed
```bash
# Redeploy
npm run deploy:tenderly

# Verify
cat src/lib/contract-addresses.json
```

### World ID Fails
```bash
# Check app ID
echo $NEXT_PUBLIC_WORLD_ID_APP_ID

# Should start with "app_staging_" or "app_"
```

---

## 📱 Browser Console Commands

### Check State
```javascript
// Check localStorage
console.log('Verified:', localStorage.getItem('privacre_verified'));
console.log('Bank:', localStorage.getItem('privacre_bank'));
console.log('Score:', localStorage.getItem('privacre_last_score'));
console.log('TX:', localStorage.getItem('privacre_last_tx'));

// Check wallet
console.log('Connected:', window.ethereum?.selectedAddress);
```

### Reset State
```javascript
// Clear all
localStorage.clear();

// Or specific keys
localStorage.removeItem('privacre_verified');
localStorage.removeItem('privacre_bank');
localStorage.removeItem('privacre_connection_status');
```

---

## 🎓 Learning Resources

### Chainlink CRE
- Docs: https://docs.chain.link/chainlink-functions
- Examples: https://github.com/smartcontractkit/chainlink-functions-toolkit

### Plaid
- Quickstart: https://plaid.com/docs/quickstart/
- Sandbox: https://plaid.com/docs/sandbox/

### World ID
- Docs: https://docs.worldcoin.org/
- IDKit: https://docs.worldcoin.org/id/idkit

### Groq
- API: https://console.groq.com/docs/quickstart
- Models: https://console.groq.com/docs/models

---

**Pro Tip**: Bookmark this file for quick reference during development and demos! 🚀

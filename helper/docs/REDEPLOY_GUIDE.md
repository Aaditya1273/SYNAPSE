# Redeployment Guide for New Tenderly Network

## Problem
The contract addresses in `src/lib/contract-addresses.json` are from the OLD Tenderly network. When you switched to the NEW Tenderly RPC URL, the contracts don't exist there, causing the score fetch to fail with:

```
Failed to read userScore mapping: could not decode result data (value="0x")
```

## Solution: Redeploy Contracts

### Step 1: Verify Environment Variables

Check your `.env` file has the correct new Tenderly RPC:

```bash
cat .env | grep TENDERLY
```

Should show:
```
NEXT_PUBLIC_TENDERLY_RPC=https://virtual.sepolia.eu.rpc.tenderly.co/7611135a-8515-41d7-8146-9390be57f949
RPC_URL_SEPOLIA=https://virtual.sepolia.eu.rpc.tenderly.co/7611135a-8515-41d7-8146-9390be57f949
```

### Step 2: Run Deployment Script

```bash
./redeploy-to-new-tenderly.sh
```

Or manually:

```bash
# Compile contracts
npx hardhat compile

# Deploy to new Tenderly network
npx hardhat run scripts/deploy.js --network tenderly
```

### Step 3: Verify Deployment

Check the new addresses:

```bash
cat src/lib/contract-addresses.json
```

You should see new addresses and updated timestamp.

### Step 4: Restart Frontend

```bash
# Stop current dev server (Ctrl+C)
# Start fresh
npm run dev
```

### Step 5: Clear Browser State

In your browser console:
```javascript
localStorage.clear()
```

Then refresh the page and reconnect your wallet.

### Step 6: Test the Flow

1. **Connect Wallet** - Make sure you're on the correct network (Chain ID: 99911155111)
2. **Verify with World ID** on Dashboard
3. **Run Credit Analysis** - This will:
   - Call the CRE API
   - Submit score to the NEW contract
   - Save score in localStorage
4. **Go to Lending Page** - Score should now appear
5. **Check Console Logs** - Should show:
   ```
   [Lending] Score Debug: {
     userScoreRaw: 86n,  // ← Should have a value now!
     isSynced: true,     // ← Should be true!
     ...
   }
   ```

## Troubleshooting

### Issue: "Insufficient funds for gas"
**Solution**: Your deployer wallet needs ETH on the Tenderly network. Use Tenderly's faucet or fund it manually.

### Issue: "Network not found"
**Solution**: Make sure `RPC_URL_SEPOLIA` in `.env` matches `NEXT_PUBLIC_TENDERLY_RPC`

### Issue: Score still not showing
**Solution**: 
1. Clear localStorage: `localStorage.clear()`
2. Check contract address in console logs
3. Verify you're on correct network (Chain ID: 99911155111)
4. Re-run credit analysis from Dashboard

### Issue: "Transaction failed"
**Solution**: Check Tenderly dashboard for transaction details and error messages

## What Gets Deployed

The deployment script will deploy:

1. **MockUSDC** - Test USDC token for the vault
2. **MockPriceFeed** - Mock Chainlink price feed (ETH at $2500)
3. **PrivaVault** - Main lending vault contract with:
   - Credit score storage (`userScores` mapping)
   - Loan management
   - Collateral calculations
   - Oracle integration

## Contract Addresses After Deployment

The script automatically updates `src/lib/contract-addresses.json` with:

```json
{
  "network": "tenderly",
  "vault": "0x...",      // ← New PrivaVault address
  "usdc": "0x...",       // ← New MockUSDC address
  "oracle": "0x...",     // ← Oracle address (your deployer)
  "priceFeed": "0x...",  // ← New MockPriceFeed address
  "deployer": "0x...",
  "timestamp": "2026-03-07..."
}
```

## Verification

After deployment, verify the contract is working:

```bash
# Check if contract exists at address
npx hardhat console --network tenderly
```

Then in the console:
```javascript
const vault = await ethers.getContractAt("PrivaVault", "YOUR_VAULT_ADDRESS");
await vault.oracle(); // Should return your oracle address
```

## Important Notes

1. **Old contracts are gone** - The old Tenderly network contracts are no longer accessible
2. **Fresh start** - All previous scores and loans are on the old network
3. **Test data** - You'll need to re-run credit analysis to get new scores
4. **Faucet** - Use the "Get Test USDC" and "Fund Vault" buttons on the Lending page

## Quick Commands Reference

```bash
# Full redeploy
./redeploy-to-new-tenderly.sh

# Just compile
npx hardhat compile

# Just deploy
npx hardhat run scripts/deploy.js --network tenderly

# Check deployment
cat src/lib/contract-addresses.json

# Restart frontend
npm run dev
```

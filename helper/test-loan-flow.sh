#!/bin/bash

echo "🧪 Testing Loan Flow After Fixes"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}📋 Pre-flight Checklist:${NC}"
echo ""
echo "1. ✅ Contract redeployed with score validation"
echo "2. ✅ Frontend updated with sync checks"
echo "3. ✅ Tenderly links corrected"
echo "4. ✅ Warning banners added"
echo ""

echo -e "${YELLOW}🔗 New Contract Addresses:${NC}"
cat src/lib/contract-addresses.json | grep -E '"vault"|"usdc"|"oracle"'
echo ""

echo -e "${YELLOW}📝 Testing Steps:${NC}"
echo ""
echo "Step 1: Open your browser to http://localhost:3000"
echo "Step 2: Go to Dashboard"
echo "Step 3: Verify with World ID"
echo "Step 4: Run CRE Analysis"
echo "Step 5: Wait for transaction confirmation"
echo "Step 6: Check for green 'On-Chain' badge"
echo "Step 7: Go to Lending page"
echo "Step 8: Enter borrow amount (e.g., 100 USDC)"
echo "Step 9: Click 'Execute Loan via CRE'"
echo "Step 10: Click transaction link to verify on Tenderly"
echo ""

echo -e "${YELLOW}🎯 Expected Results:${NC}"
echo ""
echo "✅ If score is synced: Loan executes successfully"
echo "❌ If score not synced: Red warning banner appears"
echo "❌ If no score: Button shows 'No Credit Score - Run Analysis First'"
echo "✅ Transaction link opens correct Tenderly page"
echo ""

echo -e "${YELLOW}🔍 Verification URLs:${NC}"
echo ""
echo "Vault Contract:"
echo "https://dashboard.tenderly.co/LSUDOKO/project/testnet/29209eb9-c1b7-42a0-97d9-1ee5be8c8eb9/contract/0xE2552cE8276bdCf7351eCFEb36D587409B19bbfa"
echo ""
echo "Example Transaction:"
echo "https://dashboard.tenderly.co/LSUDOKO/project/testnet/29209eb9-c1b7-42a0-97d9-1ee5be8c8eb9/tx/0xb44f1b286c7ad12dd7440cffbeddfd6fa3d9717bee4b255a51ff562d4fa0618b"
echo ""

echo -e "${GREEN}✨ Ready to test!${NC}"
echo ""
echo "Run: npm run dev"
echo "Then follow the testing steps above."

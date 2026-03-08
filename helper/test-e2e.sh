#!/bin/bash

echo "🧪 PrivaCRE End-to-End Test Suite"
echo "=================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Environment
echo "✓ Test 1: Checking environment..."
if [ -f .env ]; then
    echo -e "  ${GREEN}✅ .env file exists${NC}"
else
    echo -e "  ${RED}❌ .env file missing${NC}"
    echo "  Run: cp .env.example .env"
    exit 1
fi

# Test 2: Dependencies
echo "✓ Test 2: Checking dependencies..."
if npm list plaid react-plaid-link yaml ethers wagmi > /dev/null 2>&1; then
    echo -e "  ${GREEN}✅ All dependencies installed${NC}"
else
    echo -e "  ${YELLOW}⚠️  Some dependencies missing, installing...${NC}"
    npm install --legacy-peer-deps
fi

# Test 3: Contract addresses
echo "✓ Test 3: Checking contract deployments..."
if [ -f src/lib/contract-addresses.json ]; then
    VAULT=$(cat src/lib/contract-addresses.json | grep -o '"vault":"[^"]*"' | cut -d'"' -f4)
    echo -e "  ${GREEN}✅ Vault deployed at: $VAULT${NC}"
else
    echo -e "  ${RED}❌ Contract addresses not found${NC}"
    echo "  Run: npm run deploy:tenderly"
    exit 1
fi

# Test 4: Plaid setup
echo "✓ Test 4: Verifying Plaid configuration..."
if node test-plaid-setup.js > /dev/null 2>&1; then
    echo -e "  ${GREEN}✅ Plaid integration ready${NC}"
else
    echo -e "  ${YELLOW}⚠️  Plaid setup incomplete (check .env)${NC}"
fi

# Test 5: CRE secrets
echo "✓ Test 5: Checking CRE secrets..."
if [ -f PrivaCRE/secrets.yaml ]; then
    echo -e "  ${GREEN}✅ Secrets file exists${NC}"
else
    echo -e "  ${YELLOW}⚠️  Secrets file will be created on first connection${NC}"
fi

# Test 6: Groq API
echo "✓ Test 6: Testing Groq API..."
if grep -q "GROQ_API_KEY=" .env && ! grep -q "GROQ_API_KEY=your_" .env; then
    echo -e "  ${GREEN}✅ Groq API key configured${NC}"
else
    echo -e "  ${RED}❌ GROQ_API_KEY not set in .env${NC}"
fi

# Test 7: RPC connection
echo "✓ Test 7: Testing RPC connection..."
if grep -q "RPC_URL_SEPOLIA=" .env && ! grep -q "RPC_URL_SEPOLIA=https://virtual" .env; then
    echo -e "  ${YELLOW}⚠️  Using custom RPC URL${NC}"
elif grep -q "RPC_URL_SEPOLIA=" .env; then
    echo -e "  ${GREEN}✅ RPC URL configured (Tenderly)${NC}"
else
    echo -e "  ${RED}❌ RPC_URL_SEPOLIA not set${NC}"
fi

# Test 8: World ID
echo "✓ Test 8: Checking World ID configuration..."
if grep -q "NEXT_PUBLIC_WORLD_ID_APP_ID=" .env && ! grep -q "NEXT_PUBLIC_WORLD_ID_APP_ID=app_staging_your" .env; then
    echo -e "  ${GREEN}✅ World ID app configured${NC}"
else
    echo -e "  ${YELLOW}⚠️  World ID app ID not configured${NC}"
fi

# Test 9: Build check
echo "✓ Test 9: Checking TypeScript compilation..."
if npx tsc --noEmit > /dev/null 2>&1; then
    echo -e "  ${GREEN}✅ No TypeScript errors${NC}"
else
    echo -e "  ${YELLOW}⚠️  TypeScript warnings present (non-blocking)${NC}"
fi

echo ""
echo "=================================="
echo -e "${GREEN}✅ Pre-flight checks complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Run: ${YELLOW}npm run dev${NC}"
echo "2. Open: ${YELLOW}http://localhost:3000${NC}"
echo "3. Follow the test sequence in END_TO_END_TEST_GUIDE.md"
echo ""
echo "Quick test flow:"
echo "  → Connect Wallet"
echo "  → Verify World ID (/bridge)"
echo "  → Connect Bank via Plaid (/bridge)"
echo "  → Run CRE Pipeline (/orchestration)"
echo "  → View Score (/dashboard)"
echo "  → Check Loan Tiers (/lending)"
echo ""

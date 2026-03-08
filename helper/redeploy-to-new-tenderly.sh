#!/bin/bash

echo "🔄 Redeploying PrivaCRE to New Tenderly Network"
echo "================================================"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    exit 1
fi

# Source the .env file
source .env

# Verify RPC URL is set
if [ -z "$RPC_URL_SEPOLIA" ]; then
    echo "❌ Error: RPC_URL_SEPOLIA not set in .env"
    exit 1
fi

echo "✅ Using RPC: $RPC_URL_SEPOLIA"
echo ""

# Compile contracts
echo "📦 Compiling contracts..."
npx hardhat compile

if [ $? -ne 0 ]; then
    echo "❌ Compilation failed!"
    exit 1
fi

echo "✅ Compilation successful"
echo ""

# Deploy to Tenderly
echo "🚀 Deploying to Tenderly network..."
npx hardhat run scripts/deploy.js --network tenderly

if [ $? -ne 0 ]; then
    echo "❌ Deployment failed!"
    exit 1
fi

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "1. Check src/lib/contract-addresses.json for new addresses"
echo "2. Restart your Next.js dev server: npm run dev"
echo "3. Clear browser localStorage and reconnect wallet"
echo "4. Run credit analysis on Dashboard"
echo "5. Try borrowing on Lending page"
echo ""

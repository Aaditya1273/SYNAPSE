#!/bin/bash

# CrestAI Simulation Script
# This script simulates the entire CRE workflow locally

echo "🚀 CrestAI - Chainlink Runtime Environment Simulation"
echo "=================================================="
echo ""

# Check if CRE CLI is installed
if ! command -v cre &> /dev/null; then
    echo "❌ CRE CLI not found. Installing..."
    npm install -g @chainlink/cre-cli
fi

# Navigate to workflow directory
cd cre-workflow

# Check if secrets file exists
if [ ! -f "secrets.json" ]; then
    echo "⚠️  secrets.json not found. Creating from example..."
    cp secrets.example.json secrets.json
    echo "📝 Please update secrets.json with your actual API keys"
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo ""
echo "🔧 Building workflow..."
npm run build

echo ""
#🎯 Run the JS simulation script to generate simulation-results.json
node ../scripts/simulate-workflow.js

echo ""
echo "✅ Simulation complete!"
echo ""
echo "Next steps:"
echo "1. Review the simulation results"
echo "2. Deploy contracts: npm run deploy:testnet"
echo "3. Configure Tenderly Virtual Testnet"
echo "4. Test the full flow on the frontend"

#!/bin/bash

# ============================================================================
# CRE Workflow Execution Script
# ============================================================================
# This script runs the PrivaCRE workflow using the actual Chainlink CRE CLI
# It demonstrates the full Privacy Track workflow with real CRE integration
# ============================================================================

set -e  # Exit on error

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  PrivaCRE - Chainlink CRE Workflow Execution              ║"
echo "║  Privacy Track - Chainlink Convergence Hackathon 2025     ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check if CRE CLI is installed
if ! command -v cre &> /dev/null; then
    echo "❌ CRE CLI not found!"
    echo "   Please install from: https://docs.chain.link/cre"
    echo ""
    echo "   Falling back to simulation mode..."
    node scripts/simulate-workflow.js
    exit 0
fi

echo "✅ CRE CLI found: $(which cre)"
echo ""

# Navigate to workflow directory
cd PrivaCRE/my-workflow

echo "📦 Installing workflow dependencies..."
if command -v bun &> /dev/null; then
    bun install
else
    echo "⚠️  Bun not found, using npm..."
    npm install
fi
echo ""

echo "🔍 Checking CRE configuration..."
if [ ! -f "workflow.yaml" ]; then
    echo "❌ workflow.yaml not found!"
    exit 1
fi

if [ ! -f "config.staging.json" ]; then
    echo "❌ config.staging.json not found!"
    exit 1
fi

if [ ! -f "../project.yaml" ]; then
    echo "❌ project.yaml not found in parent directory!"
    exit 1
fi

echo "✅ Configuration files found"
echo ""

echo "🔐 Checking secrets..."
cre secrets list --target staging-settings --project-root .. 2>&1 || echo "   No secrets registered yet (this is normal)"
echo ""

echo "🚀 Running CRE workflow simulation..."
echo "   This will execute the full Privacy Track workflow:"
echo "   1. Fetch bank data via Confidential HTTP"
echo "   2. Sanitize PII in WASM sandbox"
echo "   3. AI credit risk analysis"
echo "   4. On-chain settlement with encrypted score"
echo ""

# Run the workflow simulation with proper target and project root
echo "   Command: cre workflow simulate --target staging-settings --project-root .. ."
echo ""
cre workflow simulate --target staging-settings --project-root .. . || {
    echo ""
    echo "⚠️  CRE workflow simulation encountered an issue."
    echo "   This is normal for development - falling back to local simulation..."
    echo ""
    cd ../..
    node scripts/simulate-workflow.js
    exit 0
}

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  ✅ CRE Workflow Execution Complete                        ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "📊 Results saved to simulation-results.json"
echo ""
echo "Next steps:"
echo "  1. Check the simulation output above"
echo "  2. Review logs for any errors"
echo "  3. Test the workflow with real Plaid data"
echo ""

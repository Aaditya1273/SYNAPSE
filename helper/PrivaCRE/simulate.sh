#!/bin/bash

# ============================================================================
# PrivaCRE Workflow Simulation Script
# ============================================================================
# This script simulates the CreditScoreWorkflow locally using the CRE CLI
# It uses local .env secrets and does not require DON deployment
# ============================================================================

set -e  # Exit on error

echo "=================================================="
echo "  PrivaCRE Credit Score Workflow Simulation"
echo "=================================================="
echo ""

# Check if CRE CLI is installed
if ! command -v cre &> /dev/null; then
    echo "❌ Error: CRE CLI is not installed"
    echo ""
    echo "Install it with:"
    echo "  npm install -g @chainlink/cre-cli"
    echo ""
    exit 1
fi

echo "✅ CRE CLI found"
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ Error: .env file not found"
    echo ""
    echo "Create it from the example:"
    echo "  cp .env.example .env"
    echo "  # Then edit .env with your API keys"
    echo ""
    exit 1
fi

echo "✅ .env file found"
echo ""

# Check if workflow directory exists
if [ ! -d "my-workflow" ]; then
    echo "❌ Error: my-workflow directory not found"
    exit 1
fi

echo "✅ Workflow directory found"
echo ""

# Navigate to workflow directory
cd my-workflow

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    bun install
    echo ""
fi

echo "✅ Dependencies installed"
echo ""

# Run the simulation
echo "🚀 Starting workflow simulation..."
echo ""
echo "Target: staging-settings"
echo "Config: config.staging.json"
echo "Secrets: ../secrets.yaml"
echo ""
echo "=================================================="
echo ""

cre workflow simulate CreditScoreWorkflow --target staging-settings

echo ""
echo "=================================================="
echo "  Simulation Complete!"
echo "=================================================="
echo ""
echo "Next steps:"
echo "  1. Review the simulation output above"
echo "  2. Deploy secrets: cre secrets create ../secrets.yaml --target staging-settings"
echo "  3. Deploy workflow: cre workflow deploy CreditScoreWorkflow --target staging-settings"
echo "  4. Activate workflow: cre workflow activate CreditScoreWorkflow --target staging-settings"
echo ""

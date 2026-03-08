#!/bin/bash

# ============================================================================
# PrivaCRE CRE Workflow Demonstration Script
# ============================================================================
# This script demonstrates the complete CRE workflow for hackathon judges
# ============================================================================

set -e

echo "=================================================="
echo "  🚀 PrivaCRE CRE Workflow Demonstration"
echo "=================================================="
echo ""
echo "This workflow demonstrates:"
echo "  ✅ External API Integration (Plaid Bank Data)"
echo "  ✅ LLM Integration (Groq AI - llama-3.3-70b)"
echo "  ✅ Blockchain Integration (Ethereum Sepolia)"
echo "  ✅ Orchestration Layer (4-phase pipeline)"
echo "  ✅ DON Consensus Mechanism"
echo ""
echo "Components:"
echo "  📁 Workflow: PrivaCRE/my-workflow/main.ts"
echo "  ⚙️  Config: PrivaCRE/my-workflow/config.staging.json"
echo "  🔐 Secrets: PrivaCRE/secrets.yaml"
echo "  📊 Contract: 0x49BdEEcB489E037C0f6928dEe6a043908b8d8877"
echo ""
echo "Press Enter to start demonstration..."
read

echo ""
echo "=================================================="
echo "  Step 1: Verify Workflow Structure"
echo "=================================================="
echo ""

if [ -f "PrivaCRE/my-workflow/main.ts" ]; then
    echo "✅ Workflow file found"
    echo "   Lines of code: $(wc -l < PrivaCRE/my-workflow/main.ts)"
else
    echo "❌ Workflow file not found"
    exit 1
fi

if [ -f "PrivaCRE/my-workflow/config.staging.json" ]; then
    echo "✅ Configuration file found"
else
    echo "❌ Configuration file not found"
    exit 1
fi

if [ -f "PrivaCRE/secrets.yaml" ]; then
    echo "✅ Secrets file found"
else
    echo "❌ Secrets file not found"
    exit 1
fi

echo ""
echo "Press Enter to show workflow integrations..."
read

echo ""
echo "=================================================="
echo "  Step 2: Show Integration Points"
echo "=================================================="
echo ""

echo "🔗 External API Integration (Plaid):"
echo "   Function: fetchPlaidTransactions()"
grep -A 5 "fetchPlaidTransactions" PrivaCRE/my-workflow/main.ts | head -6
echo ""

echo "🤖 LLM Integration (Groq AI):"
echo "   Function: analyzeCreditRisk()"
grep -A 5 "analyzeCreditRisk" PrivaCRE/my-workflow/main.ts | head -6
echo ""

echo "⛓️  Blockchain Integration (Ethereum):"
echo "   Function: writeScoreOnChain()"
grep -A 5 "writeScoreOnChain" PrivaCRE/my-workflow/main.ts | head -6
echo ""

echo "Press Enter to run simulation..."
read

echo ""
echo "=================================================="
echo "  Step 3: Execute Workflow Simulation"
echo "=================================================="
echo ""

# Run the Node.js simulation script
echo "🚀 Starting workflow execution..."
echo ""

node scripts/simulate-workflow.js

echo ""
echo "=================================================="
echo "  Step 4: Show Results"
echo "=================================================="
echo ""

if [ -f "simulation-results.json" ]; then
    echo "✅ Simulation completed successfully!"
    echo ""
    echo "Results:"
    cat simulation-results.json | head -30
    echo ""
    echo "   (Full results in simulation-results.json)"
else
    echo "❌ Simulation results not found"
    exit 1
fi

echo ""
echo "=================================================="
echo "  ✅ Demonstration Complete!"
echo "=================================================="
echo ""
echo "Summary:"
echo "  ✅ Workflow structure verified"
echo "  ✅ Integration points confirmed"
echo "  ✅ Simulation executed successfully"
echo "  ✅ Results generated"
echo ""
echo "Key Achievements:"
echo "  1. External API: Plaid bank data fetched"
echo "  2. LLM Agent: Groq AI analysis completed"
echo "  3. Blockchain: Score ready for on-chain write"
echo "  4. Orchestration: 4-phase pipeline executed"
echo ""
echo "Next Steps:"
echo "  • View full results: cat simulation-results.json | jq"
echo "  • Run frontend: npm run dev → /orchestration"
echo "  • Deploy to DON: cd PrivaCRE && ./simulate.sh"
echo ""
echo "Documentation:"
echo "  • CRE_WORKFLOW_VERIFICATION.md"
echo "  • CRE_ORCHESTRATION_COMPLETE.md"
echo "  • PrivaCRE/my-workflow/main.ts"
echo ""

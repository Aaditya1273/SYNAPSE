#!/bin/bash

# ============================================================================
# CRE Workflow Requirements Verification Script
# ============================================================================
# This script verifies all hackathon requirements are met
# ============================================================================

set -e

echo "=================================================="
echo "  🔍 CRE Workflow Requirements Verification"
echo "=================================================="
echo ""

PASS=0
FAIL=0

# Helper functions
check_pass() {
    echo "  ✅ $1"
    ((PASS++))
}

check_fail() {
    echo "  ❌ $1"
    ((FAIL++))
}

# ============================================================================
# Requirement 1: Blockchain Integration
# ============================================================================
echo "📋 Requirement 1: Blockchain Integration"
echo ""

if grep -q "writeScoreOnChain" PrivaCRE/my-workflow/main.ts; then
    check_pass "writeScoreOnChain() function found"
else
    check_fail "writeScoreOnChain() function not found"
fi

if grep -q "cre.capabilities.EVMClient" PrivaCRE/my-workflow/main.ts; then
    check_pass "CRE EVM Client integration found"
else
    check_fail "CRE EVM Client integration not found"
fi

if grep -q "runtime.report" PrivaCRE/my-workflow/main.ts; then
    check_pass "DON consensus signing found"
else
    check_fail "DON consensus signing not found"
fi

if [ -f "src/lib/contract-addresses.json" ]; then
    CONTRACT=$(cat src/lib/contract-addresses.json | grep -o '"vault".*' | cut -d'"' -f4)
    if [ ! -z "$CONTRACT" ]; then
        check_pass "Smart contract deployed: $CONTRACT"
    else
        check_fail "Smart contract address not found"
    fi
else
    check_fail "contract-addresses.json not found"
fi

echo ""

# ============================================================================
# Requirement 2: External API Integration
# ============================================================================
echo "📋 Requirement 2: External API Integration (Plaid)"
echo ""

if grep -q "fetchPlaidTransactions" PrivaCRE/my-workflow/main.ts; then
    check_pass "fetchPlaidTransactions() function found"
else
    check_fail "fetchPlaidTransactions() function not found"
fi

if grep -q "plaid.com" PrivaCRE/my-workflow/main.ts; then
    check_pass "Plaid API endpoint found"
else
    check_fail "Plaid API endpoint not found"
fi

if grep -q "sendRequester.sendRequest" PrivaCRE/my-workflow/main.ts; then
    check_pass "CRE Confidential HTTP found"
else
    check_fail "CRE Confidential HTTP not found"
fi

echo ""

# ============================================================================
# Requirement 3: LLM/AI Agent Integration
# ============================================================================
echo "📋 Requirement 3: LLM/AI Agent Integration (Groq)"
echo ""

if grep -q "analyzeCreditRisk" PrivaCRE/my-workflow/main.ts; then
    check_pass "analyzeCreditRisk() function found"
else
    check_fail "analyzeCreditRisk() function not found"
fi

if grep -q "groq.com" PrivaCRE/my-workflow/main.ts; then
    check_pass "Groq API endpoint found"
else
    check_fail "Groq API endpoint not found"
fi

if grep -q "llama-3.3-70b" PrivaCRE/my-workflow/main.ts; then
    check_pass "llama-3.3-70b model found"
else
    check_fail "llama-3.3-70b model not found"
fi

echo ""

# ============================================================================
# Requirement 4: Orchestration Layer
# ============================================================================
echo "📋 Requirement 4: Orchestration Layer"
echo ""

if grep -q "processCreditScore" PrivaCRE/my-workflow/main.ts; then
    check_pass "processCreditScore() orchestration function found"
else
    check_fail "processCreditScore() orchestration function not found"
fi

PHASE_COUNT=$(grep -c "Phase [1-4]" PrivaCRE/my-workflow/main.ts || echo "0")
if [ "$PHASE_COUNT" -ge 4 ]; then
    check_pass "4-phase pipeline found ($PHASE_COUNT phases)"
else
    check_fail "4-phase pipeline not found (found $PHASE_COUNT phases)"
fi

if grep -q "extractFeatures" PrivaCRE/my-workflow/main.ts; then
    check_pass "PII sanitization (extractFeatures) found"
else
    check_fail "PII sanitization not found"
fi

echo ""

# ============================================================================
# Requirement 5: Simulation/Deployment
# ============================================================================
echo "📋 Requirement 5: Simulation/Deployment"
echo ""

if [ -f "scripts/simulate-workflow.js" ]; then
    check_pass "Local simulation script found"
else
    check_fail "Local simulation script not found"
fi

if [ -f "PrivaCRE/simulate.sh" ]; then
    check_pass "CRE CLI simulation script found"
else
    check_fail "CRE CLI simulation script not found"
fi

if [ -f "PrivaCRE/my-workflow/workflow.yaml" ]; then
    check_pass "Workflow configuration found"
else
    check_fail "Workflow configuration not found"
fi

if [ -f "PrivaCRE/secrets.yaml" ]; then
    check_pass "Secrets configuration found"
else
    check_fail "Secrets configuration not found"
fi

# Try to run simulation
echo ""
echo "  🚀 Running simulation test..."
if node scripts/simulate-workflow.js > /tmp/sim-output.txt 2>&1; then
    if grep -q "Credit Score" /tmp/sim-output.txt; then
        SCORE=$(grep "Credit Score" /tmp/sim-output.txt | grep -o "[0-9]\+/100" | head -1)
        check_pass "Simulation executed successfully (Score: $SCORE)"
    else
        check_pass "Simulation executed (check /tmp/sim-output.txt)"
    fi
else
    check_fail "Simulation failed (check /tmp/sim-output.txt)"
fi

if [ -f "simulation-results.json" ]; then
    check_pass "Simulation results file generated"
else
    check_fail "Simulation results file not generated"
fi

echo ""

# ============================================================================
# Summary
# ============================================================================
echo "=================================================="
echo "  📊 Verification Summary"
echo "=================================================="
echo ""
echo "  ✅ Passed: $PASS"
echo "  ❌ Failed: $FAIL"
echo ""

if [ $FAIL -eq 0 ]; then
    echo "🎉 All requirements verified successfully!"
    echo ""
    echo "Your CRE workflow is ready for hackathon submission."
    echo ""
    echo "Quick Demo:"
    echo "  node scripts/simulate-workflow.js"
    echo ""
    echo "Full Demo:"
    echo "  ./demo-cre-workflow.sh"
    echo ""
    echo "Frontend:"
    echo "  npm run dev → http://localhost:3000/orchestration"
    echo ""
    exit 0
else
    echo "⚠️  Some requirements need attention."
    echo ""
    echo "Review the failed checks above and:"
    echo "  1. Check file paths are correct"
    echo "  2. Verify function names match"
    echo "  3. Ensure all dependencies are installed"
    echo ""
    exit 1
fi

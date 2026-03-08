#!/bin/bash

# ============================================================================
# PrivaCRE Setup Verification Script
# ============================================================================
# This script verifies that all required files are in place and properly
# configured for CRE integration
# ============================================================================

set -e

echo "=================================================="
echo "  PrivaCRE Setup Verification"
echo "=================================================="
echo ""

ERRORS=0
WARNINGS=0

# Function to check if file exists
check_file() {
    if [ -f "$1" ]; then
        echo "✅ $1"
    else
        echo "❌ $1 (MISSING)"
        ERRORS=$((ERRORS + 1))
    fi
}

# Function to check if file is executable
check_executable() {
    if [ -x "$1" ]; then
        echo "✅ $1 (executable)"
    else
        echo "⚠️  $1 (not executable)"
        WARNINGS=$((WARNINGS + 1))
    fi
}

# Function to check if directory exists
check_dir() {
    if [ -d "$1" ]; then
        echo "✅ $1/"
    else
        echo "❌ $1/ (MISSING)"
        ERRORS=$((ERRORS + 1))
    fi
}

echo "Checking project structure..."
echo ""

# Check root files
echo "Root Configuration Files:"
check_file "project.yaml"
check_file "secrets.yaml"
check_file ".env"
check_file ".env.example"
check_file ".gitignore"
echo ""

# Check documentation
echo "Documentation Files:"
check_file "README.md"
check_file "QUICKSTART.md"
check_file "DEPLOYMENT_GUIDE.md"
check_file "TESTING_GUIDE.md"
check_file "INTEGRATION_COMPLETE.md"
echo ""

# Check scripts
echo "Scripts:"
check_executable "simulate.sh"
check_executable "verify-setup.sh"
echo ""

# Check workflow directory
echo "Workflow Directory:"
check_dir "my-workflow"
echo ""

# Check workflow files
echo "Workflow Files:"
check_file "my-workflow/workflow.yaml"
check_file "my-workflow/main.ts"
check_file "my-workflow/config.staging.json"
check_file "my-workflow/config.production.json"
check_file "my-workflow/package.json"
check_file "my-workflow/tsconfig.json"
echo ""

# Check for sensitive data in git
echo "Security Checks:"
if grep -q "^\.env$" .gitignore 2>/dev/null; then
    echo "✅ .env is gitignored"
else
    echo "⚠️  .env should be in .gitignore"
    WARNINGS=$((WARNINGS + 1))
fi

if [ -f ".env" ]; then
    if grep -q "your_" .env; then
        echo "⚠️  .env contains placeholder values"
        WARNINGS=$((WARNINGS + 1))
    else
        echo "✅ .env appears to be configured"
    fi
fi
echo ""

# Check configuration syntax
echo "Configuration Validation:"

# Check if jq is available
if command -v jq &> /dev/null; then
    if jq empty my-workflow/config.staging.json 2>/dev/null; then
        echo "✅ config.staging.json is valid JSON"
    else
        echo "❌ config.staging.json has syntax errors"
        ERRORS=$((ERRORS + 1))
    fi
    
    if jq empty my-workflow/config.production.json 2>/dev/null; then
        echo "✅ config.production.json is valid JSON"
    else
        echo "❌ config.production.json has syntax errors"
        ERRORS=$((ERRORS + 1))
    fi
else
    echo "⚠️  jq not installed, skipping JSON validation"
    WARNINGS=$((WARNINGS + 1))
fi
echo ""

# Check dependencies
echo "Dependencies:"
if [ -d "my-workflow/node_modules" ]; then
    echo "✅ Dependencies installed"
else
    echo "⚠️  Dependencies not installed (run: cd my-workflow && bun install)"
    WARNINGS=$((WARNINGS + 1))
fi
echo ""

# Check CRE CLI
echo "Tools:"
if command -v cre &> /dev/null; then
    CRE_VERSION=$(cre --version 2>&1 || echo "unknown")
    echo "✅ CRE CLI installed ($CRE_VERSION)"
else
    echo "❌ CRE CLI not installed (run: npm install -g @chainlink/cre-cli)"
    ERRORS=$((ERRORS + 1))
fi

if command -v bun &> /dev/null; then
    BUN_VERSION=$(bun --version 2>&1 || echo "unknown")
    echo "✅ Bun installed ($BUN_VERSION)"
else
    echo "⚠️  Bun not installed (optional, but recommended)"
    WARNINGS=$((WARNINGS + 1))
fi
echo ""

# Summary
echo "=================================================="
echo "  Verification Summary"
echo "=================================================="
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo "🎉 Perfect! All checks passed."
    echo ""
    echo "Next steps:"
    echo "  1. Configure .env with your API keys"
    echo "  2. Update config.staging.json with contract address"
    echo "  3. Run: ./simulate.sh"
    echo ""
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo "✅ Setup is valid with $WARNINGS warning(s)"
    echo ""
    echo "You can proceed, but consider addressing the warnings above."
    echo ""
    echo "Next steps:"
    echo "  1. Configure .env with your API keys"
    echo "  2. Update config.staging.json with contract address"
    echo "  3. Run: ./simulate.sh"
    echo ""
    exit 0
else
    echo "❌ Setup has $ERRORS error(s) and $WARNINGS warning(s)"
    echo ""
    echo "Please fix the errors above before proceeding."
    echo ""
    exit 1
fi

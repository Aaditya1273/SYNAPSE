#!/bin/bash

echo "🔧 Fixing Git Secret Exposure"
echo "================================"
echo ""

# Step 1: Remove files from git cache (stop tracking them)
echo "📝 Step 1: Removing sensitive files from git tracking..."
git rm --cached .env
git rm --cached PrivaCRE/.env
git rm --cached PLAID_RPC_FIXES_SUMMARY.md
git rm --cached RPC_AND_PLAID_FIX.md

echo ""
echo "✅ Files removed from git tracking"
echo ""

# Step 2: Commit the .gitignore changes
echo "📝 Step 2: Committing .gitignore update..."
git add .gitignore
git commit -m "chore: add sensitive files to .gitignore and stop tracking them"

echo ""
echo "✅ Committed .gitignore changes"
echo ""

# Step 3: Instructions for removing from history
echo "⚠️  IMPORTANT: The secrets are still in your git history!"
echo ""
echo "To completely remove them from history, you have 2 options:"
echo ""
echo "Option 1 - Use GitHub's 'Allow Secret' (Quickest):"
echo "  1. Click this link from the error message:"
echo "     https://github.com/LSUDOKO/PrivaCRE/security/secret-scanning/unblock-secret/3AaTG3XeTFUbib0OeagdtI0aEtY"
echo "  2. Click 'Allow secret' to bypass the protection"
echo "  3. Then run: git push origin main --force"
echo "  4. IMMEDIATELY rotate your Groq API key at: https://console.groq.com"
echo ""
echo "Option 2 - Remove from history (More secure):"
echo "  Run these commands to rewrite history:"
echo ""
echo "  # Install git-filter-repo if not installed"
echo "  # On macOS: brew install git-filter-repo"
echo "  # On Linux: pip install git-filter-repo"
echo ""
echo "  # Remove the secret from all commits"
echo "  git filter-repo --invert-paths --path .env --path PrivaCRE/.env --path PLAID_RPC_FIXES_SUMMARY.md --path RPC_AND_PLAID_FIX.md --force"
echo ""
echo "  # Force push the cleaned history"
echo "  git push origin main --force"
echo ""
echo "⚠️  After either option, ROTATE YOUR API KEYS:"
echo "  - Groq API: https://console.groq.com"
echo "  - Plaid: https://dashboard.plaid.com"
echo ""

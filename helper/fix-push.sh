#!/bin/bash

echo "🔧 Fixing Git Push - Removing Secrets"
echo "======================================"

# Remove tracked files
git rm -r --cached .next 2>/dev/null || true
git rm --cached .env 2>/dev/null || true
git rm --cached PrivaCRE/.env 2>/dev/null || true
git rm --cached PLAID_RPC_FIXES_SUMMARY.md 2>/dev/null || true
git rm --cached RPC_AND_PLAID_FIX.md 2>/dev/null || true
git rm --cached scripts/simulate-workflow.js 2>/dev/null || true

# Add changes
git add .gitignore scripts/simulate-workflow.js

# Commit
git commit -m "fix: remove secrets from tracking and use env vars"

echo ""
echo "✅ Done! Now push:"
echo "   git push origin main"
echo ""
echo "⚠️  After pushing, rotate your Groq API key at:"
echo "   https://console.groq.com/keys"

#!/bin/bash

echo "🚀 Quick Fix for Git Secret Exposure"
echo "====================================="
echo ""
echo "This will:"
echo "1. Stop tracking sensitive files"
echo "2. Commit the .gitignore changes"
echo "3. Guide you to allow the secret on GitHub"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 1
fi

echo ""
echo "📝 Removing files from git tracking..."
git rm --cached .env 2>/dev/null || echo "  .env already untracked"
git rm --cached PrivaCRE/.env 2>/dev/null || echo "  PrivaCRE/.env already untracked"
git rm --cached PLAID_RPC_FIXES_SUMMARY.md 2>/dev/null || echo "  PLAID_RPC_FIXES_SUMMARY.md already untracked"
git rm --cached RPC_AND_PLAID_FIX.md 2>/dev/null || echo "  RPC_AND_PLAID_FIX.md already untracked"

echo ""
echo "📝 Committing .gitignore update..."
git add .gitignore
git commit -m "chore: add sensitive files to .gitignore"

echo ""
echo "✅ Done! Now follow these steps:"
echo ""
echo "1. Click this link to allow the secret:"
echo "   https://github.com/LSUDOKO/PrivaCRE/security/secret-scanning/unblock-secret/3AaTG3XeTFUbib0OeagdtI0aEtY"
echo ""
echo "2. Then run:"
echo "   git push origin main"
echo ""
echo "3. IMMEDIATELY rotate your Groq API key:"
echo "   https://console.groq.com/keys"
echo ""
echo "4. Update your local .env files with the new key"
echo ""

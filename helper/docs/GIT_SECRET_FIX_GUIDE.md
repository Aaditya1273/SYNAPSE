# 🔐 Git Secret Exposure - Fix Guide

## Problem
GitHub blocked your push because it detected a Groq API key in:
- `.env` (line 24)
- `PLAID_RPC_FIXES_SUMMARY.md` (line 33)
- `RPC_AND_PLAID_FIX.md` (lines 42, 135, 151)
- `PrivaCRE/.env`

## ✅ What I've Done

1. **Updated `.gitignore`** to prevent future commits of:
   - `.env` files
   - `PLAID_RPC_FIXES_SUMMARY.md`
   - `RPC_AND_PLAID_FIX.md`
   - `cre-workflow/secrets.json`

2. **Created `fix-git-secrets.sh`** script to help you clean up

## 🚀 Quick Fix (Choose One Option)

### Option 1: Allow Secret & Rotate (Fastest - 2 minutes)

This is the quickest way if you're in a hurry:

```bash
# 1. Run the cleanup script
chmod +x fix-git-secrets.sh
./fix-git-secrets.sh

# 2. Click the GitHub link from the error to allow the secret:
# https://github.com/LSUDOKO/PrivaCRE/security/secret-scanning/unblock-secret/3AaTG3XeTFUbib0OeagdtI0aEtY

# 3. Push with force
git push origin main --force

# 4. IMMEDIATELY rotate your API key at https://console.groq.com
```

**Pros:** Fast, simple
**Cons:** Secret remains in git history (but you'll rotate it anyway)

### Option 2: Remove from History (Most Secure - 5 minutes)

This completely removes the secret from git history:

```bash
# 1. Run the cleanup script
chmod +x fix-git-secrets.sh
./fix-git-secrets.sh

# 2. Install git-filter-repo (if not installed)
# macOS:
brew install git-filter-repo

# Linux:
pip install git-filter-repo

# 3. Remove files from entire git history
git filter-repo --invert-paths \
  --path .env \
  --path PrivaCRE/.env \
  --path PLAID_RPC_FIXES_SUMMARY.md \
  --path RPC_AND_PLAID_FIX.md \
  --force

# 4. Re-add the remote (filter-repo removes it)
git remote add origin https://github.com/LSUDOKO/PrivaCRE.git

# 5. Force push the cleaned history
git push origin main --force

# 6. Rotate your API key at https://console.groq.com
```

**Pros:** Secret completely removed from history
**Cons:** Takes a bit longer, rewrites git history

## 🔑 Rotate Your API Keys

After pushing, immediately rotate these keys:

### 1. Groq API Key
- Go to: https://console.groq.com/keys
- Delete the old key: `gsk_7QkX9VgPntWhICGbo8VDWGdyb3FY...`
- Create a new key
- Update your local `.env` and `PrivaCRE/.env` files

### 2. Plaid Credentials (Optional but Recommended)
- Go to: https://dashboard.plaid.com
- Rotate your sandbox credentials
- Update your local `.env` files

## 📝 Update Your Local Files

After rotating, update these files (they're now gitignored):

```bash
# .env
GROQ_API_KEY=your_new_groq_key_here
PLAID_CLIENT_ID=your_plaid_client_id
PLAID_SECRET=your_plaid_secret

# PrivaCRE/.env
AI_API_KEY_LOCAL=your_new_groq_key_here
PLAID_CLIENT_ID=your_plaid_client_id
PLAID_SECRET=your_plaid_secret
```

## ✅ Verify Everything Works

```bash
# 1. Check git status
git status
# Should show: nothing to commit, working tree clean

# 2. Verify .env files are ignored
git check-ignore .env PrivaCRE/.env
# Should output: .env and PrivaCRE/.env

# 3. Test your app still works
npm run dev
```

## 🛡️ Prevention for Future

The updated `.gitignore` now includes:
- All `.env` files
- Documentation files with secrets
- `secrets.json` files

**Best Practice:** Always use `.env.example` files with placeholder values for documentation.

## 📚 Files Modified

- ✅ `.gitignore` - Added sensitive files
- ✅ `fix-git-secrets.sh` - Created cleanup script
- ✅ `GIT_SECRET_FIX_GUIDE.md` - This guide

## 🆘 If You Get Stuck

If you encounter issues:

1. **"git filter-repo not found"**
   ```bash
   # macOS
   brew install git-filter-repo
   
   # Linux
   pip install git-filter-repo
   ```

2. **"remote origin already exists"**
   ```bash
   git remote remove origin
   git remote add origin https://github.com/LSUDOKO/PrivaCRE.git
   ```

3. **"refusing to merge unrelated histories"**
   ```bash
   git pull origin main --allow-unrelated-histories --force
   git push origin main --force
   ```

## ⏱️ Time Estimates

- Option 1 (Allow Secret): ~2 minutes
- Option 2 (Remove from History): ~5 minutes
- Rotating API keys: ~2 minutes

**Total time: 4-7 minutes**

---

**Ready?** Run `./fix-git-secrets.sh` to get started!

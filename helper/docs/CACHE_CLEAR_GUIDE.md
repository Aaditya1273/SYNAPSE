# 🔄 Cache Clear Guide - Get Real Plaid Data Working

## Issue

After connecting Plaid and storing the access token, the CRE workflow still shows:
```
⚠️ Plaid credentials missing. Falling back to Mock Data.
```

## Root Cause

Next.js caches the compiled version of `simulate-workflow.js`. When you update the code or add new secrets, the cached version doesn't see the changes.

## Solution

### Quick Fix (Recommended)
```bash
# Clear Next.js cache
rm -rf .next/cache

# Restart dev server
# Press Ctrl+C in terminal
npm run dev
```

### Alternative: Touch the File
```bash
# Force recompilation
touch scripts/simulate-workflow.js

# Wait a few seconds for Next.js to recompile
# Then run orchestration again
```

### Nuclear Option: Full Clean
```bash
# Stop server (Ctrl+C)

# Remove all build artifacts
rm -rf .next

# Restart
npm run dev
```

## Verification

After clearing cache and restarting:

1. Navigate to `/orchestration`
2. Click "RUN PIPELINE"
3. Check terminal logs

**Should see:**
```
✅ Found Plaid access token in secrets.yaml: BANK_ACCESS_TOKEN_y1aVVbmq...
🔗 Fetching REAL data from Plaid...
✅ Retrieved XX transactions from Plaid
- Data Source: Plaid API ✅
```

**Not:**
```
⚠️ Plaid credentials missing. Falling back to Mock Data.
```

## Why This Happens

Next.js optimizes performance by caching compiled code. When you:
1. Connect Plaid → Token stored in `secrets.yaml`
2. Run orchestration → Uses cached version (doesn't see new token)

The cache needs to be cleared to pick up the new token.

## When to Clear Cache

Clear cache after:
- ✅ Connecting a new bank via Plaid
- ✅ Updating `secrets.yaml` manually
- ✅ Modifying `simulate-workflow.js`
- ✅ Changing environment variables
- ✅ Seeing stale data

## Automatic Solution (Future)

To avoid this in production, you could:
1. Use a database instead of `secrets.yaml`
2. Use environment variables (reload on change)
3. Implement cache invalidation
4. Use serverless functions (no cache)

## Quick Commands

```bash
# Clear cache and restart (one command)
rm -rf .next/cache && npm run dev

# Or full clean
rm -rf .next && npm run dev
```

## Status Check

After clearing cache, verify:

```bash
# 1. Token exists
cat PrivaCRE/secrets.yaml | grep BANK_ACCESS_TOKEN

# 2. Credentials in .env
cat .env | grep PLAID

# 3. Run orchestration
# Navigate to /orchestration and click RUN PIPELINE
```

## Success!

When working correctly, you'll see:
- ✅ Real Plaid data fetched
- ✅ Actual transaction count
- ✅ Data Source: "Plaid API"
- ✅ More accurate credit scores

---

**TL;DR**: After connecting Plaid, run `rm -rf .next/cache` and restart the dev server to use real data!

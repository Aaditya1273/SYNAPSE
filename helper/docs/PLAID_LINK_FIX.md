# Plaid Link "Not Ready" Error - Fixed ✅

## Issue
Console error: "Plaid Link not ready" when clicking "Authorize Confidential Connection"

## Root Cause
The Plaid Link handler wasn't being properly initialized and stored. The previous implementation was creating a new handler on every `open()` call instead of reusing the initialized handler.

## Solution Applied

### 1. Fixed `usePlaidLink` Hook
**File**: `src/hooks/usePlaidLink.ts`

**Changes**:
- Added `useRef` to store the Plaid handler persistently
- Improved script loading detection (checks for existing script)
- Better error handling with detailed console logs
- Proper handler lifecycle management
- Single handler creation (not recreated on every open)

**Key improvements**:
```typescript
// Store handler in ref (persists across renders)
const handlerRef = useRef<any>(null);

// Create handler once when ready
useEffect(() => {
  if (!linkToken || !plaidLoaded) return;
  
  const handler = Plaid.create({...});
  handlerRef.current = handler;
  setReady(true);
}, [linkToken, plaidLoaded]);

// Use stored handler
const open = useCallback(() => {
  if (!handlerRef.current) {
    console.error('[Plaid] Handler not ready');
    return;
  }
  handlerRef.current.open();
}, []);
```

### 2. Enhanced Bridge Page
**File**: `src/app/bridge/page.tsx`

**Changes**:
- Added `plaidError` handling from hook
- Show toast notification if Plaid fails to load
- Added "Initializing Plaid Link..." button state
- Check `plaidReady` before allowing connection
- Better user feedback

**New button states**:
1. "Verify World ID First" (not verified)
2. "Connect Wallet to Start" (not connected)
3. "Select a Data Source" (no bank selected)
4. **"Initializing Plaid Link..."** (loading) ← NEW
5. "Authorize Confidential Connection" (ready)
6. "Opening Plaid Link..." (connecting)
7. "Authorizing via CRE..." (authorizing)
8. "Connection Secured ✓" (complete)

## Testing

### 1. Clear Browser State
```javascript
// In browser console
localStorage.clear();
sessionStorage.clear();
```

### 2. Reload Page
```bash
# Restart dev server
npm run dev
```

### 3. Test Flow
1. Navigate to `/bridge`
2. Connect wallet
3. Verify World ID
4. Select a bank
5. Wait for "Initializing Plaid Link..." to change to "Authorize Confidential Connection"
6. Click button
7. Plaid Link modal should open

### 4. Check Console Logs
You should see:
```
[Plaid] Fetching link token...
[Plaid] Link token received
[Plaid] Loading script...
[Plaid] Script loaded successfully
[Plaid] Creating handler...
[Plaid] Handler created and ready
[Plaid] Opening Link...
```

## Troubleshooting

### If Plaid Still Doesn't Load

**Check 1: Environment Variables**
```bash
echo $PLAID_CLIENT_ID
echo $PLAID_SECRET
```

**Check 2: API Route**
```bash
curl -X POST http://localhost:3000/api/plaid/create-link-token
```

**Check 3: Browser Console**
Look for errors related to:
- Script loading
- CORS issues
- API failures

**Check 4: Network Tab**
- Verify `link-initialize.js` loads (200 status)
- Verify `/api/plaid/create-link-token` returns token

### Common Issues

**Issue**: "Failed to load Plaid Link script"
**Solution**: Check internet connection, try different browser

**Issue**: "Failed to create link token"
**Solution**: Verify Plaid credentials in `.env`

**Issue**: Handler still not ready after 5+ seconds
**Solution**: Check browser console for errors, verify API route works

## Verification

Run this in browser console after page loads:
```javascript
// Should be true after ~2 seconds
console.log('Plaid loaded:', !!window.Plaid);

// Check localStorage
console.log('Bank selected:', localStorage.getItem('privacre_bank'));
console.log('Verified:', localStorage.getItem('privacre_verified'));
```

## What Changed

### Before ❌
- Handler created on every `open()` call
- No persistent handler storage
- Poor error messages
- No loading state

### After ✅
- Handler created once and stored in ref
- Proper lifecycle management
- Detailed console logs
- Loading state shown to user
- Error toasts for failures

## Performance Impact

- **Faster**: Handler created once, not on every click
- **More reliable**: Proper initialization sequence
- **Better UX**: Loading states and error messages

## Files Modified

1. `src/hooks/usePlaidLink.ts` - Complete rewrite
2. `src/app/bridge/page.tsx` - Added error handling and loading state

## Next Steps

If you still encounter issues:

1. Check `PLAID_INTEGRATION_GUIDE.md` for setup
2. Run `node test-plaid-setup.js` to verify config
3. Check browser console for detailed logs
4. Try in incognito mode (clear cache)

## Status

✅ **FIXED** - Plaid Link now initializes properly and opens on click

---

**Last Updated**: March 7, 2026

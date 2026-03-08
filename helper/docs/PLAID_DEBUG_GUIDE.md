# Plaid Link Debugging Guide

## Quick Test

### 1. Test API Route Directly
```bash
curl -X POST http://localhost:3000/api/plaid/create-link-token
```

**Expected**: `{"link_token":"link-sandbox-..."}`

If this fails, check:
- Dev server is running (`npm run dev`)
- `.env` has `PLAID_CLIENT_ID` and `PLAID_SECRET`
- No typos in environment variable names

### 2. Test with Simple HTML
Open `test-plaid-link.html` in your browser:
```bash
open test-plaid-link.html
# or
firefox test-plaid-link.html
```

Click "Open Plaid Link" - if this works, the issue is in React integration.

### 3. Check Browser Console
Open DevTools (F12) and look for:

**Good logs**:
```
[Plaid] Fetching link token...
[Plaid] Link token received: link-sandbox-...
[Plaid] Link is ready to open
[Bridge] Connect button clicked
[Bridge] All checks passed, opening Plaid Link...
[Plaid] Opening Link... Ready: true Token: true
```

**Bad logs**:
```
[Plaid] Error fetching link token: ...
[Plaid] Cannot open - not ready yet
```

## Common Issues

### Issue 1: "Plaid Link not ready"

**Symptoms**: Button click does nothing, console shows "not ready"

**Solutions**:
1. Wait 2-3 seconds after page load
2. Check Network tab for `/api/plaid/create-link-token` (should be 200)
3. Check console for script loading errors
4. Try refreshing the page

### Issue 2: Link token API fails

**Symptoms**: Console shows "Error fetching link token"

**Solutions**:
```bash
# Check environment variables
cat .env | grep PLAID

# Should show:
# PLAID_CLIENT_ID=69aadbcb2e387d000ceedf07
# PLAID_SECRET=d0f0d97242ee306898c8e8f5531aeb

# Test API directly
curl -X POST http://localhost:3000/api/plaid/create-link-token

# Restart dev server
# Ctrl+C then npm run dev
```

### Issue 3: Script doesn't load

**Symptoms**: Console shows "Plaid is not defined"

**Solutions**:
1. Check internet connection
2. Check browser console for CORS errors
3. Try different browser
4. Check if ad blocker is interfering

### Issue 4: Button is disabled

**Symptoms**: Button is grayed out, can't click

**Check**:
```javascript
// In browser console
console.log({
  isConnected: !!window.ethereum?.selectedAddress,
  isVerified: localStorage.getItem('privacre_verified'),
  selectedBank: localStorage.getItem('privacre_bank'),
  plaidReady: 'check hook state'
});
```

**Solutions**:
1. Connect wallet first
2. Verify World ID
3. Select a bank
4. Wait for Plaid to load

## Step-by-Step Debug

### 1. Open Browser DevTools
Press F12 or right-click → Inspect

### 2. Go to Console Tab
Clear console (trash icon)

### 3. Navigate to /bridge
Watch console logs as page loads

### 4. Expected Log Sequence
```
[Plaid] Fetching link token...
[Plaid] Link token received: link-sandbox-e68eafe1-...
[Plaid] Link is ready to open
```

### 5. Connect Wallet
Should see wallet connection logs

### 6. Verify World ID
Should see World ID verification logs

### 7. Select Bank
Click on a bank card (e.g., Wells Fargo)

### 8. Click "Authorize Confidential Connection"
Should see:
```
[Bridge] Connect button clicked
[Bridge] State: {isConnected: true, isVerified: true, ...}
[Bridge] All checks passed, opening Plaid Link...
[Plaid] Opening Link... Ready: true Token: true
```

### 9. Plaid Modal Opens
If modal doesn't open, check console for errors

## Network Tab Debugging

### 1. Open Network Tab in DevTools

### 2. Filter by "plaid"

### 3. Look for these requests:

**Request 1**: `/api/plaid/create-link-token`
- Method: POST
- Status: 200
- Response: `{"link_token":"link-sandbox-..."}`

**Request 2**: `link-initialize.js`
- URL: `https://cdn.plaid.com/link/v2/stable/link-initialize.js`
- Status: 200
- Type: script

**Request 3**: Plaid CDN requests (when modal opens)
- Various requests to `cdn.plaid.com`

## React DevTools Debugging

### 1. Install React DevTools Extension

### 2. Open Components Tab

### 3. Find BridgePage Component

### 4. Check State:
- `selectedBank`: should have value
- `connectionStatus`: should be 'idle' before click
- `isVerified`: should be true
- `toast`: check for error messages

### 5. Find usePlaidLink Hook

### 6. Check Values:
- `linkToken`: should have value
- `ready`: should be true
- `error`: should be null

## Manual Test Script

Run this in browser console after page loads:

```javascript
// Check Plaid loaded
console.log('Plaid loaded:', typeof window.Plaid !== 'undefined');

// Check link token
fetch('/api/plaid/create-link-token', { method: 'POST' })
  .then(r => r.json())
  .then(d => console.log('Link token:', d.link_token))
  .catch(e => console.error('API error:', e));

// Check localStorage
console.log('Verified:', localStorage.getItem('privacre_verified'));
console.log('Bank:', localStorage.getItem('privacre_bank'));

// Check wallet
console.log('Wallet:', window.ethereum?.selectedAddress);
```

## Force Plaid to Open (Emergency)

If nothing else works, try this in console:

```javascript
// Get link token
const response = await fetch('/api/plaid/create-link-token', { method: 'POST' });
const { link_token } = await response.json();

// Create handler
const handler = window.Plaid.create({
  token: link_token,
  onSuccess: (public_token, metadata) => {
    console.log('Success!', public_token);
    // Copy this token and paste in exchange API
  },
  onExit: (err, metadata) => {
    console.log('Exit', err);
  }
});

// Open it
handler.open();
```

## Environment Check

```bash
# Check all required env vars
cat .env | grep -E "PLAID|GROQ|WORLD_ID|RPC"

# Should see:
# PLAID_CLIENT_ID=...
# PLAID_SECRET=...
# GROQ_API_KEY=...
# NEXT_PUBLIC_WORLD_ID_APP_ID=...
# RPC_URL_SEPOLIA=...
```

## Still Not Working?

### Try These:

1. **Clear everything and restart**
```bash
# Clear browser
localStorage.clear()
sessionStorage.clear()
# Hard refresh: Ctrl+Shift+R

# Restart server
# Ctrl+C
npm run dev
```

2. **Try incognito mode**
- Opens fresh browser with no cache
- Rules out extension interference

3. **Try different browser**
- Chrome vs Firefox vs Safari
- Rules out browser-specific issues

4. **Check Plaid status**
- Visit https://status.plaid.com/
- Ensure sandbox is operational

5. **Use test HTML file**
```bash
open test-plaid-link.html
```
If this works, issue is in React code.

## Get Help

If still stuck, provide:
1. Browser console logs (full output)
2. Network tab screenshot
3. React DevTools state
4. Environment variables (redacted)
5. Browser and OS version

## Success Checklist

- [ ] API returns link token
- [ ] Plaid script loads (check Network tab)
- [ ] Console shows "Link is ready to open"
- [ ] Wallet connected
- [ ] World ID verified
- [ ] Bank selected
- [ ] Button enabled
- [ ] Click opens modal

If all checked, Plaid Link should work! 🎉

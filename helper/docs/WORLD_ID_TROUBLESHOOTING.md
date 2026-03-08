# World ID Troubleshooting Guide

## Issue: QR Code Not Showing When Clicking "Verify with World ID"

### Quick Checks

1. **Check Browser Console**
   - Open browser DevTools (F12)
   - Go to Console tab
   - Look for any errors when clicking the button
   - Common errors:
     - `app_id is required`
     - `Invalid app_id format`
     - Network errors

2. **Verify Environment Variables**
   ```bash
   # Check if variables are set
   echo $NEXT_PUBLIC_WORLD_ID_APP_ID
   echo $NEXT_PUBLIC_WORLD_RP_ID
   ```
   
   Should output:
   ```
   app_7141eab28d3662245856d528b69d89e4
   rp_c7db831223d44723
   ```

3. **Restart Dev Server**
   ```bash
   # Stop the server (Ctrl+C)
   # Start again
   npm run dev
   ```
   
   Environment variables are only loaded on server start!

### Common Issues & Solutions

#### 1. Environment Variables Not Loaded

**Symptom**: Console shows `undefined` for app_id

**Solution**:
```bash
# 1. Check .env file exists
cat .env | grep WORLD_ID

# 2. Restart dev server
npm run dev

# 3. Check in browser console
console.log(process.env.NEXT_PUBLIC_WORLD_ID_APP_ID)
```

#### 2. IDKit Not Loaded

**Symptom**: Button click does nothing, no errors

**Solution**:
```bash
# Check if @worldcoin/idkit is installed
npm list @worldcoin/idkit

# If not installed or wrong version
npm install @worldcoin/idkit@latest
```

#### 3. Wallet Not Connected

**Symptom**: "Verify with World ID" button doesn't appear

**Solution**:
- Make sure you've clicked "Connect Wallet" first
- Check MetaMask is installed and unlocked
- Wallet address should show: `0x1234...5678`

#### 4. Modal Blocked by Browser

**Symptom**: Button clicks but nothing happens

**Solution**:
- Check if browser is blocking popups
- Look for popup blocker icon in address bar
- Allow popups for localhost:3000

#### 5. CORS or Network Issues

**Symptom**: Console shows network errors

**Solution**:
```bash
# Check network tab in DevTools
# Look for failed requests to worldcoin.org

# Try in incognito mode
# Disable browser extensions
```

### Testing Steps

1. **Open Browser Console** (F12)

2. **Navigate to Dashboard**
   ```
   http://localhost:3000/dashboard
   ```

3. **Check Environment Variables**
   ```javascript
   console.log('App ID:', process.env.NEXT_PUBLIC_WORLD_ID_APP_ID);
   console.log('RP ID:', process.env.NEXT_PUBLIC_WORLD_RP_ID);
   ```
   
   Should output:
   ```
   App ID: app_7141eab28d3662245856d528b69d89e4
   RP ID: rp_c7db831223d44723
   ```

4. **Connect Wallet**
   - Click "Connect Wallet"
   - Approve in MetaMask
   - Wallet address should appear

5. **Click "Verify with World ID"**
   - Should open World ID modal
   - Should show QR code
   - Should show "Scan with World App" instructions

### Debug Mode

Add this to your dashboard component to debug:

```typescript
// Add after the IDKitWidget
useEffect(() => {
  console.log('=== World ID Debug ===');
  console.log('App ID:', process.env.NEXT_PUBLIC_WORLD_ID_APP_ID);
  console.log('RP ID:', process.env.NEXT_PUBLIC_WORLD_RP_ID);
  console.log('Wallet:', walletAddress);
  console.log('Verified:', isVerified);
}, [walletAddress, isVerified]);
```

### Expected Behavior

1. **Before Wallet Connection**:
   - Shows: "Connect Wallet" button
   - Does NOT show: "Verify with World ID"

2. **After Wallet Connection**:
   - Shows: Wallet address (0x1234...5678)
   - Shows: "Verify with World ID" button

3. **Click "Verify with World ID"**:
   - Modal opens with World ID branding
   - QR code appears
   - Instructions: "Scan with World App"
   - Can also use simulator for testing

4. **After Scanning**:
   - Modal shows "Verifying..."
   - On success: Modal closes
   - Button changes to "View Proof on Tenderly"

### Still Not Working?

#### Check IDKit Version

```bash
npm list @worldcoin/idkit
```

Should be: `@worldcoin/idkit@2.4.2` or higher

#### Reinstall Dependencies

```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

#### Check Next.js Configuration

In `next.config.mjs`, ensure environment variables are exposed:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_WORLD_ID_APP_ID: process.env.NEXT_PUBLIC_WORLD_ID_APP_ID,
    NEXT_PUBLIC_WORLD_RP_ID: process.env.NEXT_PUBLIC_WORLD_RP_ID,
  },
};

export default nextConfig;
```

#### Test with Simulator

For testing without a real World ID:

1. Click "Verify with World ID"
2. In the modal, look for "Use Simulator" option
3. Click it to test without scanning

### Browser Compatibility

World ID works best in:
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ⚠️ May have issues in older browsers

### Network Requirements

World ID needs to connect to:
- `https://id.worldcoin.org`
- `https://developer.worldcoin.org`

Check firewall/network settings if blocked.

### Console Commands for Testing

```javascript
// Test if IDKit is loaded
console.log(typeof window.IDKit);

// Test environment variables
console.log({
  appId: process.env.NEXT_PUBLIC_WORLD_ID_APP_ID,
  rpId: process.env.NEXT_PUBLIC_WORLD_RP_ID,
});

// Test wallet connection
console.log('Wallet:', window.ethereum?.selectedAddress);
```

### Get Help

If still not working:

1. **Check Browser Console** - Copy any error messages
2. **Check Network Tab** - Look for failed requests
3. **Try Different Browser** - Rule out browser-specific issues
4. **Check World ID Status** - Visit [status.worldcoin.org](https://status.worldcoin.org)

### Quick Fix Checklist

- [ ] Environment variables set in `.env`
- [ ] Dev server restarted after changing `.env`
- [ ] Wallet connected (address showing)
- [ ] Browser console shows no errors
- [ ] IDKit package installed (`@worldcoin/idkit@2.4.2`)
- [ ] No popup blockers active
- [ ] Using supported browser (Chrome/Firefox/Safari)
- [ ] Network allows connections to worldcoin.org

### Working Configuration

Your current setup should work with:

```typescript
<IDKitWidget
  app_id={process.env.NEXT_PUBLIC_WORLD_ID_APP_ID as `app_${string}`}
  action="verify-credit-score"
  signal={walletAddress}
  verification_level={VerificationLevel.Orb}
  handleVerify={handleWorldIDVerification}
  onSuccess={() => setIsVerified(true)}
>
  {({ open }) => (
    <button onClick={open}>
      Verify with World ID
    </button>
  )}
</IDKitWidget>
```

### Environment Variables

Your `.env` should have:

```bash
NEXT_PUBLIC_WORLD_ID_APP_ID=app_7141eab28d3662245856d528b69d89e4
NEXT_PUBLIC_WORLD_RP_ID=rp_c7db831223d44723
```

**Important**: Variables MUST start with `NEXT_PUBLIC_` to be available in the browser!

---

## Still Having Issues?

1. Share the browser console errors
2. Check if wallet is connected (address showing)
3. Try in incognito mode
4. Restart dev server after any `.env` changes

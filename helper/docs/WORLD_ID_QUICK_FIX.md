# World ID QR Code Not Showing - Quick Fix

## ✅ Your Setup is Correct!

Environment variables are properly configured:
- `NEXT_PUBLIC_WORLD_ID_APP_ID`: ✅ Set
- `NEXT_PUBLIC_WORLD_RP_ID`: ✅ Set

## 🔧 Try These Steps (In Order)

### 1. Restart Dev Server (Most Common Fix)

```bash
# Stop the server (Ctrl+C or Cmd+C)
# Then start again:
npm run dev
```

**Why?** Environment variables are only loaded when the server starts!

### 2. Clear Browser Cache

```bash
# In browser:
# - Press Ctrl+Shift+R (Windows/Linux)
# - Press Cmd+Shift+R (Mac)
# Or open in Incognito/Private mode
```

### 3. Check Wallet Connection

Make sure:
- [ ] You clicked "Connect Wallet" first
- [ ] MetaMask is installed and unlocked
- [ ] You see your wallet address: `0x1234...5678`
- [ ] "Verify with World ID" button is visible

### 4. Check Browser Console

1. Open DevTools (F12)
2. Go to Console tab
3. Look for errors when clicking "Verify with World ID"
4. Share any error messages you see

### 5. Test in Different Browser

Try:
- Chrome
- Firefox
- Safari

### 6. Check Popup Blockers

- Look for popup blocker icon in address bar
- Allow popups for `localhost:3000`

## 🎯 Expected Flow

1. **Open Dashboard** → http://localhost:3000/dashboard
2. **Click "Connect Wallet"** → MetaMask opens
3. **Approve Connection** → Wallet address appears
4. **Click "Verify with World ID"** → Modal opens with QR code
5. **Scan QR** → With World App on your phone

## 🐛 Still Not Working?

### Check These:

```javascript
// Open browser console and run:
console.log('App ID:', process.env.NEXT_PUBLIC_WORLD_ID_APP_ID);
console.log('RP ID:', process.env.NEXT_PUBLIC_WORLD_RP_ID);
```

Should output:
```
App ID: app_7141eab28d3662245856d528b69d89e4
RP ID: rp_c7db831223d44723
```

If it shows `undefined`:
1. Restart dev server
2. Clear browser cache
3. Hard refresh (Ctrl+Shift+R)

### Common Issues:

| Issue | Solution |
|-------|----------|
| Button does nothing | Restart dev server |
| No QR code appears | Check browser console for errors |
| Modal doesn't open | Disable popup blockers |
| Variables undefined | Restart dev server + hard refresh |

## 📱 Testing Without World App

If you don't have World App installed:

1. Click "Verify with World ID"
2. Look for "Use Simulator" or "Test Mode" in the modal
3. Use that for testing

## 🆘 Get More Help

See detailed troubleshooting: `WORLD_ID_TROUBLESHOOTING.md`

---

## Quick Command Reference

```bash
# Test environment variables
node test-worldid-setup.js

# Restart dev server
npm run dev

# Check IDKit version
npm list @worldcoin/idkit

# Reinstall if needed
npm install @worldcoin/idkit@latest
```

## Most Likely Fix

**90% of the time, this fixes it:**

```bash
# Stop server (Ctrl+C)
npm run dev
# Hard refresh browser (Ctrl+Shift+R)
```

Environment variables need a server restart to take effect!

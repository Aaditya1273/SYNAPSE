# Plaid Integration Quick Reference

## 🚀 Quick Start

### 1. Get Plaid Sandbox Credentials
```bash
# Sign up at: https://dashboard.plaid.com/signup
# Navigate to: Team Settings > Keys
# Copy your sandbox credentials
```

### 2. Configure Environment
```bash
# Add to .env
PLAID_CLIENT_ID=your_client_id_here
PLAID_SECRET=your_sandbox_secret_here
PLAID_ENV=sandbox
```

### 3. Test the Flow
```bash
npm run dev
# Navigate to: http://localhost:3000/bridge
# Use test credentials: user_good / pass_good
```

## 📋 Implementation Checklist

- [x] Plaid Node SDK installed (`plaid` package)
- [x] React Plaid Link installed (`react-plaid-link` package)
- [x] YAML parser installed (`yaml` package)
- [x] Backend API routes created
  - [x] `/api/plaid/create-link-token`
  - [x] `/api/plaid/exchange`
- [x] Frontend hook created (`usePlaidLink`)
- [x] Bridge page updated with full flow
- [x] Toast notifications implemented
- [x] Loading states on bank cards
- [x] Dynamic button text
- [x] Auto-navigation to orchestration

## 🔑 Key Components

### Frontend Hook
```typescript
// src/hooks/usePlaidLink.ts
const { open, ready, error } = usePlaidLink({
  onSuccess: (publicToken, metadata) => { /* ... */ },
  onExit: (error, metadata) => { /* ... */ }
});
```

### Backend Exchange
```typescript
// src/app/api/plaid/exchange/route.ts
POST /api/plaid/exchange
Body: { public_token, institution_name }
Returns: { success, item_id, secret_name }
```

## 🎯 Button States

| State | Text | Condition |
|-------|------|-----------|
| Phase 1 | "Verify World ID First" | !isVerified |
| Phase 2 | "Select a Data Source" | !selectedBank |
| Phase 3 | "Authorize Confidential Connection" | Ready to connect |
| Connecting | "Opening Plaid Link..." | Plaid modal opening |
| Authorizing | "Authorizing via CRE..." | Encrypting token |
| Complete | "Connection Secured ✓" | Success |

## 🧪 Plaid Sandbox Test Credentials

| Username | Password | Result |
|----------|----------|--------|
| user_good | pass_good | ✅ Success |
| user_bad | pass_bad | ❌ Invalid credentials |

## 🔐 Security Flow

```
User clicks bank
    ↓
Frontend requests link_token from backend
    ↓
Plaid Link modal opens
    ↓
User authenticates with bank
    ↓
Plaid returns public_token (one-time use)
    ↓
Frontend sends public_token to backend
    ↓
Backend exchanges for access_token
    ↓
Backend encrypts with Chainlink CRE
    ↓
Secret stored in DON (not your database!)
    ↓
Success! Navigate to orchestration
```

## 🛠️ Troubleshooting

### Issue: "Failed to create link token"
**Solution:** Check PLAID_CLIENT_ID and PLAID_SECRET in .env

### Issue: "Plaid Link not ready"
**Solution:** Check browser console for CDN loading errors

### Issue: "CRE registration failed"
**Solution:** Falls back to secrets.yaml automatically (dev mode)

### Issue: Peer dependency warnings
**Solution:** Use `--legacy-peer-deps` flag when installing

## 📊 Data Flow

```typescript
// 1. User selects bank
handleBankSelect("Wells Fargo")

// 2. User clicks connect
handleConnect() → openPlaid()

// 3. Plaid success callback
handlePlaidSuccess(publicToken, metadata)

// 4. Exchange token
POST /api/plaid/exchange
  → plaidClient.itemPublicTokenExchange()
  → CRE encryption
  → Store in DON

// 5. Navigate to orchestration
router.push('/orchestration')
```

## 🎨 UI Enhancements

- ✅ Loading spinner on bank cards during connection
- ✅ Toast notifications (success/error)
- ✅ Dynamic button states with icons
- ✅ Smooth transitions between states
- ✅ Auto-redirect on success
- ✅ Error handling with user-friendly messages

## 📝 Environment Variables

```bash
# Required for Plaid
PLAID_CLIENT_ID=your_client_id
PLAID_SECRET=your_secret
PLAID_ENV=sandbox  # or 'production'

# Already configured
NEXT_PUBLIC_WORLD_ID_APP_ID=app_...
NEXT_PUBLIC_TENDERLY_RPC=https://...
```

## 🔄 Next Steps

1. **Test locally** with sandbox credentials
2. **Configure CRE** for production encryption
3. **Update orchestration** to use stored access_token
4. **Add production Plaid credentials** when ready to go live

## 📚 Resources

- [Plaid Quickstart](https://plaid.com/docs/quickstart/)
- [Chainlink CRE Docs](https://docs.chain.link/chainlink-functions)
- [React Plaid Link](https://github.com/plaid/react-plaid-link)

---

**Status:** ✅ Fully Implemented & Ready to Test

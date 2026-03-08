# World ID v4 Setup Checklist

## ✅ Completed

- [x] Installed `@worldcoin/idkit` SDK (v2.4.2)
- [x] Created backend API endpoint for RP signature generation (`/api/worldid/sign-request`)
- [x] Created backend API endpoint for proof verification (`/api/worldid/verify`)
- [x] Created `WorldIDVerification` React component
- [x] Created `useWorldID` custom hook
- [x] Added environment variable placeholders

## 🔧 Required Actions

### 1. Get Your RP Signing Key

- [ ] Go to [World ID Developer Portal](https://developer.world.org/)
- [ ] Login and select your app
- [ ] Navigate to Settings → API Keys
- [ ] Copy your **RP Signing Key**

### 2. Update .env File

Add your signing key to `.env`:

```bash
WORLD_RP_SIGNING_KEY=your_actual_signing_key_here
```

**Current values in .env:**
```bash
NEXT_PUBLIC_WORLD_ID_APP_ID=app_7141eab28d3662245856d528b69d89e4
NEXT_PUBLIC_WORLD_RP_ID=rp_c7db831223d44723
WORLD_RP_SIGNING_KEY=your_signing_key_here_from_developer_portal  # ⚠️ UPDATE THIS!
```

### 3. Update Your Dashboard Component

Replace the old World ID widget with the new component:

```tsx
// Old (remove this):
<IDKitWidget
  app_id={...}
  action="verify-credit-score"
  ...
/>

// New (use this):
import WorldIDVerification from '@/components/WorldIDVerification';

<WorldIDVerification
  action="verify-credit-score"
  signal={walletAddress}
  onSuccess={(result) => {
    setIsVerified(true);
    localStorage.setItem("world_id_nullifier", result.nullifier_hash);
  }}
  buttonText="Verify with World ID"
/>
```

### 4. Test the Integration

- [ ] Start dev server: `npm run dev`
- [ ] Navigate to dashboard
- [ ] Click "Verify with World ID"
- [ ] Complete verification in World App
- [ ] Check console for success message
- [ ] Verify nullifier hash is stored

### 5. Security Checklist

- [ ] Confirm `WORLD_RP_SIGNING_KEY` is NOT in `.env.example`
- [ ] Confirm signing key is NOT exposed to client
- [ ] Add `.env` to `.gitignore` (should already be there)
- [ ] Implement nullifier hash storage (database)
- [ ] Add rate limiting to API endpoints
- [ ] Enable HTTPS in production

## 📁 Files Created

```
src/
├── app/
│   └── api/
│       └── worldid/
│           ├── sign-request/
│           │   └── route.ts          ✅ RP signature generator
│           └── verify/
│               └── route.ts          ✅ Proof verification
├── components/
│   └── WorldIDVerification.tsx       ✅ Ready-to-use component
└── hooks/
    └── useWorldID.ts                 ✅ Custom hook

docs/
├── WORLD_ID_V4_INTEGRATION.md        ✅ Full documentation
├── DASHBOARD_WORLDID_UPDATE_EXAMPLE.tsx  ✅ Usage examples
└── WORLD_ID_SETUP_CHECKLIST.md       ✅ This file
```

## 🧪 Testing Commands

```bash
# Start development server
npm run dev

# Test API endpoints
curl -X POST http://localhost:3000/api/worldid/sign-request \
  -H "Content-Type: application/json" \
  -d '{"action":"verify-credit-score"}'

# Check environment variables
node -e "console.log(process.env.WORLD_RP_SIGNING_KEY ? 'Key is set' : 'Key is missing')"
```

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] Set environment variables in hosting platform (Vercel/Netlify/etc.)
- [ ] Test in staging environment first
- [ ] Verify HTTPS is enabled
- [ ] Set up database for nullifier storage
- [ ] Configure CORS if needed
- [ ] Add monitoring/logging
- [ ] Test with real World ID (not simulator)

## 📚 Resources

- [World ID Documentation](https://docs.world.org/)
- [IDKit SDK Reference](https://docs.world.org/idkit)
- [Developer Portal](https://developer.world.org/)
- [Discord Support](https://discord.gg/worldcoin)

## ❓ Troubleshooting

### "Server configuration error"
→ `WORLD_RP_SIGNING_KEY` not set in `.env`

### "Failed to fetch RP signature"
→ Check API endpoint is running and accessible

### "Verification failed"
→ Check `NEXT_PUBLIC_WORLD_RP_ID` matches your app

### Component not rendering
→ Check environment variables are prefixed with `NEXT_PUBLIC_` for client-side

## 🎯 Next Steps

1. Get your RP signing key from Developer Portal
2. Update `.env` with the actual key
3. Update dashboard component to use `WorldIDVerification`
4. Test the flow end-to-end
5. Implement nullifier storage in database
6. Deploy to staging for testing
7. Deploy to production

## ✨ Benefits of v4 Integration

- ✅ Enhanced security with RP signatures
- ✅ Better sybil resistance
- ✅ Cleaner API design
- ✅ Ready for future World ID features
- ✅ Proper separation of concerns (backend/frontend)
- ✅ Easy to test and maintain

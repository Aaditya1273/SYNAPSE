# World ID v4 Integration - Managed Mode

## 🎉 Good News!

Your World ID app is in **Managed Mode**, which means World ID handles all the RP signature complexity for you! This makes integration much simpler.

## Your Credentials

```
APP ID: app_7141eab28d3662245856d528b69d89e4
RP ID: rp_c7db831223d44723
Management Mode: Managed ✅
Status: Active (Production & Staging)
```

## What is Managed Mode?

In Managed Mode:
- ✅ World ID handles RP signatures automatically
- ✅ No signing key to manage
- ✅ Simpler integration
- ✅ Less security concerns
- ✅ Automatic key rotation

## Setup (Already Done!)

### 1. Environment Variables ✅

Your `.env` file is already configured:

```bash
NEXT_PUBLIC_WORLD_ID_APP_ID=app_7141eab28d3662245856d528b69d89e4
NEXT_PUBLIC_WORLD_RP_ID=rp_c7db831223d44723
```

### 2. Backend API ✅

Created: `/api/worldid/verify` - Verifies proofs with World ID

### 3. Frontend Component ✅

Created: `WorldIDVerification` - Ready-to-use React component

## Usage

### Simple Integration (Recommended)

```tsx
import WorldIDVerification from '@/components/WorldIDVerification';

function MyComponent() {
  const { address } = useAccount();

  return (
    <WorldIDVerification
      action="verify-credit-score"
      signal={address} // Optional: bind to wallet address
      onSuccess={(result) => {
        console.log('Verified!', result);
        // Store nullifier hash
        localStorage.setItem('world_id_nullifier', result.nullifier_hash);
      }}
      onError={(error) => {
        console.error('Verification failed:', error);
      }}
      buttonText="Verify with World ID"
    />
  );
}
```

### Update Your Dashboard

Replace the old World ID widget in `src/app/dashboard/page.tsx`:

```tsx
// OLD (remove this):
<IDKitWidget
  app_id={(process.env.NEXT_PUBLIC_WORLD_ID_APP_ID as `app_${string}`) || "app_7141eab28d3662245856d528b69d89e4"}
  action="verify-credit-score"
  verification_level={VerificationLevel.Orb}
  handleVerify={handleWorldIDVerification}
  onSuccess={() => setIsVerified(true)}
  environment="staging"
>
  {({ open }: { open: () => void }) => (
    <button onClick={open}>Verify with World ID</button>
  )}
</IDKitWidget>

// NEW (use this):
import WorldIDVerification from '@/components/WorldIDVerification';

<WorldIDVerification
  action="verify-credit-score"
  signal={walletAddress}
  onSuccess={(result) => {
    console.log("World ID Proof:", result);
    setIsVerified(true);
    if (result.nullifier_hash) {
      localStorage.setItem("world_id_nullifier", result.nullifier_hash);
    }
  }}
  buttonText="Verify with World ID"
/>
```

## Architecture (Simplified)

```
┌─────────────┐
│   Client    │
│  (Browser)  │
└──────┬──────┘
       │
       │ 1. Open World ID widget
       │
       │ 2. User verifies with Orb
       │
       │ 3. Receive proof
       │
       │ 4. Send proof to backend
       ├──────────────────────────────────┐
       │                                  │
       │                          ┌───────▼────────┐
       │                          │   Backend API  │
       │                          │ /api/worldid/  │
       │                          │    verify      │
       │                          └───────┬────────┘
       │                                  │
       │                                  │ 5. Forward to World ID
       │                                  ├────────────────────┐
       │                                  │                    │
       │                                  │            ┌───────▼────────┐
       │                                  │            │   World ID     │
       │                                  │            │   Verify API   │
       │                                  │            │  (Managed Mode)│
       │                                  │            └───────┬────────┘
       │                                  │                    │
       │                                  │ 6. Verification    │
       │                                  │◄───────────────────┤
       │                                  │                    │
       │ 7. Success response              │
       │◄─────────────────────────────────┤
       │                                  │
       │ 8. Update UI                     │
       │                                  │
```

## Testing

### 1. Start Development Server

```bash
npm run dev
```

### 2. Test the Flow

1. Navigate to http://localhost:3000/dashboard
2. Click "Verify with World ID"
3. Complete verification in World App
4. Check console for success message
5. Verify nullifier hash is stored

### 3. Test API Endpoint

```bash
# This will fail without a real proof, but tests the endpoint exists
curl -X POST http://localhost:3000/api/worldid/verify \
  -H "Content-Type: application/json" \
  -d '{"action":"test"}'
```

## Sybil Resistance

World ID provides one-human-one-action through nullifier hashes:

```typescript
// After successful verification
const nullifierHash = result.nullifier_hash;

// Store to prevent reuse
localStorage.setItem('world_id_nullifier', nullifierHash);

// Or in a database (recommended for production):
await db.nullifiers.create({
  hash: nullifierHash,
  action: 'verify-credit-score',
  userId: user.id,
  timestamp: Date.now(),
});
```

## Files Created

```
src/
├── app/
│   └── api/
│       └── worldid/
│           └── verify/
│               └── route.ts          ✅ Proof verification
├── components/
│   └── WorldIDVerification.tsx       ✅ Ready-to-use component
└── hooks/
    └── useWorldID.ts                 ✅ Custom hook (optional)
```

## Security Notes

### ✅ What's Secure in Managed Mode:

- World ID manages signing keys
- Automatic key rotation
- No secrets to leak
- Simplified security model

### 🔒 What You Still Need to Do:

- Verify proofs on backend (already implemented)
- Store nullifier hashes to prevent reuse
- Use HTTPS in production
- Implement rate limiting

## Troubleshooting

### "Verification failed"
- Check `NEXT_PUBLIC_WORLD_RP_ID` is correct: `rp_c7db831223d44723`
- Verify network connectivity
- Check browser console for errors

### "Server configuration error"
- Ensure `NEXT_PUBLIC_WORLD_RP_ID` is set in `.env`
- Restart dev server after changing `.env`

### Component not rendering
- Check environment variables are prefixed with `NEXT_PUBLIC_`
- Verify `@worldcoin/idkit` is installed: `npm list @worldcoin/idkit`

## Production Deployment

### Environment Variables

Set these in your hosting platform (Vercel, Netlify, etc.):

```bash
NEXT_PUBLIC_WORLD_ID_APP_ID=app_7141eab28d3662245856d528b69d89e4
NEXT_PUBLIC_WORLD_RP_ID=rp_c7db831223d44723
```

### Checklist

- [ ] Environment variables set
- [ ] HTTPS enabled
- [ ] Database for nullifier storage
- [ ] Rate limiting on API endpoints
- [ ] Error monitoring (Sentry, etc.)
- [ ] Test with real World ID (not simulator)

## Advantages of Managed Mode

1. **Simpler Integration** - No signing key management
2. **Better Security** - World ID handles key rotation
3. **Less Code** - Fewer API endpoints needed
4. **Faster Setup** - Ready to use immediately
5. **Automatic Updates** - World ID handles protocol updates

## Next Steps

1. ✅ Environment variables are set
2. ✅ Backend API is ready
3. ✅ Component is created
4. 🔄 Update dashboard to use `WorldIDVerification` component
5. 🔄 Test the integration
6. 🔄 Deploy to production

## Resources

- [World ID Documentation](https://docs.world.org/)
- [IDKit SDK Reference](https://docs.world.org/idkit)
- [Developer Portal](https://developer.world.org/)
- [Discord Support](https://discord.gg/worldcoin)

## Support

Your app is ready to use! If you have questions:
- Check the [World ID Discord](https://discord.gg/worldcoin)
- Review [GitHub Issues](https://github.com/worldcoin/idkit-js/issues)
- Contact support through Developer Portal

---

**Status: ✅ Ready to Use**

Your World ID integration is complete and ready for testing!

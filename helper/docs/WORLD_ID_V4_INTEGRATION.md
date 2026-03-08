# World ID v4 Integration Guide

## Overview

This project now uses World ID v4 with RP (Relying Party) signatures for enhanced security and verification.

## Your Credentials

```
APP ID (Legacy): app_7141eab28d3662245856d528b69d89e4
RP ID: rp_c7db831223d44723
```

## Setup Steps

### 1. Get Your RP Signing Key

1. Go to [World ID Developer Portal](https://developer.world.org/)
2. Select your app
3. Navigate to Settings → API Keys
4. Copy your **RP Signing Key** (keep this secret!)

### 2. Update Environment Variables

Add to your `.env` file:

```bash
# World ID v4 Configuration
NEXT_PUBLIC_WORLD_ID_APP_ID=app_7141eab28d3662245856d528b69d89e4
NEXT_PUBLIC_WORLD_RP_ID=rp_c7db831223d44723
WORLD_RP_SIGNING_KEY=your_signing_key_here  # ⚠️ KEEP SECRET - Backend only!
```

**IMPORTANT**: Never expose `WORLD_RP_SIGNING_KEY` to the client!

### 3. Architecture

```
┌─────────────┐
│   Client    │
│  (Browser)  │
└──────┬──────┘
       │
       │ 1. Request RP signature
       ├──────────────────────────────────┐
       │                                  │
       │                          ┌───────▼────────┐
       │                          │   Backend API  │
       │                          │ /api/worldid/  │
       │                          │ sign-request   │
       │                          └───────┬────────┘
       │                                  │
       │ 2. Return signature              │
       │◄─────────────────────────────────┤
       │                                  │
       │ 3. Open World ID widget          │
       │    with RP context               │
       │                                  │
       │ 4. User verifies with Orb        │
       │                                  │
       │ 5. Receive proof                 │
       │                                  │
       │ 6. Send proof to backend         │
       ├──────────────────────────────────┤
       │                                  │
       │                          ┌───────▼────────┐
       │                          │   Backend API  │
       │                          │ /api/worldid/  │
       │                          │    verify      │
       │                          └───────┬────────┘
       │                                  │
       │                                  │ 7. Forward to World ID
       │                                  ├────────────────────┐
       │                                  │                    │
       │                                  │            ┌───────▼────────┐
       │                                  │            │   World ID     │
       │                                  │            │   Verify API   │
       │                                  │            └───────┬────────┘
       │                                  │                    │
       │                                  │ 8. Verification    │
       │                                  │◄───────────────────┤
       │                                  │                    │
       │ 9. Success response              │
       │◄─────────────────────────────────┤
       │                                  │
       │ 10. Update UI                    │
       │                                  │
```

## API Endpoints

### POST /api/worldid/sign-request

Generates an RP signature for a World ID request.

**Request:**
```json
{
  "action": "verify-credit-score"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sig": "abc123...",
    "nonce": "def456...",
    "created_at": 1234567890,
    "expires_at": 1234571490
  }
}
```

### POST /api/worldid/verify

Verifies a World ID proof by forwarding to World ID's API.

**Request:** IDKit result (forwarded as-is)

**Response:**
```json
{
  "success": true,
  "data": { /* World ID verification result */ },
  "nullifier_hash": "ghi789..."
}
```

## Usage Examples

### Option 1: Using the WorldIDVerification Component (Recommended)

```tsx
import WorldIDVerification from '@/components/WorldIDVerification';

function MyComponent() {
  const handleSuccess = (result) => {
    console.log('Verified!', result);
    // Update your app state
  };

  return (
    <WorldIDVerification
      action="verify-credit-score"
      signal={walletAddress} // Optional: bind to user context
      onSuccess={handleSuccess}
      onError={(error) => console.error(error)}
      buttonText="Verify with World ID"
    />
  );
}
```

### Option 2: Using the useWorldID Hook

```tsx
import { useWorldID } from '@/hooks/useWorldID';
import { IDKitWidget } from '@worldcoin/idkit';

function MyComponent() {
  const { getIDKitConfig, isLoading, error } = useWorldID();
  const [config, setConfig] = useState(null);

  useEffect(() => {
    getIDKitConfig({
      action: 'verify-credit-score',
      signal: walletAddress,
      onSuccess: (result) => {
        console.log('Verified!', result);
      },
    }).then(setConfig);
  }, []);

  if (!config) return <div>Loading...</div>;

  return (
    <IDKitWidget {...config}>
      {({ open }) => (
        <button onClick={open}>
          Verify with World ID
        </button>
      )}
    </IDKitWidget>
  );
}
```

### Option 3: Manual Integration

```tsx
import { IDKitWidget, VerificationLevel } from '@worldcoin/idkit';

function MyComponent() {
  const [rpContext, setRpContext] = useState(null);

  useEffect(() => {
    // Fetch RP signature
    fetch('/api/worldid/sign-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'verify-credit-score' }),
    })
      .then(res => res.json())
      .then(({ data }) => {
        setRpContext({
          rp_id: process.env.NEXT_PUBLIC_WORLD_RP_ID,
          nonce: data.nonce,
          created_at: data.created_at,
          expires_at: data.expires_at,
          signature: data.sig,
        });
      });
  }, []);

  const handleVerify = async (proof) => {
    const response = await fetch('/api/worldid/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(proof),
    });
    return response.json();
  };

  if (!rpContext) return <div>Loading...</div>;

  return (
    <IDKitWidget
      app_id={process.env.NEXT_PUBLIC_WORLD_ID_APP_ID}
      action="verify-credit-score"
      signal={walletAddress}
      rp_context={rpContext}
      allow_legacy_proofs={true}
      verification_level={VerificationLevel.Orb}
      handleVerify={handleVerify}
      onSuccess={(result) => console.log('Success!', result)}
    >
      {({ open }) => (
        <button onClick={open}>Verify with World ID</button>
      )}
    </IDKitWidget>
  );
}
```

## Security Best Practices

### ✅ DO:
- Keep `WORLD_RP_SIGNING_KEY` secret (backend only)
- Validate action names on the backend
- Store nullifier hashes to prevent reuse
- Use HTTPS in production
- Set appropriate CORS headers
- Implement rate limiting on API endpoints

### ❌ DON'T:
- Expose signing key to client
- Skip backend verification
- Allow arbitrary action names
- Reuse nullifier hashes
- Trust client-side verification alone

## Sybil Resistance

World ID provides one-human-one-action guarantees through nullifier hashes:

```typescript
// After successful verification
const nullifierHash = result.nullifier_hash;

// Store in database
await db.nullifiers.create({
  hash: nullifierHash,
  action: 'verify-credit-score',
  timestamp: Date.now(),
});

// Check before allowing action
const exists = await db.nullifiers.findOne({ hash: nullifierHash });
if (exists) {
  throw new Error('This World ID has already been used');
}
```

## Testing

### Staging Environment

Use staging credentials for testing:

```bash
NEXT_PUBLIC_WORLD_ID_APP_ID=app_staging_...
NEXT_PUBLIC_WORLD_RP_ID=rp_staging_...
WORLD_RP_SIGNING_KEY=staging_key_...
```

### Test Flow

1. Start your dev server: `npm run dev`
2. Navigate to dashboard
3. Click "Verify with World ID"
4. Complete verification in World App
5. Check console for verification result
6. Verify nullifier hash is stored

## Troubleshooting

### "Failed to fetch RP signature"
- Check `WORLD_RP_SIGNING_KEY` is set in `.env`
- Verify API endpoint is accessible
- Check server logs for errors

### "Verification failed"
- Ensure `NEXT_PUBLIC_WORLD_RP_ID` matches your app
- Check proof hasn't expired
- Verify network connectivity to World ID API

### "Invalid nullifier"
- Nullifier has been used before (sybil resistance working!)
- Clear test data or use different World ID

## Migration from v3 to v4

If you were using World ID v3 (legacy):

1. Update environment variables (add RP_ID and signing key)
2. Replace old IDKitWidget usage with new component
3. Add backend endpoints for signing and verification
4. Update verification logic to use v4 API
5. Test thoroughly in staging

## Resources

- [World ID Documentation](https://docs.world.org/)
- [IDKit SDK Reference](https://docs.world.org/idkit)
- [Developer Portal](https://developer.world.org/)
- [World ID v4 Migration Guide](https://docs.world.org/migration)

## Support

For issues or questions:
- Check [World ID Discord](https://discord.gg/worldcoin)
- Review [GitHub Issues](https://github.com/worldcoin/idkit-js/issues)
- Contact World ID support through Developer Portal

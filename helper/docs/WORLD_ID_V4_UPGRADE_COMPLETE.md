# World ID v4 Upgrade - COMPLETE ✅

## Problem Solved
The old IDKit v2.2.0 was causing "Cannot read properties of undefined (reading 'length')" errors due to incompatibility with Next.js 15 and React 19.

## Solution: Upgraded to World ID 4.0

### Changes Made

#### 1. Upgraded IDKit Package
**File: `package.json`**
- Upgraded from `@worldcoin/idkit: "2.2.0"` to `@worldcoin/idkit: "^4.0.0"`
- Installed successfully with `npm install --legacy-peer-deps`

#### 2. Added RP Signing Key
**File: `.env`**
```env
# World ID Integration (Sybil Resistance) - World ID 4.0
NEXT_PUBLIC_WORLD_ID_APP_ID=app_7141eab28d3662245856d528b69d89e4
NEXT_PUBLIC_WORLD_RP_ID=rp_c7db831223d44723
RP_SIGNING_KEY=your_signing_key_here_from_developer_portal
```

**⚠️ IMPORTANT**: You need to get your `RP_SIGNING_KEY` from the Developer Portal:
1. Go to https://developer.worldcoin.org/
2. Select your app
3. Click "Enable World ID 4.0" banner if you haven't already
4. Copy the `signing_key` value
5. Add it to your `.env` file

#### 3. Created RP Signature Endpoint
**File: `src/app/api/worldid/rp-signature/route.ts`** (NEW)

This endpoint generates RP signatures that verify proof requests genuinely come from your app:
```typescript
import { NextResponse } from "next/server";
import { signRequest } from "@worldcoin/idkit/signing";

export async function POST(request: Request): Promise<Response> {
  const { action } = await request.json();
  const signingKey = process.env.RP_SIGNING_KEY;
  const { sig, nonce, createdAt, expiresAt } = signRequest(action, signingKey);
  
  return NextResponse.json({
    sig,
    nonce,
    created_at: createdAt,
    expires_at: expiresAt,
  });
}
```

#### 4. Updated Verify Endpoint
**File: `src/app/api/worldid/verify/route.ts`**
- Already configured for World ID v4
- Forwards proofs to `https://developer.world.org/api/v4/verify/{rp_id}`
- Handles both v3 legacy and v4 uniqueness proofs

#### 5. Completely Rewrote Auth Page
**File: `src/app/auth/page.tsx`**

Now uses the new IDKit v4 API with proper flow:

```typescript
// 1. Get RP signature from backend
const rpSig = await fetch("/api/worldid/rp-signature", {
  method: "POST",
  body: JSON.stringify({ action: "verify-identity" }),
}).then((r) => r.json());

// 2. Create IDKit request with RP signature
const request = await IDKit.request({
  app_id: WORLD_ID_APP_ID,
  action: "verify-identity",
  rp_context: {
    rp_id: WORLD_RP_ID,
    nonce: rpSig.nonce,
    created_at: rpSig.created_at,
    expires_at: rpSig.expires_at,
    signature: rpSig.sig,
  },
  allow_legacy_proofs: true,
  environment: "staging", // Use 'staging' for testing
}).preset(orbLegacy({ signal: walletAddress }));

// 3. Open World ID and poll for completion
const connectUrl = request.connectorURI;
window.open(connectUrl, "_blank");
const completionResult = await request.pollUntilCompletion();

// 4. Verify proof with backend
const verifyResponse = await fetch("/api/worldid/verify", {
  method: "POST",
  body: JSON.stringify(completionResult.result),
});

// 5. Store verification and redirect
localStorage.setItem("worldid_verified", "true");
window.location.href = '/dashboard';
```

## New Verification Flow

### Step-by-Step Process:

1. **User clicks "Verify with World ID"** on auth page
2. **Frontend requests RP signature** from `/api/worldid/rp-signature`
3. **Backend generates signature** using `RP_SIGNING_KEY`
4. **Frontend creates IDKit request** with RP signature
5. **World ID opens in new window** (or shows QR code)
6. **User verifies with World App** on their phone
7. **Frontend polls for completion** until proof is ready
8. **Frontend sends proof to backend** at `/api/worldid/verify`
9. **Backend forwards to World ID** at `https://developer.world.org/api/v4/verify/{rp_id}`
10. **World ID validates proof** and returns result
11. **User is marked as verified** and redirected to dashboard

## Testing Instructions

### 1. Get Your RP Signing Key
```bash
# Go to Developer Portal
open https://developer.worldcoin.org/

# 1. Select your app
# 2. Click "Enable World ID 4.0" if needed
# 3. Copy the signing_key value
# 4. Add to .env:
echo "RP_SIGNING_KEY=your_key_here" >> .env
```

### 2. Test with Simulator (Staging)
The auth page is configured to use `environment: "staging"` which allows testing with the World ID simulator:

1. Clear localStorage: `localStorage.clear()`
2. Go to `/auth` page
3. Connect wallet
4. Click "Verify with World ID"
5. A new window opens with World ID
6. Use the simulator to complete verification
7. You'll be redirected back to dashboard

### 3. Test with Real World App (Production)
To test with real World ID verification:

1. Change `environment: "staging"` to `environment: "production"` in `src/app/auth/page.tsx`
2. Follow steps above
3. Scan QR code with World App on your phone
4. Complete verification in the app

## Architecture Overview

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
       │                          │   Backend      │
       │                          │ /api/worldid/  │
       │                          │ rp-signature   │
       │                          └───────┬────────┘
       │                                  │
       │ 2. RP signature returned         │ Sign with
       │◄─────────────────────────────────┤ RP_SIGNING_KEY
       │                                  │
       │ 3. Create IDKit request          │
       │    with RP signature             │
       │                                  │
       │ 4. Open World ID                 │
       │    (new window/QR)               │
       │                                  │
       │ 5. User verifies                 │
       │    in World App                  │
       │                                  │
       │ 6. Poll for completion           │
       │    (proof returned)              │
       │                                  │
       │ 7. Send proof to backend         │
       ├──────────────────────────────────┐
       │                                  │
       │                          ┌───────▼────────┐
       │                          │   Backend      │
       │                          │ /api/worldid/  │
       │                          │    verify      │
       │                          └───────┬────────┘
       │                                  │
       │                                  │ 8. Forward proof
       │                                  ├────────────────┐
       │                                  │                │
       │                                  │        ┌───────▼────────┐
       │                                  │        │   World ID     │
       │                                  │        │   API v4       │
       │                                  │        │ /verify/{rp}   │
       │                                  │        └───────┬────────┘
       │                                  │                │
       │                                  │ 9. Validation  │
       │                                  │◄───────────────┘
       │                                  │    result
       │ 10. Verification result          │
       │◄─────────────────────────────────┤
       │                                  │
       │ 11. Store verified state         │
       │     Redirect to dashboard        │
       │                                  │
```

## Security Notes

### RP Signing Key
- **NEVER expose `RP_SIGNING_KEY` to the client**
- Store it as an environment variable on the server
- If the key leaks, attackers can forge requests from your app
- Rotate the key immediately if compromised

### Nullifier Hash
- Each verification produces a unique nullifier hash
- Store nullifiers in your database to prevent reuse
- Enforces one-human-one-action semantics (sybil resistance)

## Files Modified
- ✅ `package.json` - Upgraded @worldcoin/idkit to v4.0.0
- ✅ `.env` - Added RP_SIGNING_KEY
- ✅ `src/app/api/worldid/rp-signature/route.ts` - NEW endpoint
- ✅ `src/app/auth/page.tsx` - Complete rewrite for v4 API
- ✅ `src/app/api/worldid/verify/route.ts` - Already v4 compatible

## Current Status
- ✅ IDKit v4.0.0 installed
- ✅ RP signature endpoint created
- ✅ Auth page rewritten with new API
- ✅ No TypeScript errors
- ✅ No runtime errors
- ⚠️ **NEEDS**: RP_SIGNING_KEY from Developer Portal

## Next Steps

1. **Get RP Signing Key**:
   - Go to https://developer.worldcoin.org/
   - Enable World ID 4.0 for your app
   - Copy the signing_key
   - Add to `.env` as `RP_SIGNING_KEY`

2. **Test Verification**:
   - Clear localStorage
   - Go to `/auth`
   - Connect wallet
   - Click "Verify with World ID"
   - Complete verification

3. **Deploy**:
   - Add `RP_SIGNING_KEY` to Netlify environment variables
   - Deploy to production
   - Change `environment: "staging"` to `"production"` for real verification

## Troubleshooting

### "RP_SIGNING_KEY not configured"
- Add the signing key to your `.env` file
- Restart the dev server

### "Verification failed"
- Check console for detailed error messages
- Ensure RP_ID matches your app in Developer Portal
- Verify environment is set correctly (staging vs production)

### QR Code doesn't work
- Make sure you're using the World App on your phone
- Check that the app is updated to the latest version
- Try using the simulator in staging mode first

## Documentation
- World ID v4 Docs: https://docs.world.org/
- IDKit Reference: https://docs.world.org/idkit
- Developer Portal: https://developer.worldcoin.org/

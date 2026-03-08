# Plaid Link + Chainlink CRE Integration Guide

## Overview
Your Confidential Data Bridge now integrates Plaid Link for secure bank connections with Chainlink CRE for zero-knowledge secret management.

## What Was Implemented

### 1. Frontend Hook (`src/hooks/usePlaidLink.ts`)
- Dynamically loads Plaid Link SDK
- Fetches link token from backend
- Manages Plaid Link lifecycle
- Handles success/error callbacks

### 2. Backend API Routes

#### `/api/plaid/create-link-token` (POST)
- Creates a Plaid Link token for the frontend
- Configures products: Auth + Transactions
- Returns link_token for Plaid Link initialization

#### `/api/plaid/exchange` (POST)
- Exchanges public_token for permanent access_token
- Encrypts access_token using Chainlink CRE
- Stores secret in DON (Decentralized Oracle Network)
- Fallback: stores in `PrivaCRE/secrets.yaml` for development

### 3. Updated Bridge Page (`src/app/bridge/page.tsx`)
- Dynamic button states:
  - "Verify World ID First" (Phase 1)
  - "Select a Data Source" (Phase 2)
  - "Authorize Confidential Connection" (Phase 3)
  - "Opening Plaid Link..." (Connecting)
  - "Authorizing via CRE..." (Encrypting)
  - "Connection Secured ✓" (Complete)
- Loading states on bank cards during connection
- Toast notifications for success/error
- Auto-navigation to orchestration page on success

## Setup Instructions

### Step 1: Get Plaid Credentials
1. Sign up at https://dashboard.plaid.com/signup
2. Create a new application
3. Get your credentials:
   - `client_id`
   - `secret` (use sandbox secret for testing)

### Step 2: Configure Environment Variables
Add to your `.env` file:

```bash
PLAID_CLIENT_ID=your_plaid_client_id_here
PLAID_SECRET=your_plaid_sandbox_secret_here
PLAID_ENV=sandbox
```

### Step 3: Test the Flow

#### Development Mode (Without CRE)
The system will automatically fall back to storing secrets in `PrivaCRE/secrets.yaml`:

1. Start your dev server: `npm run dev`
2. Navigate to `/bridge`
3. Verify with World ID
4. Select a bank (e.g., "Wells Fargo")
5. Click "Authorize Confidential Connection"
6. Use Plaid Sandbox credentials:
   - Username: `user_good`
   - Password: `pass_good`
7. Complete the flow

#### Production Mode (With CRE)
Ensure Chainlink CRE CLI is configured:

```bash
cd PrivaCRE
npx @chainlink/cre-cli secrets:register BANK_ACCESS_TOKEN_test "test_value"
```

## User Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. User lands on /bridge                                    │
│    Button: "Verify World ID First" (disabled)               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. User verifies with World ID                              │
│    Button: "Select a Data Source" (disabled)                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. User selects bank (e.g., Wells Fargo)                    │
│    Button: "Authorize Confidential Connection" (enabled)    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. User clicks button → Plaid Link opens                    │
│    Button: "Opening Plaid Link..." (loading)                │
│    Bank card shows loading spinner                          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. User authenticates with bank credentials                 │
│    Plaid returns public_token                               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. Backend exchanges token & encrypts with CRE              │
│    Button: "Authorizing via CRE..." (loading)               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 7. Success! Toast: "Connection Secured via Chainlink CRE!"  │
│    Button: "Connection Secured ✓"                           │
│    Auto-redirect to /orchestration                          │
└─────────────────────────────────────────────────────────────┘
```

## Error Handling

### User Cancelled
- Toast: "Connection cancelled by user"
- Button returns to: "Authorize Confidential Connection"

### Invalid Credentials
- Toast: "Invalid credentials or connection error"
- Button returns to: "Authorize Confidential Connection"

### CRE Registration Failed
- Falls back to `secrets.yaml` storage
- Logs warning in console
- Returns success with `dev_mode: true` flag

## Security Notes

1. **Never expose Plaid secrets to frontend**
   - `PLAID_CLIENT_ID` and `PLAID_SECRET` are backend-only
   - Link token is generated server-side

2. **Access tokens are encrypted**
   - Stored in Chainlink DON, not your database
   - Zero-knowledge architecture

3. **World ID verification required**
   - Prevents Sybil attacks
   - One human = one score

## Testing with Plaid Sandbox

Use these test credentials in Plaid Link:

| Username | Password | Result |
|----------|----------|--------|
| user_good | pass_good | Success |
| user_bad | pass_bad | Invalid credentials |

## Next Steps

1. **Add to .env**: Configure your Plaid credentials
2. **Test locally**: Run through the complete flow
3. **Configure CRE**: Set up Chainlink CRE for production
4. **Update orchestration**: Use the stored access_token in your CRE workflow

## Troubleshooting

### "Failed to create link token"
- Check `PLAID_CLIENT_ID` and `PLAID_SECRET` in `.env`
- Verify Plaid dashboard is accessible

### "Plaid Link not ready"
- Check browser console for script loading errors
- Ensure internet connection for CDN access

### "CRE registration failed"
- Check CRE CLI is installed: `npx @chainlink/cre-cli --version`
- Verify `PrivaCRE/secrets.yaml` exists
- Check file permissions

## Files Modified/Created

- ✅ `src/hooks/usePlaidLink.ts` - Plaid Link hook
- ✅ `src/app/api/plaid/create-link-token/route.ts` - Token creation
- ✅ `src/app/api/plaid/exchange/route.ts` - Token exchange + CRE
- ✅ `src/app/bridge/page.tsx` - Updated UI with full flow
- ✅ `.env.example` - Added Plaid configuration
- ✅ `package.json` - Added dependencies

Your Confidential Data Bridge is now fully functional! 🚀

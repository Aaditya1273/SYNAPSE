# 🚀 PrivaCRE Netlify Deployment Checklist

**Quick reference for deploying to Netlify**

---

## ✅ Pre-Deployment Checklist

### 1. Code Ready
- [ ] All features working locally
- [ ] `npm run build` succeeds without errors
- [ ] No console errors in browser
- [ ] All API routes tested
- [ ] Smart contracts deployed to Tenderly

### 2. Environment Variables Ready
- [ ] `.env` file configured with all required variables
- [ ] Plaid credentials (sandbox or production)
- [ ] Groq API key
- [ ] World ID App ID
- [ ] Tenderly RPC URL
- [ ] Private key for contract interactions

### 3. Git Repository
- [ ] Code committed to Git
- [ ] `.env` file in `.gitignore` (NEVER commit secrets!)
- [ ] Pushed to GitHub/GitLab/Bitbucket
- [ ] Repository is accessible

---

## 🔐 Required Environment Variables

Copy these to Netlify Dashboard → Site Settings → Environment Variables:

```bash
# Backend API Keys (NEVER expose to frontend)
PLAID_CLIENT_ID=your_plaid_client_id
PLAID_SECRET=your_plaid_secret
PLAID_ENV=sandbox
GROQ_API_KEY=your_groq_api_key
PRIVATE_KEY=your_private_key
RPC_URL_SEPOLIA=https://virtual.sepolia.eu.rpc.tenderly.co/7611135a-8515-41d7-8146-9390be57f949

# Frontend Public Variables
NEXT_PUBLIC_WORLD_ID_APP_ID=app_7141eab28d3662245856d528b69d89e4
NEXT_PUBLIC_TENDERLY_RPC=https://virtual.sepolia.eu.rpc.tenderly.co/7611135a-8515-41d7-8146-9390be57f949

# Optional (Tenderly Integration)
TENDERLY_PROJECT=your_project
TENDERLY_USERNAME=your_username
TENDERLY_ACCESS_KEY=your_access_key
```

---

## 🚀 Deployment Methods

### Method 1: Automated Script (Recommended)

```bash
# Run the deployment script
./deploy-to-netlify.sh
```

This script will:
1. ✅ Check Netlify CLI installation
2. ✅ Verify authentication
3. ✅ Validate environment variables
4. ✅ Build project locally
5. ✅ Set environment variables in Netlify
6. ✅ Deploy to Netlify

### Method 2: Manual Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize site
netlify init

# Set environment variables
netlify env:set PLAID_CLIENT_ID "your_value"
netlify env:set PLAID_SECRET "your_value"
# ... (repeat for all variables)

# Deploy to production
netlify deploy --prod
```

### Method 3: Netlify Dashboard (UI)

1. Go to [app.netlify.com](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect your Git repository
4. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
5. Add environment variables in Site Settings
6. Click "Deploy site"

---

## 🔍 Post-Deployment Verification

### Test All Features

Visit your deployed site and verify:

- [ ] **Homepage** loads correctly
- [ ] **Wallet Connection** works (MetaMask, WalletConnect)
- [ ] **World ID Verification** opens and works
- [ ] **Plaid Link** opens and connects banks
- [ ] **Bridge Page** displays and functions
- [ ] **Orchestration Page** runs CRE workflow
- [ ] **Dashboard** shows data correctly
- [ ] **Lending Page** displays loan options
- [ ] **API Routes** respond correctly (`/api/plaid/*`, `/api/cre`, `/api/worldid/*`)

### Check Deployment Logs

```bash
# View deployment logs
netlify logs

# Check site status
netlify status

# Open site in browser
netlify open:site
```

### Verify Environment Variables

```bash
# List all environment variables
netlify env:list

# Check specific variable
netlify env:get PLAID_CLIENT_ID
```

---

## 🐛 Common Issues & Solutions

### Issue: Build Fails

**Error**: `Module not found` or `Cannot find module`

**Solution**:
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Issue: Environment Variables Not Working

**Error**: `undefined` or `null` for environment variables

**Solution**:
1. Verify variables are set in Netlify Dashboard
2. Check variable names match exactly (case-sensitive)
3. Public variables must start with `NEXT_PUBLIC_`
4. Redeploy after adding variables

### Issue: API Routes Return 404

**Error**: `/api/*` routes not found

**Solution**:
1. Ensure `@netlify/plugin-nextjs` is in `package.json`
2. Verify `netlify.toml` has plugin configured
3. Check Next.js version compatibility

### Issue: Plaid Link Doesn't Open

**Error**: Plaid Link fails to initialize

**Solution**:
1. Verify `PLAID_CLIENT_ID` and `PLAID_SECRET` are set
2. Check `PLAID_ENV=sandbox` (or `production`)
3. Ensure variables are NOT prefixed with `NEXT_PUBLIC_` (backend only)
4. Check browser console for errors

### Issue: World ID Widget Doesn't Load

**Error**: World ID verification fails

**Solution**:
1. Verify `NEXT_PUBLIC_WORLD_ID_APP_ID` is set
2. Ensure it starts with `app_`
3. Check it's a public variable (has `NEXT_PUBLIC_` prefix)
4. Verify World ID app is active in World ID dashboard

### Issue: Smart Contract Calls Fail

**Error**: Contract interaction errors

**Solution**:
1. Verify `NEXT_PUBLIC_TENDERLY_RPC` is set correctly
2. Check contract addresses in `src/lib/contract-addresses.json`
3. Ensure contracts are deployed to Tenderly Virtual Sepolia
4. Verify `PRIVATE_KEY` has funds for gas

---

## 📊 Deployment Status

### Build Configuration

| Setting | Value |
|---------|-------|
| Build Command | `npm run build` |
| Publish Directory | `.next` |
| Node Version | 18.17.0 |
| Framework | Next.js 15.2.0 |
| Plugin | @netlify/plugin-nextjs |

### Expected Build Time

- **First Deploy**: 5-8 minutes
- **Subsequent Deploys**: 2-4 minutes
- **With Cache**: 1-2 minutes

### Site Features

✅ **Automatic HTTPS** - SSL certificate via Let's Encrypt  
✅ **Global CDN** - Edge network for fast loading  
✅ **Continuous Deployment** - Auto-deploy on Git push  
✅ **Deploy Previews** - Preview URLs for pull requests  
✅ **Rollback** - Instant rollback to previous deploys  
✅ **Environment Variables** - Secure secret management  

---

## 🎯 Production Readiness

### Before Going Live

- [ ] Switch Plaid to production environment
- [ ] Update `PLAID_ENV=production`
- [ ] Get production Plaid credentials
- [ ] Deploy contracts to mainnet
- [ ] Update RPC URLs to mainnet
- [ ] Test complete user flow
- [ ] Set up monitoring (Sentry, LogRocket)
- [ ] Configure custom domain
- [ ] Enable Netlify Analytics
- [ ] Run security audit
- [ ] Test on mobile devices
- [ ] Verify WCAG accessibility
- [ ] Set up error tracking

### Security Checklist

- [ ] All secrets in environment variables (not in code)
- [ ] `.env` file in `.gitignore`
- [ ] No API keys in frontend code
- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] CORS properly configured
- [ ] Rate limiting on API routes
- [ ] Input validation on all forms
- [ ] XSS protection enabled

---

## 📈 Performance Optimization

### Already Configured

✅ Static asset caching (1 year)  
✅ Image optimization (Next.js Image)  
✅ Code splitting (automatic)  
✅ Compression (gzip/brotli)  
✅ CDN distribution (global)  

### Additional Optimizations

1. **Enable Netlify Analytics** (optional, paid)
2. **Add Netlify Functions** for heavy API operations
3. **Configure ISR** (Incremental Static Regeneration)
4. **Optimize images** with WebP format
5. **Lazy load** heavy components

---

## 🔗 Useful Links

- **Netlify Dashboard**: https://app.netlify.com
- **Netlify Docs**: https://docs.netlify.com
- **Next.js on Netlify**: https://docs.netlify.com/integrations/frameworks/next-js/
- **Environment Variables**: https://docs.netlify.com/environment-variables/overview/
- **Deploy Logs**: https://app.netlify.com/sites/[your-site]/deploys

---

## 📞 Support

### Netlify Support

- **Community Forum**: https://answers.netlify.com
- **Status Page**: https://www.netlifystatus.com
- **Documentation**: https://docs.netlify.com

### PrivaCRE Documentation

- `README.md` - Project overview
- `NETLIFY_DEPLOYMENT_GUIDE.md` - Detailed deployment guide
- `COMPREHENSIVE_AUDIT_REPORT.md` - Full project audit
- `QUICK_REFERENCE.md` - Quick commands reference

---

## ✅ Success Criteria

Your deployment is successful when:

1. ✅ Site loads at Netlify URL
2. ✅ All pages render correctly
3. ✅ Wallet connection works
4. ✅ World ID verification works
5. ✅ Plaid Link opens and connects
6. ✅ CRE orchestration runs
7. ✅ Dashboard displays data
8. ✅ No console errors
9. ✅ All API routes respond
10. ✅ Smart contract interactions work

---

## 🎉 Deployment Complete!

Once deployed, share your site:

- ✅ **Hackathon Judges** - Submit your Netlify URL
- ✅ **Team Members** - Share for testing
- ✅ **Social Media** - Announce your launch
- ✅ **Portfolio** - Add to your projects

**Your PrivaCRE project is now LIVE! 🚀**

---

**Last Updated**: March 7, 2026  
**Status**: Ready for Deployment ✅  
**Estimated Time**: 10-15 minutes  
**Difficulty**: Easy 😊

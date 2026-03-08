# 🚀 Netlify Deployment Guide - PrivaCRE

**Complete guide to deploy your PrivaCRE project to Netlify**

---

## 📋 Prerequisites

- ✅ GitHub account
- ✅ Netlify account (free tier works!)
- ✅ All environment variables ready
- ✅ Project pushed to GitHub

---

## 🎯 Quick Deploy (5 Minutes)

### Method 1: Automated Script (Easiest!) ⚡

We've created an automated deployment script that handles everything:

```bash
# Run the deployment script
./deploy-to-netlify.sh
```

**What it does**:
1. ✅ Checks Netlify CLI installation
2. ✅ Verifies authentication
3. ✅ Validates environment variables
4. ✅ Installs dependencies
5. ✅ Builds project locally
6. ✅ Sets environment variables in Netlify
7. ✅ Deploys to Netlify

**Choose deployment type**:
- Production (live site)
- Preview (draft URL for testing)

That's it! Your site will be live in 5-10 minutes.

---

### Method 2: Manual Deployment via GitHub

### Step 1: Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "feat: complete PrivaCRE project ready for deployment"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/yourusername/PrivaCRE.git

# Push to GitHub
git push -u origin main
```

### Step 2: Connect to Netlify

1. Go to [Netlify](https://app.netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **"Deploy with GitHub"**
4. Authorize Netlify to access your GitHub
5. Select your **PrivaCRE** repository

### Step 3: Configure Build Settings

Netlify should auto-detect Next.js. Verify these settings:

```
Build command: npm run build
Publish directory: .next
```

### Step 4: Add Environment Variables

Click **"Add environment variables"** and add these:

**Required Variables**:
```
PLAID_CLIENT_ID=your_plaid_client_id
PLAID_SECRET=your_plaid_secret
PLAID_ENV=sandbox
GROQ_API_KEY=your_groq_api_key
NEXT_PUBLIC_WORLD_ID_APP_ID=app_7141eab28d3662245856d528b69d89e4
RPC_URL_SEPOLIA=https://virtual.sepolia.eu.rpc.tenderly.co/7611135a-8515-41d7-8146-9390be57f949
NEXT_PUBLIC_TENDERLY_RPC=https://virtual.sepolia.eu.rpc.tenderly.co/7611135a-8515-41d7-8146-9390be57f949
PRIVATE_KEY=your_deployer_private_key
```

**Optional Variables**:
```
TENDERLY_PROJECT=your_tenderly_project
TENDERLY_USERNAME=your_tenderly_username
TENDERLY_ACCESS_KEY=your_tenderly_access_key
```

### Step 5: Deploy!

Click **"Deploy site"**

Netlify will:
1. Clone your repository
2. Install dependencies
3. Build your Next.js app
4. Deploy to CDN

**Deployment time**: ~3-5 minutes

---

## 🔧 Manual Deployment (Using Netlify CLI)

### Install Netlify CLI

```bash
npm install -g netlify-cli
```

### Login to Netlify

```bash
netlify login
```

### Initialize Site

```bash
netlify init
```

Follow the prompts:
1. Create & configure a new site
2. Choose your team
3. Enter site name (e.g., `privacre-defi`)
4. Build command: `npm run build`
5. Publish directory: `.next`

### Set Environment Variables

```bash
# Set all environment variables
netlify env:set PLAID_CLIENT_ID "your_plaid_client_id"
netlify env:set PLAID_SECRET "your_plaid_secret"
netlify env:set PLAID_ENV "sandbox"
netlify env:set GROQ_API_KEY "your_groq_api_key"
netlify env:set NEXT_PUBLIC_WORLD_ID_APP_ID "app_7141eab28d3662245856d528b69d89e4"
netlify env:set RPC_URL_SEPOLIA "https://virtual.sepolia.eu.rpc.tenderly.co/7611135a-8515-41d7-8146-9390be57f949"
netlify env:set NEXT_PUBLIC_TENDERLY_RPC "https://virtual.sepolia.eu.rpc.tenderly.co/7611135a-8515-41d7-8146-9390be57f949"
netlify env:set PRIVATE_KEY "your_deployer_private_key"
```

### Deploy

```bash
# Deploy to production
netlify deploy --prod

# Or deploy to preview first
netlify deploy
```

---

## 📝 Configuration Files

### netlify.toml (Already Created)

This file configures your Netlify deployment:
- Build command
- Publish directory
- Redirects for Next.js
- Security headers
- Cache settings

**Location**: `netlify.toml` (root directory)

### package.json Scripts

Verify these scripts exist:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

---

## 🔐 Environment Variables Setup

### Required for Production

| Variable | Description | Example |
|----------|-------------|---------|
| `PLAID_CLIENT_ID` | Plaid API client ID | `5f8a...` |
| `PLAID_SECRET` | Plaid API secret | `abc123...` |
| `PLAID_ENV` | Plaid environment | `sandbox` or `production` |
| `GROQ_API_KEY` | Groq AI API key | `gsk_...` |
| `NEXT_PUBLIC_WORLD_ID_APP_ID` | World ID app ID | `app_...` |
| `RPC_URL_SEPOLIA` | Tenderly RPC URL | `https://virtual.sepolia...` |
| `NEXT_PUBLIC_TENDERLY_RPC` | Public Tenderly RPC | `https://virtual.sepolia...` |
| `PRIVATE_KEY` | Deployer private key | `0x...` |

### How to Add in Netlify Dashboard

1. Go to your site dashboard
2. Click **"Site settings"**
3. Click **"Environment variables"**
4. Click **"Add a variable"**
5. Enter key and value
6. Click **"Create variable"**
7. Repeat for all variables

---

## 🌐 Custom Domain (Optional)

### Add Custom Domain

1. Go to **"Domain settings"**
2. Click **"Add custom domain"**
3. Enter your domain (e.g., `privacre.com`)
4. Follow DNS configuration instructions

### Enable HTTPS

Netlify automatically provisions SSL certificates via Let's Encrypt.

**HTTPS will be enabled within 24 hours.**

---

## 🔍 Verify Deployment

### Check Build Logs

1. Go to **"Deploys"** tab
2. Click on latest deploy
3. View build logs
4. Verify no errors

### Test Your Site

Visit your Netlify URL (e.g., `https://privacre-defi.netlify.app`)

**Test these features**:
- ✅ Homepage loads
- ✅ Wallet connection works
- ✅ World ID verification works
- ✅ Plaid Link opens
- ✅ Orchestration page works
- ✅ Dashboard displays
- ✅ Lending page functional

---

## 🐛 Troubleshooting

### Build Fails

**Error**: `Module not found`

**Solution**:
```bash
# Clear cache and rebuild
netlify build --clear-cache
```

**Error**: `Environment variable not found`

**Solution**:
1. Check all environment variables are set
2. Verify variable names match exactly
3. Redeploy after adding variables

### API Routes Not Working

**Error**: `404 on /api/*`

**Solution**:
Verify `netlify.toml` has correct redirects:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Plaid Link Not Opening

**Error**: `Plaid Link fails to initialize`

**Solution**:
1. Check `PLAID_CLIENT_ID` and `PLAID_SECRET` are set
2. Verify `PLAID_ENV=sandbox`
3. Check browser console for errors

### World ID Verification Fails

**Error**: `World ID widget doesn't load`

**Solution**:
1. Verify `NEXT_PUBLIC_WORLD_ID_APP_ID` is set
2. Check it starts with `app_`
3. Ensure it's a public variable (starts with `NEXT_PUBLIC_`)

---

## 🚀 Deployment Checklist

### Pre-Deployment

- [ ] All code committed to GitHub
- [ ] `.env` file NOT committed (in `.gitignore`)
- [ ] `netlify.toml` created
- [ ] Build succeeds locally (`npm run build`)
- [ ] All environment variables documented

### During Deployment

- [ ] Repository connected to Netlify
- [ ] Build settings configured
- [ ] All environment variables added
- [ ] Deploy triggered

### Post-Deployment

- [ ] Build completed successfully
- [ ] Site accessible via Netlify URL
- [ ] All pages load correctly
- [ ] API routes working
- [ ] Wallet connection works
- [ ] Plaid integration works
- [ ] World ID works
- [ ] Smart contract interactions work

---

## 📊 Deployment Status

### Build Information

**Build Command**: `npm run build`  
**Publish Directory**: `.next`  
**Node Version**: 18.17.0  
**Build Time**: ~3-5 minutes

### Site Information

**Netlify URL**: `https://[your-site-name].netlify.app`  
**Custom Domain**: (Optional)  
**HTTPS**: Enabled automatically  
**CDN**: Global edge network

---

## � Continuous Deployment

### Auto-Deploy on Push

Netlify automatically deploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "feat: update feature"
git push

# Netlify automatically:
# 1. Detects push
# 2. Starts build
# 3. Deploys if successful
```

### Deploy Previews

Every pull request gets a preview URL:
- Test changes before merging
- Share with team for review
- Automatic cleanup after merge

---

## 📈 Performance Optimization

### Already Configured

✅ **Static Asset Caching**: 1 year cache for images/fonts  
✅ **Security Headers**: XSS protection, frame options  
✅ **CDN**: Global edge network  
✅ **Compression**: Automatic gzip/brotli  
✅ **Image Optimization**: Next.js Image component

### Additional Optimizations

1. **Enable Netlify Analytics** (optional, paid)
2. **Add Netlify Functions** for serverless API routes
3. **Configure Split Testing** for A/B testing

---

## � Production Checklist

### Before Going Live

- [ ] Switch Plaid to production environment
- [ ] Update `PLAID_ENV=production`
- [ ] Get production Plaid credentials
- [ ] Test with real bank accounts
- [ ] Verify all smart contracts on mainnet
- [ ] Update RPC URLs to mainnet
- [ ] Test complete user flow
- [ ] Set up monitoring/alerts
- [ ] Configure custom domain
- [ ] Enable HTTPS
- [ ] Test on mobile devices
- [ ] Run security audit
- [ ] Set up error tracking (Sentry)

---

## � Useful Links

- **Netlify Dashboard**: https://app.netlify.com
- **Netlify Docs**: https://docs.netlify.com
- **Next.js on Netlify**: https://docs.netlify.com/integrations/frameworks/next-js/
- **Environment Variables**: https://docs.netlify.com/environment-variables/overview/

---

## 📞 Support

### Netlify Support

- **Community Forum**: https://answers.netlify.com
- **Status Page**: https://www.netlifystatus.com
- **Support**: support@netlify.com

### PrivaCRE Issues

- **GitHub Issues**: Create an issue in your repository
- **Documentation**: Check project documentation files

---

## ✅ Success!

Once deployed, your PrivaCRE project will be live at:

**https://[your-site-name].netlify.app**

Share this URL with:
- ✅ Hackathon judges
- ✅ Team members
- ✅ Potential users
- ✅ Investors

**Your project is now LIVE and accessible worldwide!** 🌍🚀

---

**Deployment Status**: Ready to Deploy ✅  
**Estimated Time**: 5-10 minutes  
**Difficulty**: Easy 😊

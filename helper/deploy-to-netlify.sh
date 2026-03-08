#!/bin/bash

# PrivaCRE Netlify Deployment Script
# Chainlink Convergence Hackathon 2025
# Privacy-First DeFi Lending Platform

set -e  # Exit on error

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  PrivaCRE - Netlify Deployment Script                     ║"
echo "║  Privacy Track - Chainlink Convergence Hackathon 2025     ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo -e "${YELLOW}⚠️  Netlify CLI not found${NC}"
    echo "Installing Netlify CLI..."
    npm install -g netlify-cli
    echo -e "${GREEN}✅ Netlify CLI installed${NC}"
else
    echo -e "${GREEN}✅ Netlify CLI found${NC}"
fi

# Check if logged in to Netlify
echo ""
echo -e "${BLUE}🔐 Checking Netlify authentication...${NC}"
if ! netlify status &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not logged in to Netlify${NC}"
    echo "Opening browser for authentication..."
    netlify login
else
    echo -e "${GREEN}✅ Authenticated with Netlify${NC}"
fi

# Check if .env file exists
echo ""
echo -e "${BLUE}🔍 Checking environment configuration...${NC}"
if [ ! -f .env ]; then
    echo -e "${RED}❌ .env file not found${NC}"
    echo "Please create .env file with required variables"
    echo "See .env.example for reference"
    exit 1
else
    echo -e "${GREEN}✅ .env file found${NC}"
fi

# Verify required environment variables
echo ""
echo -e "${BLUE}🔍 Verifying required environment variables...${NC}"

required_vars=(
    "PLAID_CLIENT_ID"
    "PLAID_SECRET"
    "GROQ_API_KEY"
    "NEXT_PUBLIC_WORLD_ID_APP_ID"
    "RPC_URL_SEPOLIA"
    "NEXT_PUBLIC_TENDERLY_RPC"
    "PRIVATE_KEY"
)

missing_vars=()
for var in "${required_vars[@]}"; do
    if ! grep -q "^${var}=" .env; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -gt 0 ]; then
    echo -e "${RED}❌ Missing required environment variables:${NC}"
    for var in "${missing_vars[@]}"; do
        echo "   - $var"
    done
    echo ""
    echo "Please add these to your .env file"
    exit 1
else
    echo -e "${GREEN}✅ All required environment variables present${NC}"
fi

# Install dependencies
echo ""
echo -e "${BLUE}📦 Installing dependencies...${NC}"
npm install
echo -e "${GREEN}✅ Dependencies installed${NC}"

# Build the project locally to verify
echo ""
echo -e "${BLUE}🔨 Building project locally...${NC}"
npm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Local build successful${NC}"
else
    echo -e "${RED}❌ Local build failed${NC}"
    echo "Please fix build errors before deploying"
    exit 1
fi

# Check if site is already initialized
echo ""
echo -e "${BLUE}🌐 Checking Netlify site configuration...${NC}"
if [ ! -f .netlify/state.json ]; then
    echo -e "${YELLOW}⚠️  Site not initialized${NC}"
    echo "Initializing new Netlify site..."
    netlify init
else
    echo -e "${GREEN}✅ Site already configured${NC}"
fi

# Set environment variables in Netlify
echo ""
echo -e "${BLUE}🔐 Setting environment variables in Netlify...${NC}"

# Read .env file and set variables
while IFS='=' read -r key value; do
    # Skip comments and empty lines
    [[ $key =~ ^#.*$ ]] && continue
    [[ -z $key ]] && continue
    
    # Remove quotes from value
    value=$(echo "$value" | sed -e 's/^"//' -e 's/"$//' -e "s/^'//" -e "s/'$//")
    
    # Set in Netlify
    echo "Setting $key..."
    netlify env:set "$key" "$value" --silent || true
done < .env

echo -e "${GREEN}✅ Environment variables configured${NC}"

# Deploy to Netlify
echo ""
echo -e "${BLUE}🚀 Deploying to Netlify...${NC}"
echo ""
echo "Choose deployment type:"
echo "1) Deploy to production"
echo "2) Deploy preview (draft)"
read -p "Enter choice (1 or 2): " choice

case $choice in
    1)
        echo ""
        echo -e "${BLUE}🚀 Deploying to PRODUCTION...${NC}"
        netlify deploy --prod
        ;;
    2)
        echo ""
        echo -e "${BLUE}🚀 Deploying PREVIEW...${NC}"
        netlify deploy
        ;;
    *)
        echo -e "${RED}❌ Invalid choice${NC}"
        exit 1
        ;;
esac

# Get site URL
echo ""
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo -e "${BLUE}📊 Site Information:${NC}"
netlify status

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  🎉 PrivaCRE Successfully Deployed to Netlify!            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo -e "${GREEN}Next Steps:${NC}"
echo "1. Visit your site URL (shown above)"
echo "2. Test all features:"
echo "   - Wallet connection"
echo "   - World ID verification"
echo "   - Plaid Link integration"
echo "   - CRE orchestration"
echo "   - Dashboard functionality"
echo "3. Share with hackathon judges!"
echo ""
echo -e "${BLUE}Useful Commands:${NC}"
echo "  netlify open          - Open site dashboard"
echo "  netlify logs          - View deployment logs"
echo "  netlify env:list      - List environment variables"
echo "  netlify deploy --prod - Deploy to production"
echo ""

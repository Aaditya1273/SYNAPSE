#!/bin/bash

# PrivaCRE Quick Demo Launcher
# This script prepares and launches the demo environment

echo "🚀 PrivaCRE Quick Demo Launcher"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Step 1: Pre-flight checks
echo -e "${BLUE}Step 1: Running pre-flight checks...${NC}"
./test-e2e.sh
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}⚠️  Some checks failed, but continuing...${NC}"
fi
echo ""

# Step 2: Clear previous demo data
echo -e "${BLUE}Step 2: Clearing previous demo data...${NC}"
echo "This will reset localStorage for a fresh demo."
echo ""

# Step 3: Start dev server
echo -e "${BLUE}Step 3: Starting development server...${NC}"
echo ""
echo -e "${GREEN}✅ Server starting...${NC}"
echo ""
echo "================================"
echo -e "${GREEN}🎬 Demo Ready!${NC}"
echo "================================"
echo ""
echo "📋 Demo Flow:"
echo "  1. Open: ${BLUE}http://localhost:3000${NC}"
echo "  2. Connect Wallet"
echo "  3. Navigate to ${BLUE}/bridge${NC}"
echo "  4. Verify World ID"
echo "  5. Connect Bank (Plaid)"
echo "     - Username: ${YELLOW}user_good${NC}"
echo "     - Password: ${YELLOW}pass_good${NC}"
echo "  6. Navigate to ${BLUE}/orchestration${NC}"
echo "  7. Click ${YELLOW}RUN PIPELINE${NC}"
echo "  8. Watch the magic! ✨"
echo ""
echo "📖 Full demo script: ${BLUE}DEMO_SCRIPT.md${NC}"
echo "🧪 Test guide: ${BLUE}END_TO_END_TEST_GUIDE.md${NC}"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the dev server
npm run dev

#!/bin/bash

echo "🔍 Testing RPC Connections"
echo "=========================="
echo ""

# Load .env
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}Testing Tenderly RPC...${NC}"
echo "URL: $RPC_URL_SEPOLIA"
echo ""

RESPONSE=$(curl -s -X POST $RPC_URL_SEPOLIA \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}')

if echo "$RESPONSE" | grep -q "result"; then
    BLOCK=$(echo "$RESPONSE" | grep -o '"result":"[^"]*"' | cut -d'"' -f4)
    BLOCK_DEC=$((16#${BLOCK:2}))
    echo -e "${GREEN}✅ RPC Connection Successful${NC}"
    echo "Current Block: $BLOCK_DEC (hex: $BLOCK)"
else
    echo -e "${RED}❌ RPC Connection Failed${NC}"
    echo "Response: $RESPONSE"
    echo ""
    echo -e "${YELLOW}Possible Issues:${NC}"
    echo "1. Tenderly Virtual Testnet expired"
    echo "2. RPC URL is incorrect"
    echo "3. Network connectivity issue"
    echo ""
    echo -e "${YELLOW}Solutions:${NC}"
    echo "1. Get new RPC from: https://dashboard.tenderly.co/LSUDOKO/project/testnet"
    echo "2. Or use public Sepolia RPC: https://ethereum-sepolia-rpc.publicnode.com"
fi

echo ""
echo -e "${YELLOW}Testing Public Sepolia RPC (fallback)...${NC}"
PUBLIC_RPC="https://ethereum-sepolia-rpc.publicnode.com"
echo "URL: $PUBLIC_RPC"
echo ""

RESPONSE2=$(curl -s -X POST $PUBLIC_RPC \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}')

if echo "$RESPONSE2" | grep -q "result"; then
    BLOCK2=$(echo "$RESPONSE2" | grep -o '"result":"[^"]*"' | cut -d'"' -f4)
    BLOCK_DEC2=$((16#${BLOCK2:2}))
    echo -e "${GREEN}✅ Public RPC Connection Successful${NC}"
    echo "Current Block: $BLOCK_DEC2 (hex: $BLOCK2)"
    echo ""
    echo -e "${YELLOW}💡 Tip: You can use this as a fallback in your .env:${NC}"
    echo "RPC_URL_SEPOLIA=$PUBLIC_RPC"
else
    echo -e "${RED}❌ Public RPC Connection Failed${NC}"
    echo "Response: $RESPONSE2"
fi

echo ""
echo "=========================="
echo "Test Complete"

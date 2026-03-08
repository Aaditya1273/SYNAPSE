#!/bin/bash

echo "🔄 Forcing Next.js to rebuild with latest code..."
echo ""

# Remove compiled files
rm -rf .next

echo "✅ Build cache cleared"
echo ""
echo "📝 Next steps:"
echo "   1. The dev server will automatically rebuild"
echo "   2. Wait for 'compiled successfully' message"
echo "   3. Navigate to /orchestration"
echo "   4. Click 'RUN PIPELINE'"
echo "   5. Should now see: '✅ Found Plaid access token in secrets.yaml'"
echo ""
echo "🎉 Ready! The next API call will use real Plaid data."

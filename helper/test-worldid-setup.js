// Quick test to verify World ID environment variables
// Run with: node test-worldid-setup.js

require('dotenv').config();

console.log('\n🔍 Testing World ID Setup...\n');

const appId = process.env.NEXT_PUBLIC_WORLD_ID_APP_ID;
const rpId = process.env.NEXT_PUBLIC_WORLD_RP_ID;

console.log('Environment Variables:');
console.log('---------------------');
console.log('NEXT_PUBLIC_WORLD_ID_APP_ID:', appId || '❌ NOT SET');
console.log('NEXT_PUBLIC_WORLD_RP_ID:', rpId || '❌ NOT SET');
console.log('');

// Validate
let hasErrors = false;

if (!appId) {
  console.log('❌ ERROR: NEXT_PUBLIC_WORLD_ID_APP_ID is not set');
  hasErrors = true;
} else if (!appId.startsWith('app_')) {
  console.log('❌ ERROR: NEXT_PUBLIC_WORLD_ID_APP_ID should start with "app_"');
  hasErrors = true;
} else {
  console.log('✅ NEXT_PUBLIC_WORLD_ID_APP_ID is valid');
}

if (!rpId) {
  console.log('❌ ERROR: NEXT_PUBLIC_WORLD_RP_ID is not set');
  hasErrors = true;
} else if (!rpId.startsWith('rp_')) {
  console.log('❌ ERROR: NEXT_PUBLIC_WORLD_RP_ID should start with "rp_"');
  hasErrors = true;
} else {
  console.log('✅ NEXT_PUBLIC_WORLD_RP_ID is valid');
}

console.log('');

if (hasErrors) {
  console.log('❌ Setup has errors. Please fix the issues above.');
  console.log('');
  console.log('Expected values:');
  console.log('NEXT_PUBLIC_WORLD_ID_APP_ID=app_7141eab28d3662245856d528b69d89e4');
  console.log('NEXT_PUBLIC_WORLD_RP_ID=rp_c7db831223d44723');
  process.exit(1);
} else {
  console.log('✅ All checks passed!');
  console.log('');
  console.log('Next steps:');
  console.log('1. Restart your dev server: npm run dev');
  console.log('2. Navigate to http://localhost:3000/dashboard');
  console.log('3. Connect your wallet');
  console.log('4. Click "Verify with World ID"');
  console.log('5. QR code should appear');
  process.exit(0);
}

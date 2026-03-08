#!/usr/bin/env node

/**
 * Test script to verify Plaid integration setup
 * Run: node test-plaid-setup.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking Plaid Integration Setup...\n');

let errors = [];
let warnings = [];
let success = [];

// Check 1: Environment variables
console.log('1️⃣  Checking environment variables...');
try {
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) {
    errors.push('.env file not found. Copy .env.example to .env');
  } else {
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    if (!envContent.includes('PLAID_CLIENT_ID=') || envContent.includes('PLAID_CLIENT_ID=your_plaid')) {
      warnings.push('PLAID_CLIENT_ID not configured in .env');
    } else {
      success.push('PLAID_CLIENT_ID configured');
    }
    
    if (!envContent.includes('PLAID_SECRET=') || envContent.includes('PLAID_SECRET=your_plaid')) {
      warnings.push('PLAID_SECRET not configured in .env');
    } else {
      success.push('PLAID_SECRET configured');
    }
  }
} catch (error) {
  errors.push(`Error reading .env: ${error.message}`);
}

// Check 2: Required files
console.log('2️⃣  Checking required files...');
const requiredFiles = [
  'src/hooks/usePlaidLink.ts',
  'src/app/api/plaid/create-link-token/route.ts',
  'src/app/api/plaid/exchange/route.ts',
  'src/app/bridge/page.tsx',
];

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    success.push(`${file} exists`);
  } else {
    errors.push(`${file} not found`);
  }
});

// Check 3: Dependencies
console.log('3️⃣  Checking dependencies...');
try {
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
  
  if (packageJson.dependencies['plaid']) {
    success.push('plaid package installed');
  } else {
    errors.push('plaid package not installed');
  }
  
  if (packageJson.dependencies['react-plaid-link']) {
    success.push('react-plaid-link package installed');
  } else {
    warnings.push('react-plaid-link package not installed (run: npm install react-plaid-link --legacy-peer-deps)');
  }
  
  if (packageJson.dependencies['yaml']) {
    success.push('yaml package installed');
  } else {
    warnings.push('yaml package not installed (run: npm install yaml)');
  }
} catch (error) {
  errors.push(`Error reading package.json: ${error.message}`);
}

// Check 4: CRE Setup
console.log('4️⃣  Checking Chainlink CRE setup...');
const creSecretsPath = path.join(__dirname, 'PrivaCRE', 'secrets.yaml');
if (fs.existsSync(creSecretsPath)) {
  success.push('PrivaCRE/secrets.yaml exists (fallback storage ready)');
} else {
  warnings.push('PrivaCRE/secrets.yaml not found (will be created on first connection)');
}

// Print results
console.log('\n' + '='.repeat(60));
console.log('📊 RESULTS\n');

if (success.length > 0) {
  console.log('✅ SUCCESS:');
  success.forEach(msg => console.log(`   ✓ ${msg}`));
  console.log('');
}

if (warnings.length > 0) {
  console.log('⚠️  WARNINGS:');
  warnings.forEach(msg => console.log(`   ⚠ ${msg}`));
  console.log('');
}

if (errors.length > 0) {
  console.log('❌ ERRORS:');
  errors.forEach(msg => console.log(`   ✗ ${msg}`));
  console.log('');
}

console.log('='.repeat(60));

if (errors.length === 0 && warnings.length === 0) {
  console.log('\n🎉 All checks passed! Your Plaid integration is ready.');
  console.log('\n📝 Next steps:');
  console.log('   1. Add your Plaid credentials to .env');
  console.log('   2. Run: npm run dev');
  console.log('   3. Navigate to /bridge and test the flow');
  process.exit(0);
} else if (errors.length === 0) {
  console.log('\n⚠️  Setup is functional but has warnings.');
  console.log('   Review warnings above and configure as needed.');
  process.exit(0);
} else {
  console.log('\n❌ Setup incomplete. Fix errors above before proceeding.');
  process.exit(1);
}

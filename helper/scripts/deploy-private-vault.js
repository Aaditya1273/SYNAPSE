const hre = require("hardhat");

async function main() {
  console.log("╔════════════════════════════════════════════════════════════╗");
  console.log("║  Deploying PrivateVault - Privacy Track Implementation     ║");
  console.log("╚════════════════════════════════════════════════════════════╝");
  console.log("");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");
  console.log("");

  // Deploy MockUSDC first (if not already deployed)
  console.log("📦 Deploying MockUSDC...");
  const MockUSDC = await hre.ethers.getContractFactory("MockUSDC");
  const mockUSDC = await MockUSDC.deploy();
  await mockUSDC.waitForDeployment();
  const mockUSDCAddress = await mockUSDC.getAddress();
  console.log("✅ MockUSDC deployed to:", mockUSDCAddress);
  console.log("");

  // Oracle address (will be the CRE workflow address)
  const oracleAddress = deployer.address; // Placeholder - update with actual CRE oracle
  console.log("🔮 Oracle address:", oracleAddress);
  
  // Confidential Compute address (CRE DON address)
  const confidentialComputeAddress = deployer.address; // Placeholder - update with actual CC address
  console.log("🔐 Confidential Compute address:", confidentialComputeAddress);
  console.log("");

  // Deploy PrivateVault
  console.log("📦 Deploying PrivateVault...");
  const PrivateVault = await hre.ethers.getContractFactory("PrivateVault");
  const privateVault = await PrivateVault.deploy(
    mockUSDCAddress,
    oracleAddress,
    confidentialComputeAddress
  );
  await privateVault.waitForDeployment();
  const privateVaultAddress = await privateVault.getAddress();
  console.log("✅ PrivateVault deployed to:", privateVaultAddress);
  console.log("");

  // Mint some USDC to the vault for liquidity
  console.log("💰 Minting USDC to PrivateVault...");
  const mintAmount = hre.ethers.parseUnits("100000", 6); // 100k USDC
  await mockUSDC.mint(privateVaultAddress, mintAmount);
  console.log("✅ Minted 100,000 USDC to vault");
  console.log("");

  // Mint some USDC to deployer for testing
  console.log("💰 Minting USDC to deployer for testing...");
  await mockUSDC.mint(deployer.address, mintAmount);
  console.log("✅ Minted 100,000 USDC to deployer");
  console.log("");

  console.log("╔════════════════════════════════════════════════════════════╗");
  console.log("║  Deployment Summary                                         ║");
  console.log("╚════════════════════════════════════════════════════════════╝");
  console.log("");
  console.log("📝 Contract Addresses:");
  console.log("  MockUSDC:        ", mockUSDCAddress);
  console.log("  PrivateVault:    ", privateVaultAddress);
  console.log("  Oracle:          ", oracleAddress);
  console.log("  Confidential CC: ", confidentialComputeAddress);
  console.log("");
  console.log("🔐 Privacy Features:");
  console.log("  ✅ Commitment-based storage");
  console.log("  ✅ Encrypted credit scores");
  console.log("  ✅ Private loan amounts");
  console.log("  ✅ Zero-knowledge proofs");
  console.log("  ✅ Nullifier tracking");
  console.log("  ✅ Confidential transaction history");
  console.log("");
  console.log("📋 Next Steps:");
  console.log("  1. Update PrivaCRE/my-workflow/config.staging.json:");
  console.log(`     "privateVaultAddress": "${privateVaultAddress}"`);
  console.log("");
  console.log("  2. Grant CONFIDENTIAL_COMPUTE_ROLE to CRE DON:");
  console.log(`     cast send ${privateVaultAddress} \\`);
  console.log(`       "grantRole(bytes32,address)" \\`);
  console.log(`       $(cast keccak "CONFIDENTIAL_COMPUTE_ROLE()") \\`);
  console.log(`       <CRE_DON_ADDRESS> \\`);
  console.log(`       --rpc-url $RPC_URL --private-key $PRIVATE_KEY`);
  console.log("");
  console.log("  3. Deploy CRE workflow:");
  console.log("     cd PrivaCRE");
  console.log("     cre workflow deploy CreditScoreWorkflow --target staging-settings");
  console.log("");
  console.log("  4. Test private score submission:");
  console.log("     node scripts/test-private-score.js");
  console.log("");
  console.log("✅ Deployment complete!");
  console.log("");

  // Save deployment info
  const fs = require("fs");
  const deploymentInfo = {
    network: hre.network.name,
    timestamp: new Date().toISOString(),
    contracts: {
      MockUSDC: mockUSDCAddress,
      PrivateVault: privateVaultAddress,
    },
    config: {
      oracle: oracleAddress,
      confidentialCompute: confidentialComputeAddress,
    },
  };

  fs.writeFileSync(
    "deployments/private-vault-deployment.json",
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log("💾 Deployment info saved to deployments/private-vault-deployment.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

const hre = require("hardhat");
const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Starting deployment to", hre.network.name);

  // Get deployer
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // Determine USDC and Price Feed addresses
  let usdcAddress;
  let priceFeedAddress;

  if (hre.network.name === "tenderly" || hre.network.name === "localhost") {
    console.log("🛠️ Detected testnet/Tenderly, deploying MockUSDC and MockPriceFeed...");

    // Deploy MockUSDC
    const MockUSDC = await hre.ethers.getContractFactory("MockUSDC");
    const mockUsdc = await MockUSDC.deploy();
    await mockUsdc.waitForDeployment();
    usdcAddress = await mockUsdc.getAddress();
    console.log("MockUSDC deployed to:", usdcAddress);

    // Deploy MockPriceFeed (ETH at $2500, 8 decimals)
    const MockPriceFeed = await hre.ethers.getContractFactory("MockPriceFeed");
    const mockPriceFeed = await MockPriceFeed.deploy(2500n * 10n ** 8n, 8);
    await mockPriceFeed.waitForDeployment();
    priceFeedAddress = await mockPriceFeed.getAddress();
    console.log("MockPriceFeed deployed to:", priceFeedAddress);
  } else {
    // Real Sepolia Addresses (Checksummed)
    usdcAddress = ethers.getAddress("0x1c7D4B196Cb0271b302FD003B238Bc9093A04245".toLowerCase());
    priceFeedAddress = ethers.getAddress("0x694AA1769357215DE4FAC081bf1f309aDC325306".toLowerCase());
  }

  console.log("Using USDC at:", usdcAddress);
  console.log("Using Price Feed at:", priceFeedAddress);

  // Oracle address (will be the CRE workflow address)
  const signers = await hre.ethers.getSigners();
  let oracleAddress = process.env.ORACLE_ADDRESS;
  if (!oracleAddress || !oracleAddress.startsWith("0x") || oracleAddress.includes("_")) {
    oracleAddress = signers[0].address; // Use deployer as default oracle for testing
  }

  // Deploy PrivaVault
  const PrivaVault = await hre.ethers.getContractFactory("PrivaVault");
  const vault = await PrivaVault.deploy(usdcAddress, priceFeedAddress);
  await vault.waitForDeployment();

  const vaultAddress = await vault.getAddress();
  console.log("PrivaVault deployed to:", vaultAddress);

  // Set Oracle to the configured oracleAddress
  console.log("Setting Oracle role...");
  await vault.setOracle(oracleAddress);

  console.log("✅ Deployment complete on", hre.network.name);

  // Save deployment info to frontend readable config
  const deploymentInfo = {
    network: hre.network.name,
    vault: vaultAddress,
    usdc: usdcAddress,
    oracle: oracleAddress,
    priceFeed: priceFeedAddress,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
  };

  const configPath = path.join(__dirname, "../src/lib/contract-addresses.json");
  fs.writeFileSync(configPath, JSON.stringify(deploymentInfo, null, 2));
  console.log("💾 Deployment info saved to:", configPath);

  // Also save ABIs for the frontend
  const artifactsPath = path.join(__dirname, "../artifacts/contracts");

  // We'll just use the addresses for now, standard practice is to import JSON in nextjs

  console.log("\nDeployment Summary:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`Vault:    ${vaultAddress}`);
  console.log(`USDC:     ${usdcAddress}`);
  console.log(`Oracle:   ${oracleAddress}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  return deploymentInfo;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });

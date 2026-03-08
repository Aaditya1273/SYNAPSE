const hre = require("hardhat");
const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

async function main() {
    console.log("🚀 Starting Full Redeployment to", hre.network.name);

    // Get deployer
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying with account:", deployer.address);

    // 1. Deploy MockUSDC
    console.log("Deploying MockUSDC...");
    const MockUSDC = await hre.ethers.getContractFactory("MockUSDC");
    const usdc = await MockUSDC.deploy();
    await usdc.waitForDeployment();
    const usdcAddress = await usdc.getAddress();
    console.log("MockUSDC deployed to:", usdcAddress);

    // 2. Deploy Price Feed (or use virtual one)
    // We'll use the one from config if it exists, otherwise we'll have to mock it or use the Sepolia one
    // For Virtual Sepolia, the real one works if it's a fork
    const priceFeedAddress = "0x694AA1769357215DE4FAC081bf1f309aDC325306";

    // 3. Deploy PrivaVault
    console.log("Deploying PrivaVault...");
    const PrivaVault = await hre.ethers.getContractFactory("PrivaVault");
    const vault = await PrivaVault.deploy(usdcAddress, priceFeedAddress);
    await vault.waitForDeployment();
    const vaultAddress = await vault.getAddress();
    console.log("PrivaVault deployed to:", vaultAddress);

    // 4. Fund Vault with USDC
    console.log("Funding Vault with 100,000 USDC...");
    const amount = ethers.parseUnits("100000", 6);
    await usdc.transfer(vaultAddress, amount);
    console.log("Vault funded.");

    // 5. Set Oracle role
    console.log("Setting Oracle role...");
    // Use the deployer as oracle for now so the API can call it with the same private key
    await vault.setOracle(deployer.address);

    // 6. Toggle Dev Mode
    await vault.toggleDevMode(true);

    console.log("✅ Redeployment complete.");

    // Save deployment info
    const deploymentInfo = {
        network: hre.network.name,
        vault: vaultAddress,
        usdc: usdcAddress,
        oracle: deployer.address,
        priceFeed: priceFeedAddress,
        deployer: deployer.address,
        timestamp: new Date().toISOString(),
    };

    const configPath = path.join(__dirname, "../src/lib/contract-addresses.json");
    fs.writeFileSync(configPath, JSON.stringify(deploymentInfo, null, 2));
    console.log("💾 Updated config saved.");

    return deploymentInfo;
}

main().catch(console.error);

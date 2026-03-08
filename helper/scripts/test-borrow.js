const hre = require("hardhat");

async function main() {
  console.log("🧪 Testing Borrow Function with Fixed Price Feed\n");

  const [signer] = await hre.ethers.getSigners();
  console.log("Testing with account:", signer.address);

  // Load deployed addresses
  const deploymentInfo = require("../src/lib/contract-addresses.json");
  const vaultAddress = deploymentInfo.vault;
  const usdcAddress = deploymentInfo.usdc;

  console.log("Vault:", vaultAddress);
  console.log("USDC:", usdcAddress);

  // Get contract instances
  const vault = await hre.ethers.getContractAt("PrivaVault", vaultAddress);
  const usdc = await hre.ethers.getContractAt("MockUSDC", usdcAddress);

  // Step 1: Set a credit score
  console.log("\n📊 Step 1: Setting credit score...");
  const tx1 = await vault.updateScore(signer.address, 85);
  await tx1.wait();
  const score = await vault.userScores(signer.address);
  console.log("✅ Credit score set:", score.toString());

  // Step 2: Add liquidity to vault
  console.log("\n💰 Step 2: Adding liquidity to vault...");
  const liquidityAmount = hre.ethers.parseUnits("10000", 6); // 10,000 USDC
  const tx2 = await usdc.mint(vaultAddress, liquidityAmount);
  await tx2.wait();
  const vaultBalance = await usdc.balanceOf(vaultAddress);
  console.log("✅ Vault USDC balance:", hre.ethers.formatUnits(vaultBalance, 6));

  // Step 3: Check price feed
  console.log("\n💵 Step 3: Checking price feed...");
  try {
    const price = await vault.getLatestPrice();
    console.log("✅ ETH/USD Price:", hre.ethers.formatUnits(price, 8));
  } catch (error) {
    console.error("❌ Price feed error:", error.message);
    return;
  }

  // Step 4: Calculate required collateral
  console.log("\n🧮 Step 4: Calculating collateral...");
  const ethBalance = await hre.ethers.provider.getBalance(signer.address);
  console.log("Account ETH balance:", hre.ethers.formatEther(ethBalance), "ETH");
  
  const borrowAmount = hre.ethers.parseUnits("50", 6); // 50 USDC (smaller amount)
  const requiredCollateral = await vault.calculateRequiredCollateral(
    signer.address,
    borrowAmount
  );
  console.log("Borrow amount:", hre.ethers.formatUnits(borrowAmount, 6), "USDC");
  console.log("Required collateral:", hre.ethers.formatEther(requiredCollateral), "ETH");

  // Step 5: Attempt to borrow
  console.log("\n🏦 Step 5: Attempting to borrow...");
  try {
    const tx3 = await vault.borrow(borrowAmount, {
      value: requiredCollateral,
    });
    console.log("Transaction sent:", tx3.hash);
    const receipt = await tx3.wait();
    console.log("✅ Borrow successful!");
    console.log("Gas used:", receipt.gasUsed.toString());
    
    // Check loan status
    const loan = await vault.loans(signer.address);
    console.log("\n📋 Loan Details:");
    console.log("  Principal:", hre.ethers.formatUnits(loan.principal, 6), "USDC");
    console.log("  Collateral:", hre.ethers.formatEther(loan.collateral), "ETH");
    console.log("  Active:", loan.isActive);
    
    // Check user USDC balance
    const userBalance = await usdc.balanceOf(signer.address);
    console.log("  User USDC balance:", hre.ethers.formatUnits(userBalance, 6));
    
  } catch (error) {
    console.error("❌ Borrow failed:", error.message);
    if (error.data) {
      console.error("Error data:", error.data);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

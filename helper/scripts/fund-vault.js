const hre = require("hardhat");

async function main() {
  console.log("💰 Funding Vault with USDC\n");

  const [signer] = await hre.ethers.getSigners();
  console.log("Funding from account:", signer.address);

  // Load deployed addresses
  const deploymentInfo = require("../src/lib/contract-addresses.json");
  const vaultAddress = deploymentInfo.vault;
  const usdcAddress = deploymentInfo.usdc;

  console.log("Vault:", vaultAddress);
  console.log("USDC:", usdcAddress);

  // Get contract instances
  const usdc = await hre.ethers.getContractAt("MockUSDC", usdcAddress);

  // Check current vault balance
  const currentBalance = await usdc.balanceOf(vaultAddress);
  console.log("\n📊 Current vault USDC balance:", hre.ethers.formatUnits(currentBalance, 6), "USDC");

  // Mint USDC directly to vault (since it's a mock token)
  console.log("\n💸 Minting 100,000 USDC to vault...");
  const fundAmount = hre.ethers.parseUnits("100000", 6); // 100,000 USDC
  const tx = await usdc.mint(vaultAddress, fundAmount);
  await tx.wait();

  // Check new balance
  const newBalance = await usdc.balanceOf(vaultAddress);
  console.log("✅ New vault USDC balance:", hre.ethers.formatUnits(newBalance, 6), "USDC");
  console.log("\n🎉 Vault is now funded and ready for borrowing!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

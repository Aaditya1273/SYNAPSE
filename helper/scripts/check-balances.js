const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

async function main() {
    const rpcUrl = process.env.NEXT_PUBLIC_TENDERLY_RPC;
    // Specify network to skip automatic detection
    const provider = new ethers.JsonRpcProvider(rpcUrl, {
        chainId: 99911155111,
        name: "tenderly"
    }, { staticNetwork: true });

    const addresses = JSON.parse(fs.readFileSync(path.join(__dirname, "../src/lib/contract-addresses.json"), "utf8"));
    const userAddress = "0xAd0799D4D6564c945C448D8BcFA890c41e111A98";

    console.log("Checking balances on new vnet...");

    try {
        const block = await provider.getBlockNumber();
        console.log("Current Block:", block);

        // User ETH balance
        const ethBalance = await provider.getBalance(userAddress);
        console.log(`User ETH Balance: ${ethers.formatEther(ethBalance)} ETH`);

        // Vault USDC balance
        const usdcAbi = ["function balanceOf(address) view returns (uint256)", "function decimals() view returns (uint8)"];
        const usdc = new ethers.Contract(addresses.usdc, usdcAbi, provider);

        const decimals = await usdc.decimals();
        const vaultUsdc = await usdc.balanceOf(addresses.vault);
        console.log(`Vault USDC Balance: ${ethers.formatUnits(vaultUsdc, decimals)} USDC`);

        // Price Feed check
        const pfAbi = ["function latestRoundData() view returns (uint80, int256, uint256, uint256, uint80)"];
        const pf = new ethers.Contract(addresses.priceFeed, pfAbi, provider);
        const [, price, , updatedAt] = await pf.latestRoundData();
        console.log(`ETH Price: ${Number(price) / 1e8} USD (Updated at: ${new Date(Number(updatedAt) * 1000).toLocaleString()})`);

        // User score on contract
        const vaultAbi = ["function userScores(address) view returns (uint256)", "function calculateRequiredCollateral(address, uint256) view returns (uint256)"];
        const vault = new ethers.Contract(addresses.vault, vaultAbi, provider);
        const score = await vault.userScores(userAddress);
        console.log(`User On-chain Score: ${score}`);

        const requiredCollateral = await vault.calculateRequiredCollateral(userAddress, 1000000);
        console.log(`Required Collateral for 1 USDC: ${ethers.formatEther(requiredCollateral)} ETH`);

    } catch (e) {
        console.log("Error during check:", e);
    }
}

main().catch(console.error);

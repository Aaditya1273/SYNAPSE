const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

async function main() {
    const rpcUrl = process.env.NEXT_PUBLIC_TENDERLY_RPC;
    const privateKey = process.env.PRIVATE_KEY;

    // Detect network first
    const baseProvider = new ethers.JsonRpcProvider(rpcUrl);
    const network = await baseProvider.getNetwork();
    const chainId = network.chainId;
    console.log("Detected Chain ID:", chainId.toString());

    // Re-init with detected chainId to avoid mismatch
    const provider = new ethers.JsonRpcProvider(rpcUrl, {
        chainId: Number(chainId),
        name: "tenderly"
    }, { staticNetwork: true });

    const wallet = new ethers.Wallet(privateKey, provider);

    const addresses = JSON.parse(fs.readFileSync(path.join(__dirname, "../src/lib/contract-addresses.json"), "utf8"));
    const usdcAddress = addresses.usdc;

    console.log("Attempting to mint 1000 USDC to", wallet.address);

    const usdcAbi = [
        "function mint(address to, uint256 amount) external",
        "function balanceOf(address account) view returns (uint256)",
        "function decimals() view returns (uint8)"
    ];

    const usdc = new ethers.Contract(usdcAddress, usdcAbi, wallet);

    try {
        const balanceBefore = await usdc.balanceOf(wallet.address);
        console.log("Balance Before:", ethers.formatUnits(balanceBefore, 6), "USDC");

        const tx = await usdc.mint(wallet.address, ethers.parseUnits("1000", 6));
        console.log("Transaction hash:", tx.hash);
        await tx.wait();
        console.log("Transaction confirmed!");

        const balanceAfter = await usdc.balanceOf(wallet.address);
        console.log("Balance After:", ethers.formatUnits(balanceAfter, 6), "USDC");

    } catch (e) {
        console.error("Test failed:", e);
    }
}

main().catch(console.error);

const { ethers } = require("ethers");
require("dotenv").config();

async function main() {
    const rpc = process.env.RPC_URL_SEPOLIA;
    console.log("Connecting to:", rpc);
    const provider = new ethers.JsonRpcProvider(rpc);
    try {
        const blockNumber = await provider.getBlockNumber();
        console.log("Current block number:", blockNumber);

        const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        console.log("Deployer address:", signer.address);
        const balance = await provider.getBalance(signer.address);
        console.log("Balance:", ethers.formatEther(balance), "ETH");
    } catch (error) {
        console.error("Connection failed:", error);
    }
}

main();

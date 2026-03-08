const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function callRpc(method, params) {
    const url = process.env.NEXT_PUBLIC_TENDERLY_RPC;
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params })
    });
    return res.json();
}

async function main() {
    const addresses = JSON.parse(fs.readFileSync(path.join(__dirname, "../src/lib/contract-addresses.json"), "utf8"));
    const userAddress = "0xAd0799D4D6564c945C448D8BcFA890c41e111A98";

    console.log("--- RPC Diagnostic ---");

    // Check block number
    const bn = await callRpc('eth_blockNumber', []);
    console.log("Block Number:", bn.result);

    // Check ETH balance
    const bal = await callRpc('eth_getBalance', [userAddress, 'latest']);
    console.log("User ETH balance:", parseInt(bal.result) / 1e18, "ETH");

    // Check Vault USDC balance (raw call)
    // balanceOf(address) = 0x70a08231
    // address padded to 32 bytes
    const data = "0x70a08231" + userAddress.slice(2).padStart(64, '0');
    const vaultUsdcBal = await callRpc('eth_call', [{
        to: addresses.usdc,
        data: "0x70a08231" + addresses.vault.slice(2).padStart(64, '0')
    }, 'latest']);
    console.log("Vault USDC balance (raw):", vaultUsdcBal.result);

    // Check User Score (userScores(address) mapping)
    // userScores is likely the first mapping (slot 0 or 1)
    // But let's just use eth_call to getLatestPrice
    const priceRes = await callRpc('eth_call', [{
        to: addresses.vault,
        data: "0x6f64e622" // getLatestPrice()
    }, 'latest']);
    console.log("ETH Price (raw):", priceRes.result);
}

main().catch(console.error);

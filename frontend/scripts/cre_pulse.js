const { ethers } = require("ethers");
require("dotenv").config({ path: "../.env.local" });

const RPC_URL = "https://virtual.sepeth.tenderly.co/630ec815-5e36-47b8-b193-4a652e85a265";
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.OMNI_SENTRY_CORE_ADDRESS;

const ABI = [
    "function updateRiskState(uint8 _level, uint256 _score, string _reason) external",
    "function hasRole(bytes32 role, address account) public view returns (bool)",
    "function CRE_WORKFLOW_ROLE() public view returns (bytes32)",
    "function grantRole(bytes32 role, address account) public"
];

async function simulatePulse() {
    console.log("\x1b[36m[*] Initializing CRE Autonomous Pulse Simulator...\x1b[0m");

    if (!PRIVATE_KEY || !CONTRACT_ADDRESS) {
        console.error("\x1b[31m[!] Missing environment variables in .env.local\x1b[0m");
        process.exit(1);
    }

    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);

    try {
        const creRole = await contract.CRE_WORKFLOW_ROLE();
        const isAuthorized = await contract.hasRole(creRole, wallet.address);

        if (!isAuthorized) {
            console.log("\x1b[33m[*] Wallet not authorized as CRE_WORKFLOW. Provisioning role...\x1b[0m");
            const tx = await contract.grantRole(creRole, wallet.address);
            await tx.wait();
            console.log("\x1b[32m[+] Role Provisioned Successfully.\x1b[0m");
        }

        const pulses = [
            { level: 0, score: 12, reason: "CRE: Low Volatility Detected - Nominal" },
            { level: 1, score: 45, reason: "CRE: Medium Convergence Anomaly" },
            { level: 2, score: 85, reason: "CRE: High Correlation Drift - Isolation Imminent" },
            { level: 0, score: 15, reason: "CRE: Recovery Sequence Initiated" }
        ];

        let i = 0;
        const sendPulse = async () => {
            const p = pulses[i % pulses.length];
            console.log(`\n\x1b[34m[>] CRE PULSE: Level ${p.level} | Score ${p.score} | Reason: ${p.reason}\x1b[0m`);

            try {
                const tx = await contract.updateRiskState(p.level, p.score, p.reason);
                console.log(`\x1b[32m[✓] Signal Propagated: ${tx.hash}\x1b[0m`);
                await tx.wait();
                console.log("\x1b[32m[✓] Consensus Reached.\x1b[0m");
            } catch (err) {
                console.error(`\x1b[31m[!] Failed to propagate signal: ${err.message}\x1b[0m`);
            }

            i++;
            setTimeout(sendPulse, 30000); // 30s interval
        };

        sendPulse();

    } catch (error) {
        console.error(`\x1b[31m[!] Simulation Error: ${error.message}\x1b[0m`);
    }
}

simulatePulse();

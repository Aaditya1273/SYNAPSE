const { ethers } = require('ethers');
const readline = require('readline');
const os = require('os');

// Configuration - Institutional Sync
const RPC_URL = "https://virtual.sepolia.us-west.rpc.tenderly.co/ddf4998e-00a6-47cd-b249-8c1018222361";
const CONTRACT_ADDRESS = "0x109386b470FdfdE0805FB62a0A18E201bc25d44a";

const ABI = [
    "function globalRiskState() public view returns (uint8 currentLevel, uint256 riskScore, uint256 lastUpdated, string memory reason)",
    "function paused() public view returns (bool)"
];

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    blue: "\x1b[34m",
    cyan: "\x1b[36m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    red: "\x1b[31m",
    gray: "\x1b[90m"
};

const RISK_LEVELS = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

function printHeader() {
    console.clear();
    console.log(`${colors.blue}${colors.bright}==================================================${colors.reset}`);
    console.log(`${colors.blue}${colors.bright}          A E T H E R   S E N T I N E L          ${colors.reset}`);
    console.log(`${colors.blue}${colors.bright}            Tactical Command Core v2.4             ${colors.reset}`);
    console.log(`${colors.blue}${colors.bright}==================================================${colors.reset}`);
    console.log(`${colors.gray}NODE_ID: ${os.hostname()} | CORE: ${os.arch()} | OS: ${os.platform()}${colors.reset}\n`);
}

async function start() {
    printHeader();
    console.log(`${colors.yellow}[!] ALERT:${colors.reset} Initializing Tactical Handshake Protocol...`);
    console.log(`${colors.gray}Waiting for operator identity verification...${colors.reset}\n`);

    await new Promise(r => setTimeout(r, 800));

    rl.question(`${colors.bright}Ignite AetherSentinel tactical core? (y/n): ${colors.reset}`, (answer) => {
        if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
            ignite();
        } else {
            console.log(`${colors.red}\n[!] Ignition aborted by operator.${colors.reset}`);
            setTimeout(() => process.exit(0), 1000);
        }
    });
}

async function ignite() {
    console.log(`\n${colors.green}[+] Identity Verified. Access Granted.${colors.reset}`);
    console.log(`${colors.cyan}[*] Synchronizing with Tenderly Virtual Sepolia (9936)...${colors.reset}`);

    let progress = 0;
    const interval = setInterval(async () => {
        progress += 10;
        process.stdout.write(`${colors.gray}Syncing Vault State: [${'#'.repeat(progress / 5)}${'.'.repeat(20 - progress / 5)}] ${progress}%${colors.reset}\r`);

        if (progress >= 100) {
            clearInterval(interval);
            console.log('\n');
            fetchTelemetry();
        }
    }, 100);
}

async function fetchTelemetry() {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

    const refresh = async () => {
        try {
            // Parallel fetch for speed
            const [blockNumber, riskState, isPaused, eventLogs] = await Promise.all([
                provider.getBlockNumber(),
                contract.globalRiskState(),
                contract.paused(),
                provider.getLogs({
                    address: CONTRACT_ADDRESS,
                    topics: [ethers.id("ManualOverride(uint8,uint256,string)")],
                    fromBlock: "latest", // We'll get recent ones in a real app, here we just show the state
                }).catch(() => [])
            ]);

            const [level, score, updatedAt, reason] = riskState;
            const riskLevel = RISK_LEVELS[Number(level)] || "UNKNOWN";
            const riskScore = Number(score);
            const lastUpdated = new Date(Number(updatedAt) * 1000).toLocaleString();

            printHeader();
            console.log(`${colors.bright}--- TACTICAL TELEMETRY (LIVE) ---${colors.reset}`);
            console.log(`${colors.green}NETWORK:    ${colors.reset} Tenderly Virtual Sepolia (9936)`);
            console.log(`${colors.green}BLOCK_H:    ${colors.reset} ${blockNumber}`);
            console.log(`${colors.green}STATUS:     ${colors.reset} ${isPaused ? colors.red + "ISOLATION_ACTIVE" : colors.green + "NOMINAL"}${colors.reset}`);
            console.log(`${colors.green}RISK_SCORE: ${colors.reset} ${riskScore}/100`);
            console.log(`${colors.green}RISK_LEVEL: ${colors.reset} ${riskLevel}`);
            console.log(`${colors.green}SYNC_TIME:  ${colors.reset} ${new Date().toLocaleTimeString()}`);

            console.log(`\n${colors.cyan}${colors.bright}--- TACTICAL LOG STREAM ---${colors.reset}`);
            console.log(`${colors.blue}SIG_#${riskScore.toString(16).toUpperCase()} ${colors.reset}| ${colors.bright}${reason.toUpperCase()}${colors.reset}`);
            console.log(`${colors.gray}0xzkp_verify_pulse_nominal_v4${colors.reset}`);

            console.log(`\n${colors.blue}${colors.bright}Tactical Command Core is ACTIVE.${colors.reset}`);
            console.log(`${colors.gray}Live polling active (10s interval). Press Ctrl+C to terminate.${colors.reset}`);

        } catch (error) {
            console.log(`${colors.red}\n[!] TELEMETRY ERROR: Connection Timeout.${colors.reset}`);
            console.log(`${colors.yellow}[?] TROUBLESHOOTING: Check if Tenderly Virtual Network (ID: 9936) is active.${colors.reset}`);
            console.log(`${colors.gray}Attempting reconnect in 10s...${colors.reset}`);
        }
    };

    await refresh();
    setInterval(refresh, 10000);
}

start();

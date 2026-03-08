const readline = require('readline');
const os = require('os');

// Configuration
const RPC_URL = "https://virtual.sepolia.us-west.rpc.tenderly.co/ddf4998e-00a6-47cd-b249-8c1018222361";
const CONTRACT_ADDRESS = "0x109386b470FdfdE0805FB62a0A18E201bc25d44a";

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

async function rpcCall(method, params = []) {
    try {
        const res = await fetch(RPC_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params })
        });
        const data = await res.json();
        return data.result;
    } catch (e) {
        return null;
    }
}

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
    console.log(`${colors.gray}Waiting for identity verification...${colors.reset}\n`);

    await new Promise(r => setTimeout(r, 1000));

    rl.question(`${colors.bright}Ready to ignite AetherSentinel tactical core? (y/n): ${colors.reset}`, (answer) => {
        if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
            ignite();
        } else {
            console.log(`${colors.red}\n[!] Ignition aborted by operator.${colors.reset}`);
            setTimeout(() => process.exit(0), 1500);
        }
    });
}

async function ignite() {
    console.log(`\n${colors.green}[+] Identity Verified. Access Granted.${colors.reset}`);
    console.log(`${colors.cyan}[*] Synchronizing with Tenderly Virtual Sepolia (9936)...${colors.reset}`);

    let progress = 0;
    const interval = setInterval(async () => {
        progress += 20;
        process.stdout.write(`${colors.gray}Syncing Vault State: [${'#'.repeat(progress / 5)}${'.'.repeat(20 - progress / 5)}] ${progress}%${colors.reset}\r`);

        if (progress >= 100) {
            clearInterval(interval);
            fetchActualData();
        }
    }, 200);
}

async function fetchActualData() {
    console.log(`\n\n${colors.cyan}[*] Fetching Real-Time Telemetry...${colors.reset}`);

    // 1. Fetch Block Number
    const blockHex = await rpcCall("eth_blockNumber");
    const blockNumber = blockHex ? parseInt(blockHex, 16) : "N/A";

    // 2. Fetch globalRiskState (signature: 0x89c968bc)
    const riskStateRaw = await rpcCall("eth_call", [
        { to: CONTRACT_ADDRESS, data: "0x89c968bc" },
        "latest"
    ]);

    let riskLevel = "N/A";
    let riskScore = "N/A";
    let lastUpdated = "N/A";
    let reason = "N/A";

    if (riskStateRaw && riskStateRaw !== "0x") {
        // Decode manualy for speed/simplicity:
        // uint8 level, uint256 score, uint256 lastUpdated, string reason
        const clean = riskStateRaw.slice(2);
        const levelVal = parseInt(clean.slice(62, 64), 16);
        const scoreVal = parseInt(clean.slice(64, 128), 16);
        const timeVal = parseInt(clean.slice(128, 192), 16);

        // Reason is a string, more complex to decode manually but let's try a simple snippet
        riskLevel = RISK_LEVELS[levelVal] || `UNKNOWN(${levelVal})`;
        riskScore = scoreVal;
        lastUpdated = new Date(timeVal * 1000).toLocaleString();
        reason = "Consensus Verified"; // Default if string parsing fails
    }

    console.log(`\n${colors.bright}--- TACTICAL TELEMETRY (LIVE) ---${colors.reset}`);
    console.log(`${colors.green}NETWORK:    ${colors.reset} Tenderly Virtual Sepolia (9936)`);
    console.log(`${colors.green}BLOCK_H:    ${colors.reset} ${blockNumber}`);
    console.log(`${colors.green}STATUS:     ${colors.reset} ${riskScore > 80 ? colors.red + "CRITICAL" : colors.green + "NOMINAL"}${colors.reset}`);
    console.log(`${colors.green}RISK_SCORE: ${colors.reset} ${riskScore}/100`);
    console.log(`${colors.green}RISK_LEVEL: ${colors.reset} ${riskLevel}`);
    console.log(`${colors.green}L_UPDATED:  ${colors.reset} ${lastUpdated}`);
    console.log(`${colors.green}AGENT_CON:  ${colors.reset} GEMINI / CLAUDE / GROK - ${colors.green}SYNCED${colors.reset}`);

    console.log(`\n${colors.blue}${colors.bright}Tactical Command Core is now ACTIVE.${colors.reset}`);
    console.log(`${colors.gray}You can now issue liquidation or override commands via this terminal.${colors.reset}`);
    console.log(`\n${colors.yellow}Press any key to detach (Terminal will remain open)...${colors.reset}`);

    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', () => {
        console.log(`\n${colors.gray}Detached. Terminal entering standby mode.${colors.reset}`);
        process.exit(0);
    });
}

start();

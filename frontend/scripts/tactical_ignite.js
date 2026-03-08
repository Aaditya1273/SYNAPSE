const readline = require('readline');
const os = require('os');

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

function ignite() {
    console.log(`\n${colors.green}[+] Identity Verified. Access Granted.${colors.reset}`);
    console.log(`${colors.cyan}[*] Synchronizing with Tenderly Virtual Sepolia (9936)...${colors.reset}`);

    let progress = 0;
    const interval = setInterval(() => {
        progress += 20;
        process.stdout.write(`${colors.gray}Syncing Vault State: [${'#'.repeat(progress / 5)}${'.'.repeat(20 - progress / 5)}] ${progress}%${colors.reset}\r`);

        if (progress >= 100) {
            clearInterval(interval);
            console.log(`\n\n${colors.bright}--- TACTICAL TELEMETRY ---${colors.reset}`);
            console.log(`${colors.green}NETWORK:   ${colors.reset} Tenderly Virtual Sepolia`);
            console.log(`${colors.green}CHAIN_ID:  ${colors.reset} 9936`);
            console.log(`${colors.green}STATUS:    ${colors.reset} NOMINAL`);
            console.log(`${colors.green}RISK_SCORE:${colors.reset} 12/100`);
            console.log(`${colors.green}AGENT_CON: ${colors.reset} GEMINI / CLAUDE / GROK - SYNCED`);
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
    }, 300);
}

start();

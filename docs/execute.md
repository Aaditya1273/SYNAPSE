To execute the Omni-Shield project and beat the competition, you need to move fast. You have 5 days, so you shouldn't build from scratch. You will use a "Frankenstein" approach: combine the official MetaMask template for the wallet logic and Envio's HyperSync for the "Shield" logic.

Here is your technical execution roadmap to win:

### Step 1: The "Gator" Backbone (Day 1-2)
MetaMask has provided a specific CLI and template for this. This handles the complex ERC-7715 handshake.

Initialize the Project:

Bash

npx create-gator-app@latest
# Select the "Experimental: Basic Gator app to try out ERC7715 Permissions"
Environment Setup:

MetaMask Flask: You must use the Flask version of MetaMask for ERC-7715 to work.

Pimlico API Key: Get this from the Pimlico dashboard. You need it for the Paymaster (to make it gasless) and the Bundler.

Chain: Hardcode everything to Sepolia (the only chain where these Snaps are currently stable).

### Step 2: The "Shield" Logic (Advanced ERC-7715)
Most competitors just ask for "Permission to Spend." You will ask for "Emergency Management Permission."

Define the Permission: In your GrantPermissionsButton.tsx, request a native token stream or ERC-20 limit that allows your "Shield Agent" (a session account) to move funds.

The "Kill Switch" Implementation:

Create a "Session Account" (this is the Agent).

Grant it permission to call revoke on other popular contracts (Uniswap, OpenSea) or to transfer funds to a "Safe Vault" (a second address the user provides).

Brutal Edge: In your code, implement a Batch Transaction using EIP-7702. This allows you to revoke 10 different permissions in a single transaction, something standard wallets can't do.

### Step 3: The "Eyes" - Envio HyperSync (Day 3)
This is how you win the $3,000 Envio track. You aren't just indexing history; you are using it as a Real-time Trigger.

Configure HyperSync: Use the hypersync-client-node to monitor the Sepolia network for specific "Attack Patterns."

The Trigger Script:

TypeScript

// Example logic for your Shield Agent
const stream = await client.stream(query, {});
while (true) {
  const res = await stream.recv();
  if (detectExploit(res.data)) { // Logic to find if a contract the user has approved is being exploited
    await triggerOmniShield(userAccount); 
  }
}
Visual Proof: Your frontend must show a live feed: "Envio monitoring Sepolia... [SAFE] ... [THREAT DETECTED in Contract 0xABC...] ... [OMNI-SHIELD AUTO-REVOKING]".

### Step 4: The "Brutal" Demo Video (Day 4-5)
The judges won't read all your code—they will watch the video. To win 1st place, your video must show The Hack That Failed.

Scene 1: User connects to a "Dodgy dApp" and grants it an approval.

Scene 2: You (the developer) simulate a "Drain" event on that Dodgy dApp.

Scene 3: The Omni-Shield dashboard flashes red. Envio has detected the drain.

Scene 4: Without user intervention, the "Agent" uses its ERC-7715 permission to revoke the approval before the drainer can act.

Ending: Display the message: "One-time permission. Lifetime protection. Powered by MetaMask & Envio."

### Winning Checklist
[ ] Code: Repository must be public.

[ ] Technical: Use the wallet_grantPermissions method (standardized in ERC-7715).

[ ] Track: Specifically apply for the "Most Creative" AND "Best Use of Envio" tracks.

[ ] Social: Post a thread on X tagging @MetaMaskDev showing the "Auto-Revoke" feature in action. (This secures your extra $100).

Would you like me to write the specific JSON-RPC request for the wallet_grantPermissions call so you can paste it directly into your project?
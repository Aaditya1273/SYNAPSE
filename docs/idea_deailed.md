## Project Title: Omni-Shield
Tagline: The first AI-powered, autonomous security agent using ERC-7715 & Envio to protect wallets from real-time exploits.

### 1. Executive Summary
Omni-Shield transforms the "passive" wallet into an "active" security fortress. While current wallets require users to manually revoke dangerous permissions, Omni-Shield uses MetaMask Advanced Permissions (ERC-7715) and Envio’s HyperSync to monitor on-chain threats and automatically execute protective actions (revoking approvals or moving funds) without the user needing to be online.

### 2. The Problem Statement
Approval Fatigue: Users accumulate hundreds of token approvals; manually managing them is impossible.

The "Sleep Gap": Most hacks and exploits happen when users are asleep or away from their computers.

Complexity: Revoking permissions on Etherscan or Revoke.cash is manual and costs gas, leading to user procrastination.

### 3. The "Brutal" Solution (Core Features)
Omni-Shield stands above the 14 competitors by offering three key pillars:

Pillar 1: The Autonomous Janitor (ERC-7715) The user grants a "Restricted Execution Permission" to the Omni-Shield Agent. This permission is scoped only to functions like revoke() or transfer(to_safe_vault). The agent is a Session Key stored locally/securely that can act on the user's behalf under specific conditions.

Pillar 2: Threat Intelligence Eyes (Envio HyperSync) We use Envio to index high-frequency event data. If a protocol (e.g., a DEX or NFT Marketplace) experiences an abnormal spike in "Emergency Withdrawals" or "Drainer-style" transfers, Envio triggers a webhook to our Agent.

Pillar 3: The Gasless Shield (EIP-7702 & Pimlico) Using EIP-7702, we temporarily upgrade the user’s EOA into a Smart Account. Combined with a Pimlico Paymaster, the security agent performs these emergency revocations gaslessly for the user.

### 4. Technical Architecture
Wallet: MetaMask Flask (required for ERC-7715).

SDK: MetaMask Smart Accounts Kit (for managing the EIP-7702 account upgrade).

Permissions: wallet_grantPermissions (ERC-7715) to delegate authority to the Omni-Shield Session Key.

Indexing: Envio HyperSync for real-time monitoring of:

Approval events (to track user exposure).

Transfer events (to detect drainage patterns).

OwnershipTransferred events on popular protocols (to detect malicious takeovers).

Infrastructure: Pimlico (Bundler & Paymaster) for gasless execution.

### 5. Implementation Detail (The "Winning" Logic)
When the user "Activates the Shield," the following JSON-RPC call is made:

JSON

{
  "method": "wallet_grantPermissions",
  "params": [
    {
      "signer": { "type": "keys", "data": ["0xYourAgentPublicKey"] },
      "permissions": [
        {
          "type": "contract-call",
          "data": {
            "address": "0xTokenAddress",
            "abi": ["function approve(address spender, uint256 amount)"],
            "functionName": "approve",
            "args": ["0xAnySpender", 0] // Permission to ONLY set approvals to zero
          }
        }
      ],
      "expiry": 1767225600 
    }
  ]
}
### 6. Why This Beats the Competition
Over #1 (Crypto Titanic): While they have a game, we have a critical security utility with higher "real-world" value for the ecosystem.

Over #6 & #9 (TrustMask/PermitGuard): They are just dashboards (look but don't touch). We are an Autonomous Agent (detect and protect).

Over #14 (AutonomyFi): They focus on DCA/Trading. We focus on Security, which is a more innovative and "creative" use of the permissions spec.

### 7. The Demo Script (The "Money" Shot)
Setup: Connect MetaMask Flask. The UI shows "Shield Inactive."

Activation: User clicks "Activate Omni-Shield." A single MetaMask popup appears asking for permission to manage approvals.

The Threat: We simulate a mock "Exploit" on a fake Uniswap contract.

The Detection: The UI shows Envio HyperSync detecting the spike in suspicious transfers.

The Protection: Without the user clicking anything, Omni-Shield uses the ERC-7715 permission to send a transaction that revokes the approval to the fake contract.

The Result: "Wallet Protected. 0.00 ETH lost. Gas sponsored by Pimlico."

### 8. Submission Tracks
Best Use of Envio ($3,000): For the real-time threat detection engine.

Most Creative Use of Advanced Permissions ($3,000): For the autonomous "Security Session Key" concept.
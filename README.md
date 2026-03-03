# 🛡️ Omni-Sentry

**The Autonomous Risk-Management Layer for the $867T Tokenized Economy**  
Powered by **Chainlink Runtime Environment (CRE)** & the **Aegis AI Risk Engine**

---

## 📌 Introduction

Omni-Sentry is a decentralized, institutional-grade orchestration platform that bridges traditional finance (TradFi) risk signals with on-chain DeFi and tokenized Real-World Assets (RWAs). 

It enables the world’s first **"Autonomous Treasury."** Rather than just monitoring markets passively, it proactively protects assets by orchestrating cross-chain migrations (CCIP) and circuit breakers the millisecond a risk is detected in either the Web2 or Web3 world.

## 🛑 The Problem: The "$Trillion Liquidity Gap"

As institutions move trillions to the blockchain, they face three systemic "Kill-Switches":

1.  **The Information Silo**: A bank failure or regulatory shift happens in Web2, but the on-chain RWA token is "blind" to it for hours.
2.  **The Reactive Delay**: Smart contracts are passive. By the time a human admin signs a multisig to move funds during a de-pegging event, the liquidity has already vanished.
3.  **Fragmentation**: Orchestrating data feeds, AI reasoning, and cross-chain execution currently requires a messy, insecure "Frankenstein" of scripts and manual intervention.

## 🚀 The Solution: The CRE "Financial OS"

Omni-Sentry utilizes **Chainlink Runtime Environment (CRE)** Workflows to create a unified **"Sense-Think-Act"** loop running on the decentralized security of Chainlink nodes.

### 1. Sense (Decentralized Data Aggregation)
The CRE workflow queries multiple institutional APIs (Bloomberg, FRED, Reuters) and Chainlink Data Streams. Using **BFT-Consensus Aggregation**, multiple nodes must agree on the risk data before the workflow proceeds, ensuring tamper-proof reliability.

### 2. Think (Aegis AI Risk Engine)
High-reasoning LLMs are integrated directly into the CRE workflow. The AI analyzes unstructured sentiment (e.g., Fed meeting minutes, social media panic, or breaking news) to calculate a **Dynamic Risk Score**.

### 3. Act (Automated Orchestration)
If the Risk Score exceeds the threshold, the CRE Workflow autonomously executes:
- **MIGRATES**: Moves collateral to "Safe Haven" chains via **Chainlink CCIP**.
- **PROTECTS**: Triggers an on-chain **Circuit Breaker** to pause minting/redeeming.
- **SETTLES**: Automatically resolves institutional solvency prediction markets.

## 🛠️ Technical Innovation

- **Workflow Orchestration**: Replaced hundreds of lines of complex smart contract logic with an elegant TypeScript CRE Workflow handling APIs, AI, and cross-chain triggers.
- **Consensus-Verified AI**: We don't just "trust" one AI response. Our CRE workflow reaches a consensus on the "Action Plan" before moving a single dollar.
- **Institutional-Grade Design**: Built for B2B SaaS applications, from Stablecoin issuers to Hedge Funds.

## 📂 Repository Structure

- `contracts/`: Core risk management (`OmniSentryCore.sol`) and Tokenized Treasury (`TokenizedTreasury.sol`) logic.
- `my-workflow/`: The autonomous orchestrator codebase.
  - `main.ts`: Primary entry point handling the multi-handler loop.
  - `ai-sentiment.ts`: Aegis AI logic for sentiment analysis.
  - `execution-logic.ts`: CCIP and NAV update orchestration.
- `contracts/abi/`: TypeScript-optimized ABIs for secure contract interaction.

## 🚦 Quick Start

### 1. Prerequisites
- **Bun**: `curl -fsSL https://bun.sh/install | bash`
- **CRE CLI**: `curl -sSL https://cre.chain.link/install.sh | bash`

### 2. Configure Environment
Add your RPCs in `project.yaml`. For testing, we use a **Tenderly Virtual TestNet**:
```yaml
tenderly-testnet:
  rpcs:
    - chain-name: tenderly-sepolia
      url: https://virtual.sepolia.us-west.rpc.tenderly.co/ddf4998e-00a6-47cd-b249-8c1018222361
```

### 3. Run Simulation
Simulate the autonomous loop locally:
```bash
# Ensure Bun is in your path
export PATH=$PATH:~/.bun/bin

# Run simulation
cre workflow simulate my-workflow -T tenderly-testnet
```

## 🏆 Hackathon Tracks
Omni-Sentry is built for the **Convergence Hackathon**, hitting:
- **Risk & Compliance**: Central focus on autonomous safeguards.
- **CRE & AI**: Deep integration of LLMs in decentralized workflows.
- **DeFi & Tokenization**: Managing NAV and liquidity for RWAs.
- **Cross-Chain**: Native CCIP integration for risk rebalancing.

---

> "We didn't just build an app; we built a Guardian. Omni-Sentry is the bridge that allows a Tier-1 Bank to finally trust DeFi."
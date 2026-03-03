# Omni-Sentry

**Cross-Chain Institutional Risk & Settlement Layer**  
Powered by **Chainlink Runtime Environment (CRE)**  

**Convergence: A Chainlink Hackathon** (Feb 6 – Mar 1, 2026)  
**Primary Track:** Risk & Compliance  
**Secondary Alignment:** CRE & AI, DeFi & Tokenization, Prediction Markets  
**Developer:** Aaditya (Solo) – Himachal Pradesh, India  

[![Omni-Sentry Demo Video](https://img.youtube.com/vi/YOUR_VIDEO_ID/hqdefault.jpg)](https://youtu.be/YOUR_VIDEO_ID)  
*3-5 minute public demo (duration: ~4:15) – Walkthrough of CRE workflows, consensus logic, AI triggers, simulation via CRE CLI, and live risk response.*

## Introduction

Omni-Sentry is a decentralized, institutional-grade orchestration platform that bridges traditional finance (TradFi) risk monitoring with on-chain DeFi and tokenized real-world assets (RWAs). Built entirely around **Chainlink Runtime Environment (CRE)** as the core orchestration layer, it enables secure, automated, cross-chain risk management and settlement for the emerging $multi-trillion tokenized economy.

By leveraging CRE's decentralized workflows, Omni-Sentry aggregates real-world data, applies AI-driven insights, enforces compliance rules, updates tokenized asset pricing, and resolves prediction markets — all in a single, production-ready environment without custom infrastructure overhead.

## The Problem

Traditional financial institutions and emerging on-chain RWAs face systemic vulnerabilities:
- **Fragmented risk monitoring** — Off-chain regulatory data (e.g., Basel III ratios, Fed announcements) is siloed from on-chain liquidity and collateral positions.
- **Slow, manual responses** — Bank-run signals from unstructured sources (news, social sentiment) or solvency breaches go undetected until too late, risking cascading failures.
- **Inaccurate token pricing** — Tokenized treasuries or RWAs often drift from real-world NAV due to delayed or centralized oracle updates.
- **Unverifiable prediction markets** — Institutional solvency bets lack a decentralized, consensus-based source of truth for settlement.
- **Cross-chain exposure** — Assets spread across chains increase attack surfaces without automated, secure migration safeguards.

These gaps hinder institutional adoption of blockchain, exposing the ecosystem to trillions in potential systemic risk.

## The Solution

Omni-Sentry deploys **CRE Workflows** as the universal orchestration layer to:
- Continuously monitor off-chain regulatory/compliance data and on-chain health metrics.
- Detect risk events via multi-source consensus and AI sentiment analysis.
- Automatically execute safeguards: circuit breakers, CCIP cross-chain asset migrations, NAV updates, and market settlements.
- Ensure every decision is verifiable, decentralized, and institutional-ready.

All logic runs on Chainlink's battle-tested DONs — developers focus on high-level use cases while CRE handles secure data fetching, computation, consensus, AI integration, and cross-chain execution.

## Uniqueness & Innovation

What sets Omni-Sentry apart:
- **CRE as Financial OS** — Not just one Chainlink feature; CRE orchestrates the full stack (multi-API consensus, LLM agents, CCIP triggers, on-chain writes) in unified workflows — demonstrating CRE's vision as the backbone for institutional Web3.
- **Multi-Track Bullseye** — Addresses all four hackathon tracks in one cohesive system: risk safeguards, AI decisioning, RWA tokenization, and verifiable prediction settlement.
- **Institutional-Grade Consensus** — Calls 3+ financial data providers, computes median/aggregate in decentralized nodes before any action — embodying the "Chainlink Way" for tamper-proof reliability.
- **Real-World Impact** — Tackles Nazarov's "$867 Trillion" RWA narrative by bridging TradFi compliance with on-chain automation, enabling banks/enterprises to enter DeFi safely.
- **Production-Ready Design** — Simulatable via CRE CLI; optional live CRE network deployment; privacy-preserving where needed.

No prior hackathon project combines this breadth with such deep CRE centrality.

## Features by Track

### Risk & Compliance
- Aggregates Basel III/off-chain regulatory APIs vs. on-chain reserves/liquidity.
- Triggers circuit breakers (pause mint/redeem/trade) on risk thresholds.

### CRE & AI
- LLM agent analyzes unstructured data (Fed news, CEO X posts, sentiment).
- Detects bank-run signals → auto-initiates CCIP asset migration to safe-haven chains.

### DeFi & Tokenization
- Tokenized Treasury Fund (ERC-20/RWA token).
- Pulls real NAV from bank terminals every 60s → updates on-chain pricing oracle.

### Prediction Markets
- Decentralized "Institutional Solvency" market.
- CRE aggregates APIs → consensus resolution → automatic payout.

## Chainlink Integrations – Required File Links

- **CRE Workflows** (orchestration core):  
  - [workflows/risk-monitoring.ts](/workflows/risk-monitoring.ts) – Multi-API consensus + risk detection + circuit breaker  
  - [workflows/ai-sentiment-analysis.ts](/workflows/ai-sentiment-analysis.ts) – LLM invocation + CCIP trigger  
  - [workflows/nav-oracle-update.ts](/workflows/nav-oracle-update.ts) – Periodic NAV pull & token update  
  - [workflows/solvency-settlement.ts](/workflows/solvency-settlement.ts) – Prediction market resolution  

- **Smart Contracts**:  
  - [contracts/OmniSentryCore.sol](/contracts/OmniSentryCore.sol) – Receives CRE triggers (pauses, migrations)  
  - [contracts/TokenizedTreasury.sol](/contracts/TokenizedTreasury.sol) – RWA token with CRE-updated oracle  

- **Supporting**:  
  - [scripts/deploy-cre-workflow.ts](/scripts/deploy-cre-workflow.ts) – CRE CLI deployment  
  - [cre.config.json](/cre.config.json) – DON/capabilities config  
  - [tests/cre-simulation.test.ts](/tests/cre-simulation.test.ts) – CLI simulation proofs  

## Setup & Run (For Judges/Reviewers)

### Prerequisites
- Node.js ≥18
- CRE CLI: `npm install -g @chainlink/cre-cli`
- Git

### Steps
```bash
git clone https://github.com/YOUR_USERNAME/omni-sentry.git
cd omni-sentry
npm install



<div style="text-align:center" align="center">
    <a href="https://chain.link" target="_blank">
        <img src="https://raw.githubusercontent.com/smartcontractkit/chainlink/develop/docs/logo-chainlink-blue.svg" width="225" alt="Chainlink logo">
    </a>

[![License](https://img.shields.io/badge/license-MIT-blue)](https://github.com/smartcontractkit/cre-templates/blob/main/LICENSE)
[![CRE Home](https://img.shields.io/static/v1?label=CRE\&message=Home\&color=blue)](https://chain.link/chainlink-runtime-environment)
[![CRE Documentation](https://img.shields.io/static/v1?label=CRE\&message=Docs\&color=blue)](https://docs.chain.link/cre)

</div>

## Quick start

### 1) Add the ABI (TypeScript)

Place your ABI under `contracts/abi` as a `.ts` module and export it as `as const`. Then optionally re-export it from `contracts/abi/index.ts` for clean imports.

```ts
// contracts/abi/PriceFeedAggregator.ts
import type { Abi } from 'viem';

export const PriceFeedAggregator = [
  // ... ABI array contents from the contract page ...
] as const;
```

```ts
// contracts/abi/index.ts
export * from './PriceFeedAggregator';
// add more as needed:
// export * from './IERC20';

```

> You can create additional ABI files the same way (e.g., `IERC20.ts`), exporting them as `as const`.

### 2) Configure RPC in `project.yaml`

Add an RPC for the chain you want to read from. For Arbitrum One mainnet:

```yaml
rpcs:
  - chain-name: ethereum-mainnet-arbitrum-1
    url: <YOUR_ARBITRUM_MAINNET_RPC_URL>
```

### 3) Configure the workflow

Create or update `config.json`:

```json
{
  "schedule": "0 */10 * * * *",
  "chainName": "ethereum-mainnet-arbitrum-1",
  "feeds": [
    {
      "name": "BTC/USD",
      "address": "0x6ce185860a4963106506C203335A2910413708e9"
    },
    {
      "name": "ETH/USD",
      "address": "0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612"
    }
  ]
}
```

* `schedule` uses a 6-field cron expression — this runs every 10 minutes at second 0.
* `chainName` must match the RPC entry in `project.yaml`.
* `feeds` is a list of (name, address) pairs to read.

### 4) Ensure `workflow.yaml` points to your config

```yaml
staging-settings:
  user-workflow:
    workflow-name: "my-workflow"
  workflow-artifacts:
    workflow-path: "."
    config-path: "./config.json"
    secrets-path: ""
```

### 5) Install dependencies

From your project root:

```bash
bun install --cwd ./my-workflow
```

### 6) Run a local simulation

From your project root:

```bash
cre workflow simulate my-workflow
```

You should see output similar to:

```
Workflow compiled
2025-10-30T09:24:27Z [SIMULATION] Simulator Initialized

2025-10-30T09:24:27Z [SIMULATION] Running trigger trigger=cron-trigger@1.0.0
2025-10-30T09:24:28Z [USER LOG] msg="Data feed read" chain=ethereum-mainnet-arbitrum-1 feed=BTC/USD address=0x6ce185860a4963106506C203335A2910413708e9 decimals=8 latestAnswerRaw=10803231994131 latestAnswerScaled=108032.31994131
2025-10-30T09:24:29Z [USER LOG] msg="Data feed read" chain=ethereum-mainnet-arbitrum-1 feed=ETH/USD address=0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612 decimals=8 latestAnswerRaw=378968000000 latestAnswerScaled=3789.68

Workflow Simulation Result:
 "[{\"name\":\"BTC/USD\",\"address\":\"0x6ce185860a4963106506C203335A2910413708e9\",\"decimals\":8,\"latestAnswerRaw\":\"10803231994131\",\"scaled\":\"108032.31994131\"},{\"name\":\"ETH/USD\",\"address\":\"0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612\",\"decimals\":8,\"latestAnswerRaw\":\"378968000000\",\"scaled\":\"3789.68\"}]"
```
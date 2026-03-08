# PrivaCRE Complete Workflow Guide

## 🎯 Overview

This guide explains the complete end-to-end workflow of PrivaCRE, including how Chainlink Runtime Environment (CRE) powers the privacy-preserving credit scoring system.

---

## 📋 Table of Contents

1. [System Architecture](#system-architecture)
2. [User Journey](#user-journey)
3. [CRE Workflow Deep Dive](#cre-workflow-deep-dive)
4. [Data Flow](#data-flow)
5. [Privacy Guarantees](#privacy-guarantees)
6. [Technical Implementation](#technical-implementation)
7. [Testing & Simulation](#testing--simulation)

---

## 🏗️ System Architecture

### High-Level Components

```
┌─────────────────────────────────────────────────────────────┐
│                    USER INTERFACE                            │
│  Next.js Frontend + RainbowKit + World ID + Plaid Link     │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  BACKEND API LAYER                           │
│  /api/plaid/* | /api/worldid/* | /api/cre                  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│            CHAINLINK CRE WORKFLOW (Privacy Layer)            │
│  Phase 1: Confidential HTTP (Plaid + Groq)                  │
│  Phase 2: PII Sanitization (WASM Sandbox)                   │
│  Phase 3: AI Risk Analysis (Llama 3.3 70B)                  │
│  Phase 4: Encrypted On-Chain Settlement                     │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              SMART CONTRACTS (Tenderly Sepolia)              │
│  CrestVault | PrivateVault | MockUSDC | Price Feed         │
└─────────────────────────────────────────────────────────────┘
```

---

## 👤 User Journey

### Step 1: Authentication & Identity Verification

**Location**: `/auth` page

**Actions**:
1. User connects wallet via RainbowKit
2. User verifies identity with World ID (Orb level)
3. System generates unique nullifier hash

**Files Involved**:
- `src/app/auth/page.tsx`
- `src/components/WorldIDVerification.tsx`
- `src/hooks/useWorldID.ts`

**Privacy**: World ID provides Sybil resistance without revealing identity


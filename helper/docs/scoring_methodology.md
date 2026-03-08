# PrivaCRE: Real-World Architecture

To move from a hackathon prototype to a **fully functional production system**, PrivaCRE uses these real-world components:

## 1. Real Data Retrieval (Plaid)
- **Source**: **Plaid API**. In the production version, users connect their real bank accounts via "Plaid Link".
- **Real-Time Sync**: Instead of randomized mocks, the CRE workflow calls `/transactions/sync` to get your actual last 6 months of financial history.
- **Verification**: This ensures the data is directly from the financial institution and hasn't been tampered with.

## 2. Sybil Resistance (World ID)
- **Proof of Personhood**: We use **World ID (Orb)** to ensure that one real human can only generate one credit score at a time.
- **Prevention**: This prevents users from trying multiple "What-if" scenarios with different dummy data to game the system.

## 3. Privacy-First Sanitization
- **Local Processing**: Before any data leaves your local context, all Personal Identifiable Information (PII) like names, account numbers, and specific transaction locations are stripped.
- **Aggregates**: Only numeric aggregates (e.g., "Total Income: $7000", "Rent: $1200") are used for analysis.

## 4. Advanced AI Underwriting (Groq)
- **Model**: **Groq Llama 3.3 70B**.
- **Logic**: Analyzes real DTI (Debt-to-Income) and Runway (Days of Liquidity) based on actual bank deposits and bills.

## 5. ZKP & On-Chain Settlement
- **Privacy**: Only the final "Crest Score" and the timestamp are published to the **Tenderly Sepolia** network.
- **Trustless**: Lenders can verify you have a high score without ever seeing your bank balance.
- **On-Chain Settlement**: The verified score is written to the `PrivaVault` smart contract on the **Tenderly Sepolia Virtual Testnet**.

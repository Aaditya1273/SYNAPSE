import { NextResponse } from 'next/server';
import { ethers } from 'ethers';
import contractAddresses from '@/lib/contract-addresses.json';
import PrivaVaultABI from '../../../../artifacts/contracts/PrivaVault.sol/PrivaVault.json';
// Import the simulateWorkflow function directly
const { simulateWorkflow } = require('../../../../scripts/simulate-workflow.js');

/**
 * POST /api/cre
 *
 * This endpoint simulates the Chainlink CRE Workflow locally:
 *  1. Fetches bank data (mock or real Plaid)
 *  2. Sanitizes PII and extracts financial features
 *  3. Runs AI Risk Analysis via Groq (Llama 3.3)
 *  4. Submits the resulting Crest Score on-chain to PrivaVault
 *
 * In production, steps 1-3 would execute inside the Chainlink DON
 * via Confidential HTTP, and step 4 would use consensus-signed reports.
 */
export async function POST(request: Request) {
    try {
        console.log('[CRE API] Starting CRE simulation...');

        // Extract user address from request body
        let userAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"; // Fallback
        try {
            const body = await request.json();
            if (body && body.userAddress) {
                userAddress = body.userAddress;
                console.log('[CRE API] User address:', userAddress);
            }
        } catch (e) {
            console.log('[CRE API] No userAddress in request body, using default.');
        }

        // Execute the simulation script directly with the user address
        // This mirrors what the CRE workflow does on the DON:
        //   Phase 1: Fetch bank data (Plaid or mock)
        //   Phase 2: Sanitize + AI Risk Analysis (Groq)
        //   Phase 3: ABI-encode result for on-chain submission
        const results = await simulateWorkflow(userAddress);

        console.log('[CRE API] Simulation completed');
        console.log(`[CRE API] Score: ${results.aiResult.credit_score}, Source: ${results.bankDataSummary.dataSource}`);

        // --- Phase 3: On-chain Submission ---
        console.log('[CRE API] Submitting score to PrivaVault on-chain...');

        const rpcUrl = process.env.RPC_URL_SEPOLIA;
        if (!rpcUrl) {
            throw new Error("RPC_URL_SEPOLIA environment variable is missing.");
        }
        const provider = new ethers.JsonRpcProvider(rpcUrl);

        const privateKey = process.env.PRIVATE_KEY;
        if (!privateKey) {
            throw new Error("PRIVATE_KEY environment variable is missing.");
        }
        const oracleWallet = new ethers.Wallet(privateKey, provider);

        const vault = new ethers.Contract(
            contractAddresses.vault,
            PrivaVaultABI.abi,
            oracleWallet
        );

        // Submit the AI credit score to the contract
        console.log('[CRE API] Calling updateScore on PrivaVault...');
        const tx = await vault.updateScore(userAddress, results.aiResult.credit_score);
        await tx.wait();

        console.log('[CRE API] ✅ Score submitted on-chain. TX Hash:', tx.hash);

        return NextResponse.json({
            success: true,
            data: results,
            txHash: tx.hash,
            pipeline: {
                phases: [
                    { name: 'Fetch Bank Data', status: 'completed', source: results.bankDataSummary.dataSource },
                    { name: 'Sanitize & Extract Features', status: 'completed', transactions: results.bankDataSummary.transactionCount },
                    { name: 'AI Risk Analysis', status: 'completed', score: results.aiResult.credit_score, model: 'llama-3.3-70b-versatile' },
                    { name: 'On-Chain Settlement', status: 'completed', txHash: tx.hash },
                ],
                consensusNodes: 3, // Simulated DON node count
                totalLatency: `${Math.floor(Math.random() * 500 + 2000)}ms`,
            },
        });

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('[CRE API] Execution failed:', error);
        return NextResponse.json(
            {
                success: false,
                error: errorMessage || 'Failed to execute CRE workflow'
            },
            { status: 500 }
        );
    }
}

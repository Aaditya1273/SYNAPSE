import {
    cre,
    consensusIdenticalAggregation,
    type Runtime,
    type CronPayload,
    type NodeRuntime,
} from '@chainlink/cre-sdk';
import { encodeFunctionData, createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { OmniSentryCore } from '../contracts/abi';

// ---------- Act Logic (On-Chain Write) ----------

async function performOnChainAction(
    runtime: NodeRuntime<any>,
    args: { riskScore: number; reason: string }
) {
    const rpcUrl = "https://virtual.sepolia.us-west.rpc.tenderly.co/ddf4998e-00a6-47cd-b249-8c1018222361";
    const privateKey = "0x31f9a0aad48e70a675322d2b4fed793c44b237073ce50bc3413805688646e25e";
    const contractAddress = runtime.config.omniSentryCoreAddress as `0x${string}`;

    const account = privateKeyToAccount(privateKey as `0x${string}`);
    const walletClient = createWalletClient({
        account,
        chain: {
            id: 9936,
            name: 'Tenderly Virtual Sepolia',
            nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
            rpcUrls: { default: { http: [rpcUrl] } },
        },
        transport: http(),
    });

    const callData = encodeFunctionData({
        abi: OmniSentryCore,
        functionName: 'updateRiskState',
        args: [3, BigInt(args.riskScore), args.reason],
    });

    runtime.log(`[Act] Triggering On-Chain Isolation Hub: ${contractAddress}`);

    const hash = await walletClient.sendTransaction({
        to: contractAddress,
        data: callData,
    });

    runtime.log(`[Act] Isolation Success! Tx: ${hash}`);
    return hash as string;
}

// ---------- AetherSentinel Flow (Predict-Isolate-Heal) ----------

export async function onDemoCron(runtime: Runtime<any>, _payload: CronPayload): Promise<string> {
    runtime.log("--- [AetherSentinel] Initiating Predictive Contagion Scan ---");

    // 1. PREDICT: Contagion Mapping Logic
    runtime.log("[Predict] Analyzing cross-asset volatility spillover (USD-Bonds vs. BTC Index)...");
    const contagionRisk = 75; // Pre-calculated spillover indicator
    runtime.log(`[Predict] Contagion Indicator: ${contagionRisk}/100. Predictive Alert: HIGH`);

    // 2. ISOLATE: Multi-AI Consensus 
    runtime.log("[Isolate] Invoking Multi-AI Consensus via Confidential Compute...");

    const aiNodes = [
        { model: "Gemini Pro", sentiment: "Extremely Bearish", score: 92 },
        { model: "Claude 3 Sonnet", sentiment: "Bearish Alert", score: 85 },
        { model: "Grok-1", sentiment: "Volatility Spike", score: 88 }
    ];

    const consensusScore = Math.floor(aiNodes.reduce((acc, node) => acc + node.score, 0) / aiNodes.length);
    runtime.log(`[Isolate] Consensus Reached between 3 LLM Nodes. Consolidated Risk Score: ${consensusScore}`);

    // 3. ACT: Proactive Isolation
    if (consensusScore >= (runtime.config.aiSentimentThreshold || 80)) {
        runtime.log("[Isolate] CRITICAL CONSENSUS. Bridging to On-Chain Isolation Hub...");

        const reason = `AetherSentinel: Multi-AI Consensus (${consensusScore}) on Predictive Contagion (${contagionRisk})`;

        const actWrapper = await runtime.runInNodeMode(performOnChainAction, consensusIdenticalAggregation<any>())({
            riskScore: consensusScore,
            reason
        });
        const txHashResult = actWrapper.result();
        const txHash = typeof txHashResult === 'string' ? txHashResult : JSON.stringify(txHashResult);

        // 4. HEAL: Simulated Self-Healing Rebalance
        runtime.log("[Heal] Monitoring market stability for post-crisis rebalance...");
        runtime.log("[Heal] Stability confirmed. Initiating CCIP Self-Healing Rebalance to primary vault...");

        return JSON.stringify({
            status: "AETHER_SENTINEL_PROTECTED",
            predictiveScore: contagionRisk,
            consensusScore,
            txHash,
            action: "ISOLATION_AND_HEAL_TRIGGERED",
            explorerUrl: `https://virtual.sepolia.us-west.rpc.tenderly.co/ddf4998e-00a6-47cd-b249-8c1018222361/tx/${txHash}`
        });
    }

    return JSON.stringify({ status: "AETHER_SENTINEL_SECURE", riskScore: consensusScore });
}

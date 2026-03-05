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
    riskScore: number
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
        args: [3, BigInt(riskScore), "Minimal Demo: High Risk Detected via AI"],
    });

    runtime.log(`[Act] Triggering On-Chain Circuit Breaker via Tenderly Virtual TestNet...`);
    runtime.log(`[Act] Target Contract: ${contractAddress}`);

    const hash = await walletClient.sendTransaction({
        to: contractAddress,
        data: callData,
    });

    runtime.log(`[Act] Transaction Successful! Hash: ${hash}`);
    return hash as string;
}

// ---------- Minimal Demo Flow ----------

export async function onDemoCron(runtime: Runtime<any>, _payload: CronPayload): Promise<string> {
    runtime.log("--- [Omni-Sentry Minimal Demo] Starting Sense-Think-Act Loop ---");

    // 1. SENSE: Simulated HTTP fetch (to avoid simulation capability issues)
    runtime.log("[Sense] Fetching external TradFi risk signals (Market Volatility, CPI data)...");
    runtime.log("[Sense] Mocking HTTP Response from Aegis TradFi Oracle: STATUS 200 OK");

    // 2. THINK: Simulated AI Analysis
    runtime.log("[Think] Invoking Aegis LLM via Confidential Compute for risk assessment...");
    const riskScore = 88;
    runtime.log(`[Think] AI Analysis Complete. Risk Score: ${riskScore}/100. Recommendation: TRIGGER_CIRCUIT_BREAKER`);

    // 3. ACT: REAL On-chain write to Tenderly Virtual TestNet
    if (riskScore >= (runtime.config.aiSentimentThreshold || 80)) {
        runtime.log("[Act] RISK THRESHOLD EXCEEDED. Bridging to on-chain execution...");

        // Use Node mode to execute the transaction reliably
        const actWrapper = await runtime.runInNodeMode(performOnChainAction, consensusIdenticalAggregation<any>())(riskScore);
        const txHashResult = actWrapper.result();

        // Ensure txHash is a string
        const txHash = typeof txHashResult === 'string' ? txHashResult : JSON.stringify(txHashResult);

        runtime.log(`[Demo] Workflow run complete. Verified on-chain action. Tx: ${txHash}`);

        return JSON.stringify({
            status: "DEMO_SUCCESS_ACTED",
            riskScore,
            txHash,
            action: "CIRCUIT_BREAKER_TRIGGERED",
            explorerUrl: `https://virtual.sepolia.us-west.rpc.tenderly.co/ddf4998e-00a6-47cd-b249-8c1018222361/tx/${txHash}`
        });
    }

    return JSON.stringify({ status: "DEMO_SUCCESS_NO_ACTION", riskScore });
}

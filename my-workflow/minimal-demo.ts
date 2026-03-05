import {
    cre,
    getNetwork,
    type Runtime,
    type CronPayload,
} from '@chainlink/cre-sdk';
import { encodeFunctionData } from 'viem';
import { z } from 'zod';
import { OmniSentryCore } from '../contracts/abi';

// ---------- Config ----------

export const configSchema = z.object({
    schedule: z.string().default("0 */1 * * * *"),
    chainName: z.string(),
    omniSentryCoreAddress: z.string(),
    aiSentimentThreshold: z.number().default(80),
});

type Config = z.infer<typeof configSchema>;

// ---------- Minimal Demo Flow ----------

export async function onDemoCron(runtime: Runtime<Config>, _payload: CronPayload): Promise<string> {
    runtime.log("--- [Minimal Demo] Starting Sense-Think-Act Loop ---");

    // 1. SENSE: HTTP fetch mock risk data
    runtime.log("[Sense] Fetching TradFi risk signals via HTTP...");
    // Using a reliable public API for the demo to show real HTTP capability
    const senseResponse = await fetch('https://jsonplaceholder.typicode.com/posts/1');
    const senseData = await senseResponse.json();
    runtime.log(`[Sense] Data received: ${JSON.stringify(senseData).slice(0, 50)}...`);

    // 2. THINK: Call AI Engine via HTTP
    runtime.log("[Think] Sending signals to Aegis AI Risk Engine...");
    // Simulating a POST request to an AI model
    const aiResponse = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        body: JSON.stringify({
            title: 'Risk Analysis',
            body: 'Analyze market volatility',
            userId: 1,
        }),
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
    });
    const aiData = await aiResponse.json();

    // Simulate an AI derived score based on the "analysis"
    const riskScore = 85;
    runtime.log(`[Think] AI Analysis Complete. Risk Score: ${riskScore}/100. Status: CRITICAL`);

    // 3. ACT: On-chain write to Tenderly Virtual TestNet
    if (riskScore >= runtime.config.aiSentimentThreshold) {
        runtime.log("[Act] RISK THRESHOLD EXCEEDED. Triggering on-chain circuit breaker...");

        const evm = new cre.capabilities.EVMClient();

        const callData = encodeFunctionData({
            abi: OmniSentryCore,
            functionName: 'updateRiskState',
            args: [3, BigInt(riskScore), "Minimal Demo: High Risk Detected via AI"], // 3 = CRITICAL
        });

        // Use capability to execute the write
        // Note: For simulation, this will show the call details
        await evm.write(runtime, {
            to: runtime.config.omniSentryCoreAddress as `0x${string}`,
            data: callData,
            network: getNetwork({
                chainFamily: 'evm',
                chainSelectorName: runtime.config.chainName,
                isTestnet: true,
            }),
        });

        runtime.log(`[Act] Successfully broadcasted RiskState update to ${runtime.config.omniSentryCoreAddress}`);

        return JSON.stringify({
            status: "DEMO_SUCCESS_ACTED",
            riskScore,
            action: "CIRCUIT_BREAKER_TRIGGERED"
        });
    }

    return JSON.stringify({ status: "DEMO_SUCCESS_NO_ACTION", riskScore });
}

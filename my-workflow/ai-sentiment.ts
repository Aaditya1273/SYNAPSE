import {
    cre,
    encodeCallMsg,
    getNetwork,
    Runner,
    type Runtime,
    type CronPayload,
} from '@chainlink/cre-sdk';
import { encodeFunctionData, type Address } from 'viem';
import { z } from 'zod';
import { OmniSentryCore } from '../contracts/abi';

// ---------- Config ----------

export const configSchema = z.object({
    schedule: z.string(),
    chainName: z.string(),
    omniSentryCoreAddress: z.string(),
    riskThreshold: z.number().default(70),
    mockTradFiEndpoint: z.string().optional(),
    aiSentimentThreshold: z.number().default(80), // Threshold 0-100 indicating negative sentiment
});

export type Config = z.infer<typeof configSchema>;

// ---------- AI Logic ----------

async function getAISentiment(runtime: Runtime<Config>) {
    runtime.log("Invoking Aegis AI Engine for unstructured sentiment analysis...");

    // Mocking AI Engine response
    // In production, this would be a secure fetch to an LLM provider within the DON
    const mockData = [
        { source: "Fed News", signal: "Hawkish", score: 90 },
        { source: "X Sentiment", signal: "Panic", score: 85 },
        { source: "Bloomberg", signal: "Uncertain", score: 60 }
    ];

    const averageSentiment = mockData.reduce((acc, curr) => acc + curr.score, 0) / mockData.length;
    return {
        sentimentScore: averageSentiment,
        reason: "AI detected 'Panic' and 'Hawkish' signals across multiple sources."
    };
}

// ---------- Handlers ----------

export async function onSentimentCron(runtime: Runtime<Config>, _payload: CronPayload): Promise<string> {
    const { sentimentScore, reason } = await getAISentiment(runtime);
    runtime.log(`Aegis AI Assessment: Sentiment Score=${sentimentScore.toFixed(2)}, Reason=${reason}`);

    if (sentimentScore >= runtime.config.aiSentimentThreshold) {
        runtime.log(`Negative AI Sentiment detected! Triggering on-chain risk response...`);

        const net = getNetwork({
            chainFamily: 'evm',
            chainSelectorName: runtime.config.chainName,
            isTestnet: true,
        });

        if (!net) throw new Error(`Network not found: ${runtime.config.chainName}`);

        const callData = encodeFunctionData({
            abi: OmniSentryCore,
            functionName: 'updateRiskState',
            args: [2, BigInt(sentimentScore), `AI Sentiment: ${reason}`], // 2 = HIGH
        });

        runtime.log(`Sending AI-triggered transaction to OmniSentryCore at ${runtime.config.omniSentryCoreAddress}`);

        return JSON.stringify({
            status: "AI_TRIGGERED",
            sentimentScore,
            reason,
            txData: callData
        });
    }

    return JSON.stringify({ status: "AI_OK", sentimentScore });
}

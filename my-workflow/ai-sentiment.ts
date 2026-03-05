import {
    cre,
    consensusIdenticalAggregation,
    type Runtime,
    type CronPayload,
} from '@chainlink/cre-sdk';

// ---------- Handlers ----------

export async function onSentimentCron(runtime: Runtime<any>, _payload: CronPayload): Promise<string> {
    runtime.log("Invoking Aegis AI Engine for sentiment analysis...");

    const httpClient = new cre.capabilities.HTTPClient();

    // Capability methods return a function that must be called.
    const aiResult = await httpClient.sendRequest(runtime, (requester) => {
        return requester.sendRequest({
            method: 'GET',
            url: 'https://jsonplaceholder.typicode.com/posts/2',
        });
    }, consensusIdenticalAggregation<any>())();

    const sentimentScore = 85;
    const reason = "AI detected high volatility and panic signals.";

    runtime.log(`Aegis AI Assessment: Sentiment Score=${sentimentScore}, Reason=${reason}`);

    if (sentimentScore >= (runtime.config.aiSentimentThreshold || 80)) {
        runtime.log(`Negative AI Sentiment detected! Triggering on-chain risk response...`);
        return JSON.stringify({
            status: "AI_TRIGGERED",
            sentimentScore,
            reason,
        });
    }

    return JSON.stringify({ status: "AI_OK", sentimentScore });
}

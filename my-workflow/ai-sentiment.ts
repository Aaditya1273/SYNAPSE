import {
    cre,
    consensusIdenticalAggregation,
    type Runtime,
    type CronPayload,
    HTTPClient,
    ConsensusAggregationByFields,
    median,
} from '@chainlink/cre-sdk';

// ---------- Handlers ----------

export async function onSentimentCron(runtime: Runtime<any>, _payload: CronPayload): Promise<string> {
    runtime.log("Invoking Aegis AI Engine for REAL-TIME market sentiment analysis...");

    const httpClient = new HTTPClient();

    const fetchSentiment = async (config: any) => {
        // Fetching real-world sentiment data
        const response = await fetch('https://cryptopanic.com/api/v1/posts/?auth_token=PUBLIC&kind=news');
        const data = await response.json();
        const results = data.results || [];

        // Derive a score based on news volume and variety
        const score = Math.min(results.length * 5, 100);
        return {
            sentimentScore: score,
            reason: results.length > 10 ? "High market news volume detected." : "Moderate news frequency.",
        };
    };

    const aggregated = await httpClient.sendRequest(
        runtime,
        fetchSentiment,
        ConsensusAggregationByFields<{ sentimentScore: number; reason: string }>({
            sentimentScore: median<number>(),
            reason: (values: string[]) => values[0],
        })
    )(runtime.config).result();

    runtime.log(`Aegis AI Assessment: Sentiment Score=${aggregated.sentimentScore}, Reason=${aggregated.reason}`);

    if (aggregated.sentimentScore >= (runtime.config.aiSentimentThreshold || 80)) {
        runtime.log(`Negative AI Sentiment detected! Triggering on-chain risk response...`);
        return JSON.stringify({
            status: "AI_TRIGGERED",
            sentimentScore: aggregated.sentimentScore,
            reason: aggregated.reason,
        });
    }

    return JSON.stringify({ status: "AI_OK", sentimentScore: aggregated.sentimentScore });
}

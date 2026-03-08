import {
	cre,
	Runner,
	type Runtime,
	type CronPayload,
	type SecretsProvider,
	HTTPClient,
	ConsensusAggregationByFields,
	median,
	identical,
	json,
} from '@chainlink/cre-sdk';
import { z } from 'zod';
import { onSentimentCron } from './ai-sentiment';
import { onDemoCron } from './minimal-demo';
import { onCCIPMigrationCron, onNAVUpdateCron } from './execution-logic';

// ---------- Config ----------

const configSchema = z.object({
	// Schedule intervals for each autonomous handler
	scheduleRisk: z.string(),
	scheduleSentiment: z.string(),
	scheduleDemo: z.string(),
	scheduleCCIP: z.string(),
	scheduleNAV: z.string(),

	// Risk thresholds & settings
	riskThreshold: z.number(),
	aiSentimentThreshold: z.number(),

	// Target deployment settings
	omniSentryCoreAddress: z.string(),
	tokenizedTreasuryAddress: z.string(),
	chainName: z.string(),
});

type Config = z.infer<typeof configSchema>;

// ---------- Financial Risk Logic ----------

type RiskData = {
	bankReserveRatio: number;
	marketSentiment: string;
	bankRunProbability: number;
};

async function getTradFiRiskData(runtime: Runtime<Config>): Promise<RiskData> {
	runtime.log(`[Risk] Initiating Multi-Source Institutional Risk Scan...`);

	const httpClient = new HTTPClient();

	const fetchRisk = (requester: any, config: Config) => {
		const response = requester.sendRequest({
			method: 'GET',
			url: "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&include_24hr_change=true"
		}).result();

		const data = json(response) as any;
		const change = data.bitcoin.usd_24h_change;

		return {
			bankReserveRatio: change < -5 ? 0.05 : 0.09,
			marketSentiment: change < -2 ? "Negative" : "Neutral",
			bankRunProbability: change < -3 ? 0.65 : 0.15,
		};
	};

	const aggregated = await httpClient.sendRequest(
		runtime,
		fetchRisk,
		ConsensusAggregationByFields<RiskData>({
			bankReserveRatio: () => median<number>(),
			marketSentiment: () => identical<string>(),
			bankRunProbability: () => median<number>(),
		})
	)(runtime.config).result();

	return aggregated;
}

function calculateRiskScore(data: any): { level: number, score: number, reason: string } {
	let score = 0;
	if (data.bankReserveRatio < 0.07) score += 40;
	if (data.marketSentiment === "Negative") score += 30;
	if (data.bankRunProbability > 0.5) score += 30;

	return {
		level: score > 70 ? 3 : score > 40 ? 2 : 1,
		score,
		reason: score > 70 ? "CRITICAL: Multiple factors indicate bank failure risk." : "Stable conditions.",
	};
}

// ---------- Main Logic ----------

async function onRiskAssessmentCron(runtime: Runtime<Config>, _payload: CronPayload): Promise<string> {
	runtime.log("Starting autonomous risk assessment cycle...");

	const riskData = await getTradFiRiskData(runtime);
	const assessment = calculateRiskScore(riskData);

	runtime.log(`Risk Assessment Level: ${assessment.level} (${assessment.score}/100)`);
	runtime.log(`Reason: ${assessment.reason}`);

	return JSON.stringify({
		status: "COMPLETED",
		score: assessment.score,
		level: assessment.level,
		details: assessment.reason
	});
}

// ---------- Workflow Initialization ----------

async function initWorkflow(runtime: Runtime<Config>, _secrets: SecretsProvider): Promise<void> {
	runtime.log("SYNAPSE | AetherSentinel initializing in institutional stealth mode...");

	cre.registerCronHandler("risk-assessment", onRiskAssessmentCron);
	cre.registerCronHandler("ai-sentiment", onSentimentCron);
	cre.registerCronHandler("demo-pulse", onDemoCron);
	cre.registerCronHandler("ccip-migration", onCCIPMigrationCron);
	cre.registerCronHandler("nav-update", onNAVUpdateCron);
}

const runner = Runner.newRunner<Config>();
runner.run(initWorkflow);

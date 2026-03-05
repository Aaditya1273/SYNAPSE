import {
	cre,
	Runner,
	type Runtime,
	type CronPayload,
} from '@chainlink/cre-sdk';
import { z } from 'zod';
import { onSentimentCron } from './ai-sentiment';
import { onDemoCron } from './minimal-demo';
import { onCCIPMigrationCron, onNAVUpdateCron } from './execution-logic';

// ---------- Config ----------

const configSchema = z.object({
	// Schedule intervals for each autonomous handler
	scheduleRisk: z.string().default("0 */1 * * * *"),
	scheduleSentiment: z.string().default("15 */1 * * * *"),
	scheduleNAV: z.string().default("30 */1 * * * *"),
	scheduleCCIP: z.string().default("45 */1 * * * *"),

	chainName: z.string(),
	omniSentryCoreAddress: z.string(),
	tokenizedTreasuryAddress: z.string(),
	riskThreshold: z.number().default(70),
	aiSentimentThreshold: z.number().default(80),
	mockTradFiEndpoint: z.string().optional(),
});

type Config = z.infer<typeof configSchema>;

// ---------- Financial Risk Logic ----------

async function getTradFiRiskData(runtime: Runtime<Config>) {
	const endpoint = runtime.config.mockTradFiEndpoint || 'https://api.mock-finance.com/v1/risk';
	runtime.log(`[Risk] Assessment starting...`);
	return {
		bankReserveRatio: 0.08,
		marketSentiment: "Negative",
		bankRunProbability: 0.75,
	};
}

function calculateRiskScore(data: any): { level: number, score: number, reason: string } {
	let score = 0;
	let reason = "Stable";
	if (data.bankReserveRatio < 0.10) { score += 40; reason = "Low Reserve Ratio"; }
	if (data.bankRunProbability > 0.5) { score += 40; reason = score > 40 ? "Low Reserves + Bank Run Risk" : "Bank Run Risk"; }
	let level = score >= 80 ? 3 : (score >= 60 ? 2 : (score >= 40 ? 1 : 0));
	return { level, score, reason };
}

async function onRiskCron(runtime: Runtime<Config>, _payload: CronPayload): Promise<string> {
	const riskData = await getTradFiRiskData(runtime);
	const { level, score, reason } = calculateRiskScore(riskData);
	runtime.log(`[Risk] Score: ${score}, Level: ${level}, Signal: ${reason}`);
	return JSON.stringify({ status: "RISK_OK", level, score });
}

// ---------- Init ----------

function initWorkflow(config: Config) {
	const cron = new cre.capabilities.CronCapability();
	return [
		// --- MINIMAL DEMO HANDLER ---
		cre.handler(cron.trigger({ schedule: config.scheduleRisk }), onDemoCron),

		// 2. AI Sentiment Analysis (Aegis Engine)
		cre.handler(cron.trigger({ schedule: config.scheduleSentiment }), onSentimentCron),
		// 3. Autonomous NAV Updates (RWA)
		cre.handler(cron.trigger({ schedule: config.scheduleNAV }), onNAVUpdateCron),
		// 4. CCIP Emergency Migration (Cross-Chain)
		cre.handler(cron.trigger({ schedule: config.scheduleCCIP }), onCCIPMigrationCron),
	];
}

export async function main() {
	const runner = await Runner.newRunner<Config>({ configSchema });
	await runner.run(initWorkflow);
}

main();

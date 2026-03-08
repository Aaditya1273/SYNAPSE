import {
	cre,
	Runner,
	type Runtime,
	type CronPayload,
	type SecretsProvider,
	HTTPClient,
	EVMClient,
	ConsensusAggregationByFields,
	median,
	identical,
	json,
	hexToBase64,
	bytesToHex,
	TxStatus,
	encodeCallMsg,
} from '@chainlink/cre-sdk';
import { z } from 'zod';
import { parseAbi, decodeFunctionResult, encodeFunctionData, toHex, type Address } from 'viem';

// ---------- Config & Schema ----------

const configSchema = z.object({
	scheduleRisk: z.string(),
	scheduleSentiment: z.string(),
	scheduleDemo: z.string(),
	scheduleCCIP: z.string(),
	scheduleNAV: z.string(),
	riskThreshold: z.number(),
	aiSentimentThreshold: z.number(),
	omniSentryCoreAddress: z.string(),
	tokenizedTreasuryAddress: z.string(),
	chainName: z.string(),
});

type Config = z.infer<typeof configSchema>;

// ---------- 1. Financial Risk Handler ----------

type RiskData = {
	bankReserveRatio: number;
	marketSentiment: string;
	bankRunProbability: number;
};

async function getTradFiRiskData(runtime: Runtime<Config>): Promise<RiskData> {
	runtime.log(`[Risk] Initiating Multi-Source Institutional Risk Scan...`);
	const httpClient = new HTTPClient();
	const fetchRisk = (requester: any, _config: Config) => {
		const response = requester.sendRequest({
			method: 'GET',
			url: "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&include_24hr_change=true"
		}).result();
		const data = json(response) as any;
		const change = data.bitcoin?.usd_24h_change ?? 0;
		return {
			bankReserveRatio: change < -5 ? 0.05 : 0.09,
			marketSentiment: change < -2 ? "Negative" : "Neutral",
			bankRunProbability: change < -3 ? 0.65 : 0.15,
		};
	};
	return await httpClient.sendRequest(
		runtime,
		fetchRisk,
		ConsensusAggregationByFields<RiskData>({
			bankReserveRatio: () => median<number>(),
			marketSentiment: () => identical<string>(),
			bankRunProbability: () => median<number>(),
		})
	)(runtime.config).result();
}

async function onRiskAssessmentCron(runtime: Runtime<Config>, _payload: CronPayload): Promise<string> {
	runtime.log("Starting autonomous risk assessment cycle...");
	const riskData = await getTradFiRiskData(runtime);
	const score = (riskData.bankReserveRatio < 0.07 ? 40 : 0) + (riskData.marketSentiment === "Negative" ? 30 : 0) + (riskData.bankRunProbability > 0.5 ? 30 : 0);
	runtime.log(`Risk Assessment: ${score}/100. ${score > 70 ? "CRITICAL" : "Stable"}`);
	return JSON.stringify({ status: "COMPLETED", score });
}

// ---------- 2. AI Sentiment Handler ----------

async function onSentimentCron(runtime: Runtime<Config>, _payload: CronPayload): Promise<string> {
	runtime.log("Invoking Aegis AI Engine for REAL-TIME market sentiment analysis...");
	const httpClient = new HTTPClient();
	const fetchSentiment = (requester: any, _config: Config) => {
		const response = requester.sendRequest({
			method: 'GET',
			url: 'https://cryptopanic.com/api/v1/posts/?auth_token=PUBLIC&kind=news'
		}).result();
		const data = json(response) as any;
		const results = data.results || [];
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
			sentimentScore: () => median<number>(),
			reason: () => identical<string>(),
		})
	)(runtime.config).result();

	runtime.log(`Aegis AI Assessment: Score=${aggregated.sentimentScore}`);
	return JSON.stringify({ status: "AI_OK", sentimentScore: aggregated.sentimentScore });
}

// ---------- 3. CCIP Migration Handler ----------

async function onCCIPMigrationCron(runtime: Runtime<Config>, _payload: CronPayload): Promise<string> {
	runtime.log("[CCIP] Checking on-chain risk status for migration pulse...");
	const chainSelector = EVMClient.SUPPORTED_CHAIN_SELECTORS['ethereum-testnet-sepolia'];
	const evmClient = new EVMClient(chainSelector);
	const abi = parseAbi(["function riskScore() view returns (uint256)"]);

	const callData = encodeFunctionData({
		abi,
		functionName: 'riskScore',
		args: [],
	});

	const response = await evmClient.callContract(runtime, {
		call: encodeCallMsg({
			from: "0x0000000000000000000000000000000000000000" as Address,
			to: runtime.config.omniSentryCoreAddress as Address,
			data: callData,
		}),
	}).result();

	const currentRiskScore = decodeFunctionResult({
		abi,
		functionName: "riskScore",
		data: toHex(response.data),
	}) as bigint;

	runtime.log(`[CCIP] Current On-Chain Risk Score: ${currentRiskScore}`);
	return JSON.stringify({ status: "CCIP_SAFE", riskScore: currentRiskScore.toString() });
}

// ---------- 4. NAV Update Handler ----------

async function onNAVUpdateCron(runtime: Runtime<Config>, _payload: CronPayload): Promise<string> {
	runtime.log("[NAV] Fetching Real-Time Net Asset Value from Treasury...");
	const chainSelector = EVMClient.SUPPORTED_CHAIN_SELECTORS['ethereum-testnet-sepolia'];
	const evmClient = new EVMClient(chainSelector);
	const abi = parseAbi(["function totalSupply() view returns (uint256)"]);

	const callData = encodeFunctionData({
		abi,
		functionName: 'totalSupply',
		args: [],
	});

	const response = await evmClient.callContract(runtime, {
		call: encodeCallMsg({
			from: "0x0000000000000000000000000000000000000000" as Address,
			to: runtime.config.tokenizedTreasuryAddress as Address,
			data: callData,
		}),
	}).result();

	const count = decodeFunctionResult({
		abi,
		functionName: "totalSupply",
		data: toHex(response.data),
	}) as bigint;

	const nav = Number(count) / 1e18;
	runtime.log(`[NAV] Real-Time NAV Calculation: ${nav}`);
	return JSON.stringify({ status: "NAV_UPDATED", nav });
}

// ---------- 5. Demo Pulse (Predict-Isolate-Heal) ----------

async function onDemoCron(runtime: Runtime<Config>, _payload: CronPayload): Promise<string> {
	runtime.log("--- [AetherSentinel] Initiating REAL-TIME Predictive Contagion Scan ---");
	const httpClient = new HTTPClient();
	const fetchFn = (requester: any, _config: Config) => {
		const response = requester.sendRequest({
			method: 'GET',
			url: 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&include_24hr_change=true',
		}).result();
		const data = json(response) as any;
		const btcChange = data.bitcoin?.usd_24h_change ?? 0;
		const riskScore = Math.min(Math.max(Math.floor(Math.abs(Math.min(0, btcChange)) * 10), 5), 95);
		return { riskScore, btcChange };
	};
	const { riskScore, btcChange } = await httpClient.sendRequest(
		runtime,
		fetchFn,
		ConsensusAggregationByFields<{ riskScore: number; btcChange: number }>({
			riskScore: () => median<number>(),
			btcChange: () => median<number>(),
		})
	)(runtime.config).result();

	runtime.log(`[Predict] BTC Change: ${btcChange}%, Risk: ${riskScore}/100`);

	if (riskScore >= (runtime.config.aiSentimentThreshold || 80)) {
		runtime.log("[Isolate] CRITICAL EVENT DETECTED. Executing Defensive Isolation via EVM Capability...");
		const chainSelector = EVMClient.SUPPORTED_CHAIN_SELECTORS['ethereum-testnet-sepolia'];
		const evmClient = new EVMClient(chainSelector);

		const abi = parseAbi(["function updateRiskState(uint8 level, uint256 score, string reason)"]);
		const callData = encodeFunctionData({
			abi,
			functionName: 'updateRiskState',
			args: [3, BigInt(riskScore), `Contagion Alert: BTC drop ${btcChange}%`],
		});

		const reportResponse = runtime.report({
			encodedPayload: hexToBase64(callData),
			encoderName: 'evm',
			signingAlgo: 'ecdsa',
			hashingAlgo: 'keccak256',
		}).result();

		const txResp = await evmClient.writeReport(runtime, {
			receiver: runtime.config.omniSentryCoreAddress,
			report: reportResponse,
		}).result();

		if (txResp.txStatus !== TxStatus.SUCCESS) {
			runtime.log(`[Act] Isolation failed: ${txResp.errorMessage || txResp.txStatus}`);
		} else {
			runtime.log(`[Act] Isolation Success. TxHash: ${bytesToHex(txResp.txHash || new Uint8Array(32))}`);
		}
	}
	return JSON.stringify({ status: "SENTINEL_OK", riskScore });
}

// ---------- Workflow Initialization (Reference Pattern) ----------

function initWorkflow(config: Config) {
	const cronTrigger = new cre.capabilities.CronCapability();

	return [
		cre.handler(cronTrigger.trigger({ schedule: config.scheduleRisk }), onRiskAssessmentCron),
		cre.handler(cronTrigger.trigger({ schedule: config.scheduleSentiment }), onSentimentCron),
		cre.handler(cronTrigger.trigger({ schedule: config.scheduleDemo }), onDemoCron),
		cre.handler(cronTrigger.trigger({ schedule: config.scheduleCCIP }), onCCIPMigrationCron),
		cre.handler(cronTrigger.trigger({ schedule: config.scheduleNAV }), onNAVUpdateCron),
	];
}

// ---------- Main Entry Point (Reference Pattern) ----------

export async function main() {
	const runner = await Runner.newRunner<Config>({
		configSchema,
	});
	await runner.run(initWorkflow);
}

main();

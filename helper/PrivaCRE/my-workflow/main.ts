import {
	bytesToHex,
	ConsensusAggregationByFields,
	type CronPayload,
	cre,
	encodeCallMsg,
	getNetwork,
	type HTTPSendRequester,
	hexToBase64,
	LAST_FINALIZED_BLOCK_NUMBER,
	median,
	identical,
	Runner,
	type Runtime,
	TxStatus,
} from '@chainlink/cre-sdk'
import { type Address, decodeFunctionResult, encodeFunctionData, zeroAddress, keccak256, toBytes } from 'viem'
import { z } from 'zod'
import { randomBytes, createCipheriv, createDecipheriv } from 'crypto'

// ============================================================================
// Configuration Schema
// ============================================================================
const configSchema = z.object({
	schedule: z.string(),
	plaidBaseUrl: z.string().describe('Plaid API base URL for transaction fetching'),
	aiApiUrl: z.string().describe('Groq/OpenAI-compatible API endpoint'),
	aiModel: z.string().describe('AI model identifier (e.g., llama-3.3-70b-versatile)'),
	contractAddress: z.string().describe('CrestVault contract address on target chain'),
	privateVaultAddress: z.string().describe('PrivateVault contract address for confidential transactions'),
	chainSelectorName: z.string().describe('Chainlink chain selector (e.g., ethereum-testnet-sepolia)'),
	gasLimit: z.string(),
	minCreditScore: z.number(),
	maxCreditScore: z.number(),
	useConfidentialCompute: z.boolean().describe('Enable Chainlink Confidential Compute features'),
	encryptionEnabled: z.boolean().describe('Enable end-to-end encryption for sensitive data'),
})

type Config = z.infer<typeof configSchema>

// ============================================================================
// Type Definitions
// ============================================================================
interface PlaidTransactionsResponse {
	accounts: {
		account_id: string
		balances: { current: number; available: number }
		name: string
		type: string
	}[]
	added: {
		amount: number
		date: string
		category: string[]
		merchant_name?: string
	}[]
	total_transactions: number
}

interface SanitizedFeatures {
	averageBalance: number
	monthlyIncome: number
	monthlyExpenses: number
	debtToIncome: number
	transactionCount: number
	spendingVolatility: number
	accountAge: number
}

interface CreditAnalysis {
	score: number
	debtToIncomeRatio: number
	paymentConsistency: number
	balanceStability: number
	spendingVolatility: number
	recommendation: string
}

// ============================================================================
// ABI Definitions
// ============================================================================
const CrestVaultABI = [
	{
		inputs: [{ name: 'encodedData', type: 'bytes' }],
		name: 'receiveScore',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
] as const

const PrivateVaultABI = [
	{
		inputs: [
			{ name: 'user', type: 'address' },
			{ name: 'scoreCommitment', type: 'bytes32' },
			{ name: 'worldIdHash', type: 'bytes32' },
			{ name: 'encryptedScore', type: 'bytes' },
			{ name: 'proof', type: 'bytes' },
		],
		name: 'receivePrivateScore',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
] as const

// ============================================================================
// Utility Functions
// ============================================================================
const safeJsonStringify = (obj: any): string =>
	JSON.stringify(obj, (_, value) => (typeof value === 'bigint' ? value.toString() : value), 2)

/**
 * Encryption utilities for Confidential Compute
 * Uses AES-256-GCM for end-to-end encryption
 */
const encryptData = (data: string, key: Buffer): { encrypted: string; iv: string; tag: string } => {
	const iv = randomBytes(16)
	const cipher = createCipheriv('aes-256-gcm', key, iv)
	
	let encrypted = cipher.update(data, 'utf8', 'hex')
	encrypted += cipher.final('hex')
	const tag = cipher.getAuthTag().toString('hex')
	
	return {
		encrypted,
		iv: iv.toString('hex'),
		tag,
	}
}

const decryptData = (encrypted: string, key: Buffer, iv: string, tag: string): string => {
	const decipher = createDecipheriv('aes-256-gcm', key, Buffer.from(iv, 'hex'))
	decipher.setAuthTag(Buffer.from(tag, 'hex'))
	
	let decrypted = decipher.update(encrypted, 'hex', 'utf8')
	decrypted += decipher.final('utf8')
	
	return decrypted
}

/**
 * Create commitment (hash) for private data
 * Used for zero-knowledge proofs
 */
const createCommitment = (data: string, salt: string): string => {
	return keccak256(toBytes(data + salt))
}

/**
 * Generate zero-knowledge proof (simplified for hackathon)
 * Production would use zk-SNARKs (Groth16/PLONK)
 */
const generateZKProof = (commitment: string, secret: string): string => {
	// Simplified proof: hash(commitment + secret)
	// Production: Use circom/snarkjs for real ZK proofs
	return keccak256(toBytes(commitment + secret))
}

/**
 * Phase 1: Sanitize PII from bank data — strips names, addresses, account IDs.
 * Only financial "features" survive for AI analysis.
 */
const extractFeatures = (accounts: PlaidTransactionsResponse['accounts'], transactions: PlaidTransactionsResponse['added']): SanitizedFeatures => {
	const totalBalance = accounts.reduce((sum, a) => sum + (a.balances.current || 0), 0)
	const avgBalance = totalBalance / Math.max(accounts.length, 1)

	// Income = negative amounts in Plaid (money coming in)
	const income = transactions
		.filter(t => t.amount < 0)
		.reduce((sum, t) => sum + Math.abs(t.amount), 0)

	// Expenses = positive amounts in Plaid (money going out)
	const expenses = transactions
		.filter(t => t.amount > 0)
		.reduce((sum, t) => sum + t.amount, 0)

	// Monthly estimates (assuming 90 days of data)
	const monthlyIncome = income / 3
	const monthlyExpenses = expenses / 3

	// Spending volatility: standard deviation of daily spending
	const dailySpend: Record<string, number> = {}
	transactions.filter(t => t.amount > 0).forEach(t => {
		dailySpend[t.date] = (dailySpend[t.date] || 0) + t.amount
	})
	const days = Object.values(dailySpend)
	const meanSpend = days.reduce((a, b) => a + b, 0) / Math.max(days.length, 1)
	const variance = days.reduce((sum, d) => sum + Math.pow(d - meanSpend, 2), 0) / Math.max(days.length, 1)
	const spendingVolatility = Math.sqrt(variance)

	return {
		averageBalance: avgBalance,
		monthlyIncome,
		monthlyExpenses,
		debtToIncome: monthlyExpenses / Math.max(monthlyIncome, 1),
		transactionCount: transactions.length,
		spendingVolatility,
		accountAge: 12, // Placeholder — Plaid provides this via /accounts/get
	}
}

// ============================================================================
// Step 1: Fetch Bank Data via Plaid (Confidential HTTP)
// Uses runtime.getSecret to retrieve the access_token — never touches frontend.
// ============================================================================
const fetchPlaidTransactions = (
	sendRequester: HTTPSendRequester,
	config: Config,
	plaidClientId: string,
	plaidSecret: string,
	accessToken: string,
): PlaidTransactionsResponse => {
	// Calculate date range: last 90 days
	const endDate = new Date().toISOString().split('T')[0]
	const startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

	const response = sendRequester
		.sendRequest({
			method: 'POST',
			url: `${config.plaidBaseUrl}/transactions/sync`,
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				client_id: plaidClientId,
				secret: plaidSecret,
				access_token: accessToken,
			}),
		})
		.result()

	if (response.statusCode !== 200) {
		throw new Error(`Plaid API request failed with status: ${response.statusCode}`)
	}

	const responseText = Buffer.from(response.body).toString('utf-8')
	return JSON.parse(responseText) as PlaidTransactionsResponse
}

// ============================================================================
// Step 2: AI Risk Analysis via Groq (Confidential HTTP)
// ============================================================================
const analyzeCreditRisk = (
	sendRequester: HTTPSendRequester,
	config: Config,
	aiApiKey: string,
	features: SanitizedFeatures,
): CreditAnalysis => {
	const prompt = `You are a credit risk analyst for a DeFi lending protocol. Analyze the following SANITIZED financial features (no PII) and provide a credit score between ${config.minCreditScore} and ${config.maxCreditScore}.

Financial Features:
- Average Account Balance: $${features.averageBalance.toFixed(2)}
- Monthly Income: $${features.monthlyIncome.toFixed(2)}
- Monthly Expenses: $${features.monthlyExpenses.toFixed(2)}
- Debt-to-Income Ratio: ${(features.debtToIncome * 100).toFixed(1)}%
- Transaction Count (90 days): ${features.transactionCount}
- Spending Volatility (σ): $${features.spendingVolatility.toFixed(2)}
- Account Age: ${features.accountAge} months

Scoring Weights:
- Debt-to-Income Ratio: 40%
- Payment Consistency (inferred from transaction regularity): 30%
- Balance Stability: 20%
- Spending Volatility: 10%

Respond with ONLY valid JSON:
{
  "score": <number ${config.minCreditScore}-${config.maxCreditScore}>,
  "debtToIncomeRatio": <percentage>,
  "paymentConsistency": <0-100>,
  "balanceStability": <0-100>,
  "spendingVolatility": <0-100>,
  "recommendation": "<one-sentence recommendation>"
}`

	const response = sendRequester
		.sendRequest({
			method: 'POST',
			url: config.aiApiUrl,
			headers: {
				Authorization: `Bearer ${aiApiKey}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				model: config.aiModel,
				messages: [
					{
						role: 'system',
						content: 'You are a financial risk analyst for a DeFi protocol. Always respond with valid JSON only.',
					},
					{ role: 'user', content: prompt },
				],
				temperature: 0.3,
				response_format: { type: 'json_object' },
			}),
		})
		.result()

	if (response.statusCode !== 200) {
		throw new Error(`AI API request failed with status: ${response.statusCode}`)
	}

	const responseText = Buffer.from(response.body).toString('utf-8')
	const aiResponse = JSON.parse(responseText)
	const analysisText = aiResponse.choices[0].message.content
	return JSON.parse(analysisText) as CreditAnalysis
}

// ============================================================================
// Step 3A: Write Private Score (Confidential Compute Mode)
// Uses commitments and encryption to hide score on-chain
// ============================================================================
const writePrivateScoreOnChain = (
	runtime: Runtime<Config>,
	userAddress: string,
	creditScore: number,
	worldIdNullifier: string,
	justification: string,
	encryptionKey: Buffer,
): string => {
	const network = getNetwork({
		chainFamily: 'evm',
		chainSelectorName: runtime.config.chainSelectorName,
		isTestnet: runtime.config.chainSelectorName.includes('testnet'),
	})

	if (!network) {
		throw new Error(`Network not found: ${runtime.config.chainSelectorName}`)
	}

	const evmClient = new cre.capabilities.EVMClient(network.chainSelector.selector)

	runtime.log(`[Confidential Compute] Writing private score for ${userAddress}`)

	// Generate salt for commitment
	const salt = randomBytes(32).toString('hex')
	
	// Create commitment: hash(score + salt)
	const scoreCommitment = createCommitment(creditScore.toString(), salt)
	
	// Encrypt the actual score (only oracle can decrypt)
	const scoreData = JSON.stringify({
		score: creditScore,
		justification,
		salt,
		timestamp: Date.now(),
	})
	const encrypted = encryptData(scoreData, encryptionKey)
	const encryptedScore = Buffer.from(JSON.stringify(encrypted)).toString('hex')
	
	// Generate zero-knowledge proof
	const proof = generateZKProof(scoreCommitment, creditScore.toString())
	
	// Hash World ID nullifier
	const worldIdHash = keccak256(toBytes(worldIdNullifier))

	runtime.log(`[Privacy] Score commitment: ${scoreCommitment}`)
	runtime.log(`[Privacy] Encrypted score length: ${encryptedScore.length} bytes`)
	runtime.log(`[Privacy] ZK proof generated: ${proof.substring(0, 20)}...`)

	// ABI-encode for PrivateVault.receivePrivateScore
	const callData = encodeFunctionData({
		abi: PrivateVaultABI,
		functionName: 'receivePrivateScore',
		args: [
			userAddress as Address,
			scoreCommitment as `0x${string}`,
			worldIdHash as `0x${string}`,
			`0x${encryptedScore}` as `0x${string}`,
			proof as `0x${string}`,
		],
	})

	// Sign and submit via CRE consensus
	const reportResponse = runtime
		.report({
			encodedPayload: hexToBase64(callData),
			encoderName: 'evm',
			signingAlgo: 'ecdsa',
			hashingAlgo: 'keccak256',
		})
		.result()

	const resp = evmClient
		.writeReport(runtime, {
			receiver: runtime.config.privateVaultAddress,
			report: reportResponse,
			gasConfig: {
				gasLimit: runtime.config.gasLimit,
			},
		})
		.result()

	if (resp.txStatus !== TxStatus.SUCCESS) {
		throw new Error(`Private score write failed: ${resp.errorMessage || resp.txStatus}`)
	}

	const txHash = resp.txHash || new Uint8Array(32)
	runtime.log(`[Confidential Compute] Private score recorded. TX: ${bytesToHex(txHash)}`)
	runtime.log(`[Privacy] ✅ Score hidden on-chain via commitment`)
	
	return bytesToHex(txHash)
}

// ============================================================================
// Step 3B: Write Score On-Chain via CrestVault.receiveScore (Standard Mode)
// ABI-encodes: (address user, uint256 score, uint256 timestamp, bytes32 worldIdHash, string justification)
// ============================================================================
const writeScoreOnChain = (
	runtime: Runtime<Config>,
	userAddress: string,
	creditScore: number,
	worldIdNullifier: string,
	justification: string,
): string => {
	const network = getNetwork({
		chainFamily: 'evm',
		chainSelectorName: runtime.config.chainSelectorName,
		isTestnet: runtime.config.chainSelectorName.includes('testnet'),
	})

	if (!network) {
		throw new Error(`Network not found: ${runtime.config.chainSelectorName}`)
	}

	const evmClient = new cre.capabilities.EVMClient(network.chainSelector.selector)

	runtime.log(`Writing score ${creditScore} for ${userAddress} on-chain`)

	const timestamp = BigInt(Math.floor(Date.now() / 1000))

	// ABI-encode the score payload for receiveScore(bytes calldata encodedData)
	// Inner encoding: (address, uint256, uint256, bytes32, string)
	const { encodeAbiParameters, parseAbiParameters, keccak256, toBytes } = require('viem')

	const innerEncoded = encodeAbiParameters(
		parseAbiParameters('address, uint256, uint256, bytes32, string'),
		[
			userAddress as Address,
			BigInt(creditScore),
			timestamp,
			keccak256(toBytes(worldIdNullifier)),
			justification,
		],
	)

	// Outer encoding: receiveScore(bytes)
	const callData = encodeFunctionData({
		abi: CrestVaultABI,
		functionName: 'receiveScore',
		args: [innerEncoded],
	})

	// Sign and submit via CRE consensus
	const reportResponse = runtime
		.report({
			encodedPayload: hexToBase64(callData),
			encoderName: 'evm',
			signingAlgo: 'ecdsa',
			hashingAlgo: 'keccak256',
		})
		.result()

	const resp = evmClient
		.writeReport(runtime, {
			receiver: runtime.config.contractAddress,
			report: reportResponse,
			gasConfig: {
				gasLimit: runtime.config.gasLimit,
			},
		})
		.result()

	if (resp.txStatus !== TxStatus.SUCCESS) {
		throw new Error(`On-chain write failed: ${resp.errorMessage || resp.txStatus}`)
	}

	const txHash = resp.txHash || new Uint8Array(32)
	runtime.log(`Score recorded on-chain. TX: ${bytesToHex(txHash)}`)
	return bytesToHex(txHash)
}

// ============================================================================
// Main Workflow Logic
// ============================================================================
const processCreditScore = async (runtime: Runtime<Config>, userId: string): Promise<string> => {
	runtime.log(`[PrivaCRE] Starting credit score workflow for: ${userId}`)

	// Step 1: Retrieve secrets from CRE Secrets Manager (never in plaintext)
	runtime.log('[Phase 1] Retrieving secrets from CRE Secrets Manager...')
	const plaidClientId = await runtime.getSecret({ id: 'PLAID_CLIENT_ID' }).result()
	const plaidSecret = await runtime.getSecret({ id: 'PLAID_SECRET' }).result()
	const plaidAccessToken = await runtime.getSecret({ id: 'PLAID_ACCESS_TOKEN' }).result()
	const aiKey = await runtime.getSecret({ id: 'AI_API_KEY' }).result()
	const worldIdNullifier = await runtime.getSecret({ id: 'WORLD_ID_NULLIFIER' }).result()

	// Step 2: Fetch bank data via Plaid Confidential HTTP
	runtime.log('[Phase 1] Fetching bank data via Plaid Confidential HTTP...')
	const httpClient = new cre.capabilities.HTTPClient()

	const plaidData = httpClient
		.sendRequest(
			runtime,
			(sendRequester, config) =>
				fetchPlaidTransactions(
					sendRequester,
					config as Config,
					plaidClientId.value,
					plaidSecret.value,
					plaidAccessToken.value,
				),
			ConsensusAggregationByFields<PlaidTransactionsResponse>({
				accounts: identical,
				added: identical,
				total_transactions: median,
			}),
		)(runtime.config)
		.result()

	runtime.log(`[Phase 1] Plaid data retrieved: ${plaidData.added.length} transactions, ${plaidData.accounts.length} accounts`)

	// Step 3: Sanitize — strip PII, extract features only
	runtime.log('[Phase 2] Sanitizing PII and extracting financial features...')
	const features = extractFeatures(plaidData.accounts, plaidData.added)
	runtime.log(`[Phase 2] Features: DTI=${(features.debtToIncome * 100).toFixed(1)}%, Balance=$${features.averageBalance.toFixed(0)}, Volatility=$${features.spendingVolatility.toFixed(0)}`)

	// Step 4: AI Risk Analysis via Groq (Confidential HTTP)
	runtime.log('[Phase 2] Sending sanitized features to AI Risk Agent...')
	const creditAnalysis = httpClient
		.sendRequest(
			runtime,
			(sendRequester, config) =>
				analyzeCreditRisk(sendRequester, config as Config, aiKey.value, features),
			ConsensusAggregationByFields<CreditAnalysis>({
				score: median,
				debtToIncomeRatio: median,
				paymentConsistency: median,
				balanceStability: median,
				spendingVolatility: median,
				recommendation: identical,
			}),
		)(runtime.config)
		.result()

	runtime.log(`[Phase 2] AI Consensus Score: ${creditAnalysis.score}/100 — "${creditAnalysis.recommendation}"`)

	// Step 5: Write to blockchain with World ID attached
	runtime.log('[Phase 3] Writing consensus score to CrestVault on-chain...')
	const txHash = writeScoreOnChain(
		runtime,
		userId,
		creditAnalysis.score,
		worldIdNullifier.value,
		creditAnalysis.recommendation,
	)

	runtime.log(`[Phase 3] ✅ Workflow complete. TX: ${txHash}`)
	return txHash
}

// ============================================================================
// Cron Trigger Handler
// ============================================================================
const onCronTrigger = async (runtime: Runtime<Config>, payload: CronPayload): Promise<string> => {
	if (!payload.scheduledExecutionTime) {
		throw new Error('Scheduled execution time is required')
	}

	runtime.log('[PrivaCRE] Credit Score Workflow triggered by Cron')

	// In production, this would iterate over registered users
	const userId = '0x1234567890123456789012345678901234567890'
	return await processCreditScore(runtime, userId)
}

// ============================================================================
// Workflow Initialization
// ============================================================================
const initWorkflow = (config: Config) => {
	const cronTrigger = new cre.capabilities.CronCapability()

	return [
		cre.handler(
			cronTrigger.trigger({
				schedule: config.schedule,
			}),
			onCronTrigger,
		),
	]
}

// ============================================================================
// Main Entry Point
// ============================================================================
export async function main() {
	const runner = await Runner.newRunner<Config>({
		configSchema,
	})
	await runner.run(initWorkflow)
}

main()

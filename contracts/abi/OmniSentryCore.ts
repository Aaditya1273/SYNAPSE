export const OmniSentryCore = [
	{
		inputs: [
			{ internalType: 'enum OmniSentryCore.RiskLevel', name: '_level', type: 'uint8' },
			{ internalType: 'uint256', name: '_score', type: 'uint256' },
			{ internalType: 'string', name: '_reason', type: 'string' },
		],
		name: 'updateRiskState',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'paused',
		outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'globalRiskState',
		outputs: [
			{ internalType: 'enum OmniSentryCore.RiskLevel', name: 'currentLevel', type: 'uint8' },
			{ internalType: 'uint256', name: 'riskScore', type: 'uint256' },
			{ internalType: 'uint256', name: 'lastUpdated', type: 'uint256' },
			{ internalType: 'string', name: 'reason', type: 'string' },
		],
		stateMutability: 'view',
		type: 'function',
	},
] as const;

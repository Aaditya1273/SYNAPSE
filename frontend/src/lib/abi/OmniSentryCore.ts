export const OmniSentryCore = [
	{
		inputs: [],
		name: 'EnforcedPause',
		type: 'error',
	},
	{
		inputs: [],
		name: 'ExpectedPause',
		type: 'error',
	},
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
		inputs: [
			{ internalType: 'enum OmniSentryCore.RiskLevel', name: '_level', type: 'uint8' },
			{ internalType: 'uint256', name: '_score', type: 'uint256' },
			{ internalType: 'string', name: '_reason', type: 'string' },
		],
		name: 'manualOverride',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		anonymous: false,
		inputs: [
			{ indexed: false, internalType: 'uint8', name: 'level', type: 'uint8' },
			{ indexed: false, internalType: 'uint256', name: 'score', type: 'uint256' },
			{ indexed: false, internalType: 'string', name: 'reason', type: 'string' },
		],
		name: 'ManualOverride',
		type: 'event',
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

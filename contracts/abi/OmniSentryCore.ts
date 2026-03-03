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
] as const;

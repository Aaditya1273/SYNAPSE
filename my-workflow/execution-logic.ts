import {
    cre,
    getNetwork,
    type Runtime,
    type CronPayload,
    EVMClient,
    encodeCallMsg,
} from '@chainlink/cre-sdk';
import { parseAbi, decodeFunctionResult } from 'viem';

/**
 * CCIP Migration Handler
 */
/**
 * CCIP Migration Handler
 */
export async function onCCIPMigrationCron(runtime: Runtime<any>, _payload: CronPayload): Promise<string> {
    runtime.log("[CCIP] Checking on-chain risk status for migration pulse...");

    const evmClient = new EVMClient();
    const abi = parseAbi(["function riskScore() view returns (uint256)"]);

    const response = await evmClient.callContract(runtime, {
        chainName: runtime.config.chainName,
        to: runtime.config.omniSentryCoreAddress,
        data: encodeCallMsg({
            abi,
            functionName: "riskScore",
            args: [],
        }),
    }).result();

    const currentRiskScore = decodeFunctionResult({
        abi,
        functionName: "riskScore",
        data: response.data,
    });

    runtime.log(`[CCIP] Current On-Chain Risk Score: ${currentRiskScore}`);
    const isCritical = (currentRiskScore as bigint) > BigInt(runtime.config.riskThreshold || 70);

    if (isCritical) {
        runtime.log("[CCIP] CRITICAL RISK DETECTED. Initiating autonomous asset migration...");
        return JSON.stringify({ status: "CCIP_MIGRATION_STARTED", riskScore: currentRiskScore.toString() });
    }
    return JSON.stringify({ status: "CCIP_SAFE", riskScore: currentRiskScore.toString() });
}

/**
 * NAV Update Handler
 */
export async function onNAVUpdateCron(runtime: Runtime<any>, _payload: CronPayload): Promise<string> {
    runtime.log("[NAV] Fetching Real-Time Net Asset Value from Treasury...");

    const evmClient = new EVMClient();
    const abi = parseAbi(["function totalSupply() view returns (uint256)"]);

    const response = await evmClient.callContract(runtime, {
        chainName: runtime.config.chainName,
        to: runtime.config.tokenizedTreasuryAddress,
        data: encodeCallMsg({
            abi,
            functionName: "totalSupply",
            args: [],
        }),
    }).result();

    const count = decodeFunctionResult({
        abi,
        functionName: "totalSupply",
        data: response.data,
    });

    const nav = Number(count) / 1e18;
    runtime.log(`[NAV] Real-Time NAV Calculation: ${nav}`);

    return JSON.stringify({ status: "NAV_UPDATED", nav });
}

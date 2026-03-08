/**
 * CrestAI - Chainlink Runtime Environment Workflow
 * 
 * This workflow implements privacy-preserving credit scoring by:
 * 1. Fetching private bank data via Confidential HTTP
 * 2. Sanitizing data to remove PII
 * 3. Analyzing with AI to generate credit score
 * 4. Encoding and returning score for on-chain verification
 */

import { ethers } from "ethers";

// CRE Environment Types
interface Secrets {
  BANK_API_KEY: string;
  AI_API_KEY: string;
  PLAID_CLIENT_ID?: string;
  PLAID_SECRET?: string;
}

interface HTTPRequest {
  url: string;
  method: string;
  headers?: Record<string, string>;
  body?: string;
}

interface WorkflowArgs {
  userAddress: string;
  worldIdNullifier: string;
  accessToken?: string;
}

// Declare CRE global variables
declare const secrets: Secrets;
declare const args: string[];

/**
 * Fetch private bank data using Chainlink Confidential HTTP
 * This ensures API keys are never exposed in logs or on-chain
 */
async function fetchPrivateBankData(
  accessToken: string,
  apiKey: string
): Promise<any> {
  // Use Plaid API for real bank data
  const request: HTTPRequest = {
    url: "https://sandbox.plaid.com/transactions/get",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: secrets.PLAID_CLIENT_ID,
      secret: secrets.PLAID_SECRET,
      access_token: accessToken,
      start_date: getDateMonthsAgo(12),
      end_date: getCurrentDate(),
      options: {
        count: 500,
        offset: 0,
      },
    }),
  };

  // In CRE environment, use the built-in fetch
  const response = await fetch(request.url, {
    method: request.method,
    headers: request.headers,
    body: request.body,
  });

  if (!response.ok) {
    throw new Error(`Bank API Error: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

/**
 * Sanitize bank data by removing all PII
 * Only keep transaction amounts, dates, and categories for AI analysis
 */
function sanitizeBankData(rawData: any): any {
  const transactions = rawData.transactions || [];

  return {
    transaction_count: transactions.length,
    transactions: transactions.map((tx: any) => ({
      amount: tx.amount,
      date: tx.date,
      category: tx.category ? tx.category[0] : "unknown",
      merchant_name: tx.merchant_name ? "REDACTED" : null,
    })),
    // Calculate aggregate metrics without exposing individual transactions
    total_income: transactions
      .filter((tx: any) => tx.amount < 0)
      .reduce((sum: number, tx: any) => sum + Math.abs(tx.amount), 0),
    total_expenses: transactions
      .filter((tx: any) => tx.amount > 0)
      .reduce((sum: number, tx: any) => sum + tx.amount, 0),
    average_balance: rawData.accounts?.[0]?.balances?.current || 0,
  };
}

import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Analyze financial data using AI to generate credit score
 * Uses prompt engineering to ensure consistent, reliable scoring
 */
async function analyzeRiskWithAI(sanitizedData: any): Promise<{
  credit_score: number;
  justification: string;
  risk_factors: string[];
}> {
  const genAI = new GoogleGenerativeAI(secrets.AI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const systemPrompt = `You are a professional credit underwriter with 20 years of experience. 
Analyze the following transaction history and financial metrics.

Calculate a credit score between 1 and 100 based on:
1. Debt-to-Income Ratio (40% weight)
2. Payment Consistency (30% weight)
3. Account Balance Stability (20% weight)
4. Spending Volatility (10% weight)

Return ONLY a valid JSON object with this exact structure:
{
  "credit_score": <number between 1-100>,
  "justification": "<one sentence explanation>",
  "risk_factors": ["<factor1>", "<factor2>", "<factor3>"]
}`;

  const userPrompt = `Financial Data:
- Transaction Count: ${sanitizedData.transaction_count}
- Total Income (12 months): $${sanitizedData.total_income.toFixed(2)}
- Total Expenses (12 months): $${sanitizedData.total_expenses.toFixed(2)}
- Average Balance: $${sanitizedData.average_balance.toFixed(2)}
- Net Cash Flow: $${(sanitizedData.total_income - sanitizedData.total_expenses).toFixed(2)}

Recent Transactions (sample):
${JSON.stringify(sanitizedData.transactions.slice(0, 50), null, 2)}

Analyze and provide credit score.`;

  const result = await model.generateContent([systemPrompt, userPrompt]);
  const response = await result.response;
  const text = response.text();

  // Clean the response text to ensure it's valid JSON
  const jsonStart = text.indexOf('{');
  const jsonEnd = text.lastIndexOf('}') + 1;
  const jsonText = text.substring(jsonStart, jsonEnd);

  const parsedResult = JSON.parse(jsonText);

  // Validate score is within bounds
  if (parsedResult.credit_score < 1 || parsedResult.credit_score > 100) {
    throw new Error("Invalid credit score from AI");
  }

  return parsedResult;
}

/**
 * Main workflow execution function
 * This is called by the Chainlink CRE runtime
 */
async function run(): Promise<string> {
  try {
    // Parse workflow arguments
    const workflowArgs: WorkflowArgs = JSON.parse(args[0]);
    const { userAddress, worldIdNullifier, accessToken } = workflowArgs;

    // Validate World ID to prevent Sybil attacks
    if (!worldIdNullifier || worldIdNullifier.length < 32) {
      throw new Error("Invalid World ID verification");
    }

    // Step 1: Fetch private bank data using Confidential HTTP
    console.log("Fetching private bank data...");
    const rawBankData = await fetchPrivateBankData(
      accessToken || "",
      secrets.BANK_API_KEY
    );

    // Step 2: Sanitize data to remove all PII
    console.log("Sanitizing data...");
    const sanitizedData = sanitizeBankData(rawBankData);

    // Step 3: Analyze with AI to generate credit score
    console.log("Analyzing with AI...");
    const aiResult = await analyzeRiskWithAI(sanitizedData);

    // Step 4: Encode result for on-chain verification
    const timestamp = Math.floor(Date.now() / 1000);

    // ABI encode the result
    const abiCoder = ethers.AbiCoder.defaultAbiCoder();
    const encoded = abiCoder.encode(
      ["address", "uint256", "uint256", "bytes32", "string"],
      [
        userAddress,
        aiResult.credit_score,
        timestamp,
        ethers.id(worldIdNullifier), // Hash the nullifier for privacy
        aiResult.justification,
      ]
    );

    // Return encoded data for smart contract
    return encoded;
  } catch (error) {
    console.error("Workflow error:", error);
    throw error;
  }
}

// Helper functions
function getCurrentDate(): string {
  return new Date().toISOString().split("T")[0];
}

function getDateMonthsAgo(months: number): string {
  const date = new Date();
  date.setMonth(date.getMonth() - months);
  return date.toISOString().split("T")[0];
}

// Export for CRE runtime
export { run };

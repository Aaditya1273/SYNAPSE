/**
 * Simulation script for CRE workflow
 * This simulates the entire credit scoring flow locally
 */

const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
require('dotenv').config();

// Mock bank data helper for dynamic scores
function getMockBankData() {
  const randomMultiplier = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
  return {
    accounts: [
      {
        account_id: "mock_account_1",
        balances: {
          current: 5420.50 * randomMultiplier,
          available: 5420.50 * randomMultiplier,
        },
      },
    ],
    transactions: [
      { amount: -3500.00 * randomMultiplier, date: "2024-01-15", category: ["Income", "Payroll"] },
      { amount: 1200.00 * (1 + (Math.random() - 0.5) * 0.2), date: "2024-01-16", category: ["Transfer", "Rent"] },
      { amount: 85.50 * (1 + (Math.random() - 0.5) * 0.5), date: "2024-01-17", category: ["Food and Drink", "Restaurants"] },
      { amount: -3500.00 * randomMultiplier, date: "2024-02-15", category: ["Income", "Payroll"] },
      { amount: 1200.00 * (1 + (Math.random() - 0.5) * 0.2), date: "2024-02-16", category: ["Transfer", "Rent"] },
      { amount: 92.30 * (1 + (Math.random() - 0.5) * 0.5), date: "2024-02-18", category: ["Food and Drink", "Groceries"] },
    ],
  };
}

/**
 * NEW: REAL BANK DATA FETCHING (PLAID)
 * This will attempt to fetch real data if configured
 */
async function getRealBankData() {
  const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');
  const yaml = require('yaml');

  // Try to get access token from secrets.yaml (where Plaid Link stores it)
  let accessToken = process.env.PLAID_ACCESS_TOKEN;
  
  if (!accessToken) {
    try {
      const secretsPath = path.join(__dirname, '../PrivaCRE/secrets.yaml');
      if (fs.existsSync(secretsPath)) {
        const secretsContent = fs.readFileSync(secretsPath, 'utf8');
        const secrets = yaml.parse(secretsContent);
        
        // Find the most recent BANK_ACCESS_TOKEN
        const tokenKeys = Object.keys(secrets).filter(k => k.startsWith('BANK_ACCESS_TOKEN_'));
        if (tokenKeys.length > 0) {
          // Use the last one (most recent)
          accessToken = secrets[tokenKeys[tokenKeys.length - 1]];
          console.log(`✅ Found Plaid access token in secrets.yaml: ${tokenKeys[tokenKeys.length - 1]}`);
        }
      }
    } catch (err) {
      console.log('⚠️ Could not read secrets.yaml:', err.message);
    }
  }

  if (!process.env.PLAID_CLIENT_ID || !process.env.PLAID_SECRET || !accessToken) {
    console.log("⚠️ Plaid credentials missing. Falling back to Mock Data.");
    console.log("   To use real data: Connect a bank via /bridge page");
    return null;
  }

  const configuration = new Configuration({
    basePath: PlaidEnvironments[process.env.PLAID_ENV || 'sandbox'],
    baseOptions: {
      headers: {
        'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
        'PLAID-SECRET': process.env.PLAID_SECRET,
      },
    },
  });

  const client = new PlaidApi(configuration);

  try {
    console.log("🔗 Fetching REAL data from Plaid...");
    const response = await client.transactionsSync({
      access_token: accessToken,
    });

    console.log(`✅ Retrieved ${response.data.added.length} transactions from Plaid`);
    
    return {
      accounts: response.data.accounts,
      transactions: response.data.added.map(tx => ({
        amount: tx.amount,
        date: tx.date,
        category: tx.category || []
      })),
      dataSource: 'Plaid API'
    };
  } catch (error) {
    console.error("❌ Plaid Sync Failed:", error.response ? error.response.data : error.message);
    console.log("   Falling back to Mock Data");
    return null;
  }
}

async function simulateWorkflow(address) {
  console.log("🚀 Starting CRE Workflow Simulation\n");

  // Attempt real data, fallback to mock
  let bankData = await getRealBankData();
  const dataSource = bankData?.dataSource || 'Mock Simulation';
  const isReal = !!bankData && bankData.dataSource === 'Plaid API';
  
  if (!bankData) {
    bankData = getMockBankData();
    bankData.dataSource = 'Mock Simulation';
  }

  const workflowArgs = {
    userAddress: address || "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    worldIdNullifier: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    accessToken: isReal ? "real_plaid_token_from_secrets" : "mock_access_token",
  };

  console.log("📋 Workflow Arguments:", JSON.stringify(workflowArgs, null, 2));

  // Sanitize data
  const totalIncome = bankData.transactions
    .filter((tx) => tx.amount < 0)
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
  const totalExpenses = bankData.transactions
    .filter((tx) => tx.amount > 0)
    .reduce((sum, tx) => sum + tx.amount, 0);

  const currentBalance = bankData.accounts[0].balances.current;

  // AI Analysis with Groq
  const groqApiKey = process.env.GROQ_API_KEY || process.env.AI_API_KEY_LOCAL;
  if (!groqApiKey) {
    throw new Error("GROQ_API_KEY not found in environment variables");
  }
  const systemPrompt = `You are a professional credit underwriter. Analyze the input and return ONLY a raw JSON object with: "credit_score" (number from 1-100), "justification" (string, 1 sentence summary), and "risk_factors" (array of strings, max 3). 
  Be extremely precise and vary the score based on the exact balance and income provided. Small changes in data should result in small changes in score.`;
  const userPrompt = `Data (Case ID ${Math.floor(Math.random() * 1000)}): Income $${totalIncome.toFixed(2)}, Expenses $${totalExpenses.toFixed(2)}, Balance $${currentBalance.toFixed(2)}`;

  console.log("🤖 Analyzing with Groq AI (llama-3.3-70b-versatile)...");

  let aiResponse = null;
  try {
    const fetchFn = typeof fetch !== 'undefined' ? fetch : globalThis.fetch;
    if (!fetchFn) throw new Error("fetch is not defined in this environment");

    const response = await fetchFn("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${groqApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" }
      })
    });

    const data = await response.json();
    if (data.error) {
      console.error("❌ Groq API Error:", JSON.stringify(data.error, null, 2));
      throw new Error(`Groq API Error: ${data.error.message || "Unknown error"}`);
    }

    aiResponse = JSON.parse(data.choices[0].message.content);

    // Add small jitter for dynamic feedback as requested
    const jitter = Math.floor(Math.random() * 7) - 3; // -3 to +3
    aiResponse.credit_score = Math.min(100, Math.max(1, aiResponse.credit_score + jitter));

    console.log("✅ Groq AI analysis complete (with dynamic jitter)");
  } catch (error) {
    console.error("❌ AI Analysis failed:", error.message);
    throw error;
  }

  console.log(`   - Credit Score: ${aiResponse.credit_score}/100`);
  console.log(`   - Justification: ${aiResponse.justification}`);

  const timestamp = Math.floor(Date.now() / 1000);
  const checksummedAddress = ethers.getAddress(workflowArgs.userAddress);
  const abiCoder = ethers.AbiCoder.defaultAbiCoder();

  const encoded = abiCoder.encode(
    ["address", "uint256", "uint256", "bytes32", "string"],
    [
      checksummedAddress,
      aiResponse.credit_score,
      timestamp,
      ethers.id(workflowArgs.worldIdNullifier),
      aiResponse.justification,
    ]
  );

  const results = {
    workflowArgs,
    bankDataSummary: {
      transactionCount: bankData.transactions.length,
      totalIncome,
      totalExpenses,
      netCashFlow: totalIncome - totalExpenses,
      averageBalance: currentBalance,
      dataSource: dataSource,
      transactionCount: bankData.transactions.length,
    },
    aiResult: aiResponse,
    encodedData: encoded,
    timestamp,
    isRealData: isReal
  };

  fs.writeFileSync(
    path.join(__dirname, "../simulation-results.json"),
    JSON.stringify(results, null, 2)
  );

  return results;
}

if (require.main === module) {
  simulateWorkflow()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("❌ Simulation failed:", error);
      process.exit(1);
    });
}

module.exports = { simulateWorkflow };

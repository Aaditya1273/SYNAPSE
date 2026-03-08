import { NextResponse } from 'next/server';
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
    },
  },
});

const plaidClient = new PlaidApi(configuration);

export async function POST(request: Request) {
  try {
    const { public_token, institution_name } = await request.json();

    if (!public_token) {
      return NextResponse.json(
        { error: 'Missing public_token' },
        { status: 400 }
      );
    }

    // Step 1: Exchange public token for access token
    const exchangeResponse = await plaidClient.itemPublicTokenExchange({
      public_token,
    });

    const accessToken = exchangeResponse.data.access_token;
    const itemId = exchangeResponse.data.item_id;

    console.log('✅ Access token obtained:', itemId);

    // Step 2: Register secret with Chainlink CRE
    try {
      // Use the CRE CLI to encrypt and register the secret
      const secretName = `BANK_ACCESS_TOKEN_${itemId}`;
      const creCommand = `cd PrivaCRE && npx @chainlink/cre-cli secrets:register ${secretName} "${accessToken}"`;
      
      const { stdout, stderr } = await execAsync(creCommand);
      
      if (stderr && !stderr.includes('success')) {
        console.error('CRE registration warning:', stderr);
      }

      console.log('✅ Secret registered with CRE:', secretName);

      // Step 3: Store metadata (NOT the access token) in your database
      // For now, we'll return success
      return NextResponse.json({
        success: true,
        item_id: itemId,
        institution: institution_name,
        secret_name: secretName,
        message: 'Bank connection secured via Chainlink CRE',
      });
    } catch (creError: any) {
      console.error('CRE registration failed:', creError);
      
      // Fallback: Store in secrets.yaml for development
      const fs = require('fs');
      const yaml = require('yaml');
      
      try {
        const secretsPath = './PrivaCRE/secrets.yaml';
        let secrets: any = {};
        
        if (fs.existsSync(secretsPath)) {
          const secretsContent = fs.readFileSync(secretsPath, 'utf8');
          secrets = yaml.parse(secretsContent) || {};
        }
        
        secrets[`BANK_ACCESS_TOKEN_${itemId}`] = accessToken;
        fs.writeFileSync(secretsPath, yaml.stringify(secrets));
        
        console.log('✅ Secret stored in secrets.yaml (development mode)');
        
        return NextResponse.json({
          success: true,
          item_id: itemId,
          institution: institution_name,
          secret_name: `BANK_ACCESS_TOKEN_${itemId}`,
          message: 'Bank connection secured (development mode)',
          dev_mode: true,
        });
      } catch (yamlError) {
        console.error('Failed to store secret:', yamlError);
        throw yamlError;
      }
    }
  } catch (error: any) {
    console.error('Token exchange error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to exchange token', 
        details: error.response?.data || error.message 
      },
      { status: 500 }
    );
  }
}

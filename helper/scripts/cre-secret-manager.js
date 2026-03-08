/**
 * CRE Secret Manager Helper
 * 
 * This script manages secrets for Chainlink CRE workflows.
 * It uses the actual CRE CLI to register secrets with the DON.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const yaml = require('yaml');
const path = require('path');

const CRE_WORKFLOW_DIR = path.join(__dirname, '../PrivaCRE/my-workflow');
const SECRETS_FILE = path.join(__dirname, '../PrivaCRE/secrets.yaml');

/**
 * Register a secret with CRE Secrets Manager
 * @param {string} secretName - Name of the secret
 * @param {string} secretValue - Value of the secret
 * @returns {Promise<{success: boolean, method: string, message: string}>}
 */
async function registerSecret(secretName, secretValue) {
  console.log(`🔐 Registering secret: ${secretName}`);
  
  try {
    // Method 1: Store in secrets.yaml (required for CRE CLI)
    // CRE CLI reads secrets from secrets.yaml file
    await storeInSecretsFile(secretName, secretValue);
    
    // Method 2: Try using CRE CLI to sync with DON (if configured)
    try {
      console.log('   Attempting CRE CLI sync...');
      
      // Check if CRE is logged in and configured
      const loginCheck = execSync('cre account info 2>&1', { 
        stdio: 'pipe',
        encoding: 'utf-8',
        timeout: 5000
      });
      
      if (loginCheck.includes('not logged in') || loginCheck.includes('error')) {
        console.log('⚠️  CRE CLI not logged in. Secrets stored locally.');
        console.log('   To sync with DON, run: cre login');
        
        return {
          success: true,
          method: 'secrets-file',
          message: 'Secret stored in secrets.yaml (run "cre login" to sync with DON)'
        };
      }
      
      // If logged in, try to create/update secrets
      const result = execSync(
        `cd ${CRE_WORKFLOW_DIR} && cre secrets create ../secrets.yaml`,
        { 
          stdio: 'pipe',
          encoding: 'utf-8',
          timeout: 10000
        }
      );
      
      console.log('✅ Secret synced with CRE DON');
      console.log('   CRE CLI output:', result.trim().substring(0, 100) + '...');
      
      return {
        success: true,
        method: 'cre-cli',
        message: 'Secret registered with CRE Secrets Manager and synced with DON'
      };
    } catch (creError) {
      console.log('⚠️  CRE CLI sync not available:', creError.message.substring(0, 100));
      console.log('   Secret stored locally in secrets.yaml');
      
      return {
        success: true,
        method: 'secrets-file',
        message: 'Secret stored in secrets.yaml (CRE CLI sync not configured)'
      };
    }
  } catch (error) {
    console.error('❌ Failed to register secret:', error);
    throw error;
  }
}

/**
 * Store secret in secrets.yaml file
 * @param {string} secretName - Name of the secret
 * @param {string} secretValue - Value of the secret
 */
async function storeInSecretsFile(secretName, secretValue) {
  try {
    let secrets = {};
    
    // Read existing secrets
    if (fs.existsSync(SECRETS_FILE)) {
      const secretsContent = fs.readFileSync(SECRETS_FILE, 'utf8');
      secrets = yaml.parse(secretsContent) || {};
    }
    
    // Add new secret
    secrets[secretName] = secretValue;
    
    // Write back to file
    fs.writeFileSync(SECRETS_FILE, yaml.stringify(secrets));
    
    console.log('✅ Secret stored in secrets.yaml');
  } catch (error) {
    console.error('❌ Failed to store in secrets.yaml:', error);
    throw error;
  }
}

/**
 * Get a secret value
 * @param {string} secretName - Name of the secret
 * @returns {Promise<string|null>}
 */
async function getSecret(secretName) {
  try {
    // Try CRE CLI first
    try {
      const result = execSync(
        `cd ${CRE_WORKFLOW_DIR} && cre secrets get ${secretName}`,
        { 
          stdio: 'pipe',
          encoding: 'utf-8',
          timeout: 5000
        }
      );
      return result.trim();
    } catch (creError) {
      // Fallback to secrets.yaml
      if (fs.existsSync(SECRETS_FILE)) {
        const secretsContent = fs.readFileSync(SECRETS_FILE, 'utf8');
        const secrets = yaml.parse(secretsContent) || {};
        return secrets[secretName] || null;
      }
      return null;
    }
  } catch (error) {
    console.error('❌ Failed to get secret:', error);
    return null;
  }
}

/**
 * List all secrets
 * @returns {Promise<string[]>}
 */
async function listSecrets() {
  try {
    // Try CRE CLI first
    try {
      const result = execSync(
        `cd ${CRE_WORKFLOW_DIR} && cre secrets list`,
        { 
          stdio: 'pipe',
          encoding: 'utf-8',
          timeout: 5000
        }
      );
      return result.trim().split('\n').filter(Boolean);
    } catch (creError) {
      // Fallback to secrets.yaml
      if (fs.existsSync(SECRETS_FILE)) {
        const secretsContent = fs.readFileSync(SECRETS_FILE, 'utf8');
        const secrets = yaml.parse(secretsContent) || {};
        return Object.keys(secrets);
      }
      return [];
    }
  } catch (error) {
    console.error('❌ Failed to list secrets:', error);
    return [];
  }
}

/**
 * Check if CRE CLI is available
 * @returns {boolean}
 */
function isCRECLIAvailable() {
  try {
    execSync('which cre', { stdio: 'pipe' });
    return true;
  } catch (error) {
    return false;
  }
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];
  
  (async () => {
    try {
      switch (command) {
        case 'set':
        case 'register':
          if (args.length < 3) {
            console.error('Usage: node cre-secret-manager.js set <name> <value>');
            process.exit(1);
          }
          const result = await registerSecret(args[1], args[2]);
          console.log(JSON.stringify(result, null, 2));
          break;
          
        case 'get':
          if (args.length < 2) {
            console.error('Usage: node cre-secret-manager.js get <name>');
            process.exit(1);
          }
          const value = await getSecret(args[1]);
          console.log(value || 'Secret not found');
          break;
          
        case 'list':
          const secrets = await listSecrets();
          console.log('Registered secrets:');
          secrets.forEach(s => console.log(`  - ${s}`));
          break;
          
        case 'check':
          const available = isCRECLIAvailable();
          console.log(`CRE CLI available: ${available ? 'YES ✅' : 'NO ❌'}`);
          break;
          
        default:
          console.log('CRE Secret Manager');
          console.log('');
          console.log('Commands:');
          console.log('  set <name> <value>  - Register a secret');
          console.log('  get <name>          - Get a secret value');
          console.log('  list                - List all secrets');
          console.log('  check               - Check if CRE CLI is available');
          break;
      }
    } catch (error) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  })();
}

module.exports = {
  registerSecret,
  getSecret,
  listSecrets,
  isCRECLIAvailable
};

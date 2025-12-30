import { createPublicClient, createWalletClient, http, parseAbi, getContract } from "viem";
import { sepolia } from "viem/chains";

/**
 * Contract Service for interacting with Omni-Shield smart contracts
 */
export class ContractService {
  private publicClient;
  private walletClient;

  // Contract addresses (would be deployed contracts)
  private readonly EMERGENCY_VAULT_ADDRESS = "0x1234567890123456789012345678901234567890";
  private readonly APPROVAL_MANAGER_ADDRESS = "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd";

  // Contract ABIs
  private readonly EMERGENCY_VAULT_ABI = parseAbi([
    'function emergencyDeposit(address user, address token, uint256 amount) payable',
    'function withdraw(uint256 depositId)',
    'function getUserDepositCount(address user) view returns (uint256)',
    'function getUserDeposit(address user, uint256 depositId) view returns (tuple(address token, uint256 amount, uint256 timestamp, bool withdrawn))',
    'function canWithdraw(address user, uint256 depositId) view returns (bool)',
    'function authorizeAgent(address agent)',
    'event EmergencyDeposit(address indexed user, address indexed token, uint256 amount, uint256 depositId)'
  ]);

  private readonly APPROVAL_MANAGER_ABI = parseAbi([
    'function revokeApproval(address token, address spender) returns (bool)',
    'function batchRevokeApprovals(address[] tokens, address[] spenders) returns (tuple(address token, address spender, bool success)[])',
    'function revokeTokenApprovals(address token, address[] spenders) returns (uint256)',
    'function getAllowance(address token, address owner, address spender) view returns (uint256)',
    'function getBatchAllowances(address[] tokens, address owner, address[] spenders) view returns (uint256[])',
    'event BatchRevocation(address indexed user, uint256 totalRevocations, uint256 successfulRevocations)'
  ]);

  private readonly ERC20_ABI = parseAbi([
    'function approve(address spender, uint256 amount) returns (bool)',
    'function allowance(address owner, address spender) view returns (uint256)',
    'function transfer(address to, uint256 amount) returns (bool)',
    'function balanceOf(address account) view returns (uint256)',
    'function name() view returns (string)',
    'function symbol() view returns (string)',
    'function decimals() view returns (uint8)'
  ]);

  constructor() {
    this.publicClient = createPublicClient({
      chain: sepolia,
      transport: http(process.env.NEXT_PUBLIC_RPC_URL)
    });

    // Wallet client would be initialized with user's wallet
    this.walletClient = createWalletClient({
      chain: sepolia,
      transport: http(process.env.NEXT_PUBLIC_RPC_URL)
    });
  }

  /**
   * Emergency Vault Functions
   */

  async emergencyDepositETH(userAddress: string, amount: bigint, agentAddress: string) {
    try {
      const contract = getContract({
        address: this.EMERGENCY_VAULT_ADDRESS as `0x${string}`,
        abi: this.EMERGENCY_VAULT_ABI,
        client: this.walletClient
      });

      const hash = await contract.write.emergencyDeposit([
        userAddress as `0x${string}`,
        "0x0000000000000000000000000000000000000000" as `0x${string}`, // ETH
        amount
      ], {
        value: amount,
        account: agentAddress as `0x${string}`
      });

      return hash;
    } catch (error) {
      console.error("Error depositing ETH to emergency vault:", error);
      throw error;
    }
  }

  async emergencyDepositToken(
    userAddress: string, 
    tokenAddress: string, 
    amount: bigint, 
    agentAddress: string
  ) {
    try {
      // First approve the vault to spend tokens
      const tokenContract = getContract({
        address: tokenAddress as `0x${string}`,
        abi: this.ERC20_ABI,
        client: this.walletClient
      });

      await tokenContract.write.approve([
        this.EMERGENCY_VAULT_ADDRESS as `0x${string}`,
        amount
      ], {
        account: agentAddress as `0x${string}`
      });

      // Then deposit to vault
      const vaultContract = getContract({
        address: this.EMERGENCY_VAULT_ADDRESS as `0x${string}`,
        abi: this.EMERGENCY_VAULT_ABI,
        client: this.walletClient
      });

      const hash = await vaultContract.write.emergencyDeposit([
        userAddress as `0x${string}`,
        tokenAddress as `0x${string}`,
        amount
      ], {
        account: agentAddress as `0x${string}`
      });

      return hash;
    } catch (error) {
      console.error("Error depositing token to emergency vault:", error);
      throw error;
    }
  }

  async withdrawFromVault(userAddress: string, depositId: number) {
    try {
      const contract = getContract({
        address: this.EMERGENCY_VAULT_ADDRESS as `0x${string}`,
        abi: this.EMERGENCY_VAULT_ABI,
        client: this.walletClient
      });

      const hash = await contract.write.withdraw([BigInt(depositId)], {
        account: userAddress as `0x${string}`
      });

      return hash;
    } catch (error) {
      console.error("Error withdrawing from vault:", error);
      throw error;
    }
  }

  async getUserVaultDeposits(userAddress: string) {
    try {
      const contract = getContract({
        address: this.EMERGENCY_VAULT_ADDRESS as `0x${string}`,
        abi: this.EMERGENCY_VAULT_ABI,
        client: this.publicClient
      });

      const count = await contract.read.getUserDepositCount([userAddress as `0x${string}`]);
      const deposits = [];

      for (let i = 0; i < Number(count); i++) {
        const deposit = await contract.read.getUserDeposit([userAddress as `0x${string}`, BigInt(i)]);
        const canWithdraw = await contract.read.canWithdraw([userAddress as `0x${string}`, BigInt(i)]);
        
        deposits.push({
          id: i,
          token: deposit[0],
          amount: deposit[1],
          timestamp: Number(deposit[2]),
          withdrawn: deposit[3],
          canWithdraw
        });
      }

      return deposits;
    } catch (error) {
      console.error("Error getting vault deposits:", error);
      return [];
    }
  }

  /**
   * Approval Manager Functions
   */

  async revokeApproval(tokenAddress: string, spenderAddress: string, userAddress: string) {
    try {
      const contract = getContract({
        address: this.APPROVAL_MANAGER_ADDRESS as `0x${string}`,
        abi: this.APPROVAL_MANAGER_ABI,
        client: this.walletClient
      });

      const hash = await contract.write.revokeApproval([
        tokenAddress as `0x${string}`,
        spenderAddress as `0x${string}`
      ], {
        account: userAddress as `0x${string}`
      });

      return hash;
    } catch (error) {
      console.error("Error revoking approval:", error);
      throw error;
    }
  }

  async batchRevokeApprovals(
    tokenAddresses: string[], 
    spenderAddresses: string[], 
    userAddress: string
  ) {
    try {
      const contract = getContract({
        address: this.APPROVAL_MANAGER_ADDRESS as `0x${string}`,
        abi: this.APPROVAL_MANAGER_ABI,
        client: this.walletClient
      });

      const hash = await contract.write.batchRevokeApprovals([
        tokenAddresses as `0x${string}`[],
        spenderAddresses as `0x${string}`[]
      ], {
        account: userAddress as `0x${string}`
      });

      return hash;
    } catch (error) {
      console.error("Error batch revoking approvals:", error);
      throw error;
    }
  }

  async getAllowance(tokenAddress: string, ownerAddress: string, spenderAddress: string) {
    try {
      const contract = getContract({
        address: this.APPROVAL_MANAGER_ADDRESS as `0x${string}`,
        abi: this.APPROVAL_MANAGER_ABI,
        client: this.publicClient
      });

      const allowance = await contract.read.getAllowance([
        tokenAddress as `0x${string}`,
        ownerAddress as `0x${string}`,
        spenderAddress as `0x${string}`
      ]);

      return allowance;
    } catch (error) {
      console.error("Error getting allowance:", error);
      return BigInt(0);
    }
  }

  async getBatchAllowances(
    tokenAddresses: string[], 
    ownerAddress: string, 
    spenderAddresses: string[]
  ) {
    try {
      const contract = getContract({
        address: this.APPROVAL_MANAGER_ADDRESS as `0x${string}`,
        abi: this.APPROVAL_MANAGER_ABI,
        client: this.publicClient
      });

      const allowances = await contract.read.getBatchAllowances([
        tokenAddresses as `0x${string}`[],
        ownerAddress as `0x${string}`,
        spenderAddresses as `0x${string}`[]
      ]);

      return allowances;
    } catch (error) {
      console.error("Error getting batch allowances:", error);
      return [];
    }
  }

  /**
   * Token Functions
   */

  async getTokenInfo(tokenAddress: string) {
    try {
      const contract = getContract({
        address: tokenAddress as `0x${string}`,
        abi: this.ERC20_ABI,
        client: this.publicClient
      });

      const [name, symbol, decimals] = await Promise.all([
        contract.read.name(),
        contract.read.symbol(),
        contract.read.decimals()
      ]);

      return { name, symbol, decimals };
    } catch (error) {
      console.error("Error getting token info:", error);
      return { name: "Unknown", symbol: "UNK", decimals: 18 };
    }
  }

  async getTokenBalance(tokenAddress: string, userAddress: string) {
    try {
      const contract = getContract({
        address: tokenAddress as `0x${string}`,
        abi: this.ERC20_ABI,
        client: this.publicClient
      });

      const balance = await contract.read.balanceOf([userAddress as `0x${string}`]);
      return balance;
    } catch (error) {
      console.error("Error getting token balance:", error);
      return BigInt(0);
    }
  }

  /**
   * Direct approval revocation (bypassing approval manager)
   */
  async directRevokeApproval(tokenAddress: string, spenderAddress: string, userAddress: string) {
    try {
      const contract = getContract({
        address: tokenAddress as `0x${string}`,
        abi: this.ERC20_ABI,
        client: this.walletClient
      });

      const hash = await contract.write.approve([
        spenderAddress as `0x${string}`,
        BigInt(0)
      ], {
        account: userAddress as `0x${string}`
      });

      return hash;
    } catch (error) {
      console.error("Error directly revoking approval:", error);
      throw error;
    }
  }

  /**
   * Emergency transfer (for moving funds to safety)
   */
  async emergencyTransfer(
    tokenAddress: string, 
    toAddress: string, 
    amount: bigint, 
    userAddress: string
  ) {
    try {
      if (tokenAddress === "0x0000000000000000000000000000000000000000") {
        // ETH transfer
        const hash = await this.walletClient.sendTransaction({
          account: userAddress as `0x${string}`,
          to: toAddress as `0x${string}`,
          value: amount
        });
        return hash;
      } else {
        // ERC20 transfer
        const contract = getContract({
          address: tokenAddress as `0x${string}`,
          abi: this.ERC20_ABI,
          client: this.walletClient
        });

        const hash = await contract.write.transfer([
          toAddress as `0x${string}`,
          amount
        ], {
          account: userAddress as `0x${string}`
        });

        return hash;
      }
    } catch (error) {
      console.error("Error in emergency transfer:", error);
      throw error;
    }
  }

  /**
   * Utility function to estimate gas for operations
   */
  async estimateGas(operation: string, params: any[]) {
    try {
      // Implementation would depend on the specific operation
      // This is a placeholder for gas estimation logic
      return BigInt(100000); // Default gas estimate
    } catch (error) {
      console.error("Error estimating gas:", error);
      return BigInt(200000); // Conservative fallback
    }
  }

  /**
   * Monitor contract events
   */
  async monitorEmergencyDeposits(userAddress: string, callback: (event: any) => void) {
    try {
      // Set up event listener for emergency deposits
      const contract = getContract({
        address: this.EMERGENCY_VAULT_ADDRESS as `0x${string}`,
        abi: this.EMERGENCY_VAULT_ABI,
        client: this.publicClient
      });

      // In a real implementation, this would set up a proper event listener
      console.log(`Monitoring emergency deposits for ${userAddress}`);
      
      // Placeholder for event monitoring
      return () => {
        console.log("Stopped monitoring emergency deposits");
      };
    } catch (error) {
      console.error("Error setting up event monitoring:", error);
      return () => {};
    }
  }
}

// Singleton instance
export const contractService = new ContractService();
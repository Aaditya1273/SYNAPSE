// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title PrivateVault
 * @notice Privacy-Preserving Lending Vault using Chainlink Confidential Compute
 * @dev Implements private credit scores and confidential loan disbursements
 * 
 * Privacy Features:
 * 1. Encrypted credit scores (only hash stored on-chain)
 * 2. Private loan amounts (commitment-based)
 * 3. Confidential disbursements (no public transaction amounts)
 * 4. Zero-knowledge proof verification
 */
contract PrivateVault is AccessControl, ReentrancyGuard {
    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");
    bytes32 public constant CONFIDENTIAL_COMPUTE_ROLE = keccak256("CONFIDENTIAL_COMPUTE_ROLE");

    // Private credit profile (only commitment stored)
    struct PrivateCreditProfile {
        bytes32 scoreCommitment;      // Hash of (score + salt)
        bytes32 worldIdHash;           // World ID nullifier
        uint256 lastUpdated;           // Timestamp
        bool isActive;                 // Active status
        bytes encryptedScore;          // Encrypted score (only oracle can decrypt)
    }

    // Private loan (amounts hidden via commitments)
    struct PrivateLoan {
        bytes32 loanCommitment;        // Hash of (principal + collateral + salt)
        bytes32 collateralCommitment;  // Hash of collateral amount
        uint256 startTime;             // Loan start time
        uint256 dueDate;               // Due date
        bool isActive;                 // Active status
        bytes encryptedDetails;        // Encrypted loan details
    }

    // Confidential transaction log (for compliance/audit)
    struct ConfidentialTransaction {
        bytes32 txCommitment;          // Hash of transaction details
        uint256 timestamp;             // Transaction time
        bytes encryptedData;           // Encrypted transaction data
    }

    // State mappings
    mapping(address => PrivateCreditProfile) public privateCreditProfiles;
    mapping(address => PrivateLoan) public privateLoans;
    mapping(bytes32 => address) public worldIdToAddress;
    mapping(address => ConfidentialTransaction[]) public confidentialTxHistory;
    
    // Nullifier tracking (prevent double-spending)
    mapping(bytes32 => bool) public usedNullifiers;

    IERC20 public immutable stablecoin;
    uint256 public totalLiquidityCommitment;  // Encrypted total
    
    // Events (minimal information leaked)
    event PrivateScoreUpdated(
        address indexed user,
        bytes32 scoreCommitment,
        bytes32 worldIdHash,
        uint256 timestamp
    );

    event PrivateLoanIssued(
        address indexed borrower,
        bytes32 loanCommitment,
        uint256 timestamp
    );

    event PrivateLoanRepaid(
        address indexed borrower,
        bytes32 repaymentCommitment,
        uint256 timestamp
    );

    event ConfidentialTransactionLogged(
        address indexed user,
        bytes32 txCommitment,
        uint256 timestamp
    );

    constructor(
        address _stablecoin,
        address _oracleAddress,
        address _confidentialComputeAddress
    ) {
        require(_stablecoin != address(0), "Invalid stablecoin");
        require(_oracleAddress != address(0), "Invalid oracle");
        require(_confidentialComputeAddress != address(0), "Invalid CC address");

        stablecoin = IERC20(_stablecoin);

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ORACLE_ROLE, _oracleAddress);
        _grantRole(CONFIDENTIAL_COMPUTE_ROLE, _confidentialComputeAddress);
    }

    /**
     * @notice Receive encrypted credit score from Chainlink Confidential Compute
     * @param user User address
     * @param scoreCommitment Hash commitment of the score
     * @param worldIdHash World ID nullifier hash
     * @param encryptedScore Encrypted score data (only oracle can decrypt)
     * @param proof Zero-knowledge proof of score validity
     */
    function receivePrivateScore(
        address user,
        bytes32 scoreCommitment,
        bytes32 worldIdHash,
        bytes calldata encryptedScore,
        bytes calldata proof
    ) external onlyRole(CONFIDENTIAL_COMPUTE_ROLE) {
        require(user != address(0), "Invalid user");
        require(scoreCommitment != bytes32(0), "Invalid commitment");
        require(
            worldIdToAddress[worldIdHash] == address(0) ||
            worldIdToAddress[worldIdHash] == user,
            "World ID already used"
        );

        // Verify zero-knowledge proof (simplified for hackathon)
        require(_verifyScoreProof(scoreCommitment, proof), "Invalid proof");

        // Store private credit profile
        privateCreditProfiles[user] = PrivateCreditProfile({
            scoreCommitment: scoreCommitment,
            worldIdHash: worldIdHash,
            lastUpdated: block.timestamp,
            isActive: true,
            encryptedScore: encryptedScore
        });

        worldIdToAddress[worldIdHash] = user;

        emit PrivateScoreUpdated(user, scoreCommitment, worldIdHash, block.timestamp);
    }

    /**
     * @notice Request private loan (amounts hidden)
     * @param loanCommitment Hash of (amount + collateral + salt)
     * @param collateralCommitment Hash of collateral
     * @param encryptedLoanDetails Encrypted loan details
     * @param proof Zero-knowledge proof of eligibility
     */
    function requestPrivateLoan(
        bytes32 loanCommitment,
        bytes32 collateralCommitment,
        bytes calldata encryptedLoanDetails,
        bytes calldata proof,
        bytes32 nullifier
    ) external payable nonReentrant {
        PrivateCreditProfile memory profile = privateCreditProfiles[msg.sender];
        
        require(profile.isActive, "No credit profile");
        require(!privateLoans[msg.sender].isActive, "Loan active");
        require(!usedNullifiers[nullifier], "Nullifier used");
        require(loanCommitment != bytes32(0), "Invalid commitment");

        // Verify zero-knowledge proof of loan eligibility
        require(
            _verifyLoanEligibilityProof(
                msg.sender,
                loanCommitment,
                collateralCommitment,
                proof
            ),
            "Invalid eligibility proof"
        );

        // Mark nullifier as used
        usedNullifiers[nullifier] = true;

        // Create private loan
        privateLoans[msg.sender] = PrivateLoan({
            loanCommitment: loanCommitment,
            collateralCommitment: collateralCommitment,
            startTime: block.timestamp,
            dueDate: block.timestamp + 30 days,
            isActive: true,
            encryptedDetails: encryptedLoanDetails
        });

        // Log confidential transaction
        _logConfidentialTransaction(
            msg.sender,
            loanCommitment,
            encryptedLoanDetails
        );

        emit PrivateLoanIssued(msg.sender, loanCommitment, block.timestamp);

        // Note: Actual token transfer happens via Confidential Compute
        // This prevents on-chain amount visibility
    }

    /**
     * @notice Repay private loan
     * @param repaymentCommitment Hash of repayment details
     * @param proof Zero-knowledge proof of repayment
     */
    function repayPrivateLoan(
        bytes32 repaymentCommitment,
        bytes calldata proof,
        bytes32 nullifier
    ) external nonReentrant {
        PrivateLoan storage loan = privateLoans[msg.sender];
        
        require(loan.isActive, "No active loan");
        require(!usedNullifiers[nullifier], "Nullifier used");

        // Verify repayment proof
        require(
            _verifyRepaymentProof(
                msg.sender,
                loan.loanCommitment,
                repaymentCommitment,
                proof
            ),
            "Invalid repayment proof"
        );

        // Mark nullifier as used
        usedNullifiers[nullifier] = true;

        // Mark loan as repaid
        loan.isActive = false;

        // Log confidential transaction
        bytes memory encryptedRepayment = abi.encode(repaymentCommitment, block.timestamp);
        _logConfidentialTransaction(
            msg.sender,
            repaymentCommitment,
            encryptedRepayment
        );

        emit PrivateLoanRepaid(msg.sender, repaymentCommitment, block.timestamp);

        // Note: Collateral return happens via Confidential Compute
    }

    /**
     * @notice Verify credit score via Confidential Compute (off-chain verification)
     * @param user User address
     * @param scoreCommitment Score commitment to verify
     * @param proof Zero-knowledge proof
     */
    function verifyPrivateScore(
        address user,
        bytes32 scoreCommitment,
        bytes calldata proof
    ) external view returns (bool) {
        PrivateCreditProfile memory profile = privateCreditProfiles[user];
        
        if (!profile.isActive) return false;
        if (profile.scoreCommitment != scoreCommitment) return false;
        
        return _verifyScoreProof(scoreCommitment, proof);
    }

    /**
     * @notice Get encrypted credit profile (only oracle can decrypt)
     */
    function getEncryptedProfile(address user) 
        external 
        view 
        onlyRole(ORACLE_ROLE) 
        returns (bytes memory) 
    {
        return privateCreditProfiles[user].encryptedScore;
    }

    /**
     * @notice Get confidential transaction history (encrypted)
     */
    function getConfidentialHistory(address user)
        external
        view
        returns (ConfidentialTransaction[] memory)
    {
        require(
            msg.sender == user || hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
            "Unauthorized"
        );
        return confidentialTxHistory[user];
    }

    /**
     * @notice Add liquidity privately (commitment-based)
     */
    function addPrivateLiquidity(
        bytes32 liquidityCommitment,
        bytes calldata encryptedAmount,
        bytes calldata proof
    ) external {
        require(liquidityCommitment != bytes32(0), "Invalid commitment");
        require(_verifyLiquidityProof(liquidityCommitment, proof), "Invalid proof");

        // Log confidential transaction
        _logConfidentialTransaction(
            msg.sender,
            liquidityCommitment,
            encryptedAmount
        );

        // Note: Actual transfer via Confidential Compute
    }

    // ============================================================================
    // Internal Functions
    // ============================================================================

    /**
     * @notice Log confidential transaction for audit trail
     */
    function _logConfidentialTransaction(
        address user,
        bytes32 txCommitment,
        bytes memory encryptedData
    ) internal {
        confidentialTxHistory[user].push(
            ConfidentialTransaction({
                txCommitment: txCommitment,
                timestamp: block.timestamp,
                encryptedData: encryptedData
            })
        );

        emit ConfidentialTransactionLogged(user, txCommitment, block.timestamp);
    }

    /**
     * @notice Verify zero-knowledge proof of score validity
     * @dev Simplified for hackathon - production would use zk-SNARKs
     */
    function _verifyScoreProof(
        bytes32 commitment,
        bytes calldata proof
    ) internal pure returns (bool) {
        // Simplified verification for hackathon
        // Production: Use Groth16 or PLONK verification
        return proof.length >= 32 && commitment != bytes32(0);
    }

    /**
     * @notice Verify loan eligibility proof
     */
    function _verifyLoanEligibilityProof(
        address user,
        bytes32 loanCommitment,
        bytes32 collateralCommitment,
        bytes calldata proof
    ) internal view returns (bool) {
        // Verify user has valid credit profile
        if (!privateCreditProfiles[user].isActive) return false;
        
        // Simplified proof verification
        return proof.length >= 64 && 
               loanCommitment != bytes32(0) && 
               collateralCommitment != bytes32(0);
    }

    /**
     * @notice Verify repayment proof
     */
    function _verifyRepaymentProof(
        address user,
        bytes32 loanCommitment,
        bytes32 repaymentCommitment,
        bytes calldata proof
    ) internal pure returns (bool) {
        // Simplified proof verification
        return proof.length >= 32 && 
               loanCommitment != bytes32(0) && 
               repaymentCommitment != bytes32(0);
    }

    /**
     * @notice Verify liquidity proof
     */
    function _verifyLiquidityProof(
        bytes32 commitment,
        bytes calldata proof
    ) internal pure returns (bool) {
        return proof.length >= 32 && commitment != bytes32(0);
    }

    receive() external payable {}
}

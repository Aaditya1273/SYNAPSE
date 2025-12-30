// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title EmergencyVault
 * @dev Secure vault for emergency fund storage during threat detection
 * @notice This contract allows Omni-Shield to move funds to safety during exploits
 */
contract EmergencyVault is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    struct VaultDeposit {
        address token;
        uint256 amount;
        uint256 timestamp;
        bool withdrawn;
    }

    mapping(address => VaultDeposit[]) public userDeposits;
    mapping(address => bool) public authorizedAgents;
    
    uint256 public constant EMERGENCY_DELAY = 1 hours;
    uint256 public constant MAX_VAULT_TIME = 7 days;
    
    event EmergencyDeposit(
        address indexed user,
        address indexed token,
        uint256 amount,
        uint256 depositId
    );
    
    event EmergencyWithdrawal(
        address indexed user,
        address indexed token,
        uint256 amount,
        uint256 depositId
    );
    
    event AgentAuthorized(address indexed agent);
    event AgentRevoked(address indexed agent);

    modifier onlyAuthorizedAgent() {
        require(authorizedAgents[msg.sender], "Not authorized agent");
        _;
    }

    constructor() {
        // Owner is initially the only authorized agent
        authorizedAgents[msg.sender] = true;
    }

    /**
     * @dev Authorize an agent (Omni-Shield session account) to make emergency deposits
     * @param agent Address of the agent to authorize
     */
    function authorizeAgent(address agent) external onlyOwner {
        authorizedAgents[agent] = true;
        emit AgentAuthorized(agent);
    }

    /**
     * @dev Revoke agent authorization
     * @param agent Address of the agent to revoke
     */
    function revokeAgent(address agent) external onlyOwner {
        authorizedAgents[agent] = false;
        emit AgentRevoked(agent);
    }

    /**
     * @dev Emergency deposit function called by authorized agents
     * @param user The user whose funds are being protected
     * @param token The token contract address (address(0) for ETH)
     * @param amount The amount to deposit
     */
    function emergencyDeposit(
        address user,
        address token,
        uint256 amount
    ) external payable onlyAuthorizedAgent nonReentrant {
        require(user != address(0), "Invalid user address");
        require(amount > 0, "Amount must be greater than 0");

        if (token == address(0)) {
            // ETH deposit
            require(msg.value == amount, "ETH amount mismatch");
        } else {
            // ERC20 deposit
            require(msg.value == 0, "No ETH should be sent for ERC20");
            IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        }

        uint256 depositId = userDeposits[user].length;
        userDeposits[user].push(VaultDeposit({
            token: token,
            amount: amount,
            timestamp: block.timestamp,
            withdrawn: false
        }));

        emit EmergencyDeposit(user, token, amount, depositId);
    }

    /**
     * @dev User withdraws their funds from the vault
     * @param depositId The ID of the deposit to withdraw
     */
    function withdraw(uint256 depositId) external nonReentrant {
        require(depositId < userDeposits[msg.sender].length, "Invalid deposit ID");
        
        VaultDeposit storage deposit = userDeposits[msg.sender][depositId];
        require(!deposit.withdrawn, "Already withdrawn");
        require(
            block.timestamp >= deposit.timestamp + EMERGENCY_DELAY,
            "Emergency delay not met"
        );

        deposit.withdrawn = true;

        if (deposit.token == address(0)) {
            // ETH withdrawal
            (bool success, ) = msg.sender.call{value: deposit.amount}("");
            require(success, "ETH transfer failed");
        } else {
            // ERC20 withdrawal
            IERC20(deposit.token).safeTransfer(msg.sender, deposit.amount);
        }

        emit EmergencyWithdrawal(msg.sender, deposit.token, deposit.amount, depositId);
    }

    /**
     * @dev Emergency withdrawal by owner after max vault time
     * @param user The user whose funds to return
     * @param depositId The deposit ID to withdraw
     */
    function emergencyWithdrawByOwner(
        address user,
        uint256 depositId
    ) external onlyOwner nonReentrant {
        require(depositId < userDeposits[user].length, "Invalid deposit ID");
        
        VaultDeposit storage deposit = userDeposits[user][depositId];
        require(!deposit.withdrawn, "Already withdrawn");
        require(
            block.timestamp >= deposit.timestamp + MAX_VAULT_TIME,
            "Max vault time not reached"
        );

        deposit.withdrawn = true;

        if (deposit.token == address(0)) {
            // ETH withdrawal
            (bool success, ) = user.call{value: deposit.amount}("");
            require(success, "ETH transfer failed");
        } else {
            // ERC20 withdrawal
            IERC20(deposit.token).safeTransfer(user, deposit.amount);
        }

        emit EmergencyWithdrawal(user, deposit.token, deposit.amount, depositId);
    }

    /**
     * @dev Get user's deposit count
     * @param user The user address
     * @return The number of deposits
     */
    function getUserDepositCount(address user) external view returns (uint256) {
        return userDeposits[user].length;
    }

    /**
     * @dev Get user's deposit details
     * @param user The user address
     * @param depositId The deposit ID
     * @return Deposit details
     */
    function getUserDeposit(
        address user,
        uint256 depositId
    ) external view returns (VaultDeposit memory) {
        require(depositId < userDeposits[user].length, "Invalid deposit ID");
        return userDeposits[user][depositId];
    }

    /**
     * @dev Check if funds can be withdrawn
     * @param user The user address
     * @param depositId The deposit ID
     * @return Whether withdrawal is allowed
     */
    function canWithdraw(address user, uint256 depositId) external view returns (bool) {
        if (depositId >= userDeposits[user].length) return false;
        
        VaultDeposit memory deposit = userDeposits[user][depositId];
        return !deposit.withdrawn && 
               block.timestamp >= deposit.timestamp + EMERGENCY_DELAY;
    }

    receive() external payable {
        // Allow contract to receive ETH
    }
}
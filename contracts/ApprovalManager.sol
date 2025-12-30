// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title ApprovalManager
 * @dev Manages batch approval revocations for Omni-Shield
 * @notice This contract helps revoke multiple token approvals in a single transaction
 */
contract ApprovalManager is Ownable, ReentrancyGuard {
    
    struct ApprovalRevocation {
        address token;
        address spender;
        bool success;
    }

    event BatchRevocation(
        address indexed user,
        uint256 totalRevocations,
        uint256 successfulRevocations
    );

    event SingleRevocation(
        address indexed user,
        address indexed token,
        address indexed spender,
        bool success
    );

    /**
     * @dev Revoke approval for a single token-spender pair
     * @param token The ERC20 token contract
     * @param spender The spender to revoke approval from
     */
    function revokeApproval(
        address token,
        address spender
    ) external nonReentrant returns (bool success) {
        try IERC20(token).approve(spender, 0) {
            success = true;
        } catch {
            success = false;
        }

        emit SingleRevocation(msg.sender, token, spender, success);
        return success;
    }

    /**
     * @dev Batch revoke approvals for multiple token-spender pairs
     * @param tokens Array of ERC20 token contracts
     * @param spenders Array of spenders to revoke approvals from
     */
    function batchRevokeApprovals(
        address[] calldata tokens,
        address[] calldata spenders
    ) external nonReentrant returns (ApprovalRevocation[] memory results) {
        require(tokens.length == spenders.length, "Arrays length mismatch");
        require(tokens.length > 0, "Empty arrays");
        require(tokens.length <= 50, "Too many revocations"); // Gas limit protection

        results = new ApprovalRevocation[](tokens.length);
        uint256 successCount = 0;

        for (uint256 i = 0; i < tokens.length; i++) {
            bool success;
            try IERC20(tokens[i]).approve(spenders[i], 0) {
                success = true;
                successCount++;
            } catch {
          
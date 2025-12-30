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
                success = false;
            }

            results[i] = ApprovalRevocation({
                token: tokens[i],
                spender: spenders[i],
                success: success
            });

            emit SingleRevocation(msg.sender, tokens[i], spenders[i], success);
        }

        emit BatchRevocation(msg.sender, tokens.length, successCount);
        return results;
    }

    /**
     * @dev Revoke all approvals for a specific token to multiple spenders
     * @param token The ERC20 token contract
     * @param spenders Array of spenders to revoke approvals from
     */
    function revokeTokenApprovals(
        address token,
        address[] calldata spenders
    ) external nonReentrant returns (uint256 successCount) {
        require(spenders.length > 0, "Empty spenders array");
        require(spenders.length <= 50, "Too many spenders");

        successCount = 0;

        for (uint256 i = 0; i < spenders.length; i++) {
            bool success;
            try IERC20(token).approve(spenders[i], 0) {
                success = true;
                successCount++;
            } catch {
                success = false;
            }

            emit SingleRevocation(msg.sender, token, spenders[i], success);
        }

        emit BatchRevocation(msg.sender, spenders.length, successCount);
        return successCount;
    }

    /**
     * @dev Check current allowance for a token-spender pair
     * @param token The ERC20 token contract
     * @param owner The token owner
     * @param spender The spender
     * @return The current allowance
     */
    function getAllowance(
        address token,
        address owner,
        address spender
    ) external view returns (uint256) {
        return IERC20(token).allowance(owner, spender);
    }

    /**
     * @dev Check multiple allowances at once
     * @param tokens Array of ERC20 token contracts
     * @param owner The token owner
     * @param spenders Array of spenders
     * @return allowances Array of current allowances
     */
    function getBatchAllowances(
        address[] calldata tokens,
        address owner,
        address[] calldata spenders
    ) external view returns (uint256[] memory allowances) {
        require(tokens.length == spenders.length, "Arrays length mismatch");
        
        allowances = new uint256[](tokens.length);
        
        for (uint256 i = 0; i < tokens.length; i++) {
            try IERC20(tokens[i]).allowance(owner, spenders[i]) returns (uint256 allowance) {
                allowances[i] = allowance;
            } catch {
                allowances[i] = 0;
            }
        }
        
        return allowances;
    }

    /**
     * @dev Emergency function to revoke approvals on behalf of user (requires signature)
     * @param user The user whose approvals to revoke
     * @param tokens Array of ERC20 token contracts
     * @param spenders Array of spenders
     * @param deadline Signature deadline
     * @param v Signature v
     * @param r Signature r
     * @param s Signature s
     */
    function emergencyRevokeWithSignature(
        address user,
        address[] calldata tokens,
        address[] calldata spenders,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external nonReentrant {
        require(block.timestamp <= deadline, "Signature expired");
        require(tokens.length == spenders.length, "Arrays length mismatch");
        
        // Verify signature (simplified - in production use EIP-712)
        bytes32 hash = keccak256(abi.encodePacked(
            user,
            tokens,
            spenders,
            deadline,
            address(this)
        ));
        
        address signer = ecrecover(hash, v, r, s);
        require(signer == user, "Invalid signature");

        // Execute revocations
        uint256 successCount = 0;
        for (uint256 i = 0; i < tokens.length; i++) {
            // This would require the contract to have approval or use meta-transactions
            // Implementation depends on the specific approval mechanism
            emit SingleRevocation(user, tokens[i], spenders[i], false);
        }

        emit BatchRevocation(user, tokens.length, successCount);
    }
}
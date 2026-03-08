// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title OmniSentryCore
 * @dev Central risk management hub that receives triggers from Chainlink CRE Workflows.
 */
contract OmniSentryCore is AccessControl, Pausable {
    bytes32 public constant CRE_WORKFLOW_ROLE = keccak256("CRE_WORKFLOW_ROLE");
    bytes32 public constant RISK_ADMIN_ROLE = keccak256("RISK_ADMIN_ROLE");

    enum RiskLevel { LOW, MEDIUM, HIGH, CRITICAL }

    struct RiskState {
        RiskLevel currentLevel;
        uint256 riskScore; // 0-100
        uint256 lastUpdated;
        string reason;
    }

    RiskState public globalRiskState;

    event RiskStateUpdated(RiskLevel indexed level, uint256 score, string reason);
    event EmergencyActionTriggered(string actionType, address target);
    event ManualOverride(uint8 level, uint256 score, string reason);

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(RISK_ADMIN_ROLE, admin);
    }

    /**
     * @dev Called by authorized CRE Workflows to update the global risk state.
     */
    function updateRiskState(
        RiskLevel _level,
        uint256 _score,
        string calldata _reason
    ) external onlyRole(CRE_WORKFLOW_ROLE) {
        globalRiskState = RiskState({
            currentLevel: _level,
            riskScore: _score,
            lastUpdated: block.timestamp,
            reason: _reason
        });

        if (_level >= RiskLevel.HIGH) {
            _pause();
        } else if (paused()) {
            _unpause();
        }

        emit RiskStateUpdated(_level, _score, _reason);
    }

    /**
     * @dev Manually trigger a risk state override.
     */
    function manualOverride(
        RiskLevel _level,
        uint256 _score,
        string calldata _reason
    ) external onlyRole(RISK_ADMIN_ROLE) {
        globalRiskState = RiskState({
            currentLevel: _level,
            riskScore: _score,
            lastUpdated: block.timestamp,
            reason: _reason
        });

        if (_level >= RiskLevel.HIGH) {
            _pause();
        } else if (paused()) {
            _unpause();
        }

        emit ManualOverride(uint8(_level), _score, _reason);
    }

    /**
     * @dev Manually trigger an emergency action (e.g., CCIP migration trigger).
     */
    function triggerEmergencyAction(string calldata actionType, address target) external onlyRole(RISK_ADMIN_ROLE) {
        emit EmergencyActionTriggered(actionType, target);
    }

    function setRiskAdmin(address admin, bool status) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (status) {
            _grantRole(RISK_ADMIN_ROLE, admin);
        } else {
            _revokeRole(RISK_ADMIN_ROLE, admin);
        }
    }

    function setWorkflow(address workflow, bool status) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (status) {
            _grantRole(CRE_WORKFLOW_ROLE, workflow);
        } else {
            _revokeRole(CRE_WORKFLOW_ROLE, workflow);
        }
    }
}

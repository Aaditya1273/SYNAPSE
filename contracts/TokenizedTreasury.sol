// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IOmniSentryCore {
    function paused() external view returns (bool);
}

/**
 * @title TokenizedTreasury
 * @dev A tokenized Real-World Asset (RWA) treasury fund.
 * Prices are updated via CRE workflows, and transfers are guarded by OmniSentryCore's risk state.
 */
contract TokenizedTreasury is ERC20, ERC20Pausable, Ownable {
    IOmniSentryCore public immutable core;
    
    uint256 public nav; // Net Asset Value in 18 decimals
    uint256 public lastNavUpdate;

    bytes32 public constant UPDATER_ROLE = keccak256("UPDATER_ROLE");

    event NAVUpdated(uint256 newNav, uint256 timestamp);

    constructor(
        string memory name,
        string memory symbol,
        address _core,
        address _initialOwner
    ) ERC20(name, symbol) Ownable(_initialOwner) {
        core = IOmniSentryCore(_core);
    }

    /**
     * @dev Updates the Net Asset Value (NAV) of the treasury.
     * To be called by authorized CRE Workflows or owners.
     */
    function updateNAV(uint256 _newNav) external onlyOwner {
        nav = _newNav;
        lastNavUpdate = block.timestamp;
        emit NAVUpdated(_newNav, block.timestamp);
    }

    /**
     * @dev Mint new shares of the treasury.
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    /**
     * @dev Burn shares of the treasury.
     */
    function burn(address from, uint256 amount) external onlyOwner {
        _burn(from, amount);
    }

    /**
     * @dev Overrides the internal _update function to check global risk status from OmniSentryCore.
     */
    function _update(address from, address to, uint256 value) internal virtual override(ERC20, ERC20Pausable) {
        require(!core.paused(), "Omni-Sentry: Global risk circuit breaker active");
        super._update(from, to, value);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}

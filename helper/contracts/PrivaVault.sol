// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface AggregatorV3Interface {
    function decimals() external view returns (uint8);
    function description() external view returns (string memory);
    function version() external view returns (uint256);
    function getRoundData(
        uint80 _roundId
    )
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        );
    function latestRoundData()
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        );
}

/**
 * @title PrivaVault
 * @notice Functional Lending Vault connected to Sepolia with Chainlink Price Feeds.
 */
contract PrivaVault is AccessControl, ReentrancyGuard {
    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");

    struct Loan {
        uint256 principal;
        uint256 collateral;
        uint256 startTime;
        bool isActive;
    }

    mapping(address => uint256) public userScores;
    mapping(address => Loan) public loans;

    IERC20 public immutable stablecoin; // USDC (6 decimals)
    AggregatorV3Interface public priceFeed; // ETH/USD

    uint256 public constant BASE_COLLATERAL_RATIO = 150; // 150%
    uint256 public constant PRIME_COLLATERAL_RATIO = 110; // 110%
    uint256 public constant PRIME_THRESHOLD = 80;

    int256 private mockPrice;
    bool public isDevMode;

    event LoanBorrowed(
        address indexed borrower,
        uint256 amount,
        uint256 collateral
    );
    event LoanRepaid(address indexed borrower, uint256 amount);
    event ScoreUpdated(address indexed user, uint256 score);

    constructor(address _stablecoin, address _priceFeed) {
        stablecoin = IERC20(_stablecoin);
        priceFeed = AggregatorV3Interface(_priceFeed);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function setOracle(address _oracle) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(ORACLE_ROLE, _oracle);
    }

    function toggleDevMode(bool _status) external onlyRole(DEFAULT_ADMIN_ROLE) {
        isDevMode = _status;
    }

    function setMockPrice(int256 _price) external {
        require(isDevMode, "Only in Dev Mode");
        mockPrice = _price;
    }

    function updateScore(
        address user,
        uint256 score
    ) external onlyRole(ORACLE_ROLE) {
        require(score <= 100, "Invalid score");
        userScores[user] = score;
        emit ScoreUpdated(user, score);
    }

    function getLatestPrice() public view returns (uint256) {
        if (isDevMode && mockPrice > 0) {
            return uint256(mockPrice);
        }
        (, int256 price, , uint256 updatedAt, ) = priceFeed.latestRoundData();
        require(price > 0, "Invalid price");
        require(updatedAt > block.timestamp - 365 days, "Stale price"); // Lenient for testnets
        return uint256(price);
    }

    function calculateRequiredCollateral(
        address user,
        uint256 amountUSDC
    ) public view returns (uint256) {
        uint256 score = userScores[user];
        uint256 ratio = score > PRIME_THRESHOLD
            ? PRIME_COLLATERAL_RATIO
            : BASE_COLLATERAL_RATIO;

        uint256 ethPrice = getLatestPrice(); // 8 decimals ($)

        // Required_ETH = (Amount_USDC * Ratio) / ETH_Price
        // USDC (6 dec), Ratio (base 100), ETH (18 dec), Price (8 dec)
        // (USDC * Ratio/100 * 1e18) / Price
        // Final: (amountUSDC * ratio * 1e18 * 1e8) / (ethPrice * 100 * 1e6)
        // Shorthand: (amountUSDC * ratio * 1e20) / (ethPrice)

        return (amountUSDC * ratio * 1e18 * 1e8) / (ethPrice * 100 * 1e6);
    }

    function borrow(uint256 amountUSDC) external payable nonReentrant {
        require(!loans[msg.sender].isActive, "Existing loan active");
        require(userScores[msg.sender] > 0, "No credit score on-chain");
        require(amountUSDC > 0, "Invalid loan amount");
        
        uint256 requiredCollateral = calculateRequiredCollateral(
            msg.sender,
            amountUSDC
        );
        require(msg.value >= requiredCollateral, "Insufficient collateral");

        stablecoin.transfer(msg.sender, amountUSDC);

        loans[msg.sender] = Loan({
            principal: amountUSDC,
            collateral: msg.value,
            startTime: block.timestamp,
            isActive: true
        });

        emit LoanBorrowed(msg.sender, amountUSDC, msg.value);
    }

    function repay() external nonReentrant {
        Loan storage loan = loans[msg.sender];
        require(loan.isActive, "No active loan");

        stablecoin.transferFrom(msg.sender, address(this), loan.principal);

        uint256 collateralToReturn = loan.collateral;
        loan.isActive = false;
        loan.collateral = 0;

        (bool success, ) = msg.sender.call{value: collateralToReturn}("");
        require(success, "Collateral return failed");

        emit LoanRepaid(msg.sender, loan.principal);
    }

    // Admin function to add liquidity
    function depositLiquidity(uint256 amount) external {
        stablecoin.transferFrom(msg.sender, address(this), amount);
    }

    receive() external payable {}
}

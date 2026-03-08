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
 * @title CrestVault
 * @notice Credit-Gated Lending Vault powered by Chainlink CRE and AI-driven credit scoring
 * @dev This contract enables undercollateralized lending based on verified credit scores
 */
contract CrestVault is AccessControl, ReentrancyGuard {
    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");

    // Credit score storage
    struct CreditProfile {
        uint256 score; // Credit score (1-100)
        uint256 lastUpdated; // Timestamp of last update
        bytes32 worldIdHash; // Hashed World ID nullifier
        string justification; // AI-generated justification
        bool isActive; // Whether profile is active
    }

    // Loan storage
    struct Loan {
        uint256 principal; // Amount borrowed
        uint256 collateral; // Collateral deposited
        uint256 interestRate; // Annual interest rate (basis points)
        uint256 startTime; // Loan start timestamp
        uint256 dueDate; // Loan due date
        bool isActive; // Whether loan is active
    }

    // State variables
    mapping(address => CreditProfile) public creditProfiles;
    mapping(address => Loan) public loans;
    mapping(bytes32 => address) public worldIdToAddress;

    IERC20 public immutable stablecoin;
    AggregatorV3Interface public immutable priceFeed;
    uint256 public totalLiquidity;
    uint256 public totalBorrowed;

    // Constants
    uint256 public constant PRIME_THRESHOLD = 80;
    uint256 public constant STANDARD_THRESHOLD = 50;
    uint256 public constant PRIME_COLLATERAL_RATIO = 110; // 1.10x — High Trust (Score > 80)
    uint256 public constant STANDARD_COLLATERAL_RATIO = 150; // 1.50x — Standard Trust (Score < 80)
    uint256 public constant PRIME_INTEREST_RATE = 450; // 4.5%
    uint256 public constant STANDARD_INTEREST_RATE = 680; // 6.8%
    uint256 public constant LOAN_DURATION = 30 days;

    // Events
    event ScoreUpdated(
        address indexed user,
        uint256 score,
        uint256 timestamp,
        bytes32 worldIdHash
    );

    event LoanRequested(
        address indexed borrower,
        uint256 amount,
        uint256 collateral,
        uint256 interestRate
    );

    event LoanRepaid(
        address indexed borrower,
        uint256 principal,
        uint256 interest
    );

    event LiquidityAdded(address indexed provider, uint256 amount);
    event LiquidityRemoved(address indexed provider, uint256 amount);

    /**
     * @notice Constructor
     * @param _stablecoin Address of the stablecoin (e.g., USDC)
     * @param _oracleAddress Address of the Chainlink CRE oracle
     */
    constructor(
        address _stablecoin,
        address _oracleAddress,
        address _priceFeed
    ) {
        require(_stablecoin != address(0), "Invalid stablecoin address");
        require(_oracleAddress != address(0), "Invalid oracle address");
        require(_priceFeed != address(0), "Invalid price feed address");

        stablecoin = IERC20(_stablecoin);
        priceFeed = AggregatorV3Interface(_priceFeed);

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ORACLE_ROLE, _oracleAddress);
    }

    /**
     * @notice Receive and record credit score from Chainlink CRE oracle
     * @param encodedData ABI-encoded data from CRE workflow
     */
    function receiveScore(
        bytes calldata encodedData
    ) external onlyRole(ORACLE_ROLE) {
        (
            address userAddress,
            uint256 creditScore,
            uint256 timestamp,
            bytes32 worldIdHash,
            string memory justification
        ) = abi.decode(
                encodedData,
                (address, uint256, uint256, bytes32, string)
            );

        require(creditScore >= 1 && creditScore <= 100, "Invalid credit score");
        require(timestamp <= block.timestamp, "Future timestamp");
        require(
            worldIdToAddress[worldIdHash] == address(0) ||
                worldIdToAddress[worldIdHash] == userAddress,
            "World ID already used"
        );

        // Update credit profile
        creditProfiles[userAddress] = CreditProfile({
            score: creditScore,
            lastUpdated: timestamp,
            worldIdHash: worldIdHash,
            justification: justification,
            isActive: true
        });

        // Map World ID to address (Sybil resistance)
        worldIdToAddress[worldIdHash] = userAddress;

        emit ScoreUpdated(userAddress, creditScore, timestamp, worldIdHash);
    }

    /**
     * @notice Request a loan based on credit score
     * @param amount Amount to borrow
     */
    function requestLoan(uint256 amount) external payable nonReentrant {
        CreditProfile memory profile = creditProfiles[msg.sender];

        require(profile.isActive, "No active credit profile");
        require(profile.score > 0, "Invalid credit score");
        require(!loans[msg.sender].isActive, "Existing loan active");
        require(amount > 0, "Invalid loan amount");
        require(
            totalLiquidity - totalBorrowed >= amount,
            "Insufficient liquidity"
        );

        // Calculate interest rate based on credit score
        uint256 interestRate;
        if (profile.score >= PRIME_THRESHOLD) {
            interestRate = PRIME_INTEREST_RATE;
        } else {
            interestRate = STANDARD_INTEREST_RATE;
        }

        uint256 requiredCollateral = calculateRequiredCollateral(
            msg.sender,
            amount
        );
        require(msg.value >= requiredCollateral, "Insufficient collateral");

        // Create loan
        loans[msg.sender] = Loan({
            principal: amount,
            collateral: msg.value,
            interestRate: interestRate,
            startTime: block.timestamp,
            dueDate: block.timestamp + LOAN_DURATION,
            isActive: true
        });

        totalBorrowed += amount;

        // Transfer stablecoin to borrower
        require(stablecoin.transfer(msg.sender, amount), "Transfer failed");

        emit LoanRequested(msg.sender, amount, msg.value, interestRate);
    }

    /**
     * @notice Repay loan and retrieve collateral
     */
    function repayLoan() external nonReentrant {
        Loan storage loan = loans[msg.sender];

        require(loan.isActive, "No active loan");

        // Calculate interest
        uint256 timeElapsed = block.timestamp - loan.startTime;
        uint256 interest = (loan.principal * loan.interestRate * timeElapsed) /
            (10000 * 365 days);
        uint256 totalRepayment = loan.principal + interest;

        // Transfer repayment from borrower
        require(
            stablecoin.transferFrom(msg.sender, address(this), totalRepayment),
            "Repayment failed"
        );

        totalBorrowed -= loan.principal;

        // Return collateral
        uint256 collateralToReturn = loan.collateral;
        loan.isActive = false;
        loan.collateral = 0;

        (bool success, ) = msg.sender.call{value: collateralToReturn}("");
        require(success, "Collateral return failed");

        emit LoanRepaid(msg.sender, loan.principal, interest);
    }

    /**
     * @notice Get the latest ETH/USD price from Chainlink
     */
    function getLatestPrice() public view returns (uint256) {
        (, int256 price, , uint256 updatedAt, ) = priceFeed.latestRoundData();
        require(price > 0, "Invalid price");
        require(updatedAt > block.timestamp - 365 days, "Stale price"); // Lenient for testnets
        return uint256(price);
    }

    /**
     * @notice Add liquidity to the lending pool
     * @param amount Amount of stablecoin to add
     */
    function addLiquidity(uint256 amount) external {
        require(amount > 0, "Invalid amount");

        require(
            stablecoin.transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );

        totalLiquidity += amount;

        emit LiquidityAdded(msg.sender, amount);
    }

    /**
     * @notice Get user's credit profile
     * @param user Address of the user
     */
    function getCreditProfile(
        address user
    ) external view returns (CreditProfile memory) {
        return creditProfiles[user];
    }

    /**
     * @notice Get user's loan details
     * @param user Address of the user
     */
    function getLoan(address user) external view returns (Loan memory) {
        return loans[user];
    }

    /**
     * @notice Calculate required collateral for a loan amount
     * @param user Address of the user
     * @param amount Loan amount
     */
    /**
     * @notice Calculate required collateral (in ETH) for a loan amount (in stablecoin)
     * @param user Address of the user
     * @param amount Loan amount (6 decimals)
     */
    function calculateRequiredCollateral(
        address user,
        uint256 amount
    ) public view returns (uint256) {
        CreditProfile memory profile = creditProfiles[user];
        uint256 collateralRatio;

        if (profile.score >= PRIME_THRESHOLD) {
            collateralRatio = PRIME_COLLATERAL_RATIO;
        } else if (profile.score >= STANDARD_THRESHOLD) {
            collateralRatio = STANDARD_COLLATERAL_RATIO;
        } else {
            revert("Credit score too low");
        }

        uint256 ethPrice = getLatestPrice(); // 10^8
        uint256 requiredUSD = (amount * collateralRatio) / 100; // 10^6

        // ETH = ValueInUSD / Price
        // ETH (18 decimals) = (ValueInUSD (6 decimals) * 10^18 * 10^8) / (Price (8 decimals) * 10^6)
        uint256 requiredCollateral = (requiredUSD * 1e18 * 1e8) /
            (ethPrice * 1e6);

        return requiredCollateral;
    }

    /**
     * @notice Check if a user's loan is liquidatable
     */
    function isLiquidatable(address user) public view returns (bool) {
        Loan memory loan = loans[user];
        if (!loan.isActive) return false;

        uint256 ethPrice = getLatestPrice();
        uint256 collateralValueUSD = (loan.collateral * ethPrice * 1e6) /
            (1e18 * 1e8);

        // Liquidate if collateral value < 101% of principal
        return collateralValueUSD < (loan.principal * 101) / 100;
    }

    /**
     * @notice Liquidate an undercollateralized loan
     */
    function liquidate(address user) external nonReentrant {
        require(isLiquidatable(user), "Loan not liquidatable");

        Loan storage loan = loans[user];
        uint256 collateralToLiquidator = loan.collateral;
        uint256 principalToCover = loan.principal;

        loan.isActive = false;
        loan.collateral = 0;
        totalBorrowed -= principalToCover;

        // Liquidation incentive: liquidator sends principal+interest to vault?
        // Or vault takes the hit and liquidator just gets the collateral?
        // Simplest hackathon version: vault takes principal loss, liquidator gets collateral for a "fee".
        // Actually, liquidator should PAY the debt to get the collateral.

        require(
            stablecoin.transferFrom(
                msg.sender,
                address(this),
                principalToCover
            ),
            "Repayment failed"
        );

        (bool success, ) = msg.sender.call{value: collateralToLiquidator}("");
        require(success, "Collateral transfer failed");
    }

    /**
     * @notice Get available liquidity
     */
    function getAvailableLiquidity() external view returns (uint256) {
        return totalLiquidity - totalBorrowed;
    }

    receive() external payable {}
}

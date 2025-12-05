// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title GuardToken
 * @notice ERC20 token for DeFiGuard platform rewards and incentives
 * @dev Implements a capped supply token with airdrop and reward minting functionality
 */
contract GuardToken is ERC20, Ownable {
    /// @notice Maximum total supply: 1 billion tokens
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18;
    
    /// @notice Percentage of max supply allocated to treasury (10%)
    uint256 public constant TREASURY_PERCENTAGE = 10;
    
    /// @notice Amount of tokens per airdrop claim
    uint256 public constant AIRDROP_AMOUNT = 100 * 10**18;
    
    /// @notice Maximum batch size for batchMintRewards (DoS protection)
    /// @dev Prevents gas limit issues when minting to many recipients
    uint256 public constant MAX_BATCH_SIZE = 100;
    
    /// @notice Mapping to track addresses that have claimed airdrop
    mapping(address => bool) public hasClaimedAirdrop;
    
    /// @notice Total number of airdrop claims
    uint256 public totalAirdropClaims;
    
    /// @notice Treasury address that receives initial supply
    address public treasury;

    /// @notice Emitted when a user claims their airdrop
    event AirdropClaimed(
        address indexed user,
        uint256 amount,
        uint256 timestamp
    );
    
    /// @notice Emitted when rewards are minted
    event RewardsMinted(
        address indexed recipient,
        uint256 amount,
        string reason,
        uint256 timestamp
    );
    
    /// @notice Emitted when treasury address is updated
    event TreasuryUpdated(address indexed oldTreasury, address indexed newTreasury);

    /// @notice Custom errors for gas optimization
    error AirdropAlreadyClaimed(address user);
    error MaxSupplyExceeded(uint256 requested, uint256 available);
    error ZeroAddress();
    error ZeroAmount();
    error InvalidTreasuryAddress();
    error BatchSizeTooLarge(uint256 batchSize, uint256 maxAllowed);
    error ArraysLengthMismatch();

    /**
     * @notice Constructor initializes the token and mints treasury allocation
     * @param initialOwner Address that will own the contract
     * @param treasuryAddress Address that will receive the treasury allocation
     */
    constructor(
        address initialOwner,
        address treasuryAddress
    ) ERC20("DeFiGuard Token", "GUARD") Ownable(initialOwner) {
        if (initialOwner == address(0)) revert ZeroAddress();
        if (treasuryAddress == address(0)) revert InvalidTreasuryAddress();
        
        treasury = treasuryAddress;
        
        // Mint 10% of max supply to treasury
        uint256 treasuryAmount = (MAX_SUPPLY * TREASURY_PERCENTAGE) / 100;
        _mint(treasuryAddress, treasuryAmount);
        
        emit RewardsMinted(
            treasuryAddress,
            treasuryAmount,
            "Treasury Allocation",
            block.timestamp
        );
    }

    /**
     * @notice Claim airdrop tokens (one-time per address)
     * @dev Users can claim 100 tokens once if max supply allows
     */
    function claimAirdrop() external {
        if (hasClaimedAirdrop[msg.sender]) revert AirdropAlreadyClaimed(msg.sender);
        
        uint256 currentSupply = totalSupply();
        if (currentSupply + AIRDROP_AMOUNT > MAX_SUPPLY) {
            revert MaxSupplyExceeded(AIRDROP_AMOUNT, MAX_SUPPLY - currentSupply);
        }
        
        hasClaimedAirdrop[msg.sender] = true;
        totalAirdropClaims++;
        
        _mint(msg.sender, AIRDROP_AMOUNT);
        
        emit AirdropClaimed(msg.sender, AIRDROP_AMOUNT, block.timestamp);
    }

    /**
     * @notice Mint reward tokens to a recipient (owner only)
     * @param to Address to receive the rewards
     * @param amount Amount of tokens to mint
     * @param reason Reason for the reward (e.g., "Staking", "Audit", "Referral")
     */
    function mintReward(
        address to,
        uint256 amount,
        string memory reason
    ) external onlyOwner {
        if (to == address(0)) revert ZeroAddress();
        if (amount == 0) revert ZeroAmount();
        
        uint256 currentSupply = totalSupply();
        if (currentSupply + amount > MAX_SUPPLY) {
            revert MaxSupplyExceeded(amount, MAX_SUPPLY - currentSupply);
        }
        
        _mint(to, amount);
        
        emit RewardsMinted(to, amount, reason, block.timestamp);
    }

    /**
     * @notice Batch mint rewards to multiple recipients
     * @param recipients Array of recipient addresses
     * @param amounts Array of amounts to mint (must match recipients length)
     * @param reason Reason for the rewards
     * @dev CRITICAL: Maximum batch size is MAX_BATCH_SIZE (100) to prevent DoS attacks
     * @dev If you need to mint to more recipients, split into multiple batches
     */
    function batchMintRewards(
        address[] calldata recipients,
        uint256[] calldata amounts,
        string memory reason
    ) external onlyOwner {
        // Validate array lengths match
        if (recipients.length != amounts.length) {
            revert ArraysLengthMismatch();
        }
        
        // CRITICAL: DoS protection - limit batch size to prevent gas limit issues
        if (recipients.length > MAX_BATCH_SIZE) {
            revert BatchSizeTooLarge(recipients.length, MAX_BATCH_SIZE);
        }
        
        // Calculate total amount to mint (check supply limit before minting)
        uint256 totalAmount = 0;
        for (uint256 i = 0; i < amounts.length; i++) {
            totalAmount += amounts[i];
        }
        
        uint256 currentSupply = totalSupply();
        if (currentSupply + totalAmount > MAX_SUPPLY) {
            revert MaxSupplyExceeded(totalAmount, MAX_SUPPLY - currentSupply);
        }
        
        // Mint tokens to all recipients
        for (uint256 i = 0; i < recipients.length; i++) {
            if (recipients[i] == address(0)) revert ZeroAddress();
            if (amounts[i] == 0) revert ZeroAmount();
            
            _mint(recipients[i], amounts[i]);
            emit RewardsMinted(recipients[i], amounts[i], reason, block.timestamp);
        }
    }

    /**
     * @notice Update treasury address (owner only)
     * @param newTreasury New treasury address
     */
    function updateTreasury(address newTreasury) external onlyOwner {
        if (newTreasury == address(0)) revert InvalidTreasuryAddress();
        
        address oldTreasury = treasury;
        treasury = newTreasury;
        
        emit TreasuryUpdated(oldTreasury, newTreasury);
    }

    /**
     * @notice Get remaining mintable supply
     * @return Amount of tokens that can still be minted
     */
    function getRemainingSupply() external view returns (uint256) {
        uint256 currentSupply = totalSupply();
        if (currentSupply >= MAX_SUPPLY) {
            return 0;
        }
        return MAX_SUPPLY - currentSupply;
    }

    /**
     * @notice Check if an address has claimed airdrop
     * @param user Address to check
     * @return True if user has claimed, false otherwise
     */
    function hasUserClaimedAirdrop(address user) external view returns (bool) {
        return hasClaimedAirdrop[user];
    }
}


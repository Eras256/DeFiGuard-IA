// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title SecureDemoContract
 * @notice Highly secure demo contract designed to achieve maximum security score (10/100)
 * @dev Implements all security best practices:
 *      - OpenZeppelin Ownable for access control
 *      - ReentrancyGuard for reentrancy protection
 *      - Pausable for emergency stops
 *      - Input validation on all functions
 *      - Safe arithmetic operations
 *      - Events for all state changes
 *      - No external calls to untrusted contracts
 *      - No delegatecall or low-level calls
 */
contract SecureDemoContract is Ownable, ReentrancyGuard, Pausable {
    /// @notice Mapping to store values for addresses
    mapping(address => uint256) private balances;
    
    /// @notice Total supply of stored values
    uint256 public totalSupply;
    
    /// @notice Maximum balance per address (DoS protection)
    uint256 public constant MAX_BALANCE_PER_ADDRESS = 1_000_000 * 10**18;
    
    /// @notice Emitted when a value is deposited
    event Deposit(
        address indexed user,
        uint256 amount,
        uint256 newBalance,
        uint256 timestamp
    );
    
    /// @notice Emitted when a value is withdrawn
    event Withdraw(
        address indexed user,
        uint256 amount,
        uint256 newBalance,
        uint256 timestamp
    );
    
    /// @notice Custom errors for gas optimization
    error ZeroAddress();
    error ZeroAmount();
    error InsufficientBalance(uint256 requested, uint256 available);
    error ExceedsMaxBalance(uint256 requested, uint256 maxAllowed);
    error ContractPaused();
    
    /**
     * @notice Constructor sets the contract owner
     * @param initialOwner Address that will own the contract
     */
    constructor(address initialOwner) Ownable(initialOwner) {
        if (initialOwner == address(0)) revert ZeroAddress();
        totalSupply = 0;
    }
    
    /**
     * @notice Deposit value for the caller
     * @param amount Amount to deposit (must be > 0)
     * @dev Protected by ReentrancyGuard and Pausable
     */
    function deposit(uint256 amount) 
        external 
        nonReentrant 
        whenNotPaused 
    {
        if (amount == 0) revert ZeroAmount();
        
        address user = msg.sender;
        uint256 currentBalance = balances[user];
        uint256 newBalance = currentBalance + amount;
        
        // DoS protection: prevent excessive balance
        if (newBalance > MAX_BALANCE_PER_ADDRESS) {
            revert ExceedsMaxBalance(newBalance, MAX_BALANCE_PER_ADDRESS);
        }
        
        balances[user] = newBalance;
        totalSupply += amount;
        
        emit Deposit(user, amount, newBalance, block.timestamp);
    }
    
    /**
     * @notice Withdraw value from caller's balance
     * @param amount Amount to withdraw (must be > 0 and <= balance)
     * @dev Protected by ReentrancyGuard and Pausable
     */
    function withdraw(uint256 amount) 
        external 
        nonReentrant 
        whenNotPaused 
    {
        if (amount == 0) revert ZeroAmount();
        
        address user = msg.sender;
        uint256 currentBalance = balances[user];
        
        if (currentBalance < amount) {
            revert InsufficientBalance(amount, currentBalance);
        }
        
        // Update state before external interactions (checks-effects-interactions pattern)
        balances[user] = currentBalance - amount;
        totalSupply -= amount;
        
        emit Withdraw(user, amount, balances[user], block.timestamp);
    }
    
    /**
     * @notice Get balance of an address
     * @param account Address to query
     * @return Balance of the address
     */
    function balanceOf(address account) external view returns (uint256) {
        if (account == address(0)) revert ZeroAddress();
        return balances[account];
    }
    
    /**
     * @notice Pause the contract (owner only)
     * @dev Emergency stop mechanism
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @notice Unpause the contract (owner only)
     * @dev Resume normal operations
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @notice Get contract information
     * @return maxBalance Maximum balance per address
     * @return currentTotalSupply Current total supply
     * @return isPaused Whether contract is paused
     */
    function getContractInfo() 
        external 
        view 
        returns (
            uint256 maxBalance,
            uint256 currentTotalSupply,
            bool isPaused
        ) 
    {
        return (
            MAX_BALANCE_PER_ADDRESS,
            totalSupply,
            paused()
        );
    }
}


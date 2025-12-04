// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GuardToken is ERC20, Ownable {
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18; // 1 billion tokens
    
    mapping(address => bool) public hasClaimedAirdrop;
    uint256 public constant AIRDROP_AMOUNT = 100 * 10**18; // 100 tokens

    event AirdropClaimed(address indexed user, uint256 amount);
    event StakingReward(address indexed user, uint256 amount);

    constructor() ERC20("DeFiGuard Token", "GUARD") Ownable(msg.sender) {
        _mint(msg.sender, MAX_SUPPLY / 10); // 10% to treasury
    }

    function claimAirdrop() external {
        require(!hasClaimedAirdrop[msg.sender], "Already claimed");
        require(totalSupply() + AIRDROP_AMOUNT <= MAX_SUPPLY, "Max supply reached");
        
        hasClaimedAirdrop[msg.sender] = true;
        _mint(msg.sender, AIRDROP_AMOUNT);
        
        emit AirdropClaimed(msg.sender, AIRDROP_AMOUNT);
    }

    function mintReward(address to, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "Max supply reached");
        _mint(to, amount);
        emit StakingReward(to, amount);
    }
}


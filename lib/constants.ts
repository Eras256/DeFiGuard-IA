// Contract addresses deployed on Base Sepolia (Updated - December 2025)
// UPDATED: AuditRegistry now includes contractOwner mapping
// UPDATED: GuardNFT now allows contract owners to mint badges directly

// Helper function to normalize contract addresses (trim and validate)
function normalizeAddress(address: string | undefined): string {
  if (!address) return "";
  return address.trim();
}

export const CONTRACT_ADDRESSES = {
  AUDIT_REGISTRY: normalizeAddress(process.env.NEXT_PUBLIC_AUDIT_REGISTRY_ADDRESS) || "0x6D3d5487c41E1759b5457f5C29f8d41caC51a8eF",
  GUARD_NFT: normalizeAddress(process.env.NEXT_PUBLIC_GUARD_NFT_ADDRESS) || "0xE429b1AFD7BDd12ceDB69777538f5925CB6CeF52",
  GUARD_TOKEN: normalizeAddress(process.env.NEXT_PUBLIC_GUARD_TOKEN_ADDRESS) || "0xBc3035ed036B280AdB9A6Ad19a46089E39e2eDED",
} as const;

export const SUPPORTED_CHAINS = {
  baseSepolia: {
    id: 84532,
    name: "Base Sepolia",
    rpcUrl: process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC!,
    explorer: "https://sepolia.basescan.org",
    nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
  },
  arbitrumSepolia: {
    id: 421614,
    name: "Arbitrum Sepolia",
    rpcUrl: process.env.NEXT_PUBLIC_ARBITRUM_SEPOLIA_RPC!,
    explorer: "https://sepolia.arbiscan.io",
    nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
  },
  sepolia: {
    id: 11155111,
    name: "Ethereum Sepolia",
    rpcUrl: process.env.NEXT_PUBLIC_ETHEREUM_SEPOLIA_RPC!,
    explorer: "https://sepolia.etherscan.io",
    nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
  },
};

export const VULNERABILITY_TYPES = [
  "Reentrancy",
  "Integer Overflow/Underflow",
  "Unchecked Return Values",
  "Access Control",
  "Denial of Service",
  "Front-Running",
  "Timestamp Dependence",
  "Delegatecall to Untrusted",
  "Uninitialized Storage",
  "tx.origin Authentication",
];

export const FAMOUS_EXPLOITS = [
  { name: "DAO Hack", year: 2016, loss: "$60M", type: "Reentrancy" },
  { name: "Parity Wallet", year: 2017, loss: "$280M", type: "Uninitialized" },
  { name: "Nomad Bridge", year: 2022, loss: "$190M", type: "Access Control" },
  { name: "Ronin Bridge", year: 2022, loss: "$625M", type: "Key Management" },
  { name: "Wormhole", year: 2022, loss: "$325M", type: "Signature Verification" },
];

export const SAMPLE_VULNERABLE_CONTRACT = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title SecureToken
 * @notice Demo contract with good security practices for testing
 * @dev This contract follows security best practices and should have a low risk score
 */
contract SecureToken {
    mapping(address => uint256) private balances;
    address public owner;
    uint256 public totalSupply;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Mint(address indexed to, uint256 value);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }
    
    constructor() {
        owner = msg.sender;
        totalSupply = 0;
    }
    
    function mint(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "Cannot mint to zero address");
        balances[to] += amount;
        totalSupply += amount;
        emit Mint(to, amount);
        emit Transfer(address(0), to, amount);
    }
    
    function transfer(address to, uint256 amount) external {
        require(to != address(0), "Cannot transfer to zero address");
        require(balances[msg.sender] >= amount, "Insufficient balance");
        
        balances[msg.sender] -= amount;
        balances[to] += amount;
        
        emit Transfer(msg.sender, to, amount);
    }
    
    function balanceOf(address account) external view returns (uint256) {
        return balances[account];
    }
}`;


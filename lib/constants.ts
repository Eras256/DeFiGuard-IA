// Contract addresses deployed on Base Sepolia
export const CONTRACT_ADDRESSES = {
  AUDIT_REGISTRY: process.env.NEXT_PUBLIC_AUDIT_REGISTRY_ADDRESS || "0x9641E3A58aBe4c3a7320c3d176Da265A3a523F08",
  GUARD_NFT: process.env.NEXT_PUBLIC_GUARD_NFT_ADDRESS || "0xc838c5486eD3Cc6EFA08Ac12747a4270Cc19405b",
  GUARD_TOKEN: process.env.NEXT_PUBLIC_GUARD_TOKEN_ADDRESS || "0x3d9f4d386b2a2C2bCdDC141aFD4593fCc9363440",
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

contract VulnerableBank {
    mapping(address => uint256) public balances;
    
    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }
    
    // VULNERABLE: Reentrancy attack possible
    function withdraw(uint256 amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
        
        balances[msg.sender] -= amount; // State update AFTER external call!
    }
    
    function getBalance() public view returns (uint256) {
        return balances[msg.sender];
    }
}`;


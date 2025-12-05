import { getContract, readContract } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";
import { createThirdwebClient } from "thirdweb";
import { CONTRACT_ADDRESSES } from "@/lib/constants";

const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "",
});

// ABI for GuardNFT
const GUARD_NFT_ABI = [
  {
    type: "function",
    name: "getBadgeInfo",
    inputs: [{ name: "tokenId", type: "uint256", internalType: "uint256" }],
    outputs: [
      { name: "contractAddress", type: "address", internalType: "address" },
      { name: "riskScore", type: "uint256", internalType: "uint256" },
      { name: "timestamp", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getBadgeByContract",
    inputs: [{ name: "contractAddress", type: "address", internalType: "address" }],
    outputs: [{ name: "tokenId", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isContractCertified",
    inputs: [{ name: "contractAddress", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "totalSupply",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "ownerOf",
    inputs: [{ name: "tokenId", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "balanceOf",
    inputs: [{ name: "owner", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "tokenURI",
    inputs: [{ name: "tokenId", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "string", internalType: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "mintBadge",
    inputs: [
      { name: "to", type: "address", internalType: "address" },
      { name: "auditedContract", type: "address", internalType: "address" },
      { name: "riskScore", type: "uint256", internalType: "uint256" },
      { name: "uri", type: "string", internalType: "string" },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "requestBadge",
    inputs: [
      { name: "auditedContract", type: "address", internalType: "address" },
      { name: "riskScore", type: "uint256", internalType: "uint256" },
      { name: "uri", type: "string", internalType: "string" },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "auditRegistry",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "setAuditRegistry",
    inputs: [{ name: "_auditRegistry", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
] as const;

export interface BadgeInfo {
  contractAddress: string;
  riskScore: bigint;
  timestamp: bigint;
}

/**
 * Validate Ethereum address format
 */
function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export function getGuardNFTContract() {
  const address = CONTRACT_ADDRESSES.GUARD_NFT;
  
  if (!isValidAddress(address)) {
    throw new Error(`Invalid GuardNFT contract address: ${address}`);
  }
  
  return getContract({
    client,
    chain: baseSepolia,
    address: address as `0x${string}`,
    abi: GUARD_NFT_ABI,
  });
}

export async function getBadgeInfo(tokenId: bigint): Promise<BadgeInfo | null> {
  try {
    const contract = getGuardNFTContract();
    const badge = await readContract({
      contract,
      method: "getBadgeInfo",
      params: [tokenId],
    });
    
    // Type assertion for tuple return
    const badgeTuple = badge as readonly [string, bigint, bigint];
    
    return {
      contractAddress: badgeTuple[0],
      riskScore: badgeTuple[1],
      timestamp: badgeTuple[2],
    };
  } catch (error) {
    console.error("Error fetching badge info:", error);
    return null;
  }
}

export async function getBadgeByContract(contractAddress: string): Promise<bigint> {
  try {
    const contract = getGuardNFTContract();
    const tokenId = await readContract({
      contract,
      method: "getBadgeByContract",
      params: [contractAddress as `0x${string}`],
    });
    return tokenId as bigint;
  } catch (error) {
    console.error("Error fetching badge by contract:", error);
    return 0n;
  }
}

export async function isContractCertified(contractAddress: string): Promise<boolean> {
  try {
    const contract = getGuardNFTContract();
    const result = await readContract({
      contract,
      method: "isContractCertified",
      params: [contractAddress as `0x${string}`],
    });
    return result as boolean;
  } catch (error) {
    console.error("Error checking certification:", error);
    return false;
  }
}

export async function getTotalSupply(): Promise<bigint> {
  try {
    const contract = getGuardNFTContract();
    const result = await readContract({
      contract,
      method: "totalSupply",
      params: [],
    });
    return result as bigint;
  } catch (error) {
    console.error("Error fetching total supply:", error);
    return 0n;
  }
}

export async function ownerOf(tokenId: bigint): Promise<string> {
  try {
    const contract = getGuardNFTContract();
    const result = await readContract({
      contract,
      method: "ownerOf",
      params: [tokenId],
    });
    return result as string;
  } catch (error) {
    console.error("Error fetching owner:", error);
    throw error;
  }
}

export async function balanceOf(owner: string): Promise<bigint> {
  try {
    const contract = getGuardNFTContract();
    const result = await readContract({
      contract,
      method: "balanceOf",
      params: [owner as `0x${string}`],
    });
    return result as bigint;
  } catch (error) {
    console.error("Error fetching balance:", error);
    return 0n;
  }
}


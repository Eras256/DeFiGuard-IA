import { getContract, readContract } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";
import { createThirdwebClient } from "thirdweb";
import { CONTRACT_ADDRESSES } from "./audit-registry";

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
] as const;

export interface BadgeInfo {
  contractAddress: string;
  riskScore: bigint;
  timestamp: bigint;
}

export function getGuardNFTContract() {
  return getContract({
    client,
    chain: baseSepolia,
    address: CONTRACT_ADDRESSES.GUARD_NFT,
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


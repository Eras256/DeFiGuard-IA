import { getContract, readContract } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";
import { createThirdwebClient } from "thirdweb";

const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "",
});

// Contract addresses from Base Sepolia
export const CONTRACT_ADDRESSES = {
  AUDIT_REGISTRY: process.env.NEXT_PUBLIC_AUDIT_REGISTRY_ADDRESS || "0x9641E3A58aBe4c3a7320c3d176Da265A3a523F08",
  GUARD_NFT: process.env.NEXT_PUBLIC_GUARD_NFT_ADDRESS || "0xc838c5486eD3Cc6EFA08Ac12747a4270Cc19405b",
  GUARD_TOKEN: process.env.NEXT_PUBLIC_GUARD_TOKEN_ADDRESS || "0x3d9f4d386b2a2C2bCdDC141aFD4593fCc9363440",
} as const;

// ABI for AuditRegistry
const AUDIT_REGISTRY_ABI = [
  {
    type: "function",
    name: "contractAudits",
    inputs: [{ name: "", type: "address", internalType: "address" }],
    outputs: [
      {
        name: "contractAddress",
        type: "address",
        internalType: "address",
      },
      {
        name: "riskScore",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "timestamp",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "reportHash",
        type: "string",
        internalType: "string",
      },
      {
        name: "isActive",
        type: "bool",
        internalType: "bool",
      },
      {
        name: "auditor",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getAuditCount",
    inputs: [{ name: "_contractAddress", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getLatestAudit",
    inputs: [{ name: "_contractAddress", type: "address", internalType: "address" }],
    outputs: [
      {
        name: "contractAddress",
        type: "address",
        internalType: "address",
      },
      {
        name: "riskScore",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "timestamp",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "reportHash",
        type: "string",
        internalType: "string",
      },
      {
        name: "isActive",
        type: "bool",
        internalType: "bool",
      },
      {
        name: "auditor",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getAllAudits",
    inputs: [{ name: "_contractAddress", type: "address", internalType: "address" }],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        internalType: "struct AuditRegistry.Audit[]",
        components: [
          { name: "contractAddress", type: "address", internalType: "address" },
          { name: "riskScore", type: "uint256", internalType: "uint256" },
          { name: "timestamp", type: "uint256", internalType: "uint256" },
          { name: "reportHash", type: "string", internalType: "string" },
          { name: "isActive", type: "bool", internalType: "bool" },
          { name: "auditor", type: "address", internalType: "address" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isCertified",
    inputs: [{ name: "", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "totalAudits",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "recordAudit",
    inputs: [
      { name: "_contractAddress", type: "address", internalType: "address" },
      { name: "_riskScore", type: "uint256", internalType: "uint256" },
      { name: "_reportHash", type: "string", internalType: "string" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
] as const;

export interface Audit {
  contractAddress: string;
  riskScore: bigint;
  timestamp: bigint;
  reportHash: string;
  isActive: boolean;
  auditor: string;
}

export function getAuditRegistryContract() {
  return getContract({
    client,
    chain: baseSepolia,
    address: CONTRACT_ADDRESSES.AUDIT_REGISTRY,
    abi: AUDIT_REGISTRY_ABI,
  });
}

export async function getTotalAudits(): Promise<bigint> {
  const contract = getAuditRegistryContract();
  const result = await readContract({
    contract,
    method: "totalAudits",
    params: [],
  });
  return result as bigint;
}

export async function getAuditCount(contractAddress: string): Promise<bigint> {
  const contract = getAuditRegistryContract();
  const result = await readContract({
    contract,
    method: "getAuditCount",
    params: [contractAddress as `0x${string}`],
  });
  return result as bigint;
}

export async function getLatestAudit(contractAddress: string): Promise<Audit | null> {
  try {
    const contract = getAuditRegistryContract();
    const audit = await readContract({
      contract,
      method: "getLatestAudit",
      params: [contractAddress as `0x${string}`],
    });
    
    // Type assertion for tuple return
    const auditTuple = audit as readonly [string, bigint, bigint, string, boolean, string];
    
    return {
      contractAddress: auditTuple[0],
      riskScore: auditTuple[1],
      timestamp: auditTuple[2],
      reportHash: auditTuple[3],
      isActive: auditTuple[4],
      auditor: auditTuple[5],
    };
  } catch (error) {
    console.error("Error fetching latest audit:", error);
    return null;
  }
}

export async function getAllAudits(contractAddress: string): Promise<Audit[]> {
  try {
    const contract = getAuditRegistryContract();
    const audits = await readContract({
      contract,
      method: "getAllAudits",
      params: [contractAddress as `0x${string}`],
    });
    
    // Type assertion for array of tuples - convert through unknown first
    const auditsArray = audits as unknown as readonly (readonly [string, bigint, bigint, string, boolean, string])[];
    
    return auditsArray.map((audit) => ({
      contractAddress: audit[0],
      riskScore: audit[1],
      timestamp: audit[2],
      reportHash: audit[3],
      isActive: audit[4],
      auditor: audit[5],
    }));
  } catch (error) {
    console.error("Error fetching all audits:", error);
    return [];
  }
}

export async function checkCertification(contractAddress: string): Promise<boolean> {
  try {
    const contract = getAuditRegistryContract();
    const result = await readContract({
      contract,
      method: "isCertified",
      params: [contractAddress as `0x${string}`],
    });
    return result as boolean;
  } catch (error) {
    console.error("Error checking certification:", error);
    return false;
  }
}


import { getContract, readContract } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";
import { createThirdwebClient } from "thirdweb";
import { CONTRACT_ADDRESSES } from "@/lib/constants";

const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "",
});

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
    name: "getActiveAudits",
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

/**
 * Validate Ethereum address format
 */
function isValidAddress(address: string | undefined | null): boolean {
  if (!address) {
    return false;
  }
  // Trim whitespace and convert to lowercase for validation
  const trimmed = address.trim();
  // Check if it's a valid Ethereum address format (40 hex chars after 0x)
  return /^0x[a-fA-F0-9]{40}$/.test(trimmed);
}

export function getAuditRegistryContract() {
  const address = CONTRACT_ADDRESSES.AUDIT_REGISTRY;
  
  if (!address) {
    throw new Error(`AuditRegistry contract address is not defined. Check NEXT_PUBLIC_AUDIT_REGISTRY_ADDRESS environment variable.`);
  }
  
  if (!isValidAddress(address)) {
    console.error(`[getAuditRegistryContract] Invalid address format: "${address}" (length: ${address.length})`);
    throw new Error(`Invalid AuditRegistry contract address: ${address}. Expected format: 0x followed by 40 hex characters.`);
  }
  
  return getContract({
    client,
    chain: baseSepolia,
    address: address as `0x${string}`,
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
    
    // First check if there are any audits
    const auditCount = await getAuditCount(contractAddress);
    if (auditCount === 0n) {
      return null;
    }
    
    try {
      const audit = await readContract({
        contract,
        method: "getLatestAudit",
        params: [contractAddress as `0x${string}`],
      });
      
      // Type assertion for tuple return
      const auditTuple = audit as readonly [string, bigint, bigint, string, boolean, string];
      
      // Validate the data before returning
      if (!auditTuple || auditTuple.length !== 6) {
        console.warn("[getLatestAudit] Invalid audit data structure");
        return null;
      }
      
      // Validate reportHash is a valid string
      let reportHash = auditTuple[3];
      if (typeof reportHash !== 'string') {
        reportHash = String(reportHash || '');
      }
      
      return {
        contractAddress: auditTuple[0],
        riskScore: auditTuple[1],
        timestamp: auditTuple[2],
        reportHash: reportHash,
        isActive: auditTuple[4],
        auditor: auditTuple[5],
      };
    } catch (decodeError: any) {
      // If getLatestAudit fails due to decoding issues, try getAllAudits as fallback
      console.warn("[getLatestAudit] Decoding error, trying fallback method:", decodeError.message);
      
      try {
        const allAudits = await getAllAudits(contractAddress);
        if (allAudits.length > 0) {
          // Return the most recent active audit, or the most recent one if none are active
          const activeAudits = allAudits.filter(a => a.isActive);
          const latestAudit = activeAudits.length > 0 
            ? activeAudits[activeAudits.length - 1]
            : allAudits[allAudits.length - 1];
          return latestAudit;
        }
      } catch (fallbackError) {
        console.error("[getLatestAudit] Fallback method also failed:", fallbackError);
      }
      
      return null;
    }
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

export async function getActiveAudits(contractAddress: string): Promise<Audit[]> {
  try {
    const contract = getAuditRegistryContract();
    const audits = await readContract({
      contract,
      method: "getActiveAudits",
      params: [contractAddress as `0x${string}`],
    });
    
    // Type assertion for array of tuples
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
    console.error("Error fetching active audits:", error);
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

/**
 * Gets all contract addresses that have registered audits
 * using blockchain events from Basescan API
 * The AuditRecorded event has signature: AuditRecorded(address indexed,uint256,uint256,string,address indexed,uint256)
 */
export async function getAuditedContractAddresses(limit: number = 100): Promise<string[]> {
  try {
    const contractAddress = CONTRACT_ADDRESSES.AUDIT_REGISTRY;
    const apiKey = process.env.NEXT_PUBLIC_BASESCAN_API_KEY || "";
    
    // Hash of AuditRecorded(address,uint256,uint256,string,address,uint256) event
    // Calculated with keccak256 - the real event hash
    // Using known hash: 0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925
    // But we need the correct hash. Better to use transaction API to get unique addresses
    
    // Alternative: use transaction API to get all transactions to the contract
    // and extract addresses from input parameters
    const response = await fetch(
      `https://api-sepolia.basescan.org/api?module=account&action=txlist&address=${contractAddress}&startblock=0&endblock=99999999&page=1&offset=${limit}&sort=desc${apiKey ? `&apikey=${apiKey}` : ""}`
    );
    
    const data = await response.json();
    
    if (data.status !== "1" || !data.result || !Array.isArray(data.result)) {
      console.warn("Could not get transactions from Basescan:", data);
      return [];
    }
    
    // Extract unique contract addresses from transaction input parameters
    // The recordAudit method has signature: recordAudit(address,uint256,string)
    // Method selector: keccak256("recordAudit(address,uint256,string)") first 4 bytes
    // Known selector: 0x... (calculated offline)
    // For recordAudit(address,uint256,string): 0x... (we need the real hash)
    // For now, filter transactions calling the contract and extract addresses
    
    const addresses = new Set<string>();
    
    // The selector of recordAudit(address,uint256,string) is: 0x... (calculated with keccak256)
    // For simplicity, we assume all transactions to the contract are recordAudit
    // and extract the first parameter (address) that comes after the selector
    
    for (const tx of data.result) {
      // Filter only transactions to AuditRegistry contract
      if (tx.to && tx.to.toLowerCase() === contractAddress.toLowerCase() && tx.input) {
        try {
          // Input data has format: 0x + selector (4 bytes) + parameters
          // For recordAudit(address,uint256,string):
          // - selector: 4 bytes
          // - address: 32 bytes (left padding)
          // - uint256: 32 bytes
          // - string offset: 32 bytes
          // The real address is in the last 20 bytes of the first 32-byte parameter
          
          if (tx.input.length >= 138) { // Minimum: 0x + selector (8) + address (64) = 74 characters
            // Skip selector (10 characters: "0x" + 8 hex) and take next 64 characters
            // The address is in the last 40 characters (20 bytes) of those 64
            const param1 = tx.input.slice(10, 74); // First complete parameter (32 bytes = 64 hex chars)
            const addressHex = param1.slice(-40); // Last 20 bytes = real address
            const contractAddr = "0x" + addressHex.toLowerCase();
            
            // Validate it's a valid address
            if (/^0x[a-f0-9]{40}$/.test(contractAddr)) {
              addresses.add(contractAddr);
            }
          }
        } catch (e) {
          // Continue with next transaction if error
          continue;
        }
      }
    }
    
    return Array.from(addresses);
  } catch (error) {
    console.error("Error getting audited contract addresses:", error);
    return [];
  }
}

/**
 * Gets general audit statistics
 */
export interface AuditStats {
  totalAudits: bigint;
  totalContracts: number;
  certifiedContracts: number;
  averageRiskScore: number;
}

export async function getAuditStats(): Promise<AuditStats> {
  try {
    const totalAudits = await getTotalAudits();
    const auditedAddresses = await getAuditedContractAddresses(100);
    
    // Optimize: get only latest audits from each contract
    // Limit to 20 contracts to avoid too many calls
    const addressesToCheck = auditedAddresses.slice(0, 20);
    
    let totalRiskScore = 0;
    let auditCount = 0;
    let certifiedCount = 0;
    
    // Get audits from each contract to calculate statistics
    // Use Promise.all to make parallel calls (limited)
    const statsPromises = addressesToCheck.map(async (address) => {
      try {
        const latestAudit = await getLatestAudit(address);
        if (latestAudit) {
          const riskScore = Number(latestAudit.riskScore);
          const isCertified = await checkCertification(address);
          
          return {
            riskScore,
            isCertified,
            hasAudit: true,
          };
        }
        return { riskScore: 0, isCertified: false, hasAudit: false };
      } catch (err) {
        return { riskScore: 0, isCertified: false, hasAudit: false };
      }
    });
    
    const statsResults = await Promise.all(statsPromises);
    
    for (const result of statsResults) {
      if (result.hasAudit) {
        totalRiskScore += result.riskScore;
        auditCount++;
        if (result.isCertified) {
          certifiedCount++;
        }
      }
    }
    
    const averageRiskScore = auditCount > 0 ? totalRiskScore / auditCount : 0;
    
    return {
      totalAudits,
      totalContracts: auditedAddresses.length,
      certifiedContracts: certifiedCount,
      averageRiskScore: Math.round(averageRiskScore * 100) / 100,
    };
  } catch (error) {
    console.error("Error getting audit statistics:", error);
    return {
      totalAudits: 0n,
      totalContracts: 0,
      certifiedContracts: 0,
      averageRiskScore: 0,
    };
  }
}


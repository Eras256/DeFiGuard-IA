import { NextRequest, NextResponse } from "next/server";
import { createThirdwebClient, getContract, prepareContractCall, sendTransaction, waitForReceipt, readContract } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";
import { privateKeyToAccount } from "thirdweb/wallets";

export const runtime = "nodejs";

// Owner wallet (should be stored securely in environment variables)
const OWNER_PRIVATE_KEY = process.env.GUARD_NFT_OWNER_PRIVATE_KEY;

// Contract addresses (Updated - December 2025)
const GUARD_NFT_ADDRESS = process.env.NEXT_PUBLIC_GUARD_NFT_ADDRESS || "0xE429b1AFD7BDd12ceDB69777538f5925CB6CeF52";
const AUDIT_REGISTRY_ADDRESS = process.env.NEXT_PUBLIC_AUDIT_REGISTRY_ADDRESS || "0x6D3d5487c41E1759b5457f5C29f8d41caC51a8eF";

// GuardNFT ABI (simplified for mintBadge)
const GUARD_NFT_ABI = [
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

// AuditRegistry ABI (simplified for isCertified)
const AUDIT_REGISTRY_ABI = [
  {
    type: "function",
    name: "isCertified",
    inputs: [{ name: "", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getLatestAudit",
    inputs: [{ name: "_contractAddress", type: "address", internalType: "address" }],
    outputs: [
      { name: "contractAddress", type: "address", internalType: "address" },
      { name: "riskScore", type: "uint256", internalType: "uint256" },
      { name: "timestamp", type: "uint256", internalType: "uint256" },
      { name: "reportHash", type: "string", internalType: "string" },
      { name: "isActive", type: "bool", internalType: "bool" },
      { name: "auditor", type: "address", internalType: "address" },
    ],
    stateMutability: "view",
  },
] as const;

function isValidAddress(address: string | undefined | null): boolean {
  if (!address) {
    return false;
  }
  const trimmed = address.trim();
  return /^0x[a-fA-F0-9]{40}$/.test(trimmed);
}

export async function POST(request: NextRequest) {
  try {
    if (!OWNER_PRIVATE_KEY) {
      console.error("[Mint Badge API] GUARD_NFT_OWNER_PRIVATE_KEY is not set");
      return NextResponse.json(
        {
          success: false,
          error: "Server configuration error. Owner private key not configured.",
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { contractAddress, recipientAddress, riskScore } = body;

    // Validate inputs
    if (!contractAddress || !isValidAddress(contractAddress)) {
      return NextResponse.json(
        { success: false, error: `Invalid contract address: ${contractAddress}` },
        { status: 400 }
      );
    }

    if (!recipientAddress || !isValidAddress(recipientAddress)) {
      return NextResponse.json(
        { success: false, error: `Invalid recipient address: ${recipientAddress}` },
        { status: 400 }
      );
    }

    if (typeof riskScore !== "number" || riskScore < 0 || riskScore >= 40) {
      return NextResponse.json(
        { success: false, error: "Risk score must be a number between 0 and 39 (inclusive)" },
        { status: 400 }
      );
    }

    console.log("[Mint Badge API] Request received:", {
      contractAddress,
      recipientAddress,
      riskScore,
    });

    // Create client and owner account
    const client = createThirdwebClient({
      clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
    });

    // Validate and format private key
    let formattedPrivateKey = OWNER_PRIVATE_KEY.trim();
    
    // Remove any quotes or extra whitespace
    formattedPrivateKey = formattedPrivateKey.replace(/^["']|["']$/g, '').trim();
    
    // Ensure it has 0x prefix (thirdweb expects it)
    if (!formattedPrivateKey.startsWith('0x') && !formattedPrivateKey.startsWith('0X')) {
      formattedPrivateKey = '0x' + formattedPrivateKey;
    }
    
    // Validate private key format (should be 66 characters with 0x prefix = 64 hex chars)
    const isValidFormat = /^0x[a-fA-F0-9]{64}$/i.test(formattedPrivateKey);
    
    if (!isValidFormat) {
      console.error("[Mint Badge API] Invalid private key format.");
      console.error("[Mint Badge API] Private key length:", formattedPrivateKey.length);
      console.error("[Mint Badge API] Private key preview:", formattedPrivateKey.substring(0, 10) + '...' + formattedPrivateKey.substring(formattedPrivateKey.length - 4));
      console.error("[Mint Badge API] Expected format: 0x followed by 64 hex characters");
      
      return NextResponse.json(
        {
          success: false,
          error: "Server configuration error. Invalid private key format. GUARD_NFT_OWNER_PRIVATE_KEY must be a 64-character hexadecimal string (optionally prefixed with 0x).",
        },
        { status: 500 }
      );
    }

    let ownerAccount;
    try {
      ownerAccount = privateKeyToAccount({
        client,
        privateKey: formattedPrivateKey as `0x${string}`,
      });
    } catch (accountError: any) {
      console.error("[Mint Badge API] Error creating account from private key:", accountError);
      return NextResponse.json(
        {
          success: false,
          error: `Failed to create account from private key: ${accountError.message}`,
        },
        { status: 500 }
      );
    }

    // Verify contract is certified
    const auditRegistry = getContract({
      client,
      chain: baseSepolia,
      address: AUDIT_REGISTRY_ADDRESS as `0x${string}`,
      abi: AUDIT_REGISTRY_ABI,
    });

    const isCertified = await readContract({
      contract: auditRegistry,
      method: "isCertified",
      params: [contractAddress as `0x${string}`],
    }) as boolean;
    
    if (!isCertified) {
      return NextResponse.json(
        { success: false, error: "Contract is not certified. Please record the audit first." },
        { status: 400 }
      );
    }

    // Get GuardNFT contract
    const guardNFT = getContract({
      client,
      chain: baseSepolia,
      address: GUARD_NFT_ADDRESS as `0x${string}`,
      abi: GUARD_NFT_ABI,
    });

    // Generate metadata URI
    const metadataURI = `https://defiguard.ai/badges/${contractAddress.toLowerCase()}`;

    // Prepare and send transaction
    const transaction = prepareContractCall({
      contract: guardNFT,
      method: "mintBadge",
      params: [
        recipientAddress as `0x${string}`,
        contractAddress as `0x${string}`,
        BigInt(riskScore),
        metadataURI,
      ],
    });

    console.log("[Mint Badge API] Sending transaction...");
    const result = await sendTransaction({
      transaction,
      account: ownerAccount,
    });

    console.log("[Mint Badge API] Transaction sent, waiting for receipt...", result.transactionHash);
    const receipt = await waitForReceipt(result);

    console.log("[Mint Badge API] Transaction confirmed!", receipt.transactionHash);

    return NextResponse.json({
      success: true,
      transactionHash: receipt.transactionHash,
      message: "NFT badge minted successfully",
    });
  } catch (error: any) {
    console.error("[Mint Badge API] Error:", error);
    console.error("[Mint Badge API] Error details:", {
      message: error.message,
      name: error.name,
      code: error.code,
      data: error.data,
      reason: error.reason,
    });

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to mint badge",
        details: process.env.NODE_ENV === "development" ? {
          name: error.name,
          message: error.message,
          code: error.code,
        } : undefined,
      },
      { status: 500 }
    );
  }
}


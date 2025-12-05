import { NextRequest, NextResponse } from "next/server";
import { getContract, prepareContractCall } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";
import { createThirdwebClient } from "thirdweb";
import { CONTRACT_ADDRESSES } from "@/lib/constants";

const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "",
});

// This is a server-side helper - actual transactions should be sent from client
export async function POST(request: NextRequest) {
  try {
    const { contractAddress, riskScore, reportHash } = await request.json();

    if (!contractAddress || riskScore === undefined || !reportHash) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Validate inputs
    if (riskScore < 0 || riskScore > 100) {
      return NextResponse.json(
        { error: "Risk score must be between 0 and 100" },
        { status: 400 }
      );
    }

    // Return transaction data for client to sign
    const contract = getContract({
      client,
      chain: baseSepolia,
      address: CONTRACT_ADDRESSES.AUDIT_REGISTRY,
      abi: [
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
      ],
    });

    const transaction = prepareContractCall({
      contract,
      method: "recordAudit",
      params: [contractAddress as `0x${string}`, BigInt(riskScore), reportHash],
    });

    return NextResponse.json({
      success: true,
      message: "Transaction prepared. Sign in wallet to complete.",
      transaction: {
        to: CONTRACT_ADDRESSES.AUDIT_REGISTRY,
        data: transaction.data,
        value: "0",
      },
    });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to prepare transaction" },
      { status: 500 }
    );
  }
}


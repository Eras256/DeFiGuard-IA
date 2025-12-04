"use client";

import { prepareContractCall, sendTransaction, waitForReceipt } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";
import { getAuditRegistryContract } from "./audit-registry";
import type { Account } from "thirdweb/wallets";

export async function recordAuditOnChain(
  contractAddress: string,
  riskScore: number,
  reportHash: string,
  account: Account
): Promise<string> {
  if (!account) {
    throw new Error("Wallet not connected");
  }

  console.log("[recordAuditOnChain] Preparing transaction...", {
    contractAddress,
    riskScore,
    reportHash,
    accountAddress: account.address,
  });

  const auditRegistry = getAuditRegistryContract();
  
  try {
    const transaction = prepareContractCall({
      contract: auditRegistry,
      method: "recordAudit",
      params: [contractAddress as `0x${string}`, BigInt(riskScore), reportHash],
    });

    console.log("[recordAuditOnChain] Transaction prepared, sending...");

    const result = await sendTransaction({
      transaction,
      account,
    });

    console.log("[recordAuditOnChain] Transaction sent, waiting for receipt...", result.transactionHash);

    const receipt = await waitForReceipt(result);
    
    console.log("[recordAuditOnChain] Transaction confirmed!", receipt.transactionHash);
    
    return receipt.transactionHash;
  } catch (error: any) {
    console.error("[recordAuditOnChain] Error details:", {
      message: error.message,
      name: error.name,
      code: error.code,
      data: error.data,
      reason: error.reason,
      cause: error.cause,
    });
    throw error;
  }
}


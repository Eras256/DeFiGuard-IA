"use client";

import { prepareContractCall, sendTransaction, waitForReceipt, readContract } from "thirdweb";
import { getLatestAudit, checkCertification } from "./audit-registry";
import { getGuardNFTContract } from "./guard-nft";
import type { Account } from "thirdweb/wallets";

/**
 * Check if a contract is certified and eligible for NFT badge
 */
export async function checkCertificationStatus(contractAddress: string, providedRiskScore?: number): Promise<{
  isCertified: boolean;
  hasBadge: boolean;
  riskScore: number | null;
  canMintBadge: boolean;
}> {
  try {
    // Check if certified in AuditRegistry
    const isCertified = await checkCertification(contractAddress);

    // Get risk score - prefer provided score, otherwise try to fetch from contract
    let riskScore: number | null = providedRiskScore !== undefined ? providedRiskScore : null;
    
    // Only try to fetch from contract if not provided and certified
    if (riskScore === null && isCertified) {
      try {
        const latestAudit = await getLatestAudit(contractAddress);
        if (latestAudit && latestAudit.riskScore !== undefined) {
          riskScore = Number(latestAudit.riskScore);
        }
      } catch (e: any) {
        // Silently fail - we can still proceed if isCertified is true
        // The error is likely due to corrupted reportHash data in the contract
        console.warn("[checkCertificationStatus] Could not fetch risk score from contract:", e?.message?.substring(0, 100) || "Unknown error");
      }
    }

    // Check if badge already exists
    const guardNFT = getGuardNFTContract();
    let hasBadge = false;
    try {
      const badgeId = await readContract({
        contract: guardNFT,
        method: "getBadgeByContract",
        params: [contractAddress as `0x${string}`],
      }) as bigint;
      hasBadge = badgeId > 0n;
    } catch (e) {
      // No badge found
    }

    // Can mint if certified, no badge exists, and (risk score is null OR < 40)
    // If risk score is null but certified, we allow minting (certification check is the source of truth)
    const canMintBadge = isCertified && !hasBadge && (riskScore === null || riskScore < 40);

    return {
      isCertified,
      hasBadge,
      riskScore,
      canMintBadge,
    };
  } catch (error) {
    console.error("Error checking certification status:", error);
    return {
      isCertified: false,
      hasBadge: false,
      riskScore: null,
      canMintBadge: false,
    };
  }
}

/**
 * Mint NFT badge for a certified contract
 * Now users can mint directly from their wallet - no server needed!
 */
export async function mintBadgeForContract(
  contractAddress: string,
  recipientAddress: string,
  riskScore: number,
  account: Account
): Promise<string> {
  if (!account) {
    throw new Error("Wallet not connected");
  }

  // Validate contract address format
  if (!contractAddress || !contractAddress.startsWith("0x") || contractAddress.length !== 42) {
    throw new Error(`Invalid contract address format: ${contractAddress}`);
  }

  // Validate recipient address format
  if (!recipientAddress || !recipientAddress.startsWith("0x") || recipientAddress.length !== 42) {
    throw new Error(`Invalid recipient address format: ${recipientAddress}`);
  }

  // Verify contract is certified - pass riskScore to avoid fetching from contract
  const status = await checkCertificationStatus(contractAddress, riskScore);
  if (!status.isCertified) {
    throw new Error("Contract is not certified. Risk score must be < 40. Please record the audit first.");
  }

  if (status.hasBadge) {
    throw new Error("Contract already has a badge.");
  }

  if (riskScore >= 40) {
    throw new Error("Risk score must be < 40 to mint badge.");
  }

  console.log("[mintBadgeForContract] Minting badge directly from user wallet...", {
    contractAddress,
    recipientAddress,
    riskScore,
    accountAddress: account.address,
  });

  // Mint directly from user's wallet - no API needed!
  const guardNFT = getGuardNFTContract();
  
  // Generate metadata URI
  const metadataURI = `https://defiguard.ai/badges/${contractAddress.toLowerCase()}`;

  try {
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

    console.log("[mintBadgeForContract] Transaction prepared, sending...");
    const result = await sendTransaction({
      transaction,
      account,
    });

    console.log("[mintBadgeForContract] Transaction sent, waiting for receipt...", result.transactionHash);
    const receipt = await waitForReceipt(result);
    
    console.log("[mintBadgeForContract] Badge minted successfully!", receipt.transactionHash);
    return receipt.transactionHash;
  } catch (error: any) {
    console.error("[mintBadgeForContract] Error minting badge:", error);
    
    // Provide helpful error messages
    if (error.message?.includes("NotContractOwner") || error.message?.includes("not the owner")) {
      throw new Error("Only the owner of the audited contract can mint the certification badge. Make sure you are using the wallet that registered the audit.");
    }
    
    if (error.message?.includes("NotCertified") || error.message?.includes("not certified")) {
      throw new Error("Contract is not certified. Please record the audit first with a risk score < 40.");
    }
    
    if (error.message?.includes("BadgeAlreadyExists") || error.message?.includes("already exists")) {
      throw new Error("This contract already has a certification badge.");
    }
    
    throw error;
  }
}


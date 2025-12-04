"use client";

import { prepareContractCall, sendTransaction, waitForReceipt, readContract } from "thirdweb";
import { getLatestAudit, checkCertification } from "./audit-registry";
import { getGuardNFTContract } from "./guard-nft";
import type { Account } from "thirdweb/wallets";

/**
 * Check if a contract is certified and eligible for NFT badge
 */
export async function checkCertificationStatus(contractAddress: string): Promise<{
  isCertified: boolean;
  hasBadge: boolean;
  riskScore: number | null;
  canMintBadge: boolean;
}> {
  try {
    // Check if certified in AuditRegistry
    const isCertified = await checkCertification(contractAddress);

    // Get latest audit to check risk score
    let riskScore: number | null = null;
    try {
      const latestAudit = await getLatestAudit(contractAddress);
      if (latestAudit) {
        riskScore = Number(latestAudit.riskScore);
      }
    } catch (e) {
      // No audit found
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

    const canMintBadge = isCertified && !hasBadge && riskScore !== null && riskScore < 40;

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
 * Note: This requires the caller to be the owner of GuardNFT contract
 * For production, this should be called by a backend service or owner wallet
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

  // Verify contract is certified
  const status = await checkCertificationStatus(contractAddress);
  if (!status.isCertified) {
    throw new Error("Contract is not certified. Risk score must be < 40.");
  }

  if (status.hasBadge) {
    throw new Error("Contract already has a badge.");
  }

  if (riskScore >= 40) {
    throw new Error("Risk score must be < 40 to mint badge.");
  }

  const guardNFT = getGuardNFTContract();
  
  // Generate metadata URI (in production, this would be IPFS)
  const metadataURI = `https://defiguard.ai/badges/${contractAddress.toLowerCase()}`;

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

  const result = await sendTransaction({
    transaction,
    account,
  });

  const receipt = await waitForReceipt(result);
  return receipt.transactionHash;
}


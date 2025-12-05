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
      
      // Only consider it has badge if badgeId is greater than 0
      // badgeId = 0 means no badge exists
      hasBadge = badgeId !== undefined && badgeId !== null && badgeId > 0n;
      
      console.log("[checkCertificationStatus] Badge check:", {
        contractAddress,
        badgeId: badgeId?.toString(),
        hasBadge,
      });
    } catch (e: any) {
      // No badge found or error reading - assume no badge
      console.log("[checkCertificationStatus] No badge found or error:", e?.message || "Unknown error");
      hasBadge = false;
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

  // For demo addresses, allow multiple mints by generating unique contract address each time
  const isDemoAddress = contractAddress.toLowerCase().startsWith('0xd3a0');
  let finalContractAddress = contractAddress;
  let finalRiskScore = riskScore;
  
  if (isDemoAddress) {
    // Cap risk score at 20 for demo
    finalRiskScore = Math.min(riskScore, 20);
    
    // For demo, always generate a new unique address for each mint to allow unlimited mints
    // This ensures each mint gets its own badge without conflicts
    // Convert to lowercase to ensure valid address format
    const walletHash = account.address.toLowerCase().slice(2, 10); // First 8 chars of wallet (without 0x), lowercase
    const timestamp = Date.now().toString(16).slice(-6).padStart(6, '0');
    const random = Array.from({ length: 28 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    // 0x (2) + d3a0 (4) + walletHash (8) + timestamp (6) + random (22) = 42 chars
    // Convert to lowercase to ensure valid Ethereum address format
    finalContractAddress = `0xd3a0${walletHash}${timestamp}${random}`.slice(0, 42).toLowerCase();
    
    console.log("[mintBadgeForContract] Demo: Generating new address and recording audit:", finalContractAddress);
    
    // First record audit for the new address automatically
    const reportData = JSON.stringify({
      riskScore: finalRiskScore,
      vulnerabilities: 0,
      timestamp: Date.now(),
      summary: "Demo contract - automatically certified for NFT mint",
    });
    const reportHash = btoa(reportData).slice(0, 46);
    
    // Import recordAuditOnChain here to avoid circular dependency
    const { recordAuditOnChain } = await import('./record-audit');
    try {
      await recordAuditOnChain(finalContractAddress, finalRiskScore, reportHash, account);
      // Wait a bit for the transaction to confirm
      await new Promise(resolve => setTimeout(resolve, 3000));
    } catch (error: any) {
      console.error("[mintBadgeForContract] Error recording audit for new demo address:", error);
      throw new Error("Failed to prepare demo contract for minting. Please try again.");
    }
  }

  // Verify contract is certified - pass riskScore to avoid fetching from contract
  const status = await checkCertificationStatus(finalContractAddress, finalRiskScore);
  if (!status.isCertified) {
    throw new Error("Contract is not certified. Risk score must be < 40. Please record the audit first.");
  }

  if (status.hasBadge && !isDemoAddress) {
    throw new Error("Contract already has a badge.");
  }

  if (finalRiskScore >= 40) {
    throw new Error("Risk score must be < 40 to mint badge.");
  }

  console.log("[mintBadgeForContract] Minting badge directly from user wallet...", {
    originalContractAddress: contractAddress,
    finalContractAddress,
    recipientAddress,
    originalRiskScore: riskScore,
    finalRiskScore,
    isDemoAddress,
    accountAddress: account.address,
  });

  // Mint directly from user's wallet - no API needed!
  const guardNFT = getGuardNFTContract();
  
  // Generate metadata URI
  const metadataURI = `https://defiguard.ai/badges/${finalContractAddress.toLowerCase()}`;

  try {
    const transaction = prepareContractCall({
      contract: guardNFT,
      method: "mintBadge",
      params: [
        recipientAddress as `0x${string}`,
        finalContractAddress as `0x${string}`,
        BigInt(finalRiskScore),
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


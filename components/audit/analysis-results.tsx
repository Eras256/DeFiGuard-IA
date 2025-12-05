"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, Shield, TrendingUp, Save, Loader2, Award, Sparkles, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VulnerabilityAnalysis } from "@/lib/gemini/client";
import { VulnerabilityCard } from "./vulnerability-card";
import { getRiskScoreColor } from "@/lib/utils";
import { useActiveAccount } from "thirdweb/react";
import { recordAuditOnChain } from "@/lib/contracts/record-audit";
import { toast } from "sonner";
import { CONTRACT_ADDRESSES, SUPPORTED_CHAINS } from "@/lib/constants";
import { GeminiBadge } from "@/components/shared/gemini-badge";
import { checkCertificationStatus, mintBadgeForContract } from "@/lib/contracts/mint-badge";
import { getCertificationLevelInfo, isEligibleForCertification, getNextLevel } from "@/lib/constants/certification-levels";

interface AnalysisResultsProps {
  analysis: VulnerabilityAnalysis;
  contractAddress?: string;
  contractCode?: string;
  modelUsed?: string | null;
}

export function AnalysisResults({ analysis, contractAddress, contractCode, modelUsed }: AnalysisResultsProps) {
  const account = useActiveAccount();
  const [isRecording, setIsRecording] = useState(false);
  const [isRecorded, setIsRecorded] = useState(false);
  const [finalContractAddress, setFinalContractAddress] = useState<string | undefined>(contractAddress);
  const [certificationStatus, setCertificationStatus] = useState<{
    isCertified: boolean;
    hasBadge: boolean;
    riskScore: number | null;
    canMintBadge: boolean;
  } | null>(null);
  const [isMintingBadge, setIsMintingBadge] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const recordButtonRef = useRef<HTMLButtonElement>(null);
  const criticalCount = analysis.vulnerabilities.filter(v => v.severity === "Critical").length;
  const highCount = analysis.vulnerabilities.filter(v => v.severity === "High").length;
  
  // Update finalContractAddress when contractAddress prop changes
  useEffect(() => {
    setFinalContractAddress(contractAddress);
  }, [contractAddress]);

  // Add direct listener to button using useRef
  useEffect(() => {
    const button = recordButtonRef.current;
    if (!button) {
      console.log("🔧 [useEffect] Button ref not found yet");
      return;
    }

    console.log("🔧 [useEffect] Setting up button listeners...", button);

    const handleClick = (e: MouseEvent) => {
      console.log("🟢 [Direct Listener] Click detected on button!", e);
      e.preventDefault();
      e.stopPropagation();
      
      if (isRecording || !account || !contractAddress) {
        console.warn("⚠️ Click ignored - conditions not met", { isRecording, account: !!account, contractAddress: !!contractAddress });
        return;
      }
      
      console.log("✅ [Direct Listener] Calling handleRecordOnChain...");
      handleRecordOnChain();
    };

    const handleMouseDown = (e: MouseEvent) => {
      console.log("🟡 [Direct Listener] MouseDown detected!", e);
    };

    button.addEventListener('click', handleClick, true); // Use capture phase
    button.addEventListener('mousedown', handleMouseDown, true);

    return () => {
      button.removeEventListener('click', handleClick, true);
      button.removeEventListener('mousedown', handleMouseDown, true);
    };
  }, [isRecording, account, contractAddress]);

  // Check certification status when contract address is available
  // Only check after a delay to ensure blockchain state is updated
  useEffect(() => {
    const addressToCheck = finalContractAddress || contractAddress;
    if (addressToCheck && isRecorded) {
      setIsCheckingStatus(true);
      // Wait a bit before checking to ensure blockchain state is updated
      const timeoutId = setTimeout(() => {
        console.log("[useEffect] Checking certification status...");
        const isDemoAddress = addressToCheck.toLowerCase().startsWith('0xd3a0');
        const finalRiskScore = isDemoAddress ? Math.min(analysis.riskScore, 20) : analysis.riskScore;
        // Pass riskScore to avoid fetching from contract (which may fail due to corrupted data)
        checkCertificationStatus(addressToCheck, finalRiskScore).then(status => {
          console.log("[useEffect] Certification status result:", {
            isCertified: status.isCertified,
            hasBadge: status.hasBadge,
            riskScore: status.riskScore,
            canMintBadge: status.canMintBadge,
          });
          setCertificationStatus(status);
          setIsCheckingStatus(false);
        }).catch((err) => {
          console.error("[useEffect] Error checking certification status:", err);
          setIsCheckingStatus(false);
          // Don't set status on error to avoid showing incorrect information
        });
      }, 2000); // Wait 2 seconds before checking
      
      return () => clearTimeout(timeoutId);
    }
  }, [finalContractAddress, contractAddress, isRecorded, analysis.riskScore]);

  const handleRecordOnChain = async () => {
    console.log("[handleRecordOnChain] Button clicked!", {
      account: account?.address,
      contractAddress,
      isRecording,
      isRecorded,
    });

    if (!account) {
      console.warn("[handleRecordOnChain] No account connected");
      toast.error("Please connect your wallet first");
      return;
    }

    if (!contractAddress) {
      console.warn("[handleRecordOnChain] No contract address");
      toast.error("Contract address is required to record audit");
      return;
    }

    console.log("[handleRecordOnChain] Starting recording process...");
    setIsRecording(true);
    try {
      console.log("[Record Audit] Starting...", {
        contractAddress,
        riskScore: analysis.riskScore,
        account: account.address,
      });

      // For demo addresses, generate unique address per wallet to allow multiple records/mints
      const isDemoAddress = contractAddress.toLowerCase().startsWith('0xd3a0');
      let finalContractAddress = contractAddress;
      const finalRiskScore = isDemoAddress ? Math.min(analysis.riskScore, 20) : analysis.riskScore;
      
      if (isDemoAddress) {
        // Generate unique demo address that includes wallet address for uniqueness
        // This allows each wallet to have its own demo contract for unlimited records/mints
        // Convert to lowercase to ensure valid address format
        const walletHash = account.address.toLowerCase().slice(2, 10); // First 8 chars of wallet (without 0x), lowercase
        const timestamp = Date.now().toString(16).slice(-6).padStart(6, '0');
        const random = Array.from({ length: 28 }, () => 
          Math.floor(Math.random() * 16).toString(16)
        ).join('');
        // 0x (2) + d3a0 (4) + walletHash (8) + timestamp (6) + random (22) = 42 chars
        // Convert to lowercase to ensure valid Ethereum address format
        finalContractAddress = `0xd3a0${walletHash}${timestamp}${random}`.slice(0, 42).toLowerCase();
        
        if (analysis.riskScore > 20) {
          toast.info("Demo mode: Risk score capped at 20 for certification eligibility");
        }
        toast.info("Demo mode: Using unique address for unlimited records and mints");
      }

      // Generate a simple hash from the contract code and analysis
      const reportData = JSON.stringify({
        riskScore: finalRiskScore,
        vulnerabilities: analysis.vulnerabilities.length,
        timestamp: Date.now(),
        summary: analysis.summary,
      });
      const reportHash = btoa(reportData).slice(0, 46); // IPFS-like hash format

      console.log("[Record Audit] Calling recordAuditOnChain...", {
        isDemoAddress,
        originalContractAddress: contractAddress,
        finalContractAddress,
        originalRiskScore: analysis.riskScore,
        finalRiskScore,
      });
      
      toast.info("Preparing transaction... Please approve in your wallet.");
      
      const txHash = await recordAuditOnChain(
        finalContractAddress,
        finalRiskScore,
        reportHash,
        account
      );
      
      // For demo addresses, update the final address for status checking
      if (isDemoAddress && finalContractAddress !== contractAddress) {
        console.log("[Record Audit] Demo: Using new address for status check:", finalContractAddress);
        setFinalContractAddress(finalContractAddress);
      }

      console.log("[Record Audit] Success! Transaction hash:", txHash);

      setIsRecorded(true);
      
      // Beautiful notification with transaction link
      const explorerUrl = `${SUPPORTED_CHAINS.baseSepolia.explorer}/tx/${txHash}`;
      toast.success(
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <span className="font-semibold text-white">Audit Recorded Successfully!</span>
          </div>
          <p className="text-sm text-gray-300">
            Your audit has been permanently recorded on Base Sepolia blockchain.
          </p>
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors mt-1"
          >
            <span className="font-mono text-xs bg-black/30 px-2 py-1 rounded">
              {txHash.slice(0, 10)}...{txHash.slice(-8)}
            </span>
            <ExternalLink className="h-4 w-4" />
            <span>View on Explorer</span>
          </a>
        </div>,
        {
          duration: 10000,
          action: {
            label: "View Transaction",
            onClick: () => window.open(explorerUrl, "_blank"),
          },
        }
      );
      
      // Trigger custom event to update statistics
      window.dispatchEvent(new CustomEvent('audit-recorded'));
      
      // Wait a bit for transaction to confirm before updating
      // Wait longer to ensure blockchain state is updated
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('audit-recorded'));
        // Check certification status after recording - pass riskScore to avoid fetching
        if (contractAddress) {
          console.log("[Record Audit] Checking certification status after delay...");
          // Use final risk score for demo addresses
          const addressToCheck = finalContractAddress || contractAddress;
          const isDemoAddress = addressToCheck?.toLowerCase().startsWith('0xd3a0');
          const finalRiskScore = isDemoAddress ? Math.min(analysis.riskScore, 20) : analysis.riskScore;
          
          if (!addressToCheck) {
            console.error("[Record Audit] No contract address to check");
            return;
          }
          
          checkCertificationStatus(addressToCheck, finalRiskScore).then(status => {
            console.log("[Record Audit] Certification status:", {
              isCertified: status.isCertified,
              hasBadge: status.hasBadge,
              riskScore: status.riskScore,
              canMintBadge: status.canMintBadge,
            });
            setCertificationStatus(status);
          }).catch(err => {
            console.error("[Record Audit] Error checking certification status:", err);
            // Set status to null on error to avoid showing incorrect information
            setCertificationStatus(null);
          });
        }
      }, 5000); // Increased delay to 5 seconds to ensure blockchain state is updated
    } catch (error: any) {
      console.error("[Record Audit] Error:", error);
      console.error("[Record Audit] Error details:", {
        message: error.message,
        name: error.name,
        code: error.code,
        data: error.data,
        reason: error.reason,
      });
      
      // Improve specific error messages
      let errorMessage = "Failed to record audit on-chain";
      
      if (error.message) {
        errorMessage = error.message;
        
        // Specific messages for common errors
        if (error.message.includes("OwnableUnauthorizedAccount") || 
            error.message.includes("onlyOwner") ||
            error.message.includes("Ownable: caller is not the owner")) {
          errorMessage = "Only the AuditRegistry contract owner can record audits. Your wallet is not authorized.";
        } else if (error.message.includes("user rejected") || 
                   error.message.includes("User rejected")) {
          errorMessage = "Transaction rejected. Please try again and approve the transaction in your wallet.";
        } else if (error.message.includes("insufficient funds") || 
                   error.message.includes("gas")) {
          errorMessage = "Insufficient funds for gas. Please ensure you have enough ETH in your wallet.";
        }
      }
      
      toast.error(errorMessage, {
        duration: 6000,
      });
    } finally {
      setIsRecording(false);
    }
  };

  const handleMintBadge = async () => {
    const addressToUse = finalContractAddress || contractAddress;
    if (!account || !addressToUse || !certificationStatus) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!certificationStatus.isCertified) {
      toast.error("Contract is not certified. Risk score must be less than 40 (not equal).");
      return;
    }

    // For demo addresses, allow minting even if badge exists (will generate new address)
    const isDemoAddress = addressToUse.toLowerCase().startsWith('0xd3a0');
    if (certificationStatus.hasBadge && !isDemoAddress) {
      toast.info("You already have the NFT certificate for this contract");
      return;
    }

    setIsMintingBadge(true);
    try {
      toast.info("Requesting NFT certificate...");
      
      const txHash = await mintBadgeForContract(
        addressToUse,
        account.address,
        analysis.riskScore,
        account
      );

      // Beautiful notification with transaction hash link
      toast.success(
        <div className="flex flex-col gap-2 p-1">
          <div className="flex items-center gap-2">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-green-400">NFT Badge Minted Successfully!</div>
              <div className="text-sm text-gray-300 mt-0.5">Your certification badge has been minted on Base Sepolia</div>
            </div>
          </div>
          <a
            href={`https://sepolia.basescan.org/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 mt-2 px-3 py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 transition-all group"
          >
            <svg className="w-4 h-4 text-blue-400 group-hover:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            <span className="text-xs font-mono text-blue-300 group-hover:text-blue-200 truncate">
              View on Basescan: {txHash.slice(0, 8)}...{txHash.slice(-6)}
            </span>
            <svg className="w-3 h-3 text-blue-400 ml-auto group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>,
        {
          duration: 10000,
          className: "bg-gray-900/95 border border-green-500/30 shadow-lg",
        }
      );
      
      // Update status after a delay to allow blockchain to update
      setTimeout(async () => {
        const addressToCheck = finalContractAddress || contractAddress;
        const isDemoAddress = addressToCheck?.toLowerCase().startsWith('0xd3a0');
        const finalRiskScore = isDemoAddress ? Math.min(analysis.riskScore, 20) : analysis.riskScore;
        
        if (addressToCheck) {
          const newStatus = await checkCertificationStatus(addressToCheck, finalRiskScore);
          setCertificationStatus(newStatus);
        }
        
        // Trigger event to update statistics
        window.dispatchEvent(new CustomEvent('badge-minted'));
      }, 3000);
    } catch (error: any) {
      console.error("Error minting badge:", error);
      const errorMessage = error.message || "Error obtaining certificate";
      
      if (errorMessage.includes("NotContractOwner") || errorMessage.includes("not the owner") || errorMessage.includes("Only the owner")) {
        toast.error(
          <div className="flex flex-col gap-1">
            <span className="font-semibold">Authorization Error</span>
            <span className="text-sm">Only the owner of the audited contract can mint the certification badge. Make sure you are using the wallet that registered the audit.</span>
          </div>,
          { duration: 10000 }
        );
      } else if (errorMessage.includes("not certified") || errorMessage.includes("NotCertified")) {
        toast.error("Contract is not certified. Please record the audit first.");
      } else if (errorMessage.includes("already has")) {
        // For demo addresses, this shouldn't happen as we generate new addresses
        const addressToCheck = finalContractAddress || contractAddress;
        const isDemoAddress = addressToCheck?.toLowerCase().startsWith('0xd3a0');
        if (!isDemoAddress) {
          toast.info("You already have the NFT certificate for this contract.");
        }
        // Refresh status
        if (addressToCheck) {
          const finalRiskScore = isDemoAddress ? Math.min(analysis.riskScore, 20) : analysis.riskScore;
          checkCertificationStatus(addressToCheck, finalRiskScore).then(status => {
            setCertificationStatus(status);
          });
        }
      } else {
        toast.error(
          <div className="flex flex-col gap-1">
            <span className="font-semibold">Error Obtaining Certificate</span>
            <span className="text-sm">{errorMessage}</span>
          </div>,
          { duration: 8000 }
        );
      }
    } finally {
      setIsMintingBadge(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Overall Risk Score */}
      <Card className="glass glow-border">
        <CardHeader>
          <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <span className="flex items-center gap-2">
              <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              <span className="text-lg sm:text-xl font-bold">Security Analysis Complete</span>
            </span>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
              <GeminiBadge model="GEMINI IA + MCP NULLSHOT" variant="compact" />
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-2xl font-bold">Risk Score:</span>
                <span className={`text-2xl sm:text-4xl font-bold ${getRiskScoreColor(analysis.riskScore)}`}>
                  {analysis.riskScore}/100
                </span>
              </div>
            </div>
          </CardTitle>
          <CardDescription>
            {analysis.summary}
            <span className="block mt-2 text-xs text-gray-500">
              Analysis powered by GEMINI IA + MCP NullShot Architecture
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="glass p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-red-400">{criticalCount}</div>
              <div className="text-sm text-muted-foreground">Critical</div>
            </div>
            <div className="glass p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-orange-400">{highCount}</div>
              <div className="text-sm text-muted-foreground">High</div>
            </div>
            <div className="glass p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {analysis.vulnerabilities.filter(v => v.severity === "Medium").length}
              </div>
              <div className="text-sm text-muted-foreground">Medium</div>
            </div>
            <div className="glass p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-400">
                {analysis.vulnerabilities.filter(v => v.severity === "Low").length}
              </div>
              <div className="text-sm text-muted-foreground">Low</div>
            </div>
          </div>
          {/* Certification Eligibility Banner - Show even before recording if score is good */}
          {isEligibleForCertification(analysis.riskScore) && (
            <div className="mt-4 pt-4 border-t border-white/10">
              {(() => {
                const levelInfo = getCertificationLevelInfo(analysis.riskScore);
                const nextLevel = getNextLevel(analysis.riskScore);
                const borderColor = 
                  levelInfo.level === "platinum" ? "border-cyan-500/50 bg-cyan-500/10" :
                  levelInfo.level === "gold" ? "border-yellow-500/50 bg-yellow-500/10" :
                  levelInfo.level === "silver" ? "border-gray-400/50 bg-gray-400/10" :
                  "border-orange-500/50 bg-orange-500/10";
                const textColor =
                  levelInfo.level === "platinum" ? "text-cyan-400" :
                  levelInfo.level === "gold" ? "text-yellow-400" :
                  levelInfo.level === "silver" ? "text-gray-300" :
                  "text-orange-400";
                
                return (
                  <div className={`glass p-4 rounded-lg border-2 ${borderColor}`}>
                    <div className={`flex flex-wrap items-center gap-2 ${textColor} mb-2`}>
                      <span className="text-xl sm:text-2xl">{levelInfo.icon}</span>
                      <Award className="h-5 w-5 sm:h-6 sm:w-6" />
                      <span className="font-bold text-base sm:text-lg">{levelInfo.name}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-300 mb-2 leading-relaxed">
                      Your contract has a risk score of <span className="font-bold text-white">{analysis.riskScore}</span>, 
                      which grants it the <span className="font-bold">{levelInfo.name}</span> level.
                      By registering this audit on blockchain, your contract will be automatically certified 
                      and you can obtain a {levelInfo.name} NFT Badge as proof of security.
                    </p>
                    {nextLevel && (
                      <p className="text-xs text-gray-400 italic mb-2">
                        💡 Improve your score to less than {nextLevel.maxScore} to get {nextLevel.name} {nextLevel.icon}
                      </p>
                    )}
                    <div className="mt-3 pt-3 border-t border-white/10">
                      <p className="text-xs text-gray-400 mb-2 font-semibold">Certification Levels:</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                        <div className="flex items-center gap-1">
                          <span>💎</span>
                          <span className="text-gray-400">Platinum: 0-4</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>🥇</span>
                          <span className="text-gray-400">Gold: 5-14</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>🥈</span>
                          <span className="text-gray-400">Silver: 15-24</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>🥉</span>
                          <span className="text-gray-400">Bronze: 25-39</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {(finalContractAddress || contractAddress) && (
            <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
              {isRecorded ? (
                <>
                  <div className="text-center py-2">
                    <div className="flex items-center justify-center gap-2 text-cyber-green mb-2">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-semibold">Audit Recorded on Blockchain!</span>
                    </div>
                    <p className="text-xs text-gray-400">
                      This audit is now stored on Base Sepolia and counted in the total audits.
                    </p>
                  </div>

                  {/* Certification Status & NFT Badge */}
                  {isCheckingStatus ? (
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-400 py-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Checking certification status...
                    </div>
                  ) : certificationStatus && (
                    <div className="space-y-3">
                      {certificationStatus.isCertified ? (
                        (() => {
                          const levelInfo = getCertificationLevelInfo(certificationStatus.riskScore || analysis.riskScore);
                          const borderColor = 
                            levelInfo.level === "platinum" ? "border-cyan-500/50 bg-cyan-500/10" :
                            levelInfo.level === "gold" ? "border-yellow-500/50 bg-yellow-500/10" :
                            levelInfo.level === "silver" ? "border-gray-400/50 bg-gray-400/10" :
                            "border-orange-500/50 bg-orange-500/10";
                          const textColor =
                            levelInfo.level === "platinum" ? "text-cyan-400" :
                            levelInfo.level === "gold" ? "text-yellow-400" :
                            levelInfo.level === "silver" ? "text-gray-300" :
                            "text-orange-400";
                          
                          return (
                            <div className={`glass p-3 sm:p-4 rounded-lg border-2 ${borderColor}`}>
                              <div className={`flex flex-wrap items-center gap-2 ${textColor} mb-3`}>
                                <span className="text-2xl sm:text-3xl">{levelInfo.icon}</span>
                                <Award className="h-5 w-5 sm:h-6 sm:w-6" />
                                <span className="font-bold text-base sm:text-lg">Contract Certified - {levelInfo.name}!</span>
                              </div>
                              <p className="text-xs sm:text-sm text-gray-300 mb-3 leading-relaxed">
                                Your contract has passed the audit with a risk score of <span className="font-bold text-white">{certificationStatus.riskScore}</span>,
                                achieving the <span className="font-bold">{levelInfo.name}</span> level.
                                You can obtain a {levelInfo.icon} NFT certificate as proof of security.
                              </p>
                              <p className="text-xs text-gray-400 mb-3 italic">
                                {levelInfo.description}
                              </p>
                          
                              {(() => {
                                const addressToUse = finalContractAddress || contractAddress;
                                const isDemoAddress = addressToUse?.toLowerCase().startsWith('0xd3a0');
                                // For demo addresses, always show mint button (will generate new address)
                                const showMintButton = !certificationStatus.hasBadge || isDemoAddress;
                                
                                if (!showMintButton) {
                                  return (
                                    <div className="flex items-center gap-2 text-sm text-primary bg-primary/10 p-3 rounded-lg">
                                      <Sparkles className="h-5 w-5" />
                                      <span className="font-semibold">You already have the {levelInfo.icon} NFT Badge certified!</span>
                                    </div>
                                  );
                                }
                                
                                return (
                                  <Button
                                    onClick={handleMintBadge}
                                    disabled={isMintingBadge || !account}
                                    variant="glow"
                                    size="lg"
                                    className="w-full mt-2 text-sm sm:text-base"
                                  >
                                    {isMintingBadge ? (
                                      <>
                                        <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 mr-2 animate-spin" />
                                        <span className="hidden sm:inline">Obtaining {levelInfo.icon} NFT Certificate...</span>
                                        <span className="sm:hidden">Obtaining Certificate...</span>
                                      </>
                                    ) : (
                                      <>
                                        <Award className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                                        <span className="hidden sm:inline">
                                          {isDemoAddress && certificationStatus.hasBadge 
                                            ? `Get Another ${levelInfo.icon} NFT Certificate - ${levelInfo.name} (Demo)`
                                            : `Get ${levelInfo.icon} NFT Certificate - ${levelInfo.name}`}
                                        </span>
                                        <span className="sm:hidden">
                                          {isDemoAddress && certificationStatus.hasBadge 
                                            ? `Get Another ${levelInfo.icon} NFT (Demo)`
                                            : `Get ${levelInfo.icon} NFT Certificate`}
                                        </span>
                                      </>
                                    )}
                                  </Button>
                                );
                              })()}
                              
                              {!account && (
                                <p className="text-xs text-yellow-400 text-center mt-2">
                                  Connect your wallet to obtain the {levelInfo.icon} NFT certificate
                                </p>
                              )}
                            </div>
                          );
                        })()
                      ) : isEligibleForCertification(analysis.riskScore) ? (
                        (() => {
                          const levelInfo = getCertificationLevelInfo(analysis.riskScore);
                          return (
                            <div className="glass p-4 rounded-lg border border-yellow-500/30 bg-yellow-500/10">
                              <div className="flex items-center gap-2 text-yellow-400 mb-2">
                                <span className="text-xl">{levelInfo.icon}</span>
                                <Award className="h-5 w-5" />
                                <span className="font-semibold">Eligible for {levelInfo.name}</span>
                              </div>
                              <p className="text-sm text-gray-300">
                                Your risk score of <span className="font-bold">{analysis.riskScore}</span> qualifies for 
                                <span className="font-bold"> {levelInfo.name}</span> level certification (less than 40). 
                                The contract will be automatically certified after registering the audit.
                              </p>
                            </div>
                          );
                        })()
                      ) : (
                        <div className="glass p-4 rounded-lg border border-red-500/30 bg-red-500/10">
                          <div className="flex items-center gap-2 text-red-400 mb-2">
                            <AlertTriangle className="h-5 w-5" />
                            <span className="font-semibold">Not Eligible for Certification</span>
                          </div>
                          <p className="text-sm text-gray-300">
                            Risk score of <span className="font-bold">{analysis.riskScore}</span> is too high.
                            You need a score <span className="font-bold">less than 40</span> (not equal) to obtain certification.
                            A score of 40 or higher does not qualify.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* Debug info - remove in production */}
                  {process.env.NODE_ENV === "development" && (
                    <div className="mb-2 p-2 bg-yellow-500/10 border border-yellow-500/30 rounded text-xs">
                      <strong>Debug:</strong> account={account ? "✓" : "✗"}, 
                      contractAddress={contractAddress ? "✓" : "✗"}, 
                      isRecording={isRecording ? "✓" : "✗"},
                      disabled={isRecording || !account || !contractAddress ? "YES" : "NO"}
                    </div>
                  )}
                  
                  {/* Use native HTML button with ref and multiple listeners */}
                  <button
                    ref={recordButtonRef}
                    onClick={(e) => {
                      console.log("🔵 [Native Button onClick] FIRED!", {
                        isRecording,
                        account: account?.address,
                        contractAddress,
                        disabled: isRecording || !account || !contractAddress,
                        target: e.target,
                        currentTarget: e.currentTarget,
                      });
                      
                      e.preventDefault();
                      e.stopPropagation();
                      
                      // Check that it's not disabled
                      const addressToUse = finalContractAddress || contractAddress;
                      if (isRecording || !account || !addressToUse) {
                        console.warn("⚠️ Button click ignored - button is disabled");
                        toast.error("Please ensure wallet is connected and contract address is provided");
                        return;
                      }
                      
                      // Call the handler
                      console.log("✅ Calling handleRecordOnChain from onClick...");
                      handleRecordOnChain().catch(err => {
                        console.error("❌ Error in handleRecordOnChain:", err);
                      });
                    }}
                    onMouseDown={(e) => {
                      console.log("🟡 [Native Button onMouseDown] FIRED!", e);
                    }}
                    onMouseUp={(e) => {
                      console.log("🟠 [Native Button onMouseUp] FIRED!", e);
                    }}
                    disabled={isRecording || !account || !(finalContractAddress || contractAddress)}
                    className={`w-full h-11 rounded-md px-8 text-base font-medium transition-all flex items-center justify-center gap-2 relative z-50 ${
                      isEligibleForCertification(analysis.riskScore)
                        ? "bg-gradient-to-r from-cyber-blue to-cyber-purple text-white hover:shadow-2xl hover:shadow-primary/50 animate-glow"
                        : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/50"
                    } disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-95`}
                    type="button"
                    style={{ 
                      position: 'relative',
                      zIndex: 9999,
                      pointerEvents: (isRecording || !account || !(finalContractAddress || contractAddress)) ? 'none' : 'auto',
                    }}
                  >
                    {isRecording ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Recording on Blockchain...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        {isEligibleForCertification(analysis.riskScore) 
                          ? (() => {
                              const levelInfo = getCertificationLevelInfo(analysis.riskScore);
                              return `Record Audit and Get ${levelInfo.name} ${levelInfo.icon}`;
                            })()
                          : "Record Audit on Base Sepolia"}
                      </>
                    )}
                  </button>
                  {!account && (
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      Connect your wallet to record this audit on blockchain
                    </p>
                  )}
                  {!(finalContractAddress || contractAddress) && (
                    <p className="text-xs text-yellow-400 mt-2 text-center">
                      ⚠️ Contract address is required. Please enter the contract address in the upload form above.
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    ⚠️ The analysis above is only local. Click the button to save it on blockchain.
                    {isEligibleForCertification(analysis.riskScore) && (() => {
                      const levelInfo = getCertificationLevelInfo(analysis.riskScore);
                      return ` By registering, your contract will be automatically certified with ${levelInfo.name} ${levelInfo.icon} level.`;
                    })()}
                  </p>
                </>
              )}
            </div>
          )}

          {!(finalContractAddress || contractAddress) && isEligibleForCertification(analysis.riskScore) && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="glass p-4 rounded-lg border border-yellow-500/30 bg-yellow-500/10">
                <div className="flex items-center gap-2 text-yellow-400 mb-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="font-semibold">Contract Address Required</span>
                </div>
                <p className="text-sm text-gray-300">
                  To obtain certification and the NFT Badge, you need to provide the contract address 
                  in the field above before performing the analysis.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Vulnerabilities List */}
      {analysis.vulnerabilities.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-orange-400" />
            Detected Vulnerabilities
          </h3>
          {analysis.vulnerabilities.map((vulnerability, index) => (
            <VulnerabilityCard key={index} vulnerability={vulnerability} />
          ))}
        </div>
      ) : (
        <Card className="glass">
          <CardContent className="py-12 text-center">
            <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-green-400 mb-2">No Vulnerabilities Detected!</h3>
            <p className="text-muted-foreground">
              Your contract appears to follow security best practices.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Gas Optimizations */}
      {analysis.gasOptimizations.length > 0 && (
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-green-400" />
              Gas Optimization Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analysis.gasOptimizations.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-green-400 mt-0.5">•</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Best Practices */}
      {analysis.bestPractices.length > 0 && (
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-blue-400" />
              Security Best Practices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analysis.bestPractices.map((practice, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-blue-400 mt-0.5">•</span>
                  <span>{practice}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}


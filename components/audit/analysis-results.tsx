"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, Shield, TrendingUp, Save, Loader2, Award, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VulnerabilityAnalysis } from "@/lib/gemini/client";
import { VulnerabilityCard } from "./vulnerability-card";
import { getRiskScoreColor } from "@/lib/utils";
import { useActiveAccount } from "thirdweb/react";
import { recordAuditOnChain } from "@/lib/contracts/record-audit";
import { toast } from "sonner";
import { CONTRACT_ADDRESSES } from "@/lib/contracts/audit-registry";
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

  // Agregar listener directo al botón usando useRef
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
  useEffect(() => {
    if (contractAddress && isRecorded) {
      setIsCheckingStatus(true);
      checkCertificationStatus(contractAddress).then(status => {
        setCertificationStatus(status);
        setIsCheckingStatus(false);
      }).catch(() => {
        setIsCheckingStatus(false);
      });
    }
  }, [contractAddress, isRecorded]);

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

      // Generate a simple hash from the contract code and analysis
      const reportData = JSON.stringify({
        riskScore: analysis.riskScore,
        vulnerabilities: analysis.vulnerabilities.length,
        timestamp: Date.now(),
        summary: analysis.summary,
      });
      const reportHash = btoa(reportData).slice(0, 46); // IPFS-like hash format

      console.log("[Record Audit] Calling recordAuditOnChain...");
      
      toast.info("Preparing transaction... Please approve in your wallet.");
      
      const txHash = await recordAuditOnChain(
        contractAddress,
        analysis.riskScore,
        reportHash,
        account
      );

      console.log("[Record Audit] Success! Transaction hash:", txHash);

      setIsRecorded(true);
      toast.success(`Audit recorded on-chain! Transaction: ${txHash.slice(0, 10)}...`);
      
      // Disparar evento personalizado para actualizar estadísticas
      window.dispatchEvent(new CustomEvent('audit-recorded'));
      
      // Esperar un poco para que la transacción se confirme antes de actualizar
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('audit-recorded'));
        // Check certification status after recording
        if (contractAddress) {
          checkCertificationStatus(contractAddress).then(status => {
            setCertificationStatus(status);
          }).catch(err => {
            console.error("[Record Audit] Error checking certification status:", err);
          });
        }
      }, 3000);
      
      // Open transaction in explorer
      window.open(
        `https://sepolia.basescan.org/tx/${txHash}`,
        "_blank"
      );
    } catch (error: any) {
      console.error("[Record Audit] Error:", error);
      console.error("[Record Audit] Error details:", {
        message: error.message,
        name: error.name,
        code: error.code,
        data: error.data,
        reason: error.reason,
      });
      
      // Mejorar mensajes de error específicos
      let errorMessage = "Failed to record audit on-chain";
      
      if (error.message) {
        errorMessage = error.message;
        
        // Mensajes específicos para errores comunes
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
    if (!account || !contractAddress || !certificationStatus) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!certificationStatus.isCertified) {
      toast.error("Contract is not certified. Risk score must be less than 40 (not equal).");
      return;
    }

    if (certificationStatus.hasBadge) {
      toast.info("You already have the NFT certificate for this contract");
      return;
    }

    setIsMintingBadge(true);
    try {
      toast.info("Solicitando certificado NFT...");
      
      const txHash = await mintBadgeForContract(
        contractAddress,
        account.address,
        analysis.riskScore,
        account
      );

      toast.success(`¡Certificado NFT obtenido! Transacción: ${txHash.slice(0, 10)}...`);
      
      // Update status after a delay to allow blockchain to update
      setTimeout(async () => {
        const newStatus = await checkCertificationStatus(contractAddress);
        setCertificationStatus(newStatus);
        
        // Disparar evento para actualizar estadísticas
        window.dispatchEvent(new CustomEvent('badge-minted'));
      }, 3000);
      
      // Open transaction in explorer
      window.open(
        `https://sepolia.basescan.org/tx/${txHash}`,
        "_blank"
      );
    } catch (error: any) {
      console.error("Error minting badge:", error);
        const errorMessage = error.message || "Error obtaining certificate";
      
      if (errorMessage.includes("owner")) {
          toast.error("Only the GuardNFT contract owner can mint badges. Contact the DeFiGuard team.");
      } else {
        toast.error(errorMessage);
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
          <CardTitle className="flex items-center justify-between flex-wrap gap-4">
            <span className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              Security Analysis Complete
            </span>
            <div className="flex items-center gap-3 flex-wrap">
              <GeminiBadge model={modelUsed || undefined} variant="compact" />
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">Risk Score:</span>
                <span className={`text-4xl font-bold ${getRiskScoreColor(analysis.riskScore)}`}>
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
                    <div className={`flex items-center gap-2 ${textColor} mb-2`}>
                      <span className="text-2xl">{levelInfo.icon}</span>
                      <Award className="h-6 w-6" />
                      <span className="font-bold text-lg">{levelInfo.name}</span>
                    </div>
                    <p className="text-sm text-gray-300 mb-2">
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

          {contractAddress && (
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
                            <div className={`glass p-4 rounded-lg border-2 ${borderColor}`}>
                              <div className={`flex items-center gap-2 ${textColor} mb-3`}>
                                <span className="text-3xl">{levelInfo.icon}</span>
                                <Award className="h-6 w-6" />
                                <span className="font-bold text-lg">Contract Certified - {levelInfo.name}!</span>
                              </div>
                              <p className="text-sm text-gray-300 mb-3">
                                Your contract has passed the audit with a risk score of <span className="font-bold text-white">{certificationStatus.riskScore}</span>,
                                achieving the <span className="font-bold">{levelInfo.name}</span> level.
                                You can obtain a {levelInfo.icon} NFT certificate as proof of security.
                              </p>
                              <p className="text-xs text-gray-400 mb-3 italic">
                                {levelInfo.description}
                              </p>
                          
                              {certificationStatus.hasBadge ? (
                                <div className="flex items-center gap-2 text-sm text-primary bg-primary/10 p-3 rounded-lg">
                                  <Sparkles className="h-5 w-5" />
                                  <span className="font-semibold">You already have the {levelInfo.icon} NFT Badge certified!</span>
                                </div>
                              ) : (
                                <Button
                                  onClick={handleMintBadge}
                                  disabled={isMintingBadge || !account}
                                  variant="glow"
                                  size="lg"
                                  className="w-full mt-2"
                                >
                                  {isMintingBadge ? (
                                    <>
                                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                      Obtaining {levelInfo.icon} NFT Certificate...
                                    </>
                                  ) : (
                                    <>
                                      <Award className="h-5 w-5 mr-2" />
                                      Get {levelInfo.icon} NFT Certificate - {levelInfo.name}
                                    </>
                                  )}
                                </Button>
                              )}
                              
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
                  
                  {/* Usar botón HTML nativo con ref y múltiples listeners */}
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
                      
                      // Verificar que no esté deshabilitado
                      if (isRecording || !account || !contractAddress) {
                        console.warn("⚠️ Button click ignored - button is disabled");
                        toast.error("Please ensure wallet is connected and contract address is provided");
                        return;
                      }
                      
                      // Llamar al handler
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
                    disabled={isRecording || !account || !contractAddress}
                    className={`w-full h-11 rounded-md px-8 text-base font-medium transition-all flex items-center justify-center gap-2 relative z-50 ${
                      isEligibleForCertification(analysis.riskScore)
                        ? "bg-gradient-to-r from-cyber-blue to-cyber-purple text-white hover:shadow-2xl hover:shadow-primary/50 animate-glow"
                        : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/50"
                    } disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-95`}
                    type="button"
                    style={{ 
                      position: 'relative',
                      zIndex: 9999,
                      pointerEvents: (isRecording || !account || !contractAddress) ? 'none' : 'auto',
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
                  {!contractAddress && (
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

          {!contractAddress && isEligibleForCertification(analysis.riskScore) && (
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
          <h3 className="text-2xl font-bold flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-orange-400" />
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


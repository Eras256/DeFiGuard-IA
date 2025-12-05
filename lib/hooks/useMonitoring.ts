"use client";

import { useEffect, useState, useMemo } from "react";
import { useAudits } from "./useAudits";
import { useBadges } from "./useBadges";
import { useAllContractTransactions } from "./useTransactions";
import { formatAddress, formatTimestamp } from "@/lib/utils";
import { CONTRACT_ADDRESSES } from "@/lib/constants";

export interface MonitoringAlert {
  id: string;
  type: "high_risk" | "new_audit" | "new_badge" | "certification_revoked" | "unusual_activity";
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  message: string;
  timestamp: number;
  contractAddress?: string;
  riskScore?: number;
}

export function useMonitoring() {
  const { audits, loading: auditsLoading } = useAudits();
  const { badges, loading: badgesLoading } = useBadges();
  const { transactions, loading: transactionsLoading } = useAllContractTransactions(50);
  
  const [alerts, setAlerts] = useState<MonitoringAlert[]>([]);
  const [lastProcessedAudit, setLastProcessedAudit] = useState<string | null>(null);
  const [lastProcessedBadge, setLastProcessedBadge] = useState<bigint | null>(null);

  // Generate alerts based on real data
  useEffect(() => {
    if (auditsLoading || badgesLoading) return;

    const newAlerts: MonitoringAlert[] = [];

    // Check for high-risk audits
    audits.forEach((audit) => {
      const riskScore = Number(audit.riskScore);
      if (riskScore >= 80) {
        newAlerts.push({
          id: `high-risk-${audit.contractAddress}-${audit.timestamp}`,
          type: "high_risk",
          severity: "critical",
          title: "High Risk Detected",
          message: `Contract ${formatAddress(audit.contractAddress)} has a risk score of ${riskScore}/100`,
          timestamp: Number(audit.timestamp) * 1000,
          contractAddress: audit.contractAddress,
          riskScore,
        });
      } else if (riskScore >= 60) {
        newAlerts.push({
          id: `medium-risk-${audit.contractAddress}-${audit.timestamp}`,
          type: "high_risk",
          severity: "high",
          title: "Moderate Risk",
          message: `Contract ${formatAddress(audit.contractAddress)} has a risk score of ${riskScore}/100`,
          timestamp: Number(audit.timestamp) * 1000,
          contractAddress: audit.contractAddress,
          riskScore,
        });
      }
    });

    // Check for new audits
    const latestAudit = audits[0];
    if (latestAudit && latestAudit.contractAddress !== lastProcessedAudit) {
      newAlerts.push({
        id: `new-audit-${latestAudit.contractAddress}-${latestAudit.timestamp}`,
        type: "new_audit",
        severity: "low",
        title: "New Audit Registered",
        message: `Audit registered for contract ${formatAddress(latestAudit.contractAddress)}`,
        timestamp: Number(latestAudit.timestamp) * 1000,
        contractAddress: latestAudit.contractAddress,
        riskScore: Number(latestAudit.riskScore),
      });
      setLastProcessedAudit(latestAudit.contractAddress);
    }

    // Check for new badges
    const latestBadge = badges[0];
    if (latestBadge && latestBadge.tokenId !== lastProcessedBadge) {
      newAlerts.push({
        id: `new-badge-${latestBadge.tokenId}`,
        type: "new_badge",
        severity: "low",
        title: "New NFT Badge Minted",
        message: `Badge #${latestBadge.tokenId} minted for contract ${formatAddress(latestBadge.contractAddress)}`,
        timestamp: Number(latestBadge.timestamp) * 1000,
        contractAddress: latestBadge.contractAddress,
        riskScore: Number(latestBadge.riskScore),
      });
      setLastProcessedBadge(latestBadge.tokenId);
    }

    // Check for certification revocations (audits with risk >= 40 that were previously certified)
    audits.forEach((audit) => {
      const riskScore = Number(audit.riskScore);
      if (riskScore >= 40 && audit.isActive) {
        // This would require tracking previous state, simplified for now
        // In a real implementation, you'd compare with previous state
      }
    });

    // Sort alerts by timestamp (newest first) and limit to 20
    newAlerts.sort((a, b) => b.timestamp - a.timestamp);
    setAlerts(newAlerts.slice(0, 20));
  }, [audits, badges, lastProcessedAudit, lastProcessedBadge, auditsLoading, badgesLoading]);

  // Activity feed from transactions
  const activityFeed = useMemo(() => {
    return transactions.map((tx) => {
      const auditRegistryLower = CONTRACT_ADDRESSES.AUDIT_REGISTRY.toLowerCase();
      const guardNFTLower = CONTRACT_ADDRESSES.GUARD_NFT.toLowerCase();
      const txToLower = tx.to.toLowerCase();
      
      const contractName = 
        txToLower === auditRegistryLower 
          ? "AuditRegistry" 
          : txToLower === guardNFTLower
          ? "GuardNFT"
          : "Unknown";
      
      return {
        id: tx.hash,
        type: contractName === "AuditRegistry" ? "audit" : "badge",
        contract: contractName,
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        timestamp: tx.timestamp,
        blockNumber: tx.blockNumber,
        status: tx.status || "success",
      };
    });
  }, [transactions]);

  const stats = useMemo(() => {
    const highRiskAudits = audits.filter(a => Number(a.riskScore) >= 60).length;
    const certifiedContracts = audits.filter(a => Number(a.riskScore) < 40).length;
    const totalTransactions = transactions.length;
    
    return {
      totalAudits: audits.length,
      totalBadges: badges.length,
      highRiskAudits,
      certifiedContracts,
      totalTransactions,
      alertsCount: alerts.length,
    };
  }, [audits, badges, transactions, alerts]);

  return {
    audits,
    badges,
    transactions,
    alerts,
    activityFeed,
    stats,
    loading: auditsLoading || badgesLoading || transactionsLoading,
  };
}


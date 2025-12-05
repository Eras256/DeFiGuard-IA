"use client";

import React, { useMemo, useEffect, useState } from "react";
import { Shield, TrendingUp, AlertTriangle, CheckCircle, Loader2, Database, Award } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAudits } from "@/lib/hooks/useAudits";
import { useBadges } from "@/lib/hooks/useBadges";
import { useActiveAccount } from "thirdweb/react";
import { formatAddress } from "@/lib/utils";
import { NFTBadges } from "@/components/dashboard/nft-badges";
import { RecentAudits } from "@/components/dashboard/recent-audits";
import { RiskChart } from "@/components/dashboard/risk-chart";
import { getTotalAudits } from "@/lib/contracts/audit-registry";
import { getTotalSupply } from "@/lib/contracts/guard-nft";
import { CONTRACT_ADDRESSES } from "@/lib/constants";
import { CertificationLevelsInfo } from "@/components/dashboard/certification-levels-info";

export default function DashboardPage() {
  const account = useActiveAccount();
  const { audits, loading: auditsLoading } = useAudits();
  const { badges, loading: badgesLoading } = useBadges(account?.address);
  const [totalAudits, setTotalAudits] = useState(0);
  const [totalNFTs, setTotalNFTs] = useState(0);

  useEffect(() => {
    async function fetchTotals() {
      try {
        const [auditCount, nftCount] = await Promise.all([
          getTotalAudits(),
          getTotalSupply(),
        ]);
        setTotalAudits(Number(auditCount));
        setTotalNFTs(Number(nftCount));
      } catch (error) {
        console.error("Error fetching totals:", error);
      }
    }
    fetchTotals();
  }, []);

  // Calculate statistics from real data
  const certifiedContracts = useMemo(() => {
    return audits.filter(audit => Number(audit.riskScore) < 40).length;
  }, [audits]);

  const averageRiskScore = useMemo(() => {
    if (audits.length === 0) return 0;
    const sum = audits.reduce((acc, audit) => acc + Number(audit.riskScore), 0);
    return Math.round(sum / audits.length);
  }, [audits]);

  const stats = [
    {
      icon: Database,
      label: "Total On-Chain Audits",
      value: totalAudits > 0 ? totalAudits.toString() : audits.length.toString(),
      color: "text-primary",
      subtext: `${audits.length} active audits shown`,
    },
    {
      icon: Award,
      label: "Total NFT Badges",
      value: totalNFTs.toString(),
      color: "text-cyber-purple",
      subtext: `${badges.length} badges displayed`,
    },
    {
      icon: Shield,
      label: "Certified Contracts",
      value: certifiedContracts.toString(),
      color: "text-cyber-green",
      subtext: `Risk score < 40`,
    },
    {
      icon: TrendingUp,
      label: "Average Risk Score",
      value: averageRiskScore.toString(),
      color: averageRiskScore < 40 ? "text-cyber-green" : averageRiskScore < 60 ? "text-yellow-500" : "text-red-500",
      subtext: `From ${audits.length} audit${audits.length !== 1 ? 's' : ''}`,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 gradient-text">Dashboard</h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-400">
          Real-time blockchain data - 100% on-chain, zero mock
        </p>

        {/* Live Data Indicator */}
        <div className="mt-3 sm:mt-4 inline-flex flex-wrap items-center gap-2 glass rounded-full px-3 sm:px-4 py-1.5 sm:py-2">
          <div className="h-2 w-2 rounded-full bg-cyber-green animate-pulse"></div>
          <span className="text-xs sm:text-sm text-gray-400">
            Live from AuditRegistry ({CONTRACT_ADDRESSES.AUDIT_REGISTRY.slice(0, 6)}...{CONTRACT_ADDRESSES.AUDIT_REGISTRY.slice(-4)}) & GuardNFT ({CONTRACT_ADDRESSES.GUARD_NFT.slice(0, 6)}...{CONTRACT_ADDRESSES.GUARD_NFT.slice(-4)})
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="glass">
            <CardContent className="p-3 sm:p-4 md:p-6">
              <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4">
                <stat.icon className={`h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 ${stat.color}`} />
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
              </div>
              <div className="text-xs sm:text-sm font-medium text-gray-300 mb-1">{stat.label}</div>
              <div className="text-[10px] sm:text-xs text-gray-500">{stat.subtext}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Data Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8">
        <RecentAudits />
        <NFTBadges />
      </div>

      {/* Certification Levels Info */}
      <div className="mb-6 sm:mb-8">
        <CertificationLevelsInfo />
      </div>

      <RiskChart />

      {/* Data Source Footer */}
      <Card className="glass mt-6 sm:mt-8">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-xs sm:text-sm">Data Sources</CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-gray-400 space-y-2 p-4 sm:p-6 pt-0">
          <div className="break-words">
            <strong className="text-gray-300">AuditRegistry:</strong> <span className="font-mono text-[10px] sm:text-xs">{CONTRACT_ADDRESSES.AUDIT_REGISTRY}</span> (Base Sepolia)
          </div>
          <div className="break-words">
            <strong className="text-gray-300">GuardNFT:</strong> <span className="font-mono text-[10px] sm:text-xs">{CONTRACT_ADDRESSES.GUARD_NFT}</span> (Base Sepolia)
          </div>
          <div>
            <strong className="text-gray-300">Network:</strong> Base Sepolia Testnet (Chain ID: 84532)
          </div>
          <div className="pt-2 border-t border-white/10">
            All data is fetched directly from blockchain using Thirdweb SDK + Viem. No mock data or APIs.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


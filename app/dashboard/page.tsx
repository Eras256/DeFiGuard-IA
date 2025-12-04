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

  const stats = [
    {
      icon: Database,
      label: "Total On-Chain Audits",
      value: totalAudits.toString(),
      color: "text-primary",
      subtext: "Base Sepolia",
    },
    {
      icon: Award,
      label: "Total NFT Badges",
      value: totalNFTs.toString(),
      color: "text-cyber-purple",
      subtext: "GuardNFT Contract",
    },
    {
      icon: Shield,
      label: "Your Audits",
      value: audits.length.toString(),
      color: "text-cyber-pink",
      subtext: account ? "Connected" : "Connect wallet",
    },
    {
      icon: TrendingUp,
      label: "Your Badges",
      value: badges.length.toString(),
      color: "text-cyber-green",
      subtext: account ? "Certified" : "Connect wallet",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 gradient-text">Dashboard</h1>
        <p className="text-xl text-gray-400">
          Real-time blockchain data - 100% on-chain, zero mock
        </p>

        {/* Live Data Indicator */}
        <div className="mt-4 inline-flex items-center gap-2 glass rounded-full px-4 py-2">
          <div className="h-2 w-2 rounded-full bg-cyber-green animate-pulse"></div>
          <span className="text-sm text-gray-400">
            Live from AuditRegistry ({CONTRACT_ADDRESSES.AUDIT_REGISTRY.slice(0, 6)}...{CONTRACT_ADDRESSES.AUDIT_REGISTRY.slice(-4)}) & GuardNFT ({CONTRACT_ADDRESSES.GUARD_NFT.slice(0, 6)}...{CONTRACT_ADDRESSES.GUARD_NFT.slice(-4)})
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="glass">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
                <div className="text-3xl font-bold text-white">{stat.value}</div>
              </div>
              <div className="text-sm font-medium text-gray-300 mb-1">{stat.label}</div>
              <div className="text-xs text-gray-500">{stat.subtext}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Data Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <RecentAudits />
        <NFTBadges />
      </div>

      {/* Certification Levels Info */}
      <div className="mb-8">
        <CertificationLevelsInfo />
      </div>

      <RiskChart />

      {/* Data Source Footer */}
      <Card className="glass mt-8">
        <CardHeader>
          <CardTitle className="text-sm">Data Sources</CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-gray-400 space-y-2">
          <div>
            <strong className="text-gray-300">AuditRegistry:</strong> {CONTRACT_ADDRESSES.AUDIT_REGISTRY} (Base Sepolia)
          </div>
          <div>
            <strong className="text-gray-300">GuardNFT:</strong> {CONTRACT_ADDRESSES.GUARD_NFT} (Base Sepolia)
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


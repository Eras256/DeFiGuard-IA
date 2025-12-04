"use client";

import { useEffect, useState } from "react";
import { getTotalAudits } from "@/lib/contracts/audit-registry";
import { getTotalSupply } from "@/lib/contracts/guard-nft";
import { Activity } from "lucide-react";

export function LiveStatsBar() {
  const [audits, setAudits] = useState(0);
  const [nfts, setNFTs] = useState(0);

  const fetchStats = async () => {
    try {
      const [auditCount, nftCount] = await Promise.all([
        getTotalAudits(),
        getTotalSupply(),
      ]);
      setAudits(Number(auditCount));
      setNFTs(Number(nftCount));
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Update every 30s

    // Escuchar evento cuando se registra un audit
    const handleAuditRecorded = () => {
      console.log("[LiveStatsBar] Audit recorded, refreshing stats...");
      // Esperar un poco para que la transacción se confirme
      setTimeout(() => {
        fetchStats();
      }, 3000);
    };

    // Escuchar evento cuando se mintea un badge
    const handleBadgeMinted = () => {
      console.log("[LiveStatsBar] Badge minted, refreshing stats...");
      setTimeout(() => {
        fetchStats();
      }, 3000);
    };

    window.addEventListener('audit-recorded', handleAuditRecorded);
    window.addEventListener('badge-minted', handleBadgeMinted);

    return () => {
      clearInterval(interval);
      window.removeEventListener('audit-recorded', handleAuditRecorded);
      window.removeEventListener('badge-minted', handleBadgeMinted);
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 glass rounded-lg px-4 py-2 z-50">
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-cyber-green animate-pulse" />
          <span className="text-gray-400">Live</span>
        </div>
        <div className="text-gray-300">
          <span className="font-bold text-white">{audits}</span> Audits
        </div>
        <div className="text-gray-300">
          <span className="font-bold text-white">{nfts}</span> NFTs
        </div>
      </div>
    </div>
  );
}


"use client";

import { Hero } from "@/components/home/hero";
import { Features } from "@/components/home/features";
import { HowItWorks } from "@/components/home/how-it-works";
import { Stats } from "@/components/home/stats";
import { RecentAuditsPreview } from "@/components/home/recent-audits-preview";
import { CTA } from "@/components/home/cta";
import { useAudits } from "@/lib/hooks/useAudits";
import { useBadges } from "@/lib/hooks/useBadges";
import { useEffect, useState, useMemo } from "react";
import { getTotalAudits } from "@/lib/contracts/audit-registry";
import { getTotalSupply } from "@/lib/contracts/guard-nft";

export default function HomePage() {
  const { audits, loading: auditsLoading } = useAudits();
  const { badges, totalSupply, loading: badgesLoading } = useBadges();
  const [totalAudits, setTotalAudits] = useState(0);
  const [totalNFTs, setTotalNFTs] = useState(0);
  const [loading, setLoading] = useState(true);

  // Calculate real statistics from data
  const certifiedContracts = useMemo(() => {
    return audits.filter(audit => Number(audit.riskScore) < 40).length;
  }, [audits]);

  const averageRiskScore = useMemo(() => {
    if (audits.length === 0) return 0;
    const sum = audits.reduce((acc, audit) => acc + Number(audit.riskScore), 0);
    return Math.round(sum / audits.length);
  }, [audits]);

  const highRiskAudits = useMemo(() => {
    return audits.filter(audit => Number(audit.riskScore) >= 60).length;
  }, [audits]);

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
      } finally {
        setLoading(false);
      }
    }
    
    fetchTotals();
    
    // Listen for event when an audit is recorded
    const handleAuditRecorded = () => {
      console.log("[HomePage] Audit recorded, refreshing totals...");
      setTimeout(() => {
        fetchTotals();
      }, 3000);
    };

    // Listen for event when a badge is minted
    const handleBadgeMinted = () => {
      console.log("[HomePage] Badge minted, refreshing totals...");
      setTimeout(() => {
        fetchTotals();
      }, 3000);
    };

    window.addEventListener('audit-recorded', handleAuditRecorded);
    window.addEventListener('badge-minted', handleBadgeMinted);

    return () => {
      window.removeEventListener('audit-recorded', handleAuditRecorded);
      window.removeEventListener('badge-minted', handleBadgeMinted);
    };
  }, []);

  return (
    <>
      <Hero 
        totalAudits={totalAudits} 
        totalNFTs={totalNFTs}
        certifiedContracts={certifiedContracts}
        loading={loading || auditsLoading || badgesLoading} 
      />
      <Features />
      <HowItWorks />
      <Stats 
        totalAudits={totalAudits}
        totalNFTs={totalNFTs}
        recentAudits={audits.length}
        certifiedContracts={certifiedContracts}
        averageRiskScore={averageRiskScore}
        highRiskAudits={highRiskAudits}
        loading={loading || auditsLoading || badgesLoading}
      />
      <RecentAuditsPreview />
      <CTA />
    </>
  );
}


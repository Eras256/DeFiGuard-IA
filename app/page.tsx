"use client";

import { Hero } from "@/components/home/hero";
import { Features } from "@/components/home/features";
import { HowItWorks } from "@/components/home/how-it-works";
import { Stats } from "@/components/home/stats";
import { CTA } from "@/components/home/cta";
import { useAudits } from "@/lib/hooks/useAudits";
import { useEffect, useState } from "react";
import { getTotalAudits } from "@/lib/contracts/audit-registry";

export default function HomePage() {
  const { audits } = useAudits();
  const [totalAudits, setTotalAudits] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTotal() {
      try {
        const total = await getTotalAudits();
        setTotalAudits(Number(total));
      } catch (error) {
        console.error("Error fetching total audits:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchTotal();
    
    // Escuchar evento cuando se registra un audit
    const handleAuditRecorded = () => {
      console.log("[HomePage] Audit recorded, refreshing total audits...");
      setTimeout(() => {
        fetchTotal();
      }, 3000);
    };

    window.addEventListener('audit-recorded', handleAuditRecorded);

    return () => {
      window.removeEventListener('audit-recorded', handleAuditRecorded);
    };
  }, []);

  return (
    <>
      <Hero totalAudits={totalAudits} loading={loading} />
      <Features />
      <HowItWorks />
      <Stats totalAudits={totalAudits} recentAudits={audits.length} />
      <CTA />
    </>
  );
}


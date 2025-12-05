"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Award, TrendingUp, FileCheck, Loader2, AlertTriangle } from "lucide-react";
import { getAuditStats, type AuditStats } from "@/lib/contracts/audit-registry";

export function AuditStats() {
  const [stats, setStats] = useState<AuditStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const auditStats = await getAuditStats();
        setStats(auditStats);
        setError(null);
      } catch (err) {
        console.error("Error fetching audit stats:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch statistics");
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
    
    // Refresh every 60 seconds
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="glass">
            <CardContent className="py-6">
              <div className="flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="glass border-red-500/30">
        <CardContent className="py-6">
          <div className="flex items-center gap-2 text-red-400">
            <AlertTriangle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return null;
  }

  const statCards = [
    {
      title: "Total Audits",
      value: stats.totalAudits.toString(),
      description: "Audits registered on blockchain",
      icon: Shield,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Audited Contracts",
      value: stats.totalContracts.toString(),
      description: "Unique contracts with audits",
      icon: FileCheck,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Certified Contracts",
      value: stats.certifiedContracts.toString(),
      description: "Contracts with active certification",
      icon: Award,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
    },
    {
      title: "Average Risk Score",
      value: stats.averageRiskScore.toFixed(1),
      description: "Average of all contracts",
      icon: TrendingUp,
      color: stats.averageRiskScore < 40 ? "text-green-400" : stats.averageRiskScore < 60 ? "text-yellow-400" : "text-red-400",
      bgColor: stats.averageRiskScore < 40 ? "bg-green-500/10" : stats.averageRiskScore < 60 ? "bg-yellow-500/10" : "bg-red-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className={`glass ${stat.bgColor} border-white/10 hover:border-white/20 transition-all`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-400">{stat.title}</CardTitle>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${stat.color} mb-1`}>
                {stat.value}
              </div>
              <CardDescription className="text-xs mt-2">
                {stat.description}
              </CardDescription>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}


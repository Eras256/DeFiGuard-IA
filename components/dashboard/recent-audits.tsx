"use client";

import React, { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Calendar, Loader2, AlertTriangle } from "lucide-react";
import { formatAddress, formatTimestamp } from "@/lib/utils";
import { useAudits } from "@/lib/hooks/useAudits";

export function RecentAudits() {
  const { audits, loading, error } = useAudits();

  const recentAudits = useMemo(() => {
    return audits
      .slice()
      .sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
      .slice(0, 10)
      .map((audit, index) => ({
        id: `${audit.contractAddress}-${index}`,
        contractAddress: audit.contractAddress,
        riskScore: Number(audit.riskScore),
        timestamp: audit.timestamp,
        auditor: audit.auditor,
      }));
  }, [audits]);

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Recent Security Audits
        </CardTitle>
        <CardDescription>Latest audits from Base Sepolia blockchain</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-400">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
            <p>{error}</p>
          </div>
        ) : recentAudits.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Shield className="h-8 w-8 mx-auto mb-2" />
            <p>No audits found. Start auditing contracts to see them here!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentAudits.map((audit) => (
              <div
                key={audit.id}
                className="glass p-4 rounded-lg hover:bg-white/10 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-mono text-sm">
                    {formatAddress(audit.contractAddress)}
                  </div>
                  <Badge
                    variant={
                      audit.riskScore < 40 ? "low" :
                      audit.riskScore < 60 ? "medium" :
                      audit.riskScore < 80 ? "high" : "critical"
                    }
                  >
                    Risk: {audit.riskScore}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatTimestamp(audit.timestamp)}
                  </div>
                  {audit.auditor && (
                    <div className="font-mono text-xs">
                      {formatAddress(audit.auditor)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}


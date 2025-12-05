"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Calendar, ExternalLink, Loader2, AlertTriangle } from "lucide-react";
import { formatAddress, formatTimestamp } from "@/lib/utils";
import { useAudits } from "@/lib/hooks/useAudits";

export function RecentAuditsList() {
  const { audits, loading, error } = useAudits();

  const recentAudits = audits
    .filter(audit => audit && audit.contractAddress && audit.isActive)
    .slice(0, 10)
    .map((audit, index) => ({
      id: `${audit.contractAddress || 'unknown'}-${index}`,
      contractAddress: audit.contractAddress || '0x0000000000000000000000000000000000000000',
      riskScore: Number(audit.riskScore || 0),
      timestamp: audit.timestamp || 0n,
      auditor: audit.auditor || '0x0000000000000000000000000000000000000000',
      reportHash: audit.reportHash || '',
    }));

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Recent Audits
        </CardTitle>
        <CardDescription>
          Latest {recentAudits.length} audit{recentAudits.length !== 1 ? 's' : ''} registered on Base Sepolia • Real-time data
        </CardDescription>
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
            <p>No recent audits. Start auditing contracts to see them here!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentAudits.map((audit) => (
              <div
                key={audit.id}
                className="glass p-4 rounded-lg hover:bg-white/10 transition-all cursor-pointer border border-white/10 hover:border-primary/50"
                onClick={() => window.open(`https://sepolia.basescan.org/address/${audit.contractAddress}`, '_blank')}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="font-mono text-sm">
                      {formatAddress(audit.contractAddress)}
                    </div>
                    <a
                      href={`https://sepolia.basescan.org/address/${audit.contractAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-primary hover:underline"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
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
                  {audit.auditor && audit.auditor !== '0x0000000000000000000000000000000000000000' && (
                    <div className="font-mono text-xs">
                      Auditor: {formatAddress(audit.auditor)}
                    </div>
                  )}
                </div>
                {audit.reportHash && (
                  <div className="mt-2 text-xs text-muted-foreground font-mono">
                    Report Hash: {audit.reportHash.slice(0, 30)}...
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}


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
      .filter(audit => audit && audit.contractAddress) // Filter out invalid audits
      .slice()
      .sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
      .slice(0, 10)
      .map((audit, index) => ({
        id: `${audit.contractAddress || 'unknown'}-${index}`,
        contractAddress: audit.contractAddress || '0x0000000000000000000000000000000000000000',
        riskScore: Number(audit.riskScore || 0),
        timestamp: audit.timestamp || 0n,
        auditor: audit.auditor || '0x0000000000000000000000000000000000000000',
      }));
  }, [audits]);

  return (
    <Card className="glass">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          Recent Security Audits
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Latest {recentAudits.length} audit{recentAudits.length !== 1 ? 's' : ''} from Base Sepolia blockchain • Real-time data
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0">
        {loading ? (
          <div className="flex items-center justify-center py-8 sm:py-12">
            <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-8 sm:py-12 text-red-400">
            <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2" />
            <p className="text-xs sm:text-sm">{error}</p>
          </div>
        ) : recentAudits.length === 0 ? (
          <div className="text-center py-8 sm:py-12 text-muted-foreground">
            <Shield className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2" />
            <p className="text-xs sm:text-sm">No audits found. Start auditing contracts to see them here!</p>
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-3">
            {recentAudits.map((audit) => (
              <div
                key={audit.id}
                className="glass p-3 sm:p-4 rounded-lg hover:bg-white/10 transition-all cursor-pointer"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
                  <div className="font-mono text-xs sm:text-sm break-all sm:break-normal">
                    {audit.contractAddress ? formatAddress(audit.contractAddress) : 'N/A'}
                  </div>
                  <Badge
                    variant={
                      audit.riskScore < 40 ? "low" :
                      audit.riskScore < 60 ? "medium" :
                      audit.riskScore < 80 ? "high" : "critical"
                    }
                    className="text-[10px] sm:text-xs"
                  >
                    Risk: {audit.riskScore}
                  </Badge>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[10px] sm:text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatTimestamp(audit.timestamp)}
                  </div>
                  {audit.auditor && audit.auditor !== '0x0000000000000000000000000000000000000000' && (
                    <div className="font-mono text-[10px] sm:text-xs break-all sm:break-normal">
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


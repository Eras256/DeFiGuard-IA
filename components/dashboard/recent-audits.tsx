"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Calendar } from "lucide-react";
import { formatAddress, formatTimestamp } from "@/lib/utils";

interface Audit {
  id: string;
  contractAddress: string;
  riskScore: number;
  timestamp: number;
  vulnerabilities: number;
}

interface RecentAuditsProps {
  audits: Audit[];
}

export function RecentAudits({ audits }: RecentAuditsProps) {
  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Recent Security Audits
        </CardTitle>
        <CardDescription>Your latest smart contract analyses</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {audits.map((audit) => (
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
                <div>
                  {audit.vulnerabilities} vulnerabilities found
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}


"use client";

import React from "react";
import { Shield, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  // Mock data - in production, fetch from API/blockchain
  const recentAudits = [
    { contract: "0x1234...5678", riskScore: 23, date: "2025-12-01", status: "Safe" },
    { contract: "0xabcd...ef01", riskScore: 78, date: "2025-12-01", status: "High Risk" },
    { contract: "0x9876...5432", riskScore: 45, date: "2025-11-30", status: "Medium Risk" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          <span className="gradient-text">Dashboard</span>
        </h1>
        <p className="text-muted-foreground">Overview of your security audits and contract health</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Total Audits</span>
              <Shield className="h-5 w-5 text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">24</div>
            <p className="text-sm text-muted-foreground">+3 this week</p>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Critical Issues</span>
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-400">5</div>
            <p className="text-sm text-muted-foreground">Needs attention</p>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Avg Risk Score</span>
              <TrendingUp className="h-5 w-5 text-yellow-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-400">42</div>
            <p className="text-sm text-muted-foreground">Medium risk</p>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Secure Contracts</span>
              <CheckCircle className="h-5 w-5 text-green-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-400">15</div>
            <p className="text-sm text-muted-foreground">62.5% safe</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Audits */}
      <Card className="glass">
        <CardHeader>
          <CardTitle>Recent Audits</CardTitle>
          <CardDescription>Your latest smart contract security analyses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentAudits.map((audit, index) => (
              <div key={index} className="flex items-center justify-between p-4 glass rounded-lg">
                <div className="flex items-center gap-4">
                  <Shield className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-mono text-sm">{audit.contract}</div>
                    <div className="text-xs text-muted-foreground">{audit.date}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-semibold">Risk Score: {audit.riskScore}</div>
                  </div>
                  <Badge
                    variant={
                      audit.riskScore < 40 ? "low" :
                      audit.riskScore < 60 ? "medium" :
                      audit.riskScore < 80 ? "high" : "critical"
                    }
                  >
                    {audit.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


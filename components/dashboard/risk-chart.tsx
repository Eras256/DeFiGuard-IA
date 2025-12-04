"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, TrendingUp } from "lucide-react";

export function RiskChart() {
  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Risk Trend Analysis
        </CardTitle>
        <CardDescription>Average security score over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-center justify-center">
          <div className="text-center">
            <LineChart className="h-16 w-16 text-primary/50 mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">
              Chart visualization would appear here using Recharts
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Showing security improvement trends across all audited contracts
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


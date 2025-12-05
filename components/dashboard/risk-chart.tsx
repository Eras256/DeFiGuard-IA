"use client";

import React, { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from "recharts";
import { TrendingUp, Loader2 } from "lucide-react";
import { useAudits } from "@/lib/hooks/useAudits";

export function RiskChart() {
  const { audits, loading } = useAudits();

  const chartData = useMemo(() => {
    if (!audits || audits.length === 0) return [];

    // Group audits by date and calculate average risk score
    const dateMap = new Map<string, { date: string; avgRisk: number; count: number }>();
    
    audits.forEach((audit) => {
      const date = new Date(Number(audit.timestamp) * 1000).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit'
      });
      
      const riskScore = Number(audit.riskScore);
      
      if (dateMap.has(date)) {
        const existing = dateMap.get(date)!;
        existing.avgRisk = (existing.avgRisk * existing.count + riskScore) / (existing.count + 1);
        existing.count += 1;
      } else {
        dateMap.set(date, { date, avgRisk: riskScore, count: 1 });
      }
    });

    return Array.from(dateMap.values())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-10); // Last 10 data points
  }, [audits]);

  const riskDistribution = useMemo(() => {
    if (!audits || audits.length === 0) return [];

    const ranges = [
      { range: "0-20", min: 0, max: 20, count: 0, label: "Excellent (0-20)" },
      { range: "21-40", min: 21, max: 40, count: 0, label: "Good (21-40)" },
      { range: "41-60", min: 41, max: 60, count: 0, label: "Fair (41-60)" },
      { range: "61-80", min: 61, max: 80, count: 0, label: "Poor (61-80)" },
      { range: "81-100", min: 81, max: 100, count: 0, label: "Critical (81-100)" },
    ];

    audits.forEach((audit) => {
      const riskScore = Number(audit.riskScore);
      const range = ranges.find(r => riskScore >= r.min && riskScore <= r.max);
      if (range) range.count++;
    });

    return ranges.map(r => ({ name: r.label, value: r.count }));
  }, [audits]);

  const averageRisk = useMemo(() => {
    if (!audits || audits.length === 0) return 0;
    const sum = audits.reduce((acc, audit) => acc + Number(audit.riskScore), 0);
    return Math.round(sum / audits.length);
  }, [audits]);

  if (loading) {
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
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Risk Trend Analysis
        </CardTitle>
        <CardDescription>
          Real-time security analysis from {audits.length} audit{audits.length !== 1 ? 's' : ''} • Average Risk: {averageRisk}/100
        </CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <div className="space-y-6">
            {/* Risk Trend Over Time */}
            <div>
              <h3 className="text-sm font-medium mb-4 text-gray-300">Risk Score Trend</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#9ca3af"
                    fontSize={12}
                    tick={{ fill: '#9ca3af' }}
                  />
                  <YAxis 
                    stroke="#9ca3af"
                    fontSize={12}
                    tick={{ fill: '#9ca3af' }}
                    domain={[0, 100]}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="avgRisk" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    dot={{ fill: '#8b5cf6', r: 4 }}
                    name="Avg Risk Score"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Risk Distribution */}
            <div>
              <h3 className="text-sm font-medium mb-4 text-gray-300">Risk Distribution</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={riskDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#9ca3af"
                    fontSize={10}
                    tick={{ fill: '#9ca3af' }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    stroke="#9ca3af"
                    fontSize={12}
                    tick={{ fill: '#9ca3af' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="#8b5cf6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="h-16 w-16 text-primary/50 mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">
                No audit data available yet
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Start auditing contracts to see risk trends
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


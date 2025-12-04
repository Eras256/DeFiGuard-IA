"use client";

import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, Shield, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VulnerabilityAnalysis } from "@/lib/gemini/client";
import { VulnerabilityCard } from "./vulnerability-card";
import { getRiskScoreColor } from "@/lib/utils";

interface AnalysisResultsProps {
  analysis: VulnerabilityAnalysis;
}

export function AnalysisResults({ analysis }: AnalysisResultsProps) {
  const criticalCount = analysis.vulnerabilities.filter(v => v.severity === "Critical").length;
  const highCount = analysis.vulnerabilities.filter(v => v.severity === "High").length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Overall Risk Score */}
      <Card className="glass glow-border">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              Security Analysis Complete
            </span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">Risk Score:</span>
              <span className={`text-4xl font-bold ${getRiskScoreColor(analysis.riskScore)}`}>
                {analysis.riskScore}/100
              </span>
            </div>
          </CardTitle>
          <CardDescription>{analysis.summary}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-red-400">{criticalCount}</div>
              <div className="text-sm text-muted-foreground">Critical</div>
            </div>
            <div className="glass p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-orange-400">{highCount}</div>
              <div className="text-sm text-muted-foreground">High</div>
            </div>
            <div className="glass p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {analysis.vulnerabilities.filter(v => v.severity === "Medium").length}
              </div>
              <div className="text-sm text-muted-foreground">Medium</div>
            </div>
            <div className="glass p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-400">
                {analysis.vulnerabilities.filter(v => v.severity === "Low").length}
              </div>
              <div className="text-sm text-muted-foreground">Low</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vulnerabilities List */}
      {analysis.vulnerabilities.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-2xl font-bold flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-orange-400" />
            Detected Vulnerabilities
          </h3>
          {analysis.vulnerabilities.map((vulnerability, index) => (
            <VulnerabilityCard key={index} vulnerability={vulnerability} />
          ))}
        </div>
      ) : (
        <Card className="glass">
          <CardContent className="py-12 text-center">
            <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-green-400 mb-2">No Vulnerabilities Detected!</h3>
            <p className="text-muted-foreground">
              Your contract appears to follow security best practices.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Gas Optimizations */}
      {analysis.gasOptimizations.length > 0 && (
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-green-400" />
              Gas Optimization Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analysis.gasOptimizations.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-green-400 mt-0.5">•</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Best Practices */}
      {analysis.bestPractices.length > 0 && (
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-blue-400" />
              Security Best Practices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analysis.bestPractices.map((practice, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-blue-400 mt-0.5">•</span>
                  <span>{practice}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}


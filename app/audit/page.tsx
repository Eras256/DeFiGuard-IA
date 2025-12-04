"use client";

import React, { useState } from "react";
import { ContractUploader } from "@/components/audit/contract-uploader";
import { AnalysisResults } from "@/components/audit/analysis-results";
import { VulnerabilityAnalysis } from "@/lib/gemini/client";
import { toast } from "sonner";

export default function AuditPage() {
  const [analysis, setAnalysis] = useState<VulnerabilityAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async (code: string) => {
    setIsAnalyzing(true);
    setAnalysis(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      const result = await response.json();
      setAnalysis(result);
      toast.success("Analysis complete!");
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("Failed to analyze contract. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          <span className="gradient-text">Smart Contract Auditor</span>
        </h1>
        <p className="text-muted-foreground">
          Upload your Solidity contract for instant AI-powered security analysis
        </p>
      </div>

      <div className="space-y-8">
        <ContractUploader onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
        {analysis && <AnalysisResults analysis={analysis} />}
      </div>
    </div>
  );
}


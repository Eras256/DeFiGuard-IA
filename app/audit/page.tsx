"use client";

import { useState } from "react";
import { ContractUploader } from "@/components/audit/contract-uploader";
import { AnalysisResults } from "@/components/audit/analysis-results";
import { VulnerabilityAnalysis } from "@/lib/gemini/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useActiveAccount } from "thirdweb/react";
import { AlertCircle, CheckCircle2, ExternalLink, Sparkles } from "lucide-react";
import { CONTRACT_ADDRESSES } from "@/lib/constants";
import { toast } from "sonner";
import { GeminiStatus } from "@/components/shared/gemini-status";
import { GeminiBadge } from "@/components/shared/gemini-badge";
import { AuditStats } from "@/components/audit/audit-stats";
import { AuditSearch } from "@/components/audit/audit-search";
import { RecentAuditsList } from "@/components/audit/recent-audits-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AnalysisResponse {
  success: boolean;
  data?: VulnerabilityAnalysis;
  modelUsed?: string;
  error?: string;
}

export default function AuditPage() {
  const [analysis, setAnalysis] = useState<VulnerabilityAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [modelUsed, setModelUsed] = useState<string | null>(null);
  const [contractCode, setContractCode] = useState<string>("");
  const [contractAddress, setContractAddress] = useState<string>("");
  const account = useActiveAccount();

  const handleAnalyze = async (code: string, address?: string) => {
    setLoading(true);
    setAnalysis(null);
    setModelUsed(null);
    setContractCode(code);
    setContractAddress(address || "");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      let result: AnalysisResponse;
      try {
        result = await response.json();
      } catch (jsonError) {
        const text = await response.text();
        console.error("Failed to parse JSON response:", text);
        throw new Error(`Server returned invalid JSON. Status: ${response.status}. Response: ${text.substring(0, 200)}`);
      }
      
      if (!response.ok || !result.success) {
        const errorMessage = result.error || `Server error: ${response.status} ${response.statusText}`;
        console.error("Analysis failed:", errorMessage);
        console.error("Full error response:", result);
        throw new Error(errorMessage);
      }
      
      if (result.data) {
        setAnalysis(result.data);
        setModelUsed(result.modelUsed || null);
        toast.success(`Analysis complete! Powered by GEMINI IA + MCP NullShot Architecture`);
      } else {
        throw new Error("No analysis data received");
      }
    } catch (error: any) {
      console.error("Analysis error:", error);
      console.error("Error details:", {
        message: error.message,
        name: error.name,
        stack: error.stack,
      });
      const errorMessage = error.message || "Failed to analyze contract. Please check your Gemini API key and try again.";
      toast.error(errorMessage, {
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
      {/* Header with connection status */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text">
            Smart Contract Auditor
          </h1>
          <GeminiBadge model={modelUsed || undefined} variant="compact" />
        </div>
        <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-4 sm:mb-6">
          AI-powered security analysis using <span className="text-primary font-semibold">GEMINI IA</span> + MCP NullShot Architecture
        </p>

        {/* Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
          {/* Gemini Status */}
          <GeminiStatus />

          {/* Wallet Connection Status */}
          <Card className="glass">
            <CardContent className="py-2.5 sm:py-3 px-3 sm:px-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {account ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-cyber-green flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-medium">Wallet Connected</div>
                        <div className="text-[10px] sm:text-xs text-gray-400 truncate">
                          {account.address.slice(0, 6)}...{account.address.slice(-4)}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                      <div className="text-xs sm:text-sm text-gray-400">
                        Connect wallet to record audits on-chain
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contract Addresses */}
        <Card className="glass">
          <CardContent className="py-2.5 sm:py-3 px-3 sm:px-4">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 text-[10px] sm:text-xs">
              <span className="text-gray-400">Deployed Contracts:</span>
              <a
                href={`https://sepolia.basescan.org/address/${CONTRACT_ADDRESSES.AUDIT_REGISTRY}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-primary hover:underline"
              >
                AuditRegistry <ExternalLink className="h-3 w-3" />
              </a>
              <a
                href={`https://sepolia.basescan.org/address/${CONTRACT_ADDRESSES.GUARD_NFT}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-primary hover:underline"
              >
                GuardNFT <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Audit Statistics */}
      <div className="mb-6 sm:mb-8">
        <AuditStats />
      </div>

      {/* Tabs to organize content */}
      <Tabs defaultValue="analyze" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-3 h-auto">
          <TabsTrigger value="analyze" className="text-xs sm:text-sm py-2 sm:py-2.5">Analyze Contract</TabsTrigger>
          <TabsTrigger value="search" className="text-xs sm:text-sm py-2 sm:py-2.5">Search Audits</TabsTrigger>
          <TabsTrigger value="recent" className="text-xs sm:text-sm py-2 sm:py-2.5">Recent Audits</TabsTrigger>
        </TabsList>

        {/* Tab: Analyze Contract */}
        <TabsContent value="analyze" className="space-y-6">
          {/* Uploader */}
          <ContractUploader onAnalyze={handleAnalyze} isAnalyzing={loading} />

          {/* Results */}
          {loading && (
            <Card className="glass mt-8 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                  Analyzing Contract with Gemini AI...
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <div className="text-gray-400">
                      Gemini AI is analyzing your contract for vulnerabilities...
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 pl-11">
                    Using multi-model fallback system for maximum reliability
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {analysis && !loading && (
            <AnalysisResults
              analysis={analysis}
              contractAddress={contractAddress}
              contractCode={contractCode}
              modelUsed={modelUsed}
            />
          )}
        </TabsContent>

        {/* Tab: Search Audits */}
        <TabsContent value="search">
          <AuditSearch />
        </TabsContent>

        {/* Tab: Recent Audits */}
        <TabsContent value="recent">
          <RecentAuditsList />
        </TabsContent>
      </Tabs>
    </div>
  );
}


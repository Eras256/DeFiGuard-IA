"use client";

import React, { useState } from "react";
import { Upload, FileCode, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SAMPLE_VULNERABLE_CONTRACT } from "@/lib/constants";
import { GeminiBadge } from "@/components/shared/gemini-badge";

interface ContractUploaderProps {
  onAnalyze: (code: string, address?: string) => void;
  isAnalyzing: boolean;
}

export function ContractUploader({ onAnalyze, isAnalyzing }: ContractUploaderProps) {
  const [code, setCode] = useState("");
  const [contractAddress, setContractAddress] = useState("");

  const handleAnalyze = () => {
    if (code.trim()) {
      onAnalyze(code, contractAddress.trim() || undefined);
    }
  };

  const loadSampleContract = () => {
    setCode(SAMPLE_VULNERABLE_CONTRACT);
  };

  return (
    <Card className="glass">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
          <CardTitle className="flex items-center gap-2">
            <FileCode className="h-6 w-6 text-primary" />
            Smart Contract Upload
          </CardTitle>
          <GeminiBadge variant="compact" />
        </div>
        <CardDescription>
          Paste your Solidity contract code below for AI-powered security analysis using{" "}
          <span className="text-primary font-semibold">GEMINI IA + MCP NullShot Architecture</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Contract Address (Optional)</label>
          <input
            type="text"
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
            placeholder="0x..."
            className="w-full px-4 py-2 glass rounded-lg border border-white/10 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono text-sm transition-all"
            disabled={isAnalyzing}
          />
          <p className="text-xs text-muted-foreground mt-1">
            If provided, audit can be recorded on-chain after analysis
          </p>
        </div>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="// SPDX-License-Identifier: MIT&#10;pragma solidity ^0.8.0;&#10;&#10;contract MyContract {&#10;    // Your contract code here&#10;}"
          className="w-full h-96 px-4 py-3 glass rounded-lg border border-white/10 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono text-sm resize-none transition-all"
          disabled={isAnalyzing}
        />
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleAnalyze}
            disabled={!code.trim() || isAnalyzing}
            variant="glow"
            size="lg"
            className="flex-1"
          >
            {isAnalyzing ? (
              <>
                <Sparkles className="mr-2 h-5 w-5 animate-pulse text-primary" />
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Analyzing with GEMINI IA + MCP NullShot...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-5 w-5" />
                Analyze with GEMINI IA + MCP NullShot
              </>
            )}
          </Button>
          <Button
            onClick={loadSampleContract}
            disabled={isAnalyzing}
            variant="outline"
            size="lg"
          >
            Load Sample (Vulnerable)
          </Button>
        </div>
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Sparkles className="h-3 w-3 text-primary" />
          <span>Analysis typically completes in 15-30 seconds</span>
          <span>•</span>
          <GeminiBadge variant="inline" />
        </div>
      </CardContent>
    </Card>
  );
}


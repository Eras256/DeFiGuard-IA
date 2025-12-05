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
    // Generate a unique demo contract address for testing purposes
    // This allows users to record audits and mint NFTs multiple times for demo
    // Format: 0x + 40 hex characters (demo addresses start with 0xd3a0 for easy identification)
    // Using timestamp + random to ensure uniqueness for each demo
    const timestamp = Date.now().toString(16).slice(-8).padStart(8, '0'); // 8 hex chars, padded
    const random = Array.from({ length: 32 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    // 0x (2) + d3a0 (4) + timestamp (8) + random (28) = 42 characters total
    // d3a0 is hex-valid and easy to identify as demo addresses (d3a0 = demo in hex-like)
    // Convert to lowercase to ensure valid Ethereum address format
    const demoAddress = `0xd3a0${timestamp}${random}`.slice(0, 42).toLowerCase();
    setContractAddress(demoAddress);
  };

  return (
    <Card className="glass">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <FileCode className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            Smart Contract Upload
          </CardTitle>
          <GeminiBadge variant="compact" />
        </div>
        <CardDescription className="text-xs sm:text-sm">
          Paste your Solidity contract code below for AI-powered security analysis using{" "}
          <span className="text-primary font-semibold">GEMINI IA + MCP NullShot Architecture</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">
            Contract Address {contractAddress.toLowerCase().startsWith('0xd3a0') && (
              <span className="text-primary text-xs">(Demo Address)</span>
            )}
          </label>
          <input
            type="text"
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
            placeholder="0x..."
            className="w-full px-4 py-2 glass rounded-lg border border-white/10 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono text-sm transition-all"
            disabled={isAnalyzing}
          />
          <p className="text-xs text-muted-foreground mt-1">
            {contractAddress.toLowerCase().startsWith('0xd3a0') 
              ? "Demo address generated. You can record audits and mint NFTs multiple times for testing."
              : "If provided, audit can be recorded on-chain after analysis"}
          </p>
        </div>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="// SPDX-License-Identifier: MIT&#10;pragma solidity ^0.8.0;&#10;&#10;contract MyContract {&#10;    // Your contract code here&#10;}"
          className="w-full h-64 sm:h-80 md:h-96 px-3 sm:px-4 py-2 sm:py-3 glass rounded-lg border border-white/10 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono text-xs sm:text-sm resize-none transition-all"
          disabled={isAnalyzing}
        />
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button
            onClick={handleAnalyze}
            disabled={!code.trim() || isAnalyzing}
            variant="glow"
            size="lg"
            className="flex-1 text-sm sm:text-base"
          >
            {isAnalyzing ? (
              <>
                <Sparkles className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-pulse text-primary" />
                <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                <span className="hidden sm:inline">Analyzing with GEMINI IA + MCP NullShot...</span>
                <span className="sm:hidden">Analyzing...</span>
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">Analyze with GEMINI IA + MCP NullShot</span>
                <span className="sm:hidden">Analyze Contract</span>
              </>
            )}
          </Button>
          <Button
            onClick={loadSampleContract}
            disabled={isAnalyzing}
            variant="outline"
            size="lg"
            className="text-sm sm:text-base"
          >
            Load Sample (Demo)
          </Button>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
          <Sparkles className="h-3 w-3 text-primary" />
          <span className="text-center">Analysis typically completes in 15-30 seconds</span>
          <span className="hidden sm:inline">•</span>
          <GeminiBadge variant="inline" />
        </div>
      </CardContent>
    </Card>
  );
}


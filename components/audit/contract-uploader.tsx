"use client";

import React, { useState } from "react";
import { Upload, FileCode, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SAMPLE_VULNERABLE_CONTRACT } from "@/lib/constants";

interface ContractUploaderProps {
  onAnalyze: (code: string) => void;
  isAnalyzing: boolean;
}

export function ContractUploader({ onAnalyze, isAnalyzing }: ContractUploaderProps) {
  const [code, setCode] = useState("");

  const handleAnalyze = () => {
    if (code.trim()) {
      onAnalyze(code);
    }
  };

  const loadSampleContract = () => {
    setCode(SAMPLE_VULNERABLE_CONTRACT);
  };

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileCode className="h-6 w-6 text-primary" />
          Smart Contract Upload
        </CardTitle>
        <CardDescription>
          Paste your Solidity contract code below for AI-powered security analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Analyzing Contract...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-5 w-5" />
                Analyze Contract
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
        <p className="text-xs text-muted-foreground text-center">
          Analysis typically completes in 15-30 seconds • Powered by Gemini 2.5 Flash
        </p>
      </CardContent>
    </Card>
  );
}


"use client";

import React, { useState } from "react";
import { ArrowLeft, Code, Book, Terminal, Copy, Check, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const codeExamples = {
  analyze: `// Analyze a smart contract
const response = await fetch('/api/analyze', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    code: contractSourceCode,
    contractAddress: '0x...' // Optional
  })
});

const result = await response.json();
// Returns: { success: true, data: VulnerabilityAnalysis, modelUsed: string }`,

  recordAudit: `// Record an audit on-chain
const response = await fetch('/api/record-audit', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    contractAddress: '0x...',
    riskScore: 25,
    reportHash: 'Qm...' // IPFS hash
  })
});

const result = await response.json();
// Returns: { success: true, transactionHash: string }`,

  mintBadge: `// Mint an NFT badge for certified contract
const response = await fetch('/api/mint-badge', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    contractAddress: '0x...',
    riskScore: 15
  })
});

const result = await response.json();
// Returns: { success: true, tokenId: string, transactionHash: string }`,
};

const apiEndpoints = [
  {
    method: "POST",
    path: "/api/analyze",
    description: "Analyze a smart contract for security vulnerabilities using Gemini AI + MCP Architecture",
    parameters: [
      { name: "code", type: "string", required: true, description: "Solidity source code of the contract" },
      { name: "contractAddress", type: "string", required: false, description: "Contract address (optional)" },
    ],
    response: {
      success: true,
      data: {
        riskScore: "number",
        vulnerabilities: "array",
        recommendations: "array",
        overallAssessment: "string",
      },
      modelUsed: "string",
    },
  },
  {
    method: "POST",
    path: "/api/record-audit",
    description: "Record an audit result on-chain to the AuditRegistry contract",
    parameters: [
      { name: "contractAddress", type: "string", required: true, description: "Address of the audited contract" },
      { name: "riskScore", type: "number", required: true, description: "Risk score from 0-100" },
      { name: "reportHash", type: "string", required: true, description: "IPFS hash of the audit report" },
    ],
    response: {
      success: true,
      transactionHash: "string",
    },
  },
  {
    method: "POST",
    path: "/api/mint-badge",
    description: "Mint an NFT certification badge for contracts with risk score < 40",
    parameters: [
      { name: "contractAddress", type: "string", required: true, description: "Address of the certified contract" },
      { name: "riskScore", type: "number", required: true, description: "Risk score (must be < 40)" },
    ],
    response: {
      success: true,
      tokenId: "string",
      transactionHash: "string",
    },
  },
];

export default function APIDocumentationPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="min-h-screen pt-20 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <div className="flex items-center justify-center gap-3 mb-6">
            <Code className="h-12 w-12 text-primary" />
            <h1 className="text-5xl font-bold gradient-text">API Documentation</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Complete API reference for integrating DeFiGuard AI into your applications
          </p>
        </div>

        {/* Quick Start */}
        <Card className="glass mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Quick Start
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              DeFiGuard AI provides RESTful APIs for analyzing smart contracts, recording audits on-chain, and minting 
              certification badges. All endpoints require JSON payloads and return JSON responses.
            </p>
            <div className="bg-black/30 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-2">Base URL:</p>
              <code className="text-sm text-primary">https://your-domain.com/api</code>
            </div>
          </CardContent>
        </Card>

        {/* MCP Architecture Explanation */}
        <Card className="glass mb-8 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Terminal className="h-5 w-5 text-primary" />
              MCP Architecture: How It Works
            </CardTitle>
            <CardDescription>
              Understanding the Model Context Protocol integration that powers DeFiGuard AI
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3 text-primary">What is MCP Architecture?</h3>
              <p className="text-muted-foreground mb-4">
                DeFiGuard AI uses <strong className="text-white">Model Context Protocol (MCP)</strong> to enhance AI analysis 
                with specialized data sources. When you submit a contract for analysis, three MCP servers work in parallel to 
                provide comprehensive security insights.
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-black/30 rounded-lg p-4 border border-primary/10">
                <h4 className="font-semibold mb-2 text-cyber-blue">1. SlitherMCP Server</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Performs static code analysis on your Solidity contract:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                  <li>Detects known vulnerability patterns (reentrancy, overflow, access control)</li>
                  <li>Analyzes code structure and identifies security weaknesses</li>
                  <li>Provides line-by-line vulnerability mapping with severity levels</li>
                  <li>Identifies gas optimization opportunities</li>
                </ul>
              </div>

              <div className="bg-black/30 rounded-lg p-4 border border-primary/10">
                <h4 className="font-semibold mb-2 text-cyber-purple">2. BlockchainMCP Server</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Fetches on-chain data when a contract address is provided:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                  <li>Retrieves contract verification status from blockchain explorers</li>
                  <li>Fetches transaction history and interaction patterns</li>
                  <li>Analyzes token holder distribution and contract usage</li>
                  <li>Validates contract behavior in production environment</li>
                </ul>
              </div>

              <div className="bg-black/30 rounded-lg p-4 border border-primary/10">
                <h4 className="font-semibold mb-2 text-cyber-green">3. DeFiDataMCP Server</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Correlates contract patterns with historical exploits:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                  <li>Matches vulnerabilities to real-world hacks (DAO Hack 2016, Parity Wallet, etc.)</li>
                  <li>Provides exploit scenarios based on similar compromised contracts</li>
                  <li>Enhances AI understanding with DeFi protocol security data</li>
                  <li>Offers historical context for vulnerability assessment</li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-r from-primary/10 to-cyber-purple/10 rounded-lg p-4 border border-primary/20">
              <h4 className="font-semibold mb-3 text-white">How MCP Enhances AI Analysis</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <strong className="text-white">Step 1:</strong> All three MCP servers execute in parallel, collecting 
                  static analysis, on-chain data, and historical exploit information.
                </p>
                <p>
                  <strong className="text-white">Step 2:</strong> The collected data is aggregated into a rich context that 
                  includes vulnerability patterns, real-world usage, and historical correlations.
                </p>
                <p>
                  <strong className="text-white">Step 3:</strong> This enriched context is injected into the Gemini AI prompt, 
                  providing the model with multi-dimensional understanding beyond simple code review.
                </p>
                <p>
                  <strong className="text-white">Step 4:</strong> Gemini AI generates comprehensive vulnerability reports that 
                  combine code analysis, real-world validation, and historical knowledge.
                </p>
              </div>
            </div>

            <div className="bg-black/30 rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-primary">Benefits</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-cyber-green">✓</span>
                  <span className="text-muted-foreground">Fault tolerant - partial failures don't break analysis</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-cyber-green">✓</span>
                  <span className="text-muted-foreground">Parallel execution for faster results</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-cyber-green">✓</span>
                  <span className="text-muted-foreground">Multi-dimensional analysis catches more vulnerabilities</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-cyber-green">✓</span>
                  <span className="text-muted-foreground">Real-world context enhances AI understanding</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API Endpoints */}
        <div className="space-y-8 mb-8">
          {apiEndpoints.map((endpoint, index) => (
            <Card key={index} className="glass">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant="outline" className="font-mono">
                    {endpoint.method}
                  </Badge>
                  <code className="text-lg font-mono text-primary">{endpoint.path}</code>
                </div>
                <CardDescription>{endpoint.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Parameters */}
                <div>
                  <h3 className="font-semibold mb-3">Parameters</h3>
                  <div className="space-y-2">
                    {endpoint.parameters.map((param, paramIndex) => (
                      <div key={paramIndex} className="flex items-start gap-3 text-sm">
                        <code className="text-primary min-w-[120px]">{param.name}</code>
                        <span className="text-muted-foreground min-w-[80px]">{param.type}</span>
                        {param.required && (
                          <Badge variant="destructive" className="text-xs">Required</Badge>
                        )}
                        <span className="text-muted-foreground flex-1">{param.description}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Response */}
                <div>
                  <h3 className="font-semibold mb-3">Response</h3>
                  <div className="bg-black/30 rounded-lg p-4">
                    <pre className="text-sm text-gray-300 overflow-x-auto">
                      {JSON.stringify(endpoint.response, null, 2)}
                    </pre>
                  </div>
                </div>

                {/* Code Example */}
                <div>
                  <h3 className="font-semibold mb-3">Example</h3>
                  <div className="relative">
                    <div className="bg-black/30 rounded-lg p-4">
                      <pre className="text-sm text-gray-300 overflow-x-auto">
                        {codeExamples[endpoint.path.replace('/api/', '') as keyof typeof codeExamples]}
                      </pre>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(
                        codeExamples[endpoint.path.replace('/api/', '') as keyof typeof codeExamples],
                        endpoint.path
                      )}
                    >
                      {copiedCode === endpoint.path ? (
                        <Check className="h-4 w-4 text-green-400" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Error Handling */}
        <Card className="glass mb-8">
          <CardHeader>
            <CardTitle>Error Handling</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              All API endpoints return standard HTTP status codes. Errors are returned in the following format:
            </p>
            <div className="bg-black/30 rounded-lg p-4 mb-4">
              <pre className="text-sm text-gray-300 overflow-x-auto">
{`{
  "success": false,
  "error": "Error message describing what went wrong",
  "details": { /* Additional error details in development */ }
}`}
              </pre>
            </div>
            <div className="space-y-2 text-sm">
              <div><strong className="text-white">400 Bad Request:</strong> Invalid parameters or request format</div>
              <div><strong className="text-white">500 Internal Server Error:</strong> Server-side error during processing</div>
              <div><strong className="text-white">503 Service Unavailable:</strong> API service temporarily unavailable</div>
            </div>
          </CardContent>
        </Card>

        {/* Rate Limiting */}
        <Card className="glass mb-8">
          <CardHeader>
            <CardTitle>Rate Limiting</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              API requests are rate-limited to prevent abuse. Current limits:
            </p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>• <strong className="text-white">Analyze endpoint:</strong> 10 requests per minute per IP</li>
              <li>• <strong className="text-white">Record audit endpoint:</strong> 5 requests per minute per wallet</li>
              <li>• <strong className="text-white">Mint badge endpoint:</strong> 3 requests per minute per wallet</li>
            </ul>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <Link href="/audit">
            <Button size="lg" variant="glow" className="text-lg px-8">
              Try API Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}


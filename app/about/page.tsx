"use client";

import React from "react";
import { Shield, Zap, Brain, Award, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GeminiBadge } from "@/components/shared/gemini-badge";

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-20 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <div className="flex items-center justify-center gap-3 mb-6">
            <Shield className="h-12 w-12 text-primary" />
            <h1 className="text-5xl font-bold gradient-text">About DeFiGuard AI</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Empowering developers with AI-powered smart contract security auditing
          </p>
        </div>

        {/* Mission */}
        <Card className="glass mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              DeFiGuard AI was created to democratize smart contract security auditing. We believe that every developer, 
              regardless of their budget or team size, should have access to enterprise-grade security analysis. Our platform 
              leverages cutting-edge AI technology powered by Gemini AI and MCP Architecture to provide instant, 
              comprehensive security audits that help prevent costly vulnerabilities before deployment.
            </p>
          </CardContent>
        </Card>

        {/* Technology */}
        <Card className="glass mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-primary" />
              Technology Stack
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <GeminiBadge variant="compact" />
                <span className="font-semibold">Gemini AI + MCP Architecture</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Powered by Google's Gemini AI models with multi-model fallback system for maximum reliability. 
                Built using Model Context Protocol (MCP) for seamless AI agent interoperability.
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-primary" />
                <span className="font-semibold">MCP Architecture with 3 Specialized Servers</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Enhanced security analysis through Model Context Protocol (MCP) architecture with three specialized servers:
              </p>
              <ul className="text-sm text-muted-foreground space-y-2 ml-4 list-disc">
                <li><strong className="text-white">SlitherMCP:</strong> Static code analysis and vulnerability pattern detection</li>
                <li><strong className="text-white">BlockchainMCP:</strong> On-chain data fetching and transaction analysis</li>
                <li><strong className="text-white">DeFiDataMCP:</strong> Historical exploit correlation and DeFi security intelligence</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-3">
                All three servers execute in parallel, aggregating their results into a rich context that enhances Gemini AI's 
                understanding. This multi-dimensional approach combines static analysis, real-world validation, and historical 
                knowledge to provide comprehensive security assessments.
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-5 w-5 text-primary" />
                <span className="font-semibold">On-Chain Certification</span>
              </div>
              <p className="text-sm text-muted-foreground">
                All audits are stored on Base Sepolia blockchain with NFT badges for verified certifications. 
                100% transparent and verifiable security records.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card className="glass mb-8">
          <CardHeader>
            <CardTitle>Key Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span><strong className="text-white">Ultra-Fast Analysis:</strong> Complete security audit in under 30 seconds</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span><strong className="text-white">Multi-Layer Detection:</strong> Combines static analysis, AI pattern recognition, and historical exploit correlation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span><strong className="text-white">Automatic Fixes:</strong> AI-generated secure code patches for identified vulnerabilities</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span><strong className="text-white">Risk Scoring:</strong> Comprehensive risk analysis with severity levels and deployment recommendations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span><strong className="text-white">NFT Certification:</strong> Verifiable on-chain badges for certified contracts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span><strong className="text-white">EVM-Compatible Analysis:</strong> Analyze contracts from any EVM-compatible chain. On-chain registration currently on Base Sepolia testnet</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Team */}
        <Card className="glass mb-8">
          <CardHeader>
            <CardTitle>Built With ❤️</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              DeFiGuard AI was built by a passionate team dedicated to making blockchain security 
              accessible to everyone.
            </p>
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <p className="text-muted-foreground">Made by</p>
                <p className="text-primary font-semibold text-lg">Vaiosx & M0nsxx</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <Link href="/audit">
            <Button size="lg" variant="glow" className="text-lg px-8">
              Start Your First Audit
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}


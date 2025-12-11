"use client";

import React, { useState } from "react";
import { ArrowLeft, BookOpen, PlayCircle, CheckCircle, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const tutorials = [
  {
    id: 1,
    title: "Getting Started with DeFiGuard AI",
    description: "Learn how to perform your first smart contract audit using DeFiGuard AI",
    duration: "5 min",
    difficulty: "Beginner",
    steps: [
      {
        title: "Connect Your Wallet",
        description: "Connect your Web3 wallet (MetaMask, WalletConnect, etc.) to Base Sepolia network",
        details: "Make sure you have Base Sepolia testnet configured in your wallet. You'll need testnet ETH for transaction fees.",
      },
      {
        title: "Upload Your Contract",
        description: "Paste your Solidity contract code or upload a .sol file",
        details: "You can upload complete contract files or paste code directly. The AI will analyze the entire contract for vulnerabilities.",
      },
      {
        title: "Review Analysis Results",
        description: "Examine the risk score, vulnerabilities, and recommendations provided by Gemini AI",
        details: "The analysis includes detailed vulnerability descriptions, severity levels, and suggested fixes. Risk scores range from 0-100.",
      },
      {
        title: "Record Audit On-Chain",
        description: "Save your audit results permanently on the blockchain",
        details: "Recording audits creates an immutable record that can be verified by anyone. This requires a small transaction fee.",
      },
      {
        title: "Mint Certification Badge",
        description: "If your contract has a risk score < 40, mint an NFT certification badge",
        details: "Certified contracts receive NFT badges that prove their security status. Badges are stored on-chain and can be displayed.",
      },
    ],
  },
  {
    id: 2,
    title: "Understanding Risk Scores",
    description: "Learn how to interpret risk scores and vulnerability assessments",
    duration: "8 min",
    difficulty: "Intermediate",
    steps: [
      {
        title: "Risk Score Ranges",
        description: "Understand what different risk score ranges mean",
        details: "0-20: Excellent (Platinum), 21-40: Good (Gold/Silver/Bronze), 41-60: Fair, 61-80: Poor, 81-100: Critical",
      },
      {
        title: "Vulnerability Severity",
        description: "Learn about different vulnerability severity levels",
        details: "Critical vulnerabilities require immediate attention. High severity issues should be fixed before deployment. Medium and low severity issues should be addressed based on context.",
      },
      {
        title: "Certification Eligibility",
        description: "Understand when contracts qualify for certification",
        details: "Only contracts with risk scores below 40 are eligible for certification. The specific badge level depends on the exact score.",
      },
      {
        title: "Interpreting Recommendations",
        description: "How to use AI-generated recommendations effectively",
        details: "Recommendations include code fixes, best practices, and security improvements. Always review suggestions carefully before implementing.",
      },
    ],
  },
  {
    id: 3,
    title: "Advanced: API Integration",
    description: "Integrate DeFiGuard AI into your development workflow using our API",
    duration: "15 min",
    difficulty: "Advanced",
    steps: [
      {
        title: "Set Up API Access",
        description: "Configure API endpoints and authentication",
        details: "Use the /api/analyze endpoint to programmatically analyze contracts. No authentication required for public endpoints.",
      },
      {
        title: "Automate Contract Analysis",
        description: "Create scripts to automatically audit contracts during development",
        details: "Integrate API calls into your CI/CD pipeline to catch vulnerabilities before deployment.",
      },
      {
        title: "Batch Processing",
        description: "Analyze multiple contracts efficiently",
        details: "Use parallel requests to analyze multiple contracts simultaneously. Respect rate limits to avoid throttling.",
      },
      {
        title: "Webhook Integration",
        description: "Set up webhooks for audit completion notifications",
        details: "Configure webhooks to receive notifications when audits complete, enabling automated workflows.",
      },
    ],
  },
  {
    id: 4,
    title: "Best Practices for Contract Auditing",
    description: "Learn professional auditing techniques and best practices",
    duration: "12 min",
    difficulty: "Intermediate",
    steps: [
      {
        title: "Pre-Audit Preparation",
        description: "Prepare your contract code for optimal analysis",
        details: "Ensure code is well-commented, formatted, and includes all dependencies. Remove test code and comments that might confuse the AI.",
      },
      {
        title: "Reviewing AI Findings",
        description: "How to effectively review and validate AI-generated findings",
        details: "Not all findings are vulnerabilities. Some may be false positives. Always verify findings manually and understand the context.",
      },
      {
        title: "Implementing Fixes",
        description: "Best practices for fixing identified vulnerabilities",
        details: "Follow the recommended fixes, but also consider the broader security implications. Test thoroughly after making changes.",
      },
      {
        title: "Re-auditing After Fixes",
        description: "Verify that fixes resolved vulnerabilities",
        details: "Always re-audit contracts after making security fixes to ensure vulnerabilities are properly addressed.",
      },
    ],
  },
];

export default function TutorialsPage() {
  const [expandedTutorial, setExpandedTutorial] = useState<number | null>(null);

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
            <BookOpen className="h-12 w-12 text-primary" />
            <h1 className="text-5xl font-bold gradient-text">Tutorials</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Step-by-step guides to help you master DeFiGuard AI
          </p>
        </div>

        {/* Tutorials List */}
        <div className="space-y-6 mb-8">
          {tutorials.map((tutorial) => (
            <Card 
              key={tutorial.id} 
              className="glass hover:border-primary/50 transition-all cursor-pointer"
              onClick={() => setExpandedTutorial(expandedTutorial === tutorial.id ? null : tutorial.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle>{tutorial.title}</CardTitle>
                      <Badge variant="outline">{tutorial.difficulty}</Badge>
                    </div>
                    <CardDescription>{tutorial.description}</CardDescription>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {tutorial.duration}
                    </div>
                    <PlayCircle className="h-5 w-5" />
                  </div>
                </div>
              </CardHeader>
              {expandedTutorial === tutorial.id && (
                <CardContent>
                  <div className="space-y-6 pt-4 border-t border-white/10">
                    {tutorial.steps.map((step, stepIndex) => (
                      <div key={stepIndex} className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                            {stepIndex + 1}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{step.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{step.description}</p>
                          <div className="bg-black/30 rounded-lg p-3 mt-2">
                            <p className="text-xs text-gray-400">{step.details}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="pt-4 border-t border-white/10">
                      <Link href="/audit">
                        <Button variant="glow" className="w-full">
                          Try This Tutorial
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Quick Tips */}
        <Card className="glass mb-8">
          <CardHeader>
            <CardTitle>Quick Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-cyber-green mt-0.5" />
                <div>
                  <h4 className="font-semibold mb-1">Always Audit Before Deployment</h4>
                  <p className="text-sm text-muted-foreground">Never deploy contracts to mainnet without a security audit.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-cyber-green mt-0.5" />
                <div>
                  <h4 className="font-semibold mb-1">Review All Findings</h4>
                  <p className="text-sm text-muted-foreground">Not all findings are critical. Review context before making changes.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-cyber-green mt-0.5" />
                <div>
                  <h4 className="font-semibold mb-1">Re-audit After Fixes</h4>
                  <p className="text-sm text-muted-foreground">Always verify that security fixes resolved vulnerabilities.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-cyber-green mt-0.5" />
                <div>
                  <h4 className="font-semibold mb-1">Use Multiple Tools</h4>
                  <p className="text-sm text-muted-foreground">Combine AI analysis with manual review and other security tools.</p>
                </div>
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


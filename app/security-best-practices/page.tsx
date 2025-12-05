"use client";

import React from "react";
import { ArrowLeft, Shield, AlertTriangle, CheckCircle, Lock, Code, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const bestPractices = [
  {
    category: "Access Control",
    icon: Lock,
    practices: [
      {
        title: "Use Access Control Modifiers",
        description: "Always use OpenZeppelin's Ownable or AccessControl for managing permissions. Never hardcode addresses.",
        severity: "critical",
        example: "Use `onlyOwner` modifier or role-based access control instead of direct address checks.",
      },
      {
        title: "Implement Multi-Signature Wallets",
        description: "For critical operations, require multiple signatures before execution.",
        severity: "high",
        example: "Use Gnosis Safe or implement custom multi-sig for admin functions.",
      },
      {
        title: "Avoid tx.origin",
        description: "Never use `tx.origin` for authorization. Always use `msg.sender` instead.",
        severity: "critical",
        example: "`require(msg.sender == owner)` instead of `require(tx.origin == owner)`.",
      },
    ],
  },
  {
    category: "Reentrancy Protection",
    icon: AlertTriangle,
    practices: [
      {
        title: "Use Checks-Effects-Interactions Pattern",
        description: "Always follow the CEI pattern: check conditions, update state, then interact with external contracts.",
        severity: "critical",
        example: "Update balances before calling external contracts to prevent reentrancy attacks.",
      },
      {
        title: "Implement ReentrancyGuard",
        description: "Use OpenZeppelin's ReentrancyGuard modifier for functions that call external contracts.",
        severity: "critical",
        example: "Add `nonReentrant` modifier to functions that perform external calls.",
      },
      {
        title: "Avoid External Calls in Loops",
        description: "External calls in loops can lead to gas issues and reentrancy vulnerabilities.",
        severity: "high",
        example: "Batch external calls or use pull payment patterns instead.",
      },
    ],
  },
  {
    category: "Integer Overflow/Underflow",
    icon: Code,
    practices: [
      {
        title: "Use SafeMath or Solidity 0.8+",
        description: "Always use SafeMath library or Solidity 0.8+ which has built-in overflow protection.",
        severity: "critical",
        example: "Use `SafeMath.add()` or rely on Solidity 0.8+ automatic checks.",
      },
      {
        title: "Validate Input Ranges",
        description: "Always validate that inputs are within expected ranges before performing arithmetic.",
        severity: "high",
        example: "Check that amounts are greater than 0 and less than maximum before calculations.",
      },
    ],
  },
  {
    category: "Gas Optimization",
    icon: Zap,
    practices: [
      {
        title: "Use Packed Storage",
        description: "Pack multiple small variables into single storage slots to save gas.",
        severity: "medium",
        example: "Use `uint128` instead of `uint256` when values are small enough.",
      },
      {
        title: "Cache Storage Variables",
        description: "Cache frequently accessed storage variables in memory to reduce gas costs.",
        severity: "medium",
        example: "Store `balances[user]` in a local variable if accessed multiple times.",
      },
      {
        title: "Use Events Instead of Storage",
        description: "For data that doesn't need to be read on-chain, use events instead of storage.",
        severity: "low",
        example: "Emit events for historical data that can be indexed off-chain.",
      },
    ],
  },
  {
    category: "Input Validation",
    icon: CheckCircle,
    practices: [
      {
        title: "Validate All External Inputs",
        description: "Always validate inputs from users, external contracts, and oracles.",
        severity: "critical",
        example: "Check that addresses are not zero, amounts are positive, and arrays are not empty.",
      },
      {
        title: "Use Require Statements with Clear Messages",
        description: "Provide clear error messages in require statements for better debugging.",
        severity: "medium",
        example: "`require(amount > 0, 'Amount must be greater than zero')`.",
      },
      {
        title: "Sanitize String Inputs",
        description: "Validate and sanitize string inputs to prevent injection attacks.",
        severity: "high",
        example: "Check string length and validate format before processing.",
      },
    ],
  },
];

export default function SecurityBestPracticesPage() {
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
            <Shield className="h-12 w-12 text-primary" />
            <h1 className="text-5xl font-bold gradient-text">Security Best Practices</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Essential security guidelines for developing secure smart contracts
          </p>
        </div>

        {/* Introduction */}
        <Card className="glass mb-8">
          <CardHeader>
            <CardTitle>Why Security Matters</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Smart contracts handle valuable assets and execute critical business logic. A single vulnerability can lead to 
              catastrophic losses. Following security best practices is not optional—it's essential for protecting users and 
              maintaining trust in your protocol.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              These guidelines are based on common vulnerabilities found in production contracts and recommendations from 
              security experts. Always audit your contracts before deployment, especially for production use.
            </p>
          </CardContent>
        </Card>

        {/* Best Practices by Category */}
        <div className="space-y-8">
          {bestPractices.map((category, categoryIndex) => {
            const CategoryIcon = category.icon;
            return (
              <Card key={categoryIndex} className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CategoryIcon className="h-6 w-6 text-primary" />
                    {category.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {category.practices.map((practice, practiceIndex) => (
                      <div key={practiceIndex} className="border-l-4 border-primary/30 pl-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-semibold">{practice.title}</h3>
                          <Badge
                            variant={
                              practice.severity === "critical" ? "critical" :
                              practice.severity === "high" ? "high" :
                              practice.severity === "medium" ? "medium" : "low"
                            }
                          >
                            {practice.severity}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-3">{practice.description}</p>
                        <div className="bg-black/30 rounded-lg p-3 mt-3">
                          <p className="text-sm text-gray-400 mb-1">Example:</p>
                          <code className="text-sm text-primary">{practice.example}</code>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Resources */}
        <Card className="glass mt-8">
          <CardHeader>
            <CardTitle>Additional Security Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Security Tools</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Slither - Static analysis tool</li>
                  <li>• Mythril - Security analysis framework</li>
                  <li>• Echidna - Property-based fuzzer</li>
                  <li>• Manticore - Symbolic execution tool</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Security Standards</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• OpenZeppelin Contracts - Secure library</li>
                  <li>• Consensys Best Practices</li>
                  <li>• SWC Registry - Vulnerability database</li>
                  <li>• DeFi Security Standards</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center mt-8">
          <Link href="/audit">
            <Button size="lg" variant="glow" className="text-lg px-8">
              Audit Your Contract Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}


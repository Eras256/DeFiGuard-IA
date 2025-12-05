"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Cpu,
  Shield,
  Zap,
  Globe,
  Code,
  LineChart,
  Lock,
  Sparkles,
  Network,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { GeminiBadge } from "@/components/shared/gemini-badge";

const features = [
  {
    icon: Cpu,
    title: "AI-Powered Analysis",
    description: "GEMINI IA + MCP NullShot Architecture analyzes contracts using AI SDK with multi-model fallback. Integrates MCP servers (Slither, Blockchain, DeFi) for comprehensive security insights.",
    gemini: true,
  },
  {
    icon: Shield,
    title: "Multi-Layer Detection",
    description: "Combines static analysis, AI pattern recognition, and historical exploit correlation.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Complete security audit in under 30 seconds. No more waiting days for results.",
  },
  {
    icon: Globe,
    title: "Multi-Chain Support",
    description: "Audits contracts on Ethereum, Base, Arbitrum, Optimism, Polygon, and Solana.",
  },
  {
    icon: Code,
    title: "Automated Fixes",
    description: "AI generates secure code patches for identified vulnerabilities automatically.",
  },
  {
    icon: LineChart,
    title: "Risk Scoring",
    description: "Comprehensive risk analysis with severity levels and deployment recommendations.",
  },
  {
    icon: Lock,
    title: "NFT Certification",
    description: "Audited contracts receive verifiable NFT badges stored on-chain.",
  },
  {
    icon: Sparkles,
    title: "Real-Time Monitoring",
    description: "Continuous monitoring of deployed contracts with instant vulnerability alerts.",
  },
  {
    icon: Network,
    title: "MCP NullShot Architecture",
    description: "Built on NullShot Framework with Model Context Protocol (MCP) for seamless AI agent interoperability. Integrated MCP servers provide enhanced security insights.",
  },
];

export function Features() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl sm:text-5xl font-bold mb-4">
          <span className="gradient-text">Advanced Security Features</span>
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Enterprise-grade smart contract auditing powered by GEMINI IA + MCP NullShot Architecture using AI SDK and integrated MCP servers
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="h-full glass-hover group cursor-pointer">
              <CardHeader>
                <div className="mb-4 flex items-center justify-between">
                  <div className="relative inline-block">
                    <feature.icon className="h-12 w-12 text-primary group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute inset-0 blur-xl bg-primary/30 group-hover:bg-primary/50 transition-all" />
                  </div>
                  {(feature as any).gemini && (
                    <GeminiBadge variant="compact" />
                  )}
                </div>
                <CardTitle className="group-hover:text-primary transition-colors">
                  {feature.title}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}


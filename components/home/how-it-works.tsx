"use client";

import React from "react";
import { motion } from "framer-motion";
import { Upload, Brain, Shield, CheckCircle } from "lucide-react";
import { GeminiBadge } from "@/components/shared/gemini-badge";

const steps = [
  {
    icon: Upload,
    title: "Upload Contract",
    description: "Paste your Solidity code directly into the editor. We analyze contracts from any EVM-compatible chain (Ethereum, Base, Arbitrum, Optimism, Polygon, etc.).",
  },
  {
    icon: Brain,
    title: "AI Analysis",
    description: "Gemini AI + MCP Architecture powered by AI SDK analyzes your contract using multiple detection methods and integrated MCP servers (Slither, Blockchain, DeFi). Multi-model fallback system ensures reliability.",
    gemini: true,
  },
  {
    icon: Shield,
    title: "Security Report",
    description: "Receive a detailed vulnerability report with severity levels, exploit scenarios, and fixes.",
  },
  {
    icon: CheckCircle,
    title: "Register & Certify",
    description: "Implement the suggested fixes and register your audit on-chain (Base Sepolia). Earn a verifiable NFT certification badge stored on blockchain.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 px-2">
          <span className="gradient-text">How It Works</span>
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
          From code upload to secure deployment in four simple steps
        </p>
      </motion.div>

      <div className="relative">
        {/* Connection lines */}
        <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 relative z-10">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative"
            >
              <div className="glass p-4 sm:p-6 rounded-lg text-center group hover:border-primary/50 transition-all">
                {/* Step number */}
                <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center font-bold text-xs sm:text-sm">
                    {index + 1}
                  </div>
                </div>

                {/* Icon */}
                <div className="mb-3 sm:mb-4 flex justify-center">
                  <div className="relative">
                    <step.icon className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 text-primary group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute inset-0 blur-xl bg-primary/30 group-hover:bg-primary/60 transition-all" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-lg sm:text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mb-2 leading-relaxed">{step.description}</p>
                {(step as any).gemini && (
                  <div className="flex justify-center mt-2">
                    <GeminiBadge variant="compact" />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


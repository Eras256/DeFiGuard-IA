"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, Zap, Lock, Award, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GeminiBadge } from "@/components/shared/gemini-badge";

interface HeroProps {
  totalAudits: number;
  totalNFTs: number;
  certifiedContracts: number;
  loading?: boolean;
}

export function Hero({ totalAudits, totalNFTs, certifiedContracts, loading = false }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 px-4 py-20">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{ duration: 8, repeat: Infinity, delay: 1 }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <motion.div
            className="mb-8"
            whileHover={{ scale: 1.05 }}
          >
            <GeminiBadge model="GEMINI IA" />
            <span className="ml-3 text-sm text-gray-400">+ MCP NullShot Architecture</span>
          </motion.div>

          {/* Main heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 px-2">
            <span className="gradient-text">Secure Your Smart Contracts</span>
            <br />
            <span className="text-white">with AI-Powered Audits</span>
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-6 sm:mb-8 max-w-3xl mx-auto px-4 leading-relaxed">
            DeFiGuard IA analyzes Solidity contracts from any EVM-compatible chain in 30 seconds using{" "}
            <span className="text-primary font-semibold">GEMINI IA</span> +{" "}
            <span className="text-primary font-semibold">MCP NullShot Architecture</span>,
            detecting vulnerabilities before deployment. Audit registration and NFT badges are stored on-chain on Base Sepolia testnet.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12 px-4">
            <Link href="/audit" className="w-full sm:w-auto">
              <Button size="lg" variant="glow" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 group">
                Start Free Audit
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6">
                View Dashboard
              </Button>
            </Link>
          </div>

          {/* Real-time Stats from Blockchain */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 max-w-5xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-lg p-4 sm:p-6"
            >
              <Shield className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-primary mx-auto mb-2 sm:mb-4" />
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">
                {loading ? "..." : totalAudits.toLocaleString()}
              </div>
              <div className="text-xs sm:text-sm text-gray-400">On-Chain Audits</div>
              <div className="text-[10px] sm:text-xs text-gray-500 mt-1">Base Sepolia</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass rounded-lg p-4 sm:p-6"
            >
              <Award className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-cyber-purple mx-auto mb-2 sm:mb-4" />
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">
                {loading ? "..." : totalNFTs.toLocaleString()}
              </div>
              <div className="text-xs sm:text-sm text-gray-400">NFT Badges Minted</div>
              <div className="text-[10px] sm:text-xs text-gray-500 mt-1">Certifications</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass rounded-lg p-4 sm:p-6"
            >
              <Zap className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-cyber-green mx-auto mb-2 sm:mb-4" />
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">
                {loading ? "..." : certifiedContracts.toLocaleString()}
              </div>
              <div className="text-xs sm:text-sm text-gray-400">Certified Contracts</div>
              <div className="text-[10px] sm:text-xs text-gray-500 mt-1">Risk score &lt; 40</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass rounded-lg p-4 sm:p-6"
            >
              <Lock className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-cyber-pink mx-auto mb-2 sm:mb-4" />
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">30s</div>
              <div className="text-xs sm:text-sm text-gray-400">Average Time</div>
              <div className="text-[10px] sm:text-xs text-gray-500 mt-1">Complete analysis</div>
            </motion.div>
          </div>

          {/* Live Data Indicator */}
          <div className="mt-8 inline-flex items-center gap-2 glass rounded-full px-4 py-2">
            <div className="h-2 w-2 rounded-full bg-cyber-green animate-pulse"></div>
            <span className="text-sm text-gray-400">
              Live data from Base Sepolia • 100% on-chain • No mock data
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}


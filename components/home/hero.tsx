"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, Zap, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GeminiBadge } from "@/components/shared/gemini-badge";

interface HeroProps {
  totalAudits: number;
  loading?: boolean;
}

export function Hero({ totalAudits, loading = false }: HeroProps) {
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
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
            <span className="gradient-text">Secure Your Smart Contracts</span>
            <br />
            <span className="text-white">with AI-Powered Audits</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            DeFiGuard IA analyzes Solidity contracts in 30 seconds using{" "}
            <span className="text-primary font-semibold">GEMINI IA</span> +{" "}
            <span className="text-primary font-semibold">MCP NullShot Architecture</span>,
            detecting vulnerabilities before deployment.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/audit">
              <Button size="lg" variant="glow" className="text-lg px-8 py-6 group">
                Start Free Audit
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                View Dashboard
              </Button>
            </Link>
          </div>

          {/* Real-time Stats from Blockchain */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-lg p-6"
            >
              <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
              <div className="text-4xl font-bold text-white mb-2">
                {loading ? "..." : totalAudits.toLocaleString()}
              </div>
              <div className="text-gray-400">Audits on Base Sepolia</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass rounded-lg p-6"
            >
              <Zap className="h-12 w-12 text-cyber-purple mx-auto mb-4" />
              <div className="text-4xl font-bold text-white mb-2">30s</div>
              <div className="text-gray-400">Average Analysis Time</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="glass rounded-lg p-6"
            >
              <Lock className="h-12 w-12 text-cyber-pink mx-auto mb-4" />
              <div className="text-4xl font-bold text-white mb-2">100%</div>
              <div className="text-gray-400">On-Chain Verified</div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}


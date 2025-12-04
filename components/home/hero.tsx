"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, Zap, Lock, TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
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
            className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-8"
            whileHover={{ scale: 1.05 }}
          >
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm">Powered by Gemini 2.5 Flash + MCP</span>
          </motion.div>

          {/* Main heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
            <span className="gradient-text">Secure Your Smart Contracts</span>
            <br />
            <span className="text-white">with AI-Powered Audits</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
            DeFiGuard AI analyzes your Solidity contracts in seconds, identifying
            vulnerabilities before they become exploits. Multi-chain support,
            instant results, and actionable fixes powered by advanced AI.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/audit">
              <Button size="xl" variant="glow" className="group">
                Start Free Audit
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="xl" variant="glass">
                View Dashboard
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {[
              { icon: Shield, label: "Contracts Audited", value: "1,247" },
              { icon: Lock, label: "Vulnerabilities Found", value: "3,892" },
              { icon: TrendingUp, label: "Security Score Avg", value: "87%" },
              { icon: Zap, label: "Avg Analysis Time", value: "<30s" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="glass p-6 rounded-lg"
                whileHover={{ scale: 1.05, borderColor: "rgba(0, 240, 255, 0.5)" }}
              >
                <stat.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}


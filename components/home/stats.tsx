"use client";

import React from "react";
import { motion } from "framer-motion";
import { Shield, Zap, Award, TrendingUp, Database, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";

interface StatsProps {
  totalAudits: number;
  totalNFTs: number;
  recentAudits: number;
  certifiedContracts: number;
  averageRiskScore: number;
  highRiskAudits: number;
  loading?: boolean;
}

export function Stats({ 
  totalAudits, 
  totalNFTs,
  recentAudits, 
  certifiedContracts,
  averageRiskScore,
  highRiskAudits,
  loading = false
}: StatsProps) {
  const stats = [
    {
      icon: Database,
      value: loading ? "..." : totalAudits.toString(),
      label: "Total On-Chain Audits",
      sublabel: `${recentAudits} active audits`,
      color: "text-primary",
    },
    {
      icon: Award,
      value: loading ? "..." : totalNFTs.toString(),
      label: "NFT Badges Minted",
      sublabel: "Verifiable certifications",
      color: "text-cyber-purple",
    },
    {
      icon: CheckCircle,
      value: loading ? "..." : certifiedContracts.toString(),
      label: "Certified Contracts",
      sublabel: "Risk score < 40",
      color: "text-cyber-green",
    },
    {
      icon: TrendingUp,
      value: loading ? "..." : averageRiskScore.toString(),
      label: "Average Risk Score",
      sublabel: `From ${recentAudits} audit${recentAudits !== 1 ? 's' : ''}`,
      color: averageRiskScore < 40 ? "text-cyber-green" : averageRiskScore < 60 ? "text-yellow-500" : "text-red-500",
    },
    {
      icon: Shield,
      value: loading ? "..." : recentAudits.toString(),
      label: "Recent Audits",
      sublabel: "Shown in dashboard",
      color: "text-cyber-pink",
    },
    {
      icon: AlertTriangle,
      value: loading ? "..." : highRiskAudits.toString(),
      label: "High Risk Detected",
      sublabel: "Risk score ≥ 60",
      color: "text-red-500",
    },
    {
      icon: Zap,
      value: "30s",
      label: "Average Analysis Time",
      sublabel: "Complete AI analysis",
      color: "text-cyber-purple",
    },
    {
      icon: Database,
      value: "100%",
      label: "On-Chain Data",
      sublabel: "No mock data",
      color: "text-cyber-green",
    },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
            <span className="gradient-text">Real-Time</span> Statistics
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-400 px-2">
            All audit registrations and NFT badges stored on Base Sepolia testnet • 100% on-chain • Real blockchain data
          </p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-lg p-3 sm:p-4 md:p-6 text-center hover:border-primary/50 transition-all"
              >
                <stat.icon className={`h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 ${stat.color} mx-auto mb-2 sm:mb-3 md:mb-4`} />
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">{stat.value}</div>
                <div className="text-xs sm:text-sm md:text-base text-gray-300 font-medium mb-1">{stat.label}</div>
                <div className="text-[10px] sm:text-xs text-gray-500">{stat.sublabel}</div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Live indicator */}
        <div className="mt-6 sm:mt-8 text-center px-4">
          <div className="inline-flex flex-wrap items-center justify-center gap-2 glass rounded-full px-3 sm:px-4 py-1.5 sm:py-2">
            <div className="h-2 w-2 rounded-full bg-cyber-green animate-pulse"></div>
            <span className="text-xs sm:text-sm text-gray-400">
              Live data from Base Sepolia • Auto-update every 30s
            </span>
          </div>
        </div>

        {/* Data Source Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-6 sm:mt-8 glass rounded-lg p-4 sm:p-6 text-center"
        >
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed px-2">
            <strong className="text-gray-300">On-Chain Storage:</strong> AuditRegistry contract (Base Sepolia) • GuardNFT contract (Base Sepolia) • 
            All audit registrations and certifications are permanently stored on Base Sepolia testnet using Thirdweb SDK + Viem
          </p>
        </motion.div>
      </div>
    </section>
  );
}


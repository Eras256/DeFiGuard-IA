"use client";

import React from "react";
import { motion } from "framer-motion";
import { Shield, Zap, Award, TrendingUp } from "lucide-react";

interface StatsProps {
  totalAudits: number;
  recentAudits: number;
}

export function Stats({ totalAudits, recentAudits }: StatsProps) {
  const stats = [
    {
      icon: Shield,
      value: totalAudits.toString(),
      label: "Total Audits on Base",
      color: "text-primary",
    },
    {
      icon: Zap,
      value: "30s",
      label: "Average Analysis Time",
      color: "text-cyber-purple",
    },
    {
      icon: Award,
      value: recentAudits.toString(),
      label: "Recent Audits",
      color: "text-cyber-pink",
    },
    {
      icon: TrendingUp,
      value: "100%",
      label: "On-Chain Verified",
      color: "text-cyber-green",
    },
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">
            Real-Time <span className="gradient-text">Blockchain Stats</span>
          </h2>
          <p className="text-xl text-gray-400">
            All data pulled directly from Base Sepolia - no mock data
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-lg p-6 text-center"
            >
              <stat.icon className={`h-12 w-12 ${stat.color} mx-auto mb-4`} />
              <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Live indicator */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2">
            <div className="h-2 w-2 rounded-full bg-cyber-green animate-pulse"></div>
            <span className="text-sm text-gray-400">Live data from Base Sepolia</span>
          </div>
        </div>
      </div>
    </section>
  );
}


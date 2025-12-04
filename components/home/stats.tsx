"use client";

import React from "react";
import { motion } from "framer-motion";
import { DollarSign, AlertTriangle, Users, Clock } from "lucide-react";

const stats = [
  {
    icon: DollarSign,
    value: "$2.8B",
    label: "Lost to exploits in 2024",
    subtext: "Source: Chainalysis",
  },
  {
    icon: AlertTriangle,
    value: "90+",
    label: "Vulnerability types detected",
    subtext: "Including reentrancy, overflow, etc.",
  },
  {
    icon: Users,
    value: "1,200+",
    label: "Developers trust DeFiGuard",
    subtext: "Across 15+ blockchain networks",
  },
  {
    icon: Clock,
    value: "<30s",
    label: "Average audit completion time",
    subtext: "vs. 2-4 weeks traditional",
  },
];

export function Stats() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="glass rounded-2xl p-8 sm:p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="gradient-text">Protecting the Web3 Ecosystem</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Real-time data from the blockchain security landscape
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="mb-4 flex justify-center">
                  <div className="relative">
                    <stat.icon className="h-12 w-12 text-primary" />
                    <div className="absolute inset-0 blur-xl bg-primary/40" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-lg font-medium text-foreground mb-1">{stat.label}</div>
                <div className="text-sm text-muted-foreground">{stat.subtext}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


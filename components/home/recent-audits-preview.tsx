"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Shield, ArrowRight, Calendar, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAudits } from "@/lib/hooks/useAudits";
import { formatAddress, formatTimestamp } from "@/lib/utils";
import { CONTRACT_ADDRESSES, SUPPORTED_CHAINS } from "@/lib/constants";
import { Loader2 } from "lucide-react";

export function RecentAuditsPreview() {
  const { audits, loading } = useAudits();

  const recentAudits = audits
    .filter(audit => audit && audit.contractAddress)
    .slice()
    .sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
    .slice(0, 3);

  if (loading) {
    return (
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  if (recentAudits.length === 0) {
    return null;
  }

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
            <span className="gradient-text">Recent Audits</span>
          </h2>
          <p className="text-xl text-gray-400">
            Latest audits registered on-chain on Base Sepolia
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {recentAudits.map((audit, index) => {
            const riskScore = Number(audit.riskScore);
            const riskVariant = 
              riskScore < 40 ? "low" :
              riskScore < 60 ? "medium" :
              riskScore < 80 ? "high" : "critical";

            return (
              <motion.div
                key={`${audit.contractAddress}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-lg p-6 hover:border-primary/50 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                  <Badge variant={riskVariant}>
                    Risk: {riskScore}
                  </Badge>
                </div>
                
                <div className="mb-4">
                  <div className="text-sm text-gray-400 mb-1">Contract</div>
                  <div className="font-mono text-sm text-white break-all">
                    {formatAddress(audit.contractAddress)}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                  <Calendar className="h-3 w-3" />
                  <span>{formatTimestamp(audit.timestamp)}</span>
                </div>

                <a
                  href={`${SUPPORTED_CHAINS.baseSepolia.explorer}/address/${audit.contractAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline flex items-center gap-1"
                >
                  View on Basescan <ExternalLink className="h-3 w-3" />
                </a>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center">
          <Link href="/dashboard">
            <Button variant="outline" size="lg" className="group">
              View All Audits
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Contract Info */}
        <div className="mt-8 glass rounded-lg p-4 text-center">
          <p className="text-xs text-gray-400">
            Data from <strong className="text-gray-300">AuditRegistry</strong> ({CONTRACT_ADDRESSES.AUDIT_REGISTRY.slice(0, 6)}...{CONTRACT_ADDRESSES.AUDIT_REGISTRY.slice(-4)}) on Base Sepolia
          </p>
        </div>
      </div>
    </section>
  );
}


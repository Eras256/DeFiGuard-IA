"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass glow-border rounded-2xl p-12 text-center relative overflow-hidden"
        >
          {/* Background effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 animate-gradient" />
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm">Limited Beta Access</span>
            </div>

            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              <span className="gradient-text">Ready to Secure Your Contracts?</span>
            </h2>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join hundreds of developers using AI-powered security audits. Start protecting
              your smart contracts today with DeFiGuard AI.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/audit">
                <Button size="xl" variant="glow" className="group">
                  Start Free Audit
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="https://discord.gg/nullshot" target="_blank">
                <Button size="xl" variant="glass">
                  Join Discord Community
                </Button>
              </Link>
            </div>

            <p className="text-sm text-muted-foreground mt-6">
              No credit card required • Free tier available • Enterprise plans coming soon
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}


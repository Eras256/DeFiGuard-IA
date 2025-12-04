"use client";

import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface GeminiBadgeProps {
  model?: string;
  variant?: "default" | "compact" | "inline";
  showModel?: boolean;
}

export function GeminiBadge({ model, variant = "default", showModel = true }: GeminiBadgeProps) {
  const displayModel = model || "Gemini AI";
  
  if (variant === "compact") {
    return (
      <Badge className="glass border-primary/30 text-primary">
        <Sparkles className="h-3 w-3 mr-1" />
        {displayModel}
      </Badge>
    );
  }

  if (variant === "inline") {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-primary">
        <Sparkles className="h-3 w-3" />
        <span className="font-medium">{displayModel}</span>
      </span>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="inline-flex items-center gap-2"
    >
      <Badge className="glass border-primary/30 text-primary px-3 py-1.5">
        <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
        <span className="font-medium">Powered by</span>
        {showModel && (
          <span className="ml-1 font-bold">{displayModel}</span>
        )}
      </Badge>
    </motion.div>
  );
}


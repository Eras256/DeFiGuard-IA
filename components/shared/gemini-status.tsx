"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, CheckCircle2 } from "lucide-react";

/**
 * Static component that displays Gemini AI status
 * No checks or token consumption - visual only
 */
export function GeminiStatus() {
  return (
    <Card className="glass border-primary/20 w-64">
      <CardContent className="py-3 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium">GEMINI AI</span>
          </div>
          
          <Badge className="bg-cyber-green/20 border-cyber-green/50 text-cyber-green">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Available
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}


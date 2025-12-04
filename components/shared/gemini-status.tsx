"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface GeminiStatusResponse {
  success: boolean;
  message?: string;
  modelUsed?: string;
  error?: string;
}

export function GeminiStatus() {
  const [status, setStatus] = useState<"checking" | "connected" | "error">("checking");
  const [modelUsed, setModelUsed] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch("/api/test-gemini");
        const data: GeminiStatusResponse = await response.json();
        
        if (data.success) {
          setStatus("connected");
          setModelUsed(data.modelUsed || null);
          setError(null);
        } else {
          setStatus("error");
          setError(data.error || "Unknown error");
        }
      } catch (err: any) {
        setStatus("error");
        setError(err.message || "Failed to connect");
      }
    };

    checkStatus();
    // Verificar cada 60 segundos
    const interval = setInterval(checkStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="glass border-primary/20 w-64">
      <CardContent className="py-3 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium">Gemini AI</span>
          </div>
          
          {status === "checking" && (
            <Badge variant="outline" className="border-yellow-500/50 text-yellow-400">
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              Checking...
            </Badge>
          )}
          
          {status === "connected" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Badge className="bg-cyber-green/20 border-cyber-green/50 text-cyber-green">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                {modelUsed || "Connected"}
              </Badge>
            </motion.div>
          )}
          
          {status === "error" && (
            <Badge variant="destructive" className="border-red-500/50 text-red-400">
              <AlertCircle className="h-3 w-3 mr-1" />
              Error
            </Badge>
          )}
        </div>
        
        {error && (
          <p className="text-xs text-red-400 mt-2">{error}</p>
        )}
      </CardContent>
    </Card>
  );
}


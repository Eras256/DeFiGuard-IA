"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Activity, AlertCircle, CheckCircle2 } from "lucide-react";
import { baseSepolia } from "thirdweb/chains";
import { getRpcClient } from "thirdweb/rpc";
import { thirdwebClient } from "@/lib/thirdweb/client-config";

export function BlockchainStatus() {
  const [status, setStatus] = useState<"connected" | "disconnected" | "checking">("checking");
  const [blockNumber, setBlockNumber] = useState<number>(0);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const rpcRequest = getRpcClient({ client: thirdwebClient, chain: baseSepolia });
        const block = await rpcRequest({
          method: "eth_blockNumber",
        });
        setBlockNumber(parseInt(block as string, 16));
        setStatus("connected");
      } catch (error) {
        console.error("Connection check failed:", error);
        setStatus("disconnected");
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Badge
      variant={status === "connected" ? "default" : "destructive"}
      className="glass w-full justify-start"
    >
        {status === "connected" && (
          <>
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Base Sepolia #{blockNumber.toLocaleString()}
          </>
        )}
        {status === "disconnected" && (
          <>
            <AlertCircle className="h-3 w-3 mr-1" />
            Disconnected
          </>
        )}
        {status === "checking" && (
          <>
            <Activity className="h-3 w-3 mr-1 animate-spin" />
            Checking...
          </>
        )}
      </Badge>
  );
}


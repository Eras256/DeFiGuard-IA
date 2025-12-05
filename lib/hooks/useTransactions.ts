"use client";

import { useEffect, useState } from "react";
import { CONTRACT_ADDRESSES } from "@/lib/constants";

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: number;
  blockNumber: string;
  method?: string;
  status?: string;
}

export function useTransactions(contractAddress: string, limit: number = 20) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        setLoading(true);
        
        // Try to use Basescan API if available (server-side only)
        // For client-side, we'll use a different approach
        const response = await fetch(
          `/api/transactions?address=${contractAddress}&limit=${limit}`
        );
        
        if (response.ok) {
          const data = await response.json();
          setTransactions(data.transactions || []);
        } else {
          // Fallback: fetch from public Basescan API (no API key needed for basic queries)
          const basescanUrl = `https://api-sepolia.basescan.org/api?module=account&action=txlist&address=${contractAddress}&startblock=0&endblock=99999999&page=1&offset=${limit}&sort=desc`;
          
          const basescanResponse = await fetch(basescanUrl);
          const basescanData = await basescanResponse.json();
          
          if (basescanData.status === "1" && basescanData.result) {
            const txs = basescanData.result.map((tx: any) => ({
              hash: tx.hash,
              from: tx.from,
              to: tx.to,
              value: tx.value,
              timestamp: parseInt(tx.timeStamp) * 1000,
              blockNumber: tx.blockNumber,
              method: tx.methodId || "0x",
              status: tx.txreceipt_status === "1" ? "success" : "failed",
            }));
            setTransactions(txs);
          } else {
            setTransactions([]);
          }
        }
        
        setError(null);
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch transactions");
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    }

    if (contractAddress) {
      fetchTransactions();
      
      // Refresh every 30 seconds
      const interval = setInterval(fetchTransactions, 30000);
      return () => clearInterval(interval);
    }
  }, [contractAddress, limit]);

  return { transactions, loading, error };
}

// Hook to get combined transactions from both contracts
export function useAllContractTransactions(limit: number = 30) {
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAllTransactions() {
      try {
        setLoading(true);
        
        const [auditTxs, nftTxs] = await Promise.all([
          fetch(`https://api-sepolia.basescan.org/api?module=account&action=txlist&address=${CONTRACT_ADDRESSES.AUDIT_REGISTRY}&startblock=0&endblock=99999999&page=1&offset=${limit}&sort=desc`).then(r => r.json()),
          fetch(`https://api-sepolia.basescan.org/api?module=account&action=txlist&address=${CONTRACT_ADDRESSES.GUARD_NFT}&startblock=0&endblock=99999999&page=1&offset=${limit}&sort=desc`).then(r => r.json()),
        ]);

        const combined: Transaction[] = [];
        
        if (auditTxs.status === "1" && auditTxs.result) {
          auditTxs.result.forEach((tx: any) => {
            combined.push({
              hash: tx.hash,
              from: tx.from,
              to: tx.to,
              value: tx.value,
              timestamp: parseInt(tx.timeStamp) * 1000,
              blockNumber: tx.blockNumber,
              method: tx.methodId || "0x",
              status: tx.txreceipt_status === "1" ? "success" : "failed",
            });
          });
        }
        
        if (nftTxs.status === "1" && nftTxs.result) {
          nftTxs.result.forEach((tx: any) => {
            combined.push({
              hash: tx.hash,
              from: tx.from,
              to: tx.to,
              value: tx.value,
              timestamp: parseInt(tx.timeStamp) * 1000,
              blockNumber: tx.blockNumber,
              method: tx.methodId || "0x",
              status: tx.txreceipt_status === "1" ? "success" : "failed",
            });
          });
        }
        
        // Sort by timestamp (newest first) and limit
        combined.sort((a, b) => b.timestamp - a.timestamp);
        setAllTransactions(combined.slice(0, limit));
        setError(null);
      } catch (err) {
        console.error("Error fetching all transactions:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch transactions");
        setAllTransactions([]);
      } finally {
        setLoading(false);
      }
    }

    fetchAllTransactions();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchAllTransactions, 30000);
    return () => clearInterval(interval);
  }, [limit]);

  return { transactions: allTransactions, loading, error };
}


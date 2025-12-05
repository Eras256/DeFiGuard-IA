"use client";

import { useEffect, useState } from "react";
import { useActiveAccount } from "thirdweb/react";
import { getAllAudits, getTotalAudits, getActiveAudits, getAuditedContractAddresses, type Audit } from "@/lib/contracts/audit-registry";

export function useAudits(contractAddress?: string) {
  const account = useActiveAccount();
  const [audits, setAudits] = useState<Audit[]>([]);
  const [totalAudits, setTotalAudits] = useState<bigint>(0n);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAudits() {
      try {
        setLoading(true);
        
        // Always fetch total audits count
        const total = await getTotalAudits();
        setTotalAudits(total);

        if (contractAddress) {
          // Fetch audits for specific contract
          const allAudits = await getAllAudits(contractAddress);
          setAudits(allAudits);
        } else {
          // Get real addresses of audited contracts from blockchain events
          const auditedAddresses = await getAuditedContractAddresses(100);
          
          // If no addresses from events, use empty list (no more hardcoded)
          if (auditedAddresses.length === 0) {
            setAudits([]);
            setLoading(false);
            return;
          }
          
          // Fetch all audits from real contract addresses
          const allAuditsList: Audit[] = [];
          
          // Limit to 20 contracts to avoid too many calls
          const addressesToFetch = auditedAddresses.slice(0, 20);
          
          // Fetch audits from real contract addresses
          for (const addr of addressesToFetch) {
            try {
              // Try to get active audits first (more efficient)
              const activeAudits = await getActiveAudits(addr);
              // Filter out invalid audits
              const validAudits = activeAudits.filter(a => 
                a && 
                a.contractAddress && 
                typeof a.contractAddress === 'string' &&
                a.contractAddress.length >= 10 &&
                a.isActive
              );
              allAuditsList.push(...validAudits);
            } catch (err) {
              // If active audits fails, try getting all audits
              try {
                const audits = await getAllAudits(addr);
                const validAudits = audits.filter(a => 
                  a && 
                  a.isActive &&
                  a.contractAddress && 
                  typeof a.contractAddress === 'string' &&
                  a.contractAddress.length >= 10
                );
                allAuditsList.push(...validAudits);
              } catch (e) {
                // Contract might not have audits, skip
                continue;
              }
            }
          }
          
          // Sort by timestamp (newest first) and filter out any remaining invalid entries
          const sortedAudits = allAuditsList
            .filter(a => a && a.contractAddress && a.timestamp)
            .sort((a, b) => Number(b.timestamp) - Number(a.timestamp));
          setAudits(sortedAudits);
        }
        
        setError(null);
      } catch (err) {
        console.error("Error fetching audits:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch audits");
      } finally {
        setLoading(false);
      }
    }

    fetchAudits();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchAudits, 30000);
    return () => clearInterval(interval);
  }, [contractAddress]);

  return { audits, totalAudits, loading, error };
}


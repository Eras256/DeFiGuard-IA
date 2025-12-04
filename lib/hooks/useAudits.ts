"use client";

import { useEffect, useState } from "react";
import { useActiveAccount } from "thirdweb/react";
import { getAllAudits, getTotalAudits, type Audit } from "@/lib/contracts/audit-registry";

export function useAudits(contractAddress?: string) {
  const account = useActiveAccount();
  const [audits, setAudits] = useState<Audit[]>([]);
  const [totalAudits, setTotalAudits] = useState<bigint>(0n);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAudits() {
      if (!contractAddress) {
        // Fetch total audits count
        try {
          const total = await getTotalAudits();
          setTotalAudits(total);
          setLoading(false);
        } catch (err) {
          console.error("Error fetching total audits:", err);
          setError("Failed to fetch audits");
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        const allAudits = await getAllAudits(contractAddress);
        setAudits(allAudits);
        const total = await getTotalAudits();
        setTotalAudits(total);
        setError(null);
      } catch (err) {
        console.error("Error fetching audits:", err);
        setError("Failed to fetch audits");
      } finally {
        setLoading(false);
      }
    }

    fetchAudits();
  }, [contractAddress]);

  return { audits, totalAudits, loading, error };
}


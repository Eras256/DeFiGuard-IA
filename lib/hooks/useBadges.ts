"use client";

import { useEffect, useState } from "react";
import { useActiveAccount } from "thirdweb/react";
import { getBadgeByContract, getBadgeInfo, getTotalSupply, type BadgeInfo } from "@/lib/contracts/guard-nft";

export function useBadges(userAddress?: string) {
  const account = useActiveAccount();
  const [badges, setBadges] = useState<Array<BadgeInfo & { tokenId: bigint }>>([]);
  const [totalSupply, setTotalSupply] = useState<bigint>(0n);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBadges() {
      try {
        setLoading(true);
        const total = await getTotalSupply();
        setTotalSupply(total);
        
        // Fetch badges (simplified - in production you'd fetch by owner)
        // For now, we'll fetch badges by iterating through token IDs
        const badgeList: Array<BadgeInfo & { tokenId: bigint }> = [];
        
        // Only fetch first 10 badges to avoid too many calls
        for (let i = 1n; i <= total && i <= 10n; i++) {
          try {
            const badge = await getBadgeInfo(i);
            if (badge) {
              badgeList.push({ ...badge, tokenId: i });
            }
          } catch (err) {
            // Token might not exist, skip
            continue;
          }
        }
        
        setBadges(badgeList);
        setError(null);
      } catch (err) {
        console.error("Error fetching badges:", err);
        setError("Failed to fetch badges");
      } finally {
        setLoading(false);
      }
    }

    fetchBadges();
  }, [userAddress]);

  return { badges, totalSupply, loading, error };
}


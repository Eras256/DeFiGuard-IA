"use client";

import { useEffect, useState } from "react";
import { useActiveAccount } from "thirdweb/react";
import { getBadgeByContract, getBadgeInfo, getTotalSupply, ownerOf, type BadgeInfo } from "@/lib/contracts/guard-nft";

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
        
        const badgeList: Array<BadgeInfo & { tokenId: bigint }> = [];
        const addressToFilter = userAddress || account?.address;
        
        // Fetch badges by iterating through token IDs
        // Limit to first 20 badges for performance
        const maxBadges = total > 20n ? 20n : total;
        
        for (let i = 1n; i <= maxBadges; i++) {
          try {
            const badge = await getBadgeInfo(i);
            if (badge && badge.contractAddress && typeof badge.contractAddress === 'string') {
              // If user address is provided, filter by owner
              if (addressToFilter) {
                try {
                  const owner = await ownerOf(i);
                  if (owner.toLowerCase() === addressToFilter.toLowerCase()) {
                    badgeList.push({ ...badge, tokenId: i });
                  }
                } catch (err) {
                  // If ownerOf fails, include badge anyway (might be a view issue)
                  badgeList.push({ ...badge, tokenId: i });
                }
              } else {
                // No filter, include all badges
                badgeList.push({ ...badge, tokenId: i });
              }
            }
          } catch (err) {
            // Token might not exist, skip
            continue;
          }
        }
        
        // Sort by token ID (newest first)
        badgeList.sort((a, b) => Number(b.tokenId) - Number(a.tokenId));
        
        setBadges(badgeList);
        setError(null);
      } catch (err) {
        console.error("Error fetching badges:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch badges");
      } finally {
        setLoading(false);
      }
    }

    fetchBadges();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchBadges, 30000);
    return () => clearInterval(interval);
  }, [userAddress, account?.address]);

  return { badges, totalSupply, loading, error };
}


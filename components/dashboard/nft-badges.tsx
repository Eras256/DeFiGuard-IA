"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBadges } from "@/lib/hooks/useBadges";
import { formatAddress } from "@/lib/utils";
import { CONTRACT_ADDRESSES } from "@/lib/contracts/audit-registry";
import { SUPPORTED_CHAINS } from "@/lib/constants";
import { getCertificationLevelInfo } from "@/lib/constants/certification-levels";
import { CertificationBadge } from "@/components/shared/certification-badge";

export function NFTBadges() {
  const { badges, loading, error } = useBadges();
  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" />
          Security Certification Badges
        </CardTitle>
        <CardDescription>NFT badges for audited contracts</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-400">
            <p>{error}</p>
          </div>
        ) : badges.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {badges.map((badge) => {
              const levelInfo = getCertificationLevelInfo(Number(badge.riskScore));
              const borderColor = 
                levelInfo.level === "platinum" ? "border-cyan-500/30" :
                levelInfo.level === "gold" ? "border-yellow-500/30" :
                levelInfo.level === "silver" ? "border-gray-400/30" :
                "border-orange-500/30";
              
              return (
                <div
                  key={Number(badge.tokenId)}
                  className={`glass p-4 rounded-lg border-2 ${borderColor} hover:border-primary/50 transition-all cursor-pointer group`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl">{levelInfo.icon}</span>
                      <div>
                        <div className="font-bold text-lg">{levelInfo.name}</div>
                        <div className="text-xs text-gray-400">Token ID: #{Number(badge.tokenId)}</div>
                      </div>
                    </div>
                    <CertificationBadge levelInfo={levelInfo} variant="compact" />
                  </div>
                  
                  <div className="space-y-2 mb-3">
                    <div className="text-xs font-mono text-muted-foreground">
                      Contract: {formatAddress(badge.contractAddress)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Risk Score:</span>
                      <span className="text-lg font-bold text-white">{Number(badge.riskScore)}</span>
                    </div>
                    <div className="text-xs text-gray-500 italic">
                      {levelInfo.description}
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      window.open(
                        `${SUPPORTED_CHAINS.baseSepolia.explorer}/address/${CONTRACT_ADDRESSES.GUARD_NFT}`,
                        "_blank"
                      );
                    }}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View on Explorer
                  </Button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Award className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-sm text-muted-foreground mb-2">
              No certification badges yet. Audit contracts with risk scores <span className="font-bold">&lt; 40</span> (less than 40, not equal) to earn NFT badges!
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs">
              <span className="text-gray-400">Available levels:</span>
              <span>💎 Platinum (0-4)</span>
              <span>🥇 Gold (5-14)</span>
              <span>🥈 Silver (15-24)</span>
              <span>🥉 Bronze (25-39)</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


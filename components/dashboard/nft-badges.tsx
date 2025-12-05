"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBadges } from "@/lib/hooks/useBadges";
import { formatAddress } from "@/lib/utils";
import { CONTRACT_ADDRESSES } from "@/lib/constants";
import { SUPPORTED_CHAINS } from "@/lib/constants";
import { getCertificationLevelInfo } from "@/lib/constants/certification-levels";
import { CertificationBadge } from "@/components/shared/certification-badge";

export function NFTBadges() {
  const { badges, loading, error } = useBadges();
  return (
    <Card className="glass">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Award className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          Security Certification Badges
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          {badges.length > 0 
            ? `${badges.length} NFT badge${badges.length !== 1 ? 's' : ''} minted on-chain • Real-time data`
            : "NFT badges for audited contracts • Real-time data"
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0">
        {loading ? (
          <div className="flex items-center justify-center py-8 sm:py-12">
            <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-8 sm:py-12 text-red-400">
            <p className="text-xs sm:text-sm">{error}</p>
          </div>
        ) : badges.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 sm:gap-4">
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
                  className={`glass p-3 sm:p-4 rounded-lg border-2 ${borderColor} hover:border-primary/50 transition-all cursor-pointer group`}
                >
                  <div className="flex items-start justify-between mb-2 sm:mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl sm:text-3xl">{levelInfo.icon}</span>
                      <div>
                        <div className="font-bold text-base sm:text-lg">{levelInfo.name}</div>
                        <div className="text-[10px] sm:text-xs text-gray-400">Token ID: #{Number(badge.tokenId)}</div>
                      </div>
                    </div>
                    <CertificationBadge levelInfo={levelInfo} variant="compact" />
                  </div>
                  
                  <div className="space-y-1.5 sm:space-y-2 mb-2 sm:mb-3">
                    <div className="text-[10px] sm:text-xs font-mono text-muted-foreground break-all">
                      Contract: {badge.contractAddress ? formatAddress(badge.contractAddress) : 'N/A'}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm text-gray-400">Risk Score:</span>
                      <span className="text-base sm:text-lg font-bold text-white">{Number(badge.riskScore)}</span>
                    </div>
                    <div className="text-[10px] sm:text-xs text-gray-500 italic">
                      {levelInfo.description}
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-xs sm:text-sm"
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
          <div className="text-center py-8 sm:py-12">
            <Award className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground/50 mx-auto mb-3 sm:mb-4" />
            <p className="text-xs sm:text-sm text-muted-foreground mb-2 px-2">
              No certification badges yet. Audit contracts with risk scores <span className="font-bold">&lt; 40</span> (less than 40, not equal) to earn NFT badges!
            </p>
            <div className="mt-3 sm:mt-4 flex flex-wrap justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs px-2">
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


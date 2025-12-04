"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NFTBadge {
  tokenId: number;
  contractAddress: string;
  riskScore: number;
  imageUrl: string;
}

interface NFTBadgesProps {
  badges: NFTBadge[];
}

export function NFTBadges({ badges }: NFTBadgesProps) {
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
        {badges.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {badges.map((badge) => (
              <div
                key={badge.tokenId}
                className="glass p-4 rounded-lg text-center hover:border-primary/50 transition-all cursor-pointer group"
              >
                <div className="w-full aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg mb-3 flex items-center justify-center">
                  <Award className="h-12 w-12 text-primary group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-xs font-mono text-muted-foreground mb-1">
                  #{badge.tokenId}
                </div>
                <div className="text-sm font-semibold">Score: {badge.riskScore}</div>
                <Button variant="ghost" size="sm" className="mt-2 w-full">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View on Explorer
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Award className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">
              No certification badges yet. Audit contracts with low risk scores to earn NFT badges!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


"use client";

import { CertificationLevelInfo } from "@/lib/constants/certification-levels";
import { Badge } from "@/components/ui/badge";
import { Award } from "lucide-react";

interface CertificationBadgeProps {
  levelInfo: CertificationLevelInfo;
  variant?: "default" | "compact" | "large";
  showScore?: boolean;
  score?: number;
}

export function CertificationBadge({ 
  levelInfo, 
  variant = "default",
  showScore = false,
  score 
}: CertificationBadgeProps) {
  const colorClasses = {
    platinum: "bg-cyan-500/20 border-cyan-500/50 text-cyan-400",
    gold: "bg-yellow-500/20 border-yellow-500/50 text-yellow-400",
    silver: "bg-gray-400/20 border-gray-400/50 text-gray-300",
    bronze: "bg-orange-500/20 border-orange-500/50 text-orange-400",
    gray: "bg-gray-500/20 border-gray-500/50 text-gray-400",
  };

  const colorClass = colorClasses[levelInfo.level as keyof typeof colorClasses] || colorClasses.gray;

  if (variant === "compact") {
    return (
      <Badge className={`glass ${colorClass} px-2 py-1`}>
        <span className="text-sm mr-1">{levelInfo.icon}</span>
        <span className="text-xs font-medium">{levelInfo.name}</span>
      </Badge>
    );
  }

  if (variant === "large") {
    return (
      <div className={`glass p-4 rounded-lg border-2 ${colorClass}`}>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">{levelInfo.icon}</span>
          <div>
            <div className="font-bold text-lg">{levelInfo.name}</div>
            {showScore && score !== undefined && (
              <div className="text-xs text-gray-400">Risk Score: {score}</div>
            )}
          </div>
        </div>
        <p className="text-sm text-gray-300">{levelInfo.description}</p>
      </div>
    );
  }

  return (
    <Badge className={`glass ${colorClass} px-3 py-1.5`}>
      <Award className="h-4 w-4 mr-1" />
      <span className="text-sm mr-1">{levelInfo.icon}</span>
      <span className="font-medium">{levelInfo.name}</span>
      {showScore && score !== undefined && (
        <span className="ml-2 text-xs opacity-75">({score})</span>
      )}
    </Badge>
  );
}


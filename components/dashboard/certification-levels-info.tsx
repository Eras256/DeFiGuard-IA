"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CERTIFICATION_LEVELS, CertificationLevel } from "@/lib/constants/certification-levels";
import { Award } from "lucide-react";

export function CertificationLevelsInfo() {
  const levels = [
    CertificationLevel.PLATINUM,
    CertificationLevel.GOLD,
    CertificationLevel.SILVER,
    CertificationLevel.BRONZE,
  ];

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" />
          Certification Levels System
        </CardTitle>
        <CardDescription>
          Different certification levels based on contract risk score
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {levels.map((level) => {
            const levelInfo = CERTIFICATION_LEVELS[level];
            const borderColor = 
              level === CertificationLevel.PLATINUM ? "border-cyan-500/30 bg-cyan-500/10" :
              level === CertificationLevel.GOLD ? "border-yellow-500/30 bg-yellow-500/10" :
              level === CertificationLevel.SILVER ? "border-gray-400/30 bg-gray-400/10" :
              "border-orange-500/30 bg-orange-500/10";
            const textColor =
              level === CertificationLevel.PLATINUM ? "text-cyan-400" :
              level === CertificationLevel.GOLD ? "text-yellow-400" :
              level === CertificationLevel.SILVER ? "text-gray-300" :
              "text-orange-400";

            return (
              <div key={level} className={`glass p-3 rounded-lg border ${borderColor}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{levelInfo.icon}</span>
                    <div>
                      <div className={`font-semibold ${textColor}`}>{levelInfo.name}</div>
                      <div className="text-xs text-gray-400">
                        Risk Score: {levelInfo.minScore === 0 ? "0" : levelInfo.minScore}-{levelInfo.maxScore}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-white">
                      {levelInfo.maxScore === 4 ? "0-4" :
                       levelInfo.maxScore === 14 ? "5-14" :
                       levelInfo.maxScore === 24 ? "15-24" :
                       "25-39"}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-2">{levelInfo.description}</p>
              </div>
            );
          })}
        </div>
        <div className="mt-4 pt-4 border-t border-white/10">
          <p className="text-xs text-gray-500">
            💡 Contracts with risk score <span className="font-bold">less than 40</span> are eligible for certification.
            The level is automatically determined based on the score obtained in the audit.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}


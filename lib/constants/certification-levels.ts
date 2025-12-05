/**
 * Certification Levels System
 * Different badges based on contract risk score
 */

export enum CertificationLevel {
  NONE = "none",
  BRONZE = "bronze",    // Score 25-39
  SILVER = "silver",    // Score 15-24
  GOLD = "gold",        // Score 5-14
  PLATINUM = "platinum" // Score 0-4
}

export interface CertificationLevelInfo {
  level: CertificationLevel;
  name: string;
  minScore: number;
  maxScore: number;
  color: string;
  description: string;
  icon: string;
}

export const CERTIFICATION_LEVELS: Record<CertificationLevel, CertificationLevelInfo> = {
  [CertificationLevel.NONE]: {
    level: CertificationLevel.NONE,
    name: "No Certified",
    minScore: 40,
    maxScore: 100,
    color: "gray",
    description: "Contract does not meet certification requirements",
    icon: "❌",
  },
  [CertificationLevel.BRONZE]: {
    level: CertificationLevel.BRONZE,
    name: "Bronze Certification",
    minScore: 25,
    maxScore: 39,
    color: "orange",
    description: "Good security practices, low-moderate risk",
    icon: "🥉",
  },
  [CertificationLevel.SILVER]: {
    level: CertificationLevel.SILVER,
    name: "Silver Certification",
    minScore: 15,
    maxScore: 24,
    color: "gray",
    description: "Very good security practices, low risk",
    icon: "🥈",
  },
  [CertificationLevel.GOLD]: {
    level: CertificationLevel.GOLD,
    name: "Gold Certification",
    minScore: 5,
    maxScore: 14,
    color: "yellow",
    description: "Excellent security practices, very low risk",
    icon: "🥇",
  },
  [CertificationLevel.PLATINUM]: {
    level: CertificationLevel.PLATINUM,
    name: "Platinum Certification",
    minScore: 0,
    maxScore: 4,
    color: "cyan",
    description: "Outstanding security, minimal risk - Highest certification level",
    icon: "💎",
  },
};

/**
 * Gets the certification level based on risk score
 */
export function getCertificationLevel(riskScore: number): CertificationLevel {
  if (riskScore >= 40) return CertificationLevel.NONE;
  if (riskScore >= 25) return CertificationLevel.BRONZE;
  if (riskScore >= 15) return CertificationLevel.SILVER;
  if (riskScore >= 5) return CertificationLevel.GOLD;
  return CertificationLevel.PLATINUM;
}

/**
 * Gets the certification level information
 */
export function getCertificationLevelInfo(riskScore: number): CertificationLevelInfo {
  const level = getCertificationLevel(riskScore);
  return CERTIFICATION_LEVELS[level];
}

/**
 * Checks if a score is eligible for certification
 */
export function isEligibleForCertification(riskScore: number): boolean {
  return riskScore < 40;
}

/**
 * Gets the next available level if score improves
 */
export function getNextLevel(currentScore: number): CertificationLevelInfo | null {
  const currentLevel = getCertificationLevel(currentScore);
  
  if (currentLevel === CertificationLevel.PLATINUM) return null; // Already at highest level
  
  const levels = [
    CertificationLevel.PLATINUM,
    CertificationLevel.GOLD,
    CertificationLevel.SILVER,
    CertificationLevel.BRONZE,
  ];
  
  const currentIndex = levels.indexOf(currentLevel);
  if (currentIndex === -1 || currentIndex === levels.length - 1) return null;
  
  return CERTIFICATION_LEVELS[levels[currentIndex - 1]];
}


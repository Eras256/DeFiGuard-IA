import { VulnerabilityAnalysis } from "../gemini/client";

export class RiskAgent {
  private name: string;
  private description: string;
  private version: string;

  constructor() {
    this.name = "RiskScorer";
    this.description = "Calculates comprehensive risk scores for smart contracts";
    this.version = "1.0.0";
  }

  calculateRiskScore(analysis: VulnerabilityAnalysis): number {
    let score = 0;
    
    analysis.vulnerabilities.forEach(vuln => {
      switch (vuln.severity) {
        case "Critical":
          score += 25;
          break;
        case "High":
          score += 15;
          break;
        case "Medium":
          score += 8;
          break;
        case "Low":
          score += 3;
          break;
      }
    });
    
    return Math.min(100, score);
  }

  getRiskLevel(score: number): { level: string; color: string; description: string } {
    if (score >= 80) {
      return {
        level: "Critical Risk",
        color: "red",
        description: "Immediate action required. Multiple critical vulnerabilities detected.",
      };
    } else if (score >= 60) {
      return {
        level: "High Risk",
        color: "orange",
        description: "Significant vulnerabilities found. Should not be deployed without fixes.",
      };
    } else if (score >= 40) {
      return {
        level: "Medium Risk",
        color: "yellow",
        description: "Some vulnerabilities detected. Review and fix before mainnet deployment.",
      };
    } else if (score >= 20) {
      return {
        level: "Low Risk",
        color: "blue",
        description: "Minor issues found. Generally safe but improvements recommended.",
      };
    }
    
    return {
      level: "Minimal Risk",
      color: "green",
      description: "Contract follows best practices. No significant vulnerabilities detected.",
    };
  }
}

export const riskAgent = new RiskAgent();


import { analyzeContractWithGemini, VulnerabilityAnalysis } from "../gemini/client";

export class AuditorAgent {
  private name: string;
  private description: string;
  private version: string;

  constructor() {
    this.name = "SmartContractAuditor";
    this.description = "Analyzes smart contracts for security vulnerabilities using multiple detection methods";
    this.version = "1.0.0";
  }

  async analyzeContract(code: string): Promise<VulnerabilityAnalysis> {
    console.log("[AuditorAgent] 🔍 Starting security analysis...");
    
    try {
      // Use Gemini for AI-powered analysis with fallback multi-model
      const aiAnalysis = await analyzeContractWithGemini(code);
      
      // Static analysis would go here (Slither, Aderyn, etc.)
      // Focus on AI analysis
      
      console.log(`[AuditorAgent] ✅ Analysis complete. Found ${aiAnalysis.vulnerabilities.length} vulnerabilities`);
      
      return aiAnalysis;
    } catch (error: any) {
      console.error("[AuditorAgent] ❌ Analysis failed:", error);
      throw new Error(`Failed to analyze contract: ${error.message}`);
    }
  }

  async quickScan(code: string): Promise<{ riskScore: number; criticalCount: number }> {
    const analysis = await this.analyzeContract(code);
    
    const criticalCount = analysis.vulnerabilities.filter(
      v => v.severity === "Critical"
    ).length;
    
    return {
      riskScore: analysis.riskScore,
      criticalCount,
    };
  }
}

export const auditorAgent = new AuditorAgent();


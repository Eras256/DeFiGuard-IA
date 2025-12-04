import { generateRemediationCode, Vulnerability } from "../gemini/client";

export class RemediationAgent {
  private name: string;
  private description: string;
  private version: string;

  constructor() {
    this.name = "CodeRemediation";
    this.description = "Generates secure code fixes for identified vulnerabilities";
    this.version = "1.0.0";
  }

  async generateFix(
    originalCode: string,
    vulnerability: Vulnerability
  ): Promise<string> {
    console.log(`🔧 Generating fix for ${vulnerability.type}...`);
    
    const fixedCode = await generateRemediationCode(originalCode, vulnerability);
    
    console.log("✅ Fix generated successfully");
    
    return fixedCode;
  }

  async generateAllFixes(
    originalCode: string,
    vulnerabilities: Vulnerability[]
  ): Promise<Map<string, string>> {
    const fixes = new Map<string, string>();
    
    for (const vuln of vulnerabilities) {
      if (vuln.severity === "Critical" || vuln.severity === "High") {
        const fix = await this.generateFix(originalCode, vuln);
        fixes.set(vuln.type, fix);
      }
    }
    
    return fixes;
  }
}

export const remediationAgent = new RemediationAgent();


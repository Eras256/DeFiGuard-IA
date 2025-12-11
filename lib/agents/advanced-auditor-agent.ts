import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { VulnerabilityAnalysis } from "../gemini/client";
import { slitherMCP } from "../mcp/slither-mcp";
import { blockchainMCP } from "../mcp/blockchain-mcp";
import { defiDataMCP } from "../mcp/defi-data-mcp";

// Configure API key for AI SDK (use GEMINI_API_KEY if GOOGLE_GENERATIVE_AI_API_KEY is not available)
if (typeof process !== 'undefined' && process.env) {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY && process.env.GEMINI_API_KEY) {
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = process.env.GEMINI_API_KEY;
  }
}

/**
 * Advanced Auditor Agent using AI SDK and Gemini
 * Integrates MCP servers for comprehensive analysis
 */
export class AdvancedAuditorAgent {
  private name: string = "AdvancedSmartContractAuditor";
  private description: string = "Analyzes smart contracts using Gemini AI with MCP Architecture";
  private version: string = "2.0.0";

  // Modelos en orden de preferencia (fallback multi-modelo)
  private readonly modelsToTry = [
    "gemini-2.5-flash",
    "gemini-2.5-pro",
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-1.5-pro",
  ];

  /**
   * Analiza un contrato usando Gemini AI con arquitectura MCP
   */
  async analyzeContract(
    code: string,
    contractAddress?: string
  ): Promise<VulnerabilityAnalysis & { modelUsed: string; mcpData?: any }> {
    console.log("[AdvancedAuditorAgent] 🔍 Starting analysis with Gemini AI + MCP Architecture...");

    // Get additional data from MCP servers (always run Slither and DeFi, Blockchain only if address exists)
    let mcpContext = "";
    try {
      const mcpPromises: Promise<any>[] = [
        slitherMCP.analyze(code),
        defiDataMCP.getHistoricalExploits(code),
      ];

      // Add blockchain data only if contract address exists
      if (contractAddress) {
        mcpPromises.push(blockchainMCP.getContractInfo(contractAddress, 84532)); // Base Sepolia
      }

      const mcpResults = await Promise.allSettled(mcpPromises);
      
      // Build MCP context
      const slitherData = mcpResults[0];
      const defiData = mcpResults[1];
      const blockchainData = contractAddress ? mcpResults[2] : { status: "fulfilled" as const, value: null };

      mcpContext = this.buildMCPContext(slitherData, blockchainData, defiData);
      console.log("[AdvancedAuditorAgent] ✅ MCP data collected from servers:", {
        slither: slitherData.status === "fulfilled" ? "✓" : "✗",
        defi: defiData.status === "fulfilled" ? "✓" : "✗",
        blockchain: contractAddress ? (blockchainData.status === "fulfilled" ? "✓" : "✗") : "N/A",
      });
    } catch (error) {
      console.warn("[AdvancedAuditorAgent] ⚠️ MCP data collection failed:", error);
    }

    // Construir prompt con contexto MCP
    const prompt = this.buildAnalysisPrompt(code, mcpContext);

    // Intentar cada modelo hasta que uno funcione
    let lastError: Error | null = null;
    let modelUsed: string | null = null;

    for (const modelName of this.modelsToTry) {
      try {
        console.log(`[AdvancedAuditorAgent] Attempting model: ${modelName}`);

        const model = google(modelName);
        const result = await generateText({
          model,
          prompt,
          temperature: 0.2,
        });

        const analysis = this.parseAnalysisResponse(result.text);
        modelUsed = modelName;
        
        console.log(`[AdvancedAuditorAgent] ✅ Analysis complete using ${modelName}. Found ${analysis.vulnerabilities.length} vulnerabilities`);

        return {
          ...analysis,
          modelUsed,
          mcpData: mcpContext ? { 
            hasMCPData: true,
            serversUsed: {
              slither: true,
              defi: true,
              blockchain: !!contractAddress,
            }
          } : undefined,
        };
      } catch (error: any) {
        lastError = error;
        console.warn(`[AdvancedAuditorAgent] ⚠️ Model ${modelName} failed:`, error.message);
        
        // If it's an authentication error, don't try other models
        if (error.message?.includes("API key") || error.message?.includes("401") || error.message?.includes("403")) {
          break;
        }
        continue;
      }
    }

    throw new Error(
      `All models failed. Last error: ${lastError?.message || "Unknown error"}`
    );
  }

  /**
   * Builds the MCP data context
   */
  private buildMCPContext(
    slitherData: PromiseSettledResult<any>,
    blockchainData: PromiseSettledResult<any>,
    defiData: PromiseSettledResult<any>
  ): string {
    let context = "\n\n## Additional Context from MCP Servers:\n\n";

    if (slitherData.status === "fulfilled" && slitherData.value) {
      context += `### Static Analysis (Slither MCP):\n${JSON.stringify(slitherData.value, null, 2)}\n\n`;
    }

    if (blockchainData.status === "fulfilled" && blockchainData.value) {
      context += `### Blockchain Data:\n${JSON.stringify(blockchainData.value, null, 2)}\n\n`;
    }

    if (defiData.status === "fulfilled" && defiData.value) {
      context += `### Historical Exploits (DeFi MCP):\n${JSON.stringify(defiData.value, null, 2)}\n\n`;
    }

    return context;
  }

  /**
   * Builds the analysis prompt with MCP context
   */
  private buildAnalysisPrompt(code: string, mcpContext: string): string {
    return `You are an expert smart contract security auditor using Gemini AI with MCP Architecture. Analyze this Solidity code for vulnerabilities.

IMPORTANT: Respond ONLY with valid JSON. No markdown, no code blocks, no explanations outside JSON.

\`\`\`solidity
${code}
\`\`\`
${mcpContext}
Provide a detailed security analysis in this EXACT JSON format:

{
  "vulnerabilities": [
    {
      "type": "Reentrancy" | "Integer Overflow" | etc.,
      "severity": "Critical" | "High" | "Medium" | "Low",
      "line": line_number,
      "description": "detailed explanation of the vulnerability",
      "exploitScenario": "step-by-step how this can be exploited",
      "fix": "recommended code fix",
      "similarExploits": ["DAO Hack 2016", "Other similar real-world exploits"]
    }
  ],
  "riskScore": number_0_to_100,
  "gasOptimizations": ["suggestion 1", "suggestion 2"],
  "bestPractices": ["recommendation 1", "recommendation 2"],
  "summary": "Overall security assessment of the contract"
}

Find ALL vulnerabilities including:
- Reentrancy attacks
- Integer overflow/underflow
- Unchecked external calls
- Access control issues
- DOS vulnerabilities
- Front-running risks
- Timestamp manipulation
- Uninitialized storage
- Delegatecall dangers
- tx.origin authentication`;
  }

  /**
   * Parses the model response to VulnerabilityAnalysis
   */
  private parseAnalysisResponse(responseText: string): VulnerabilityAnalysis {
    // Clean markdown if present
    const cleaned = responseText
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    // Extract JSON
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[0] : cleaned;

    try {
      const parsed = JSON.parse(jsonString);
      
      // Validate basic structure
      if (!parsed.vulnerabilities || !Array.isArray(parsed.vulnerabilities)) {
        throw new Error("Invalid response structure: vulnerabilities array missing");
      }

      return {
        vulnerabilities: parsed.vulnerabilities,
        riskScore: parsed.riskScore || 0,
        gasOptimizations: parsed.gasOptimizations || [],
        bestPractices: parsed.bestPractices || [],
        summary: parsed.summary || "Analysis complete",
      };
    } catch (error: any) {
      console.error("[AdvancedAuditorAgent] JSON parsing error:", error);
      throw new Error(`Failed to parse analysis response: ${error.message}`);
    }
  }
}

export const advancedAuditorAgent = new AdvancedAuditorAgent();


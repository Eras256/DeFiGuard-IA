import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { VulnerabilityAnalysis } from "../gemini/client";
import { slitherMCP } from "../mcp/slither-mcp";
import { blockchainMCP } from "../mcp/blockchain-mcp";
import { defiDataMCP } from "../mcp/defi-data-mcp";

// Configurar API key para AI SDK (usa GEMINI_API_KEY si GOOGLE_GENERATIVE_AI_API_KEY no está disponible)
if (typeof process !== 'undefined' && process.env) {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY && process.env.GEMINI_API_KEY) {
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = process.env.GEMINI_API_KEY;
  }
}

/**
 * Auditor Agent usando NullShot Framework con AI SDK y Gemini
 * Integra servidores MCP para análisis completo
 */
export class NullShotAuditorAgent {
  private name: string = "NullShotSmartContractAuditor";
  private description: string = "Analyzes smart contracts using GEMINI IA + MCP NullShot Architecture";
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
   * Analiza un contrato usando Gemini IA + MCP NullShot Architecture
   */
  async analyzeContract(
    code: string,
    contractAddress?: string
  ): Promise<VulnerabilityAnalysis & { modelUsed: string; mcpData?: any }> {
    console.log("[NullShotAuditorAgent] 🔍 Starting analysis with GEMINI IA + MCP NullShot Architecture...");

    // Obtener datos adicionales de servidores MCP (siempre ejecutar Slither y DeFi, Blockchain solo si hay address)
    let mcpContext = "";
    try {
      const mcpPromises: Promise<any>[] = [
        slitherMCP.analyze(code),
        defiDataMCP.getHistoricalExploits(code),
      ];

      // Agregar datos de blockchain solo si hay dirección de contrato
      if (contractAddress) {
        mcpPromises.push(blockchainMCP.getContractInfo(contractAddress, 84532)); // Base Sepolia
      }

      const mcpResults = await Promise.allSettled(mcpPromises);
      
      // Construir contexto MCP
      const slitherData = mcpResults[0];
      const defiData = mcpResults[1];
      const blockchainData = contractAddress ? mcpResults[2] : { status: "fulfilled" as const, value: null };

      mcpContext = this.buildMCPContext(slitherData, blockchainData, defiData);
      console.log("[NullShotAuditorAgent] ✅ MCP data collected from servers:", {
        slither: slitherData.status === "fulfilled" ? "✓" : "✗",
        defi: defiData.status === "fulfilled" ? "✓" : "✗",
        blockchain: contractAddress ? (blockchainData.status === "fulfilled" ? "✓" : "✗") : "N/A",
      });
    } catch (error) {
      console.warn("[NullShotAuditorAgent] ⚠️ MCP data collection failed:", error);
    }

    // Construir prompt con contexto MCP
    const prompt = this.buildAnalysisPrompt(code, mcpContext);

    // Intentar cada modelo hasta que uno funcione
    let lastError: Error | null = null;
    let modelUsed: string | null = null;

    for (const modelName of this.modelsToTry) {
      try {
        console.log(`[NullShotAuditorAgent] Attempting model: ${modelName}`);

        const model = google(modelName);
        const result = await generateText({
          model,
          prompt,
          temperature: 0.2,
        });

        const analysis = this.parseAnalysisResponse(result.text);
        modelUsed = modelName;
        
        console.log(`[NullShotAuditorAgent] ✅ Analysis complete using ${modelName}. Found ${analysis.vulnerabilities.length} vulnerabilities`);

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
        console.warn(`[NullShotAuditorAgent] ⚠️ Model ${modelName} failed:`, error.message);
        
        // Si es error de autenticación, no intentar otros modelos
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
   * Construye el contexto de datos MCP
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
   * Construye el prompt de análisis con contexto MCP
   */
  private buildAnalysisPrompt(code: string, mcpContext: string): string {
    return `You are an expert smart contract security auditor using GEMINI IA + MCP NullShot Architecture. Analyze this Solidity code for vulnerabilities.

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
   * Parsea la respuesta del modelo a VulnerabilityAnalysis
   */
  private parseAnalysisResponse(responseText: string): VulnerabilityAnalysis {
    // Limpiar markdown si está presente
    const cleaned = responseText
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    // Extraer JSON
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[0] : cleaned;

    try {
      const parsed = JSON.parse(jsonString);
      
      // Validar estructura básica
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
      console.error("[NullShotAuditorAgent] JSON parsing error:", error);
      throw new Error(`Failed to parse analysis response: ${error.message}`);
    }
  }
}

export const nullShotAuditorAgent = new NullShotAuditorAgent();


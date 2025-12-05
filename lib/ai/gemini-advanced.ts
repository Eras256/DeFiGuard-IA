import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";

/**
 * Obtiene la instancia de GoogleGenerativeAI de forma segura (solo en servidor)
 * Esta función solo debe llamarse desde API routes o server components
 */
function getGeminiInstance(): GoogleGenerativeAI | null {
  // Solo acceder a process.env en el servidor
  if (typeof window !== 'undefined') {
    console.error("❌ getGeminiInstance() called from client-side. This should only run on the server.");
    return null;
  }

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.warn("⚠️ GEMINI_API_KEY is not set in environment variables");
  console.warn("   Please add GEMINI_API_KEY to your .env.local file");
  console.warn("   Get your API key from: https://aistudio.google.com/app/apikey");
    return null;
}

  return new GoogleGenerativeAI(GEMINI_API_KEY);
}

// Modelos en orden de preferencia (fallback multi-modelo)
const modelsToTry = [
  "gemini-2.5-flash",
  "gemini-2.5-pro",
  "gemini-2.0-flash",
  "gemini-1.5-flash",
  "gemini-1.5-pro",
];

export interface GeminiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  modelUsed?: string;
}

export interface GenerationConfig {
  temperature?: number;
  topP?: number;
  topK?: number;
  maxOutputTokens?: number;
}

/**
 * Llama a Gemini AI con sistema de fallback multi-modelo
 */
export async function callGemini(
  prompt: string,
  config: GenerationConfig = {}
): Promise<GeminiResponse> {
  // Crear instancia solo cuando se necesita (solo en servidor)
  const genAI = getGeminiInstance();
  
  if (!genAI) {
    return {
      success: false,
      error: "Gemini API key not configured. Please set GEMINI_API_KEY in .env.local",
    };
  }

  const defaultConfig: GenerationConfig = {
    temperature: 0.7,
    topP: 0.9,
    topK: 40,
    maxOutputTokens: 1024,
  };

  const generationConfig = { ...defaultConfig, ...config };

  let result: any = null;
  let modelUsed: string | undefined;
  let lastError: Error | null = null;

  // Intentar cada modelo en orden hasta que uno funcione
  for (const modelName of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig,
      });

      console.log(`[AI] Attempting to use model: ${modelName}`);
      console.log(`[AI] Prompt length: ${prompt.length} characters`);
      
      result = await model.generateContent(prompt);
      modelUsed = modelName;
      console.log(`[AI] ✅ Successfully used model: ${modelName}`);
      break;
    } catch (error: any) {
      lastError = error;
      console.error(`[AI] ⚠️ Model ${modelName} failed:`, {
        message: error.message,
        name: error.name,
        code: error.code,
        status: error.status,
        statusText: error.statusText,
      });
      // If it's an API key or authentication error, don't try other models
      if (error.message?.includes("API key") || error.message?.includes("401") || error.message?.includes("403")) {
        console.error("[AI] Authentication error detected. Stopping model fallback.");
        break;
      }
      continue;
    }
  }

  if (!result) {
    const errorDetails = lastError 
      ? `${lastError.message || "Unknown error"}${(lastError as any).code ? ` (Code: ${(lastError as any).code})` : ""}${(lastError as any).status ? ` (Status: ${(lastError as any).status})` : ""}`
      : "Unknown error - no error details available";
    
    return {
      success: false,
      error: `All models failed. Last error: ${errorDetails}. Please check your GEMINI_API_KEY and ensure it's valid.`,
    };
  }

  try {
    // Verify that result.response exists
    if (!result || !result.response) {
      return {
        success: false,
        error: `Invalid response structure from ${modelUsed}. Response object is missing.`,
        modelUsed,
      };
    }

    const responseText = result.response.text();
    
    if (!responseText || responseText.trim().length === 0) {
      console.error(`[AI] Empty response from ${modelUsed}`);
      return {
        success: false,
        error: `Empty response from Gemini AI (model: ${modelUsed}). The API may have rate limits or quota issues.`,
        modelUsed,
      };
    }
    
    console.log(`[AI] Response received from ${modelUsed}, length: ${responseText.length} chars`);
    
    return {
      success: true,
      data: responseText,
      modelUsed,
    };
  } catch (error: any) {
    console.error(`[AI] Error extracting response from ${modelUsed}:`, {
      message: error.message,
      name: error.name,
      stack: error.stack,
    });
    return {
      success: false,
      error: `Failed to extract response from ${modelUsed}: ${error.message}`,
      modelUsed,
    };
  }
}

/**
 * Calls Gemini and parses the response as JSON
 */
export async function callGeminiJSON<T = any>(
  prompt: string,
  config: GenerationConfig = {}
): Promise<GeminiResponse<T>> {
  const response = await callGemini(prompt, {
    ...config,
    maxOutputTokens: config.maxOutputTokens || 8192,
  });

  if (!response.success || !response.data) {
    return response;
  }

  try {
    let responseText = String(response.data);
    
    // Clean markdown code blocks if present
    responseText = responseText
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    
    // Try multiple strategies to extract valid JSON
    let parsed: any = null;
    let parseError: Error | null = null;
    
    // Strategy 1: Find the first complete JSON object
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        parsed = JSON.parse(jsonMatch[0]);
      } catch (e: any) {
        parseError = e;
        console.warn("[AI] First JSON match failed, trying to fix...");
      }
    }
    
    // Strategy 2: If it fails, try to fix common JSON issues
    if (!parsed && jsonMatch) {
      try {
        let fixedJson = jsonMatch[0];
        
        // Fix trailing commas in arrays and objects
        fixedJson = fixedJson.replace(/,(\s*[}\]])/g, '$1');
        
        // Fix unescaped quotes in strings
        fixedJson = fixedJson.replace(/([^\\])"/g, '$1\\"');
        
        // Fix unescaped line breaks
        fixedJson = fixedJson.replace(/\n/g, '\\n').replace(/\r/g, '\\r');
        
        parsed = JSON.parse(fixedJson);
        console.log("[AI] Successfully repaired JSON");
      } catch (e: any) {
        parseError = e;
        console.warn("[AI] JSON repair failed");
      }
    }
    
    // Strategy 3: Try to extract only the main object if there are multiple objects
    if (!parsed) {
      try {
        // Search from the end backwards to find the largest object
        let lastBrace = responseText.lastIndexOf('}');
        let firstBrace = responseText.indexOf('{');
        
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
          const potentialJson = responseText.substring(firstBrace, lastBrace + 1);
          parsed = JSON.parse(potentialJson);
          console.log("[AI] Extracted JSON using brace matching");
        }
      } catch (e: any) {
        parseError = e;
      }
    }
    
    if (!parsed) {
      console.error("[AI] All JSON parsing strategies failed");
      console.error("[AI] Parse error:", parseError?.message);
      console.error("[AI] Response preview (first 1000 chars):", responseText.substring(0, 1000));
      const errorPosition = parseError && 'position' in parseError 
        ? Number((parseError as any).position)
        : null;
      
      if (errorPosition !== null) {
        console.error("[AI] Response preview (around error position):", 
          responseText.substring(Math.max(0, errorPosition - 100), errorPosition + 100)
        );
      }
      
      return {
        success: false,
        error: `Failed to parse JSON: ${parseError?.message || "Invalid JSON format"}. Response preview: ${responseText.substring(0, 300)}`,
        modelUsed: response.modelUsed,
      };
    }
    
    // Validate basic structure
    if (typeof parsed !== "object" || parsed === null) {
      return {
        success: false,
        error: "Invalid JSON structure in response",
        modelUsed: response.modelUsed,
      };
    }
    
    return {
      success: true,
      data: parsed,
      modelUsed: response.modelUsed,
    };
  } catch (error: any) {
    console.error("[AI] JSON parsing error:", error.message);
    console.error("[AI] Error position:", error.position);
    console.error("[AI] Response preview:", String(response.data).substring(0, 1000));
    return {
      success: false,
      error: `Failed to parse JSON: ${error.message}. This might be due to an invalid response format from Gemini AI.`,
      modelUsed: response.modelUsed,
    };
  }
}

/**
 * Analyzes a Solidity contract with Gemini
 */
export interface VulnerabilityAnalysis {
  vulnerabilities: Vulnerability[];
  riskScore: number;
  gasOptimizations: string[];
  bestPractices: string[];
  summary: string;
}

export interface Vulnerability {
  type: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  line: number;
  description: string;
  exploitScenario: string;
  fix: string;
  similarExploits: string[];
}

export async function analyzeContractWithGemini(
  code: string
): Promise<GeminiResponse<VulnerabilityAnalysis>> {
  const prompt = `You are an expert smart contract security auditor. Analyze this Solidity code for vulnerabilities.

IMPORTANT: Respond ONLY with valid JSON. No markdown, no code blocks, no explanations outside JSON.

\`\`\`solidity
${code}
\`\`\`

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

  return callGeminiJSON(prompt, {
    temperature: 0.2,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
  });
}

/**
 * Generates remediation code for a vulnerability
 */
export async function generateRemediationCode(
  originalCode: string,
  vulnerability: {
    type: string;
    line: number;
    description: string;
  }
): Promise<GeminiResponse<string>> {
  const prompt = `Given this vulnerable Solidity code and the identified vulnerability, provide the COMPLETE FIXED CODE.

ORIGINAL CODE:

\`\`\`solidity
${originalCode}
\`\`\`

VULNERABILITY:

Type: ${vulnerability.type}
Line: ${vulnerability.line}
Issue: ${vulnerability.description}

Provide ONLY the fixed Solidity code. No explanations, no markdown blocks, just pure Solidity code.`;

  const response = await callGemini(prompt, {
    temperature: 0.3,
    maxOutputTokens: 4096,
  });

  if (response.success && response.data) {
    // Clean markdown if present
    const cleaned = String(response.data)
      .replace(/```solidity\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    return {
      success: true,
      data: cleaned,
      modelUsed: response.modelUsed,
    };
  }

  return response;
}

/**
 * Explains a vulnerability in simple terms
 */
export async function explainVulnerability(
  vulnerability: {
    type: string;
    severity: string;
    description: string;
  }
): Promise<GeminiResponse<string>> {
  const prompt = `Explain this smart contract vulnerability in simple terms for developers:

Type: ${vulnerability.type}
Severity: ${vulnerability.severity}
Description: ${vulnerability.description}

Provide:
1. What this vulnerability means (2-3 sentences)
2. Real-world example of this exploit
3. Why it's dangerous
4. How to prevent it

Keep it concise and educational.`;

  return callGemini(prompt, {
    temperature: 0.7,
    maxOutputTokens: 2048,
  });
}


import { GoogleGenerativeAI } from "@google/generative-ai";

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

export interface AnalysisResult {
  analysis: VulnerabilityAnalysis;
  modelUsed: string;
}

export async function analyzeContractWithGemini(
  code: string
): Promise<VulnerabilityAnalysis> {
  // Crear instancia solo cuando se necesita (solo en servidor)
  const genAI = getGeminiInstance();
  
  if (!genAI) {
    throw new Error("Gemini API key not configured. Please set GEMINI_API_KEY in .env.local");
  }

  // Modelos en orden de preferencia (fallback multi-modelo)
  const modelsToTry = [
    "gemini-2.5-flash",
    "gemini-2.5-pro",
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-1.5-pro",
  ];

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

  let lastError: Error | null = null;
  let modelUsed: string | null = null;

  // Intentar cada modelo en orden hasta que uno funcione
  for (const modelName of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          temperature: 0.2,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 8192,
        },
      });

      console.log(`[AI] Attempting to use model: ${modelName}`);
      const result = await model.generateContent(prompt);
      const response = result.response.text();
      
      // Clean response - remove markdown code blocks if present
      const cleanedResponse = response
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      
      // Try to extract JSON if wrapped in markdown
      const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : cleanedResponse;
      
      const analysis = JSON.parse(jsonString);
      modelUsed = modelName;
      console.log(`[AI] ✅ Successfully used model: ${modelName}`);
      
      // Return only the analysis to maintain compatibility
      return analysis;
    } catch (error: any) {
      lastError = error;
      console.warn(`[AI] ⚠️ Model ${modelName} failed:`, error.message);
      continue;
    }
  }

  console.error("Gemini API Error: All models failed", lastError);
  throw new Error(`Failed to analyze contract with AI. All models failed. Last error: ${lastError?.message || "Unknown error"}`);
}

export async function generateRemediationCode(
  originalCode: string,
  vulnerability: Vulnerability
): Promise<string> {
  // Crear instancia solo cuando se necesita (solo en servidor)
  const genAI = getGeminiInstance();
  
  if (!genAI) {
    throw new Error("Gemini API key not configured");
  }

  const modelsToTry = [
    "gemini-2.5-flash",
    "gemini-2.5-pro",
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-1.5-pro",
  ];

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

  let lastError: Error | null = null;

  for (const modelName of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 4096,
        },
      });

      const result = await model.generateContent(prompt);
      const response = result.response.text();
      
      // Clean markdown if present
      const cleaned = response
        .replace(/```solidity\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      
      return cleaned;
    } catch (error: any) {
      lastError = error;
      continue;
    }
  }

  throw new Error(`Failed to generate remediation code. All models failed. Last error: ${lastError?.message || "Unknown error"}`);
}

export async function explainVulnerability(
  vulnerability: Vulnerability
): Promise<string> {
  // Crear instancia solo cuando se necesita (solo en servidor)
  const genAI = getGeminiInstance();
  
  if (!genAI) {
    throw new Error("Gemini API key not configured");
  }

  const modelsToTry = [
    "gemini-2.5-flash",
    "gemini-2.5-pro",
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-1.5-pro",
  ];

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

  let lastError: Error | null = null;

  for (const modelName of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
      });

      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error: any) {
      lastError = error;
      continue;
    }
  }

  throw new Error(`Failed to explain vulnerability. All models failed. Last error: ${lastError?.message || "Unknown error"}`);
}


import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

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
): Promise<VulnerabilityAnalysis> {
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-2.5-flash-latest",
    generationConfig: {
      temperature: 0.2,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
    },
  });

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

  try {
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    // Clean response - remove markdown code blocks if present
    const cleanedResponse = response
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    
    const analysis = JSON.parse(cleanedResponse);
    return analysis;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to analyze contract with AI");
  }
}

export async function generateRemediationCode(
  originalCode: string,
  vulnerability: Vulnerability
): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-2.5-flash-latest",
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 4096,
    },
  });

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

  const result = await model.generateContent(prompt);
  return result.response.text();
}

export async function explainVulnerability(
  vulnerability: Vulnerability
): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-2.5-flash-latest",
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2048,
    },
  });

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

  const result = await model.generateContent(prompt);
  return result.response.text();
}

